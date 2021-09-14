/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface JsonData {
    words: string[];
}

@Injectable({
    providedIn: 'root',
})
export class ValidWorldService {
    private dictionary_loaded: boolean = false;
    private dictionary: Array<Set<string>>;

    constructor(private http: HttpClient) {}

    private get_dictionary(): Observable<JsonData> {
        return this.http.get<JsonData>('/assets/dictionnary.json');
    }

    public async load_dictionary() {
        const data = await this.get_dictionary().toPromise();

        const words = data.words.map((str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

        const letter_indexes = new Array();

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
        this.dictionary_loaded = true;
    }

    public verify_word(word: string) {
        if (!this.dictionary_loaded) {
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
