import { Letter } from '@app/classes/letters';
import { promises as fs } from 'fs';
import { decompress } from 'fzstd';
import { Service } from 'typedi';

@Service()
export class ValidWordService {
    matchWords: string[] = [];
    concatWord: string = '';
    chosenDic: string[] = [];
    readonly utf8Decoder = new TextDecoder('UTF-8');
    private dictionary?: Set<string>[];
    constructor() {
        this.loadDictionary(this.chosenDic);
    }

    async loadDictionary(file: string[]) {
        let words: string[] = [];
        console.log('66666666666');
        if (file.length !== 0) words = await this.getWordsNotDefault(file[0]);
        else words = await this.getWords();
        console.log('88888888888');
        const letterIndexes = new Array<number[]>();
        console.log(words);
        let tailLetter = words[0].charCodeAt(0);
        console.log('99999999999');
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
        console.log(this.dictionary);
    }
    verifyWord(word: Letter[]): boolean {
        let concatWord = '';
        if (this.dictionary === undefined) {
            console.log('11111111111');
            return false;
        }
        if (word.length === 0) {
            console.log('22222222222');
            return false;
        }
        for (const i of word) {
            const letter = i.charac;
            concatWord += letter;
        }
        console.log(concatWord);
        console.log('333333333333');
        const letterIndexInput = concatWord.charCodeAt(0) - 'a'.charCodeAt(0);
        console.log('444444444444');
        console.log(this.dictionary);

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

    async getNotCompressedWords(file: string): Promise<Buffer> {
        return await fs.readFile('./assets/Dictionaries/' + file + '.json');
    }

    async getWordsNotDefault(file: string): Promise<string[]> {
        const a = await this.getNotCompressedWords(file);
        const c = this.utf8Decoder.decode(a);

        return JSON.parse(c).words;
    }
}
