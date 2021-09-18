/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { decompress } from 'fzstd';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ValidWorldService {
    private static utf8_decoder = new TextDecoder('utf-8');

    private dictionary?: Array<Set<string>>;

    constructor(private http: HttpClient) {}

    private get_dictionary(): Observable<ArrayBuffer> {
        return this.http.get('/assets/dictionary_min.json.zst', { responseType: 'arraybuffer' });
    }

    public async load_dictionary() {
        const compressed_data_ab = await this.get_dictionary().toPromise();

        const compressed_data_u8a = new Uint8Array(compressed_data_ab);

        const decompressed_data_u8a = decompress(compressed_data_u8a);

        const decompressed_data_str = ValidWorldService.utf8_decoder.decode(decompressed_data_u8a);

        const words = JSON.parse(decompressed_data_str);

        // const words = data.words.map((str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

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

    public verify_word(word: string) {
        if (!this.dictionary) {
            console.log('ntm t a pas chargé');
            return;
        }
        if (word.length == 0) {
            console.log('Mot vide!');
            return;
        }

        const letter_index_input = word.charCodeAt(0) - 'a'.charCodeAt(0);
        return this.dictionary[letter_index_input].has(word);
    }
}
