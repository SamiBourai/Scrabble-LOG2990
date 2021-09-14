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
    private dictionnary_loaded: boolean = false;
    // private dictionnary = new Array<Set<string>>(24);
    private dictionnary : Set<string>;

    constructor(private http: HttpClient) {
        //for (let i = 0; i < this.dictionnary.length; ++i) {
        //    this.dictionnary[i] = new Set();
        //}
    }

    private get_dictionnary(): Observable<JsonData> {
        return this.http.get<JsonData>('/assets/dictionnary.json');
    }

    private accent_fix(str: string) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    public load_dictionary() {
        return this.get_dictionnary().toPromise().then(({words}) => {
            const len = words.length;
            for (let i = 0; i < len; ++i) {
                words[i] = this.accent_fix(words[i]);
            }

            //for (let i = 0; i < len; ++i) {
            //    const letter_index = words[i].charCodeAt(0) - 'a'.charCodeAt(0);
            //    this.dictionnary[letter_index].add(words[i]);
            //}
            this.dictionnary = new Set(words);
            
            this.dictionnary_loaded = true;;
        });
    }

    public verify_word(word: string) {
        if (!this.dictionnary_loaded) {
            console.log('ntm t a pas chargé');
            return;
        }
        if (word.length == 0) {
            console.log('Mot vide!');
            return;
        }
        
        //const letter_index_input = word.charCodeAt(0) - 'a'.charCodeAt(0);
        //return this.dictionnary[letter_index_input].has(word);
        return this.dictionnary.has(word);
    }
}
