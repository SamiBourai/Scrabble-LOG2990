import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Dictionary, LoadableDictionary } from '@app/classes/dictionary';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    comparePositions,
    MAX_LINES,
    MIN_LINES,
    NB_TILES,
    NOT_A_LETTER,
    SEND_URL_GET_DICTIONARY,
    TWO_LETTER,
    UNDEFINED_INDEX,
} from '@app/constants/constants';
import { decompress } from 'fzstd';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LettersService } from './letters.service';
import { WordPointsService } from './word-points.service';

@Injectable({
    providedIn: 'root',
})
export class ValidWordService {
    concatWord: string = '';
    isWordValid: boolean = false;
    usedWords = new Map<string, Vec2[]>();
    private readonly utf8Decoder = new TextDecoder('UTF-8');

    private dictionary: Dictionary;

    constructor(private http: HttpClient, private wps: WordPointsService, private letterService: LettersService) {}

    static loadableDictToDict({ title, description, words }: LoadableDictionary) {
        const letterIndexes = new Array<number[]>();
        let tailLetter = words[0].charCodeAt(0);
        let tail = 0;
        for (let head = 0; head < words.length; ++head) {
            const headLetter = words[head].charCodeAt(0);
            if (headLetter !== tailLetter) {
                tailLetter = headLetter;
                letterIndexes.push([tail, head]);
                tail = head;
            }
        }
        letterIndexes.push([tail, words.length]);
        return { title, description, words: letterIndexes.map(([t, h]) => new Set(words.slice(t, h))) } as Dictionary;
    }

    getDictionary(title: string, oldName?: string): Observable<LoadableDictionary> {
        const fullUrl = SEND_URL_GET_DICTIONARY + '/' + title + '/' + (oldName ?? '');
        return this.http.get<LoadableDictionary>(fullUrl);
    }

    async loadDictionary(title?: string) {
        let loadableDictionaryObs: Observable<LoadableDictionary>;
        if (title) {
            loadableDictionaryObs = this.getDictionary(title);
        } else {
            loadableDictionaryObs = this.getLoadableDictionary();
        }
        const loadableDictionary = await loadableDictionaryObs.toPromise();
        this.dictionary = ValidWordService.loadableDictToDict(loadableDictionary);
    }

    generateRegEx(lett: Letter[]): string {
        let regEx = '';
        let concat = '(^';
        let newRange = new Array<Letter>();
        const allRegEx = new Array<string>();
        let lastIsLetter = false;
        for (let i = 0; i < lett.length; i++) {
            switch (lett[i]) {
                case NOT_A_LETTER:
                    if (lastIsLetter) {
                        concat += '$)';
                        allRegEx.push(concat);
                        concat = concat.slice(0, -TWO_LETTER);
                        let counterSpace = 0;
                        let j = i;
                        while (j < lett.length && lett[j] === NOT_A_LETTER) {
                            counterSpace++;
                            j++;
                        }
                        let save = concat;
                        if (j !== lett.length) {
                            newRange = lett.slice();
                            newRange.splice(0, i + 1);
                            regEx = this.generateRegEx(newRange);
                        }
                        switch (counterSpace) {
                            case 1:
                                if (j !== lett.length) concat += '.';
                                else {
                                    concat += '.?$)';
                                    allRegEx.push(concat);
                                }

                                break;
                            default:
                                while (counterSpace > 1) {
                                    save += '.';
                                    concat += '.?';
                                    counterSpace--;
                                }
                                concat += '$)';
                                allRegEx.push(concat);
                                concat = concat.slice(0, -TWO_LETTER);
                                if (j !== lett.length) {
                                    save += '.';
                                    concat = save;
                                } else {
                                    concat += '.?$)';
                                    allRegEx.push(concat);
                                }
                                break;
                        }
                        i = j - 1;
                    } else {
                        concat += '.?';
                    }
                    lastIsLetter = false;
                    break;
                default:
                    concat += lett[i].charac + '{1}';
                    if (i === lett.length - 1) {
                        concat += '$)';
                        allRegEx.push(concat);
                    }
                    lastIsLetter = true;
                    break;
            }
        }
        if (regEx !== '') regEx += '|';
        for (const reg of allRegEx) regEx += reg + '|';
        regEx = regEx.slice(0, UNDEFINED_INDEX);
        return regEx;
    }

    generateAllWordsPossible(word: Letter[]): string[] {
        const matchWords: string[] = [];
        for (const letter of word) {
            this.concatWord += letter.charac;
        }

        for (let i = this.concatWord.length; i >= 1; i--) {
            const regex = new RegExp(`[${this.concatWord}]{${i}}`, 'g');

            for (const letteredWords of this.dictionary.words) {
                for (const dictionaryWord of letteredWords) {
                    if (i === dictionaryWord.length) {
                        const match = regex.test(dictionaryWord);
                        if (match) {
                            matchWords.push(dictionaryWord);
                        }
                    }
                }
            }
        }
        this.concatWord = '';
        return matchWords;
    }

    readWordsAndGivePointsIfValid(usedPosition: Letter[][], command: ChatCommand, playMode: string, testPoint: boolean): number {
        const usedPositionLocal = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < usedPositionLocal.length; i++) {
            usedPositionLocal[i] = usedPosition[i].slice();
        }

        const positionsWordCommand = this.convertIntoPositionArray(command, usedPositionLocal);

