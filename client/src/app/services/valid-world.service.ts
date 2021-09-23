/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { decompress } from 'fzstd';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WordPointsService } from './word-points.service';

@Injectable({
    providedIn: 'root',
})
export class ValidWordService {
    private readonly utf8_decoder = new TextDecoder('UTF-8');

    private dictionary?: Array<Set<string>>;

    constructor(private http: HttpClient, private wps: WordPointsService) {}

    private get_compressed_words(): Observable<ArrayBuffer> {
        // return this.http.get<string[]>('/assets/dictionary.json');
        return this.http.get('/assets/dictionary_min.json.zst', { responseType: 'arraybuffer' });
    }

    private get_words(): Observable<string[]> {
        const compressed_words = this.get_compressed_words();
        return compressed_words.pipe(
            map((buf) => new Uint8Array(buf)),
            map((data) => decompress(data)),
            map((data) => this.utf8_decoder.decode(data)),
            map((data) => JSON.parse(data)),
        );
    }

    public async load_dictionary() {
        const words_obs = this.get_words();
        const words = await words_obs.toPromise();
        const letter_indexes = new Array<number[]>();

        let tail_letter = words[0].charCodeAt(0);
        let tail = 0;
        for (let head = 0; head < words.length; ++head) {
            const head_letter = words[head].charCodeAt(0);
            if (head_letter != tail_letter) {
                tail_letter = head_letter;
                letter_indexes.push([tail, head]);
                tail = head;
            }
        }
        letter_indexes.push([tail, words.length]);

        this.dictionary = letter_indexes.map(([t, h]) => new Set(words.slice(t, h)));
    }

    public verify_word(word: Letter[]) {
        let concatWord: string = '';
        if (this.dictionary === undefined) {
            return;
        }
        if (word.length == 0) {
            return;
        }
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].charac;
            concatWord += letter;
        }
        const letter_index_input = concatWord.charCodeAt(0) - 'a'.charCodeAt(0);
        return this.dictionary[letter_index_input].has(concatWord);
    }

    private checkSides(positions: Vec2[], array: Array<Letter>, arrayPosition: Array<Vec2>, letter_index: number, usedPosition: (Letter | undefined)[][] ) {
        let counter: number = 1;
        let currentPosition = positions[letter_index];
        while (currentPosition !== undefined && currentPosition.x < 15) {
            let currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== undefined) {
                array.push(currentLetter);
                arrayPosition.push({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.x++;
            counter++;
        }
        if (currentPosition !== undefined) currentPosition.x = positions[letter_index].x - counter;
        counter = 0;

        //check left side

        while (currentPosition !== undefined && currentPosition.x >= 0) {
            let currentLetter = usedPosition[currentPosition.y][currentPosition.x];
            if (currentLetter !== undefined) {
                array.unshift(currentLetter);
                arrayPosition.unshift({ x: currentPosition.x, y: currentPosition.y });
            } else {
                break;
            }
            currentPosition.x--;
        }

        if (currentPosition !== undefined) currentPosition.x = positions[letter_index].x + counter;
        counter = 0;
    }

    public readWordsAndGivePointsIfValid_Vertical(word: Letter[], positions: Vec2[], usedPosition: Letter[][]) {
        let readPositions: Array<Vec2> = [];
        for (let i of positions) {
            readPositions.push({ x: i.x, y: i.y });
        }
        let totalPointsSum = 0;
        for (let letter_index = 0; letter_index < word.length; letter_index++) {
            let array: Array<Letter> = [];
            let arrayPosition: Array<Vec2> = [];

            // Check side if word entered is vertical
            this.checkSides(positions, array, arrayPosition, letter_index, usedPosition);

            // Check top and bottom if word entered is horizontal
            //this.checkTopBottom(positions, array, arrayPosition, letter_index, usedPosition);

            console.log(array);
            console.log(arrayPosition);
            if (this.verify_word(array)) {
                totalPointsSum += this.wps.points_word(array, arrayPosition);
            } else {
                console.log('ntm');
                totalPointsSum = 0;
                console.log(totalPointsSum);
                return totalPointsSum;
            }
        }
        console.log(totalPointsSum);
        console.log(readPositions);
        let wordItselfPoints = this.wps.points_word(word, readPositions);
        console.log(wordItselfPoints);
        totalPointsSum += wordItselfPoints;
        console.log(totalPointsSum);
        return totalPointsSum;
    }
}
