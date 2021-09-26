/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { MAX_LINES, MIN_LINES } from '@app/constants/constants';
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

    async generateAllWordsPossible(word: Letter[]) {
        for (const letter of word) {
            this.concatWord += letter;
        }
        console.log(this.concatWord);

        // const regexp = new RegExp(
        //     '^(?=['+ this.concatWord+']{' +
        //         this.concatWord.length+
        //         '}$)(?!.(.).\e).*$', 'g');
        for (let i = this.concatWord.length; i >= 1; i--) {
            const regex = new RegExp('[' + this.concatWord + ']{' + i + '}', 'g');
            // let  regexp = new RegExp('(?=['+this.concatWord+']{'+i+'})
            // (?=(?!((?<1>.)\k<1>.)))(?=(?!((?<2>.).\k<2>)))(?=(?!(.(?<3>.)\k<3>)))(?=(?!((?<4>.)\k<4>\k<4>)))['+this.concatWord+']{'+i+'}')
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

        console.log(this.matchWords, 'match');
    }

    readWordsAndGivePointsIfValid(usedPosition: Letter[][], command: ChatCommand) {
        const positions = this.convertIntoPositionArray(command);

        let totalPointsSum = 0;
        for (let letterIndex = 0; letterIndex < command.word.length; letterIndex++) {
            const array: Letter[] = [];
            const arrayPosition: Vec2[] = [];

            // Check side if word entered is vertical
            if (command.direction === 'v') {
                this.checkSides(positions, array, arrayPosition, letterIndex, usedPosition);
            }

            if (command.direction === 'h') {
                this.checkBottomTopSide(positions, array, arrayPosition, letterIndex, usedPosition);
            }
            //

            console.log(array);
            console.log(arrayPosition);

            if (array.length === 1) {
                totalPointsSum += 0;
            } else if (this.verifyWord(array)) {
                totalPointsSum += this.wps.pointsWord(array, arrayPosition);
            } else {
                totalPointsSum = 0;
                console.log(totalPointsSum);
                return totalPointsSum;
            }
        }

        const wordItselfPoints = this.wps.pointsWord(this.letterService.fromWordToLetters(command.word), positions);
        console.log(wordItselfPoints);
        console.log(totalPointsSum);

        totalPointsSum += wordItselfPoints;
        console.log(totalPointsSum);
        return totalPointsSum;
    }

    verifyWord(word: Letter[]) {
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

    private convertIntoPositionArray(command: ChatCommand): Vec2[] {
        const position: Vec2[] = [];

        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h') {
                position.push({ x: command.position.x - 1 + i, y: command.position.y - 1 });
            } else if (command.direction === 'v') {
                position.push({ x: command.position.x - 1, y: command.position.y - 1 + i });
            }
        }

        return position;
    }

    private getCompressedWords(): Observable<ArrayBuffer> {
        // return this.http.get<string[]>('/assets/dictionary.json');
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
        const currentPosition = positions[letterIndex];
        while (currentPosition !== undefined && currentPosition.x < MAX_LINES) {
            const currentLetter: Letter = usedPosition[currentPosition.x][currentPosition.y];
            if (currentLetter !== undefined) {
                array.push(currentLetter);
                arrayPosition.push({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.x++;
            counter++;
        }
        if (currentPosition !== undefined) currentPosition.x = positions[letterIndex].x - counter;
        counter = 0;

        // check left side

        while (currentPosition !== undefined && currentPosition.x >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.x][currentPosition.y];
            if (currentLetter !== undefined) {
                array.unshift(currentLetter);
                arrayPosition.unshift({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.x--;
        }

        if (currentPosition !== undefined) currentPosition.x = positions[letterIndex].x + counter;
        counter = 0;
    }

    private checkBottomTopSide(
        positions: Vec2[],
        array: Letter[],
        arrayPosition: Vec2[],
        letterIndex: number,
        usedPosition: (Letter | undefined)[][],
    ) {
        // check bottom side
        let counter = 1;
        const currentPosition = positions[letterIndex];
        while (currentPosition !== undefined && currentPosition.y < MAX_LINES) {
            const currentLetter = usedPosition[currentPosition.x][currentPosition.y];
            if (currentLetter !== undefined) {
                array.push(currentLetter);
                arrayPosition.push({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.y++;
            counter++;
        }
        if (currentPosition !== undefined) currentPosition.y = positions[letterIndex].y - counter;
        counter = 0;

        // check top side
        while (currentPosition !== undefined && currentPosition.y >= MIN_LINES) {
            const currentLetter = usedPosition[currentPosition.x][currentPosition.y];
            if (currentLetter !== undefined) {
                array.unshift(currentLetter);
                arrayPosition.unshift({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.y--;
        }

        if (currentPosition !== undefined) currentPosition.y = positions[letterIndex].y + counter;
        counter = 0;
    }
}
