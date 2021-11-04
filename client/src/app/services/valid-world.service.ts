import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { comparePositions, MAX_LINES, MIN_LINES, NB_TILES, NOT_A_LETTER, UNDEFINED_INDEX } from '@app/constants/constants';
import { decompress } from 'fzstd';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LettersService } from './letters.service';
import { WordPointsService } from './word-points.service';

@Injectable({
    providedIn: 'root',
})
export class ValidWordService {
    matchWords: string[] = [];
    concatWord: string = '';
    isWordValid: boolean = false;
    usedWords = new Map<string, Vec2[]>();
    private readonly utf8Decoder = new TextDecoder('UTF-8');

    private dictionary?: Set<string>[];
    constructor(private http: HttpClient, private wps: WordPointsService, private letterService: LettersService) {}
    async loadDictionary() {
        const wordsObs = this.getWords();
        const words = await wordsObs.toPromise();
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

        this.dictionary = letterIndexes.map(([t, h]) => new Set(words.slice(t, h)));
    }

    generateRegEx(lett: Letter[]): string {
        let concat = '(^';

        let lastWasEmpty = true;
        let spotDefine = false;
        let metLetter = false;
        for (let i = 0; i < lett.length; i++) {
            if (spotDefine) {
                const save: string = concat.slice();
                concat += '$)|';
                concat += save;
                spotDefine = false;
            }

            if (lett[i].charac === NOT_A_LETTER.charac) {
                concat += '.';

                if (i !== lett.length - 1) {
                    if (!metLetter) {
                        concat += '?';
                    } else if (lett[i + 1].charac === NOT_A_LETTER.charac) {
                        concat += '?';
                        spotDefine = true;
                    } else if (lett[i + 1].charac !== NOT_A_LETTER.charac) {
                        let spaceCounter = 0;
                        while (concat.charAt(concat.length - 1) !== '}') {
                            if (concat.charAt(concat.length - 1) === '.') {
                                spaceCounter++;
                            }
                            concat = concat.slice(0, UNDEFINED_INDEX);
                        }
                        for (let k = 0; k < spaceCounter; k++) concat += '.';
                    }
                }
                lastWasEmpty = true;
            } else {
                metLetter = true;
                concat += lett[i].charac;
                if (i !== lett.length - 1)
                    if (lett[i + 1].charac === NOT_A_LETTER.charac) {
                        concat += '{1}';
                        spotDefine = true;
                    }
                lastWasEmpty = false;
            }
        }
        if (lastWasEmpty) {
            concat += '?$)';
        } else {
            concat += '{1}$)';
        }
        return concat;
    }

    generateAllWordsPossible(word: Letter[]): string[] {
        for (const letter of word) {
            this.concatWord += letter.charac;
        }

        for (let i = this.concatWord.length; i >= 1; i--) {
            const regex = new RegExp('[' + this.concatWord + ']{' + i + '}', 'g');

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (const words of this.dictionary!) {
                for (const dictionaryWord of words) {
                    if (i === dictionaryWord.length) {
                        const match = regex.test(dictionaryWord);
                        if (match) {
                            this.matchWords.push(dictionaryWord);
                        }
                    }
                }
            }
        }
        this.concatWord = '';
        return this.matchWords;
    }

    readWordsAndGivePointsIfValid(usedPosition: Letter[][], command: ChatCommand, playMode: string): number {
        // create copy of board
        const usedPositionLocal = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < usedPositionLocal.length; i++) {
            usedPositionLocal[i] = usedPosition[i].slice();
        }

        // positions of the word provided by the command
        const positionsWordCommand = this.convertIntoPositionArray(command, usedPositionLocal);

        let totalPointsSum = 0;
        for (let letterIndex = 0; letterIndex < command.word.length; letterIndex++) {
            const array: Letter[] = [];
            const arrayPosition: Vec2[] = [];

            // get a merged word
            if (command.direction === 'v') {
                this.checkSides(positionsWordCommand, array, arrayPosition, letterIndex, usedPositionLocal);
            } else if (command.direction === 'h') {
                this.checkBottomTopSide(positionsWordCommand, array, arrayPosition, letterIndex, usedPositionLocal);
            }

            if (array.length === 1) {
                // only one letter
                totalPointsSum += 0;
            } else if (this.verifyWord(array, playMode)) {
                // word exists in the dictionnary
                // check if this exact word was used before
                const exists = this.checkIfWordIsUsed(array, arrayPosition);
                if (exists) {
                    totalPointsSum += 0;
                } else {
                    this.usedWords.set(this.fromLettersToString(array), arrayPosition);
                    totalPointsSum += this.wps.pointsWord(array, arrayPosition);
                }
            } else {
                totalPointsSum = 0;

                return totalPointsSum;
            }
        }

        if (this.verifyWord(this.letterService.fromWordToLetters(command.word), playMode)) {
            this.usedWords.set(command.word, positionsWordCommand);
            const wordItselfPoints = this.wps.pointsWord(this.letterService.fromWordToLetters(command.word), positionsWordCommand);
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
            if (this.dictionary === undefined) {
                return;
            }
            if (word.length === 0) {
                return;
            }
            for (const i of word) {
                const letter = i.charac;
                concatWord += letter;
            }

            const letterIndexInput = concatWord.charCodeAt(0) - 'a'.charCodeAt(0);
            return this.dictionary[letterIndexInput].has(concatWord);
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
        return this.http.get('/assets/dictionary_min.json.zst', { responseType: 'arraybuffer' });
    }

    private getWords(): Observable<string[]> {
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
        while (currentPosition !== undefined && currentPosition.x < MAX_LINES) {
            const currentLetter: Letter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== NOT_A_LETTER) {
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

        // check left side

        while (currentPosition !== undefined && currentPosition.x >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== NOT_A_LETTER) {
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
        // check bottom side
        positions = JSON.parse(JSON.stringify(positions));
        let counter = 1;
        const currentPosition = positions[letterIndex];
        while (currentPosition !== undefined && currentPosition.y < MAX_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== NOT_A_LETTER) {
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

        // check top side
        while (currentPosition !== undefined && currentPosition.y >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== NOT_A_LETTER) {
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