        let totalPointsSum = 0;
        for (let letterIndex = 0; letterIndex < command.word.length; letterIndex++) {
            const array: Letter[] = [];
            const arrayPosition: Vec2[] = [];

            if (command.direction === 'v') {
                this.checkSides(positionsWordCommand, array, arrayPosition, letterIndex, usedPositionLocal);
            } else if (command.direction === 'h') {
                this.checkBottomTopSide(positionsWordCommand, array, arrayPosition, letterIndex, usedPositionLocal);
            }

            if (array.length === 1) {
                // only one letter
                totalPointsSum += 0;
            } else if (this.verifyWord(array, playMode)) {
                const exists = this.checkIfWordIsUsed(array, arrayPosition);

                if (!exists) {
                    if (!testPoint) {
                        this.usedWords.set(this.fromLettersToString(array), arrayPosition);
                    }
                    totalPointsSum += this.wps.pointsWord(array, arrayPosition, testPoint);
                }
            } else {
                totalPointsSum = 0;

                return totalPointsSum;
            }
        }

        if (this.verifyWord(this.letterService.fromWordToLetters(command.word), playMode)) {
            if (!testPoint) this.usedWords.set(command.word, positionsWordCommand);
            const wordItselfPoints = this.wps.pointsWord(this.letterService.fromWordToLetters(command.word), positionsWordCommand, testPoint);
            totalPointsSum += wordItselfPoints;
            return totalPointsSum;
        } else {
            totalPointsSum = 0;

            return totalPointsSum;
        }
    }

    verifyWord(word: Letter[], playMode: string) {
        if (playMode !== 'soloGame') {
            return this.isWordValid;
        } else {
            let concatWord = '';
            if (word.length === 0) {
                return;
            }
            for (const i of word) {
                const letter = i.charac;
                concatWord += letter;
            }

            const letterIndexInput = concatWord.charCodeAt(0) - 'a'.charCodeAt(0);
            console.log('allo' + this.dictionary.words[letterIndexInput]);
            
            return this.dictionary.words[letterIndexInput].has(concatWord);
        }
    }

    private fromLettersToString(word: Letter[]) {
        return word.map(({ charac }) => charac).reduce((a, b) => a + b);
    }

    private checkIfWordIsUsed(word: Letter[], positions: Vec2[]): boolean {
        const lettersPositions = this.usedWords.get(this.fromLettersToString(word));
        if (lettersPositions === undefined) {
            return false;
        }
        for (let i = 0; i < lettersPositions.length; ++i) {
            if (!comparePositions(lettersPositions[i], positions[i])) {
                return false;
            }
        }
        return true;
    }

    private convertIntoPositionArray(command: ChatCommand, usedPosition: Letter[][]): Vec2[] {
        const position: Vec2[] = [];
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h') {
                position.push({ x: command.position.x - 1 + i, y: command.position.y - 1 });
                usedPosition[command.position.y - 1][command.position.x - 1 + i] = this.letterService.getTheLetter(command.word.charAt(i));
            } else if (command.direction === 'v') {
                position.push({ x: command.position.x - 1, y: command.position.y - 1 + i });
                usedPosition[command.position.y - 1 + i][command.position.x - 1] = this.letterService.getTheLetter(command.word.charAt(i));
            }
        }

        return position;
    }

    private getCompressedWords(): Observable<ArrayBuffer> {
        return this.http.get('./assets/dictionary_min.json.zst', { responseType: 'arraybuffer' });
    }

    private getLoadableDictionary(): Observable<LoadableDictionary> {
        const compressedWords = this.getCompressedWords();
        return compressedWords.pipe(
            map((buf) => new Uint8Array(buf)),
            map((data) => decompress(data)),
            map((data) => this.utf8Decoder.decode(data)),
            map((data) => JSON.parse(data)),
        );
    }

    private checkSides(positions: Vec2[], array: Letter[], arrayPosition: Vec2[], letterIndex: number, usedPosition: Letter[][]) {
        let counter = 1;
        positions = JSON.parse(JSON.stringify(positions));
        const currentPosition = positions[letterIndex];

        while (currentPosition !== undefined && currentPosition.x <= MAX_LINES) {
            const currentLetter: Letter = usedPosition[currentPosition.y][currentPosition.x];

            if (currentLetter && currentLetter !== NOT_A_LETTER) {
                array.push(currentLetter);
                arrayPosition.push({ x: currentPosition.x, y: currentPosition.y });
            } else {
                currentPosition.x = positions[letterIndex].x - counter;
                break;
            }

            currentPosition.x++;
            counter++;
        }
        counter = 0;

        while (currentPosition !== undefined && currentPosition.x >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];

            if (currentLetter && currentLetter !== NOT_A_LETTER) {
                array.unshift(currentLetter);
                arrayPosition.unshift({ x: currentPosition.x, y: currentPosition.y });
            } else {
                currentPosition.x = positions[letterIndex].x + counter;
                break;
            }
            currentPosition.x--;
        }
        counter = 0;
    }

    private checkBottomTopSide(positions: Vec2[], array: Letter[], arrayPosition: Vec2[], letterIndex: number, usedPosition: Letter[][]) {
        positions = JSON.parse(JSON.stringify(positions));
        let counter = 1;
        const currentPosition = positions[letterIndex];
        while (currentPosition !== undefined && currentPosition.y <= MAX_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter && currentLetter !== NOT_A_LETTER) {
                array.push(currentLetter);
                arrayPosition.push({ x: currentPosition.x, y: currentPosition.y });
            } else {
                currentPosition.y = positions[letterIndex].y - counter;
                break;
            }
            currentPosition.y++;
            counter++;
        }
        counter = 0;

        while (currentPosition !== undefined && currentPosition.y >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter && currentLetter !== NOT_A_LETTER) {
                array.unshift(currentLetter);
                arrayPosition.unshift({ x: currentPosition.x, y: currentPosition.y });
            } else {
                currentPosition.y = positions[letterIndex].y + counter;
                break;
            }

            currentPosition.y--;
        }
        counter = 0;
    }
}
