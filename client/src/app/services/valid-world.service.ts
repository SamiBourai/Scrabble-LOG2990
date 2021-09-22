/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { decompress } from 'fzstd';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ValidWordService {
    private readonly utf8_decoder = new TextDecoder('UTF-8');

    private dictionary?: Set<string>[];
    matchWords: Array<string> = [];
    concatWord: string = '';


    constructor(private http: HttpClient) { }

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

    async load_dictionary() {
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

    verify_word(word: Letter[]) {
        let concatWord = '';
        console.log(this.dictionary, 'ditionary');
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
    async generateAllWordsPossible(word: Letter[]) {
        await this.load_dictionary();
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].charac;
            this.concatWord += letter;
        }
        let regexp = new RegExp('[ ${this.concatWord} ]');
        console.log(this.concatWord, 'concatword');
        // console.log(this.verify_word(word), 'verify');
        if (this.verify_word(word)) {
            for (let words of this.dictionary!)
                for (let dictionaryWord of words) {
                    if (this.concatWord.length == dictionaryWord.length) {
                        let match = regexp.test(dictionaryWord);
                        if (match) this.matchWords.push(dictionaryWord);
                        //console.log(this.concatWord, 'matchhhhh');
                        break;
                    }
                }
        }
        console.log(this.matchWords, 'match');
    }

}
