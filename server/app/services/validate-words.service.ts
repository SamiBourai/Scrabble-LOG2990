import { Letter } from '@app/classes/letters';
import { promises as fs } from 'fs';
import { decompress } from 'fzstd';
import { Service } from 'typedi';

@Service()
export class ValidWordService {
    matchWords: string[] = [];
    concatWord: string = '';
    readonly utf8Decoder = new TextDecoder('UTF-8');
    private dictionary?: Set<string>[];
    constructor() {
        this.loadDictionary();
    }
    async loadDictionary() {
        const words = await this.getWords();
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
    verifyWord(word: Letter[]): boolean {
        let concatWord = '';
        if (this.dictionary === undefined) {
            return false;
        }
        if (word.length === 0) {
            return false;
        }
        for (const i of word) {
            const letter = i.charac;
            concatWord += letter;
        }
        const letterIndexInput = concatWord.charCodeAt(0) - 'a'.charCodeAt(0);
        return this.dictionary[letterIndexInput].has(concatWord);
    }

    async getCompressedWords(): Promise<Buffer> {
        return fs.readFile('./assets/dictionary_min.json.zst');
    }

    async getWords(): Promise<string[]> {
        const a = await this.getCompressedWords();
        const b = decompress(a);
        const c = this.utf8Decoder.decode(b);
        return JSON.parse(c);
    }
}
