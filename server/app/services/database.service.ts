// import { injectable } from "inversify";
import { BEST_SCORES, DEFAULT_SCORE, MAX_OCCURANCY } from '@app/classes/constants';
import { LoadableDictionary } from '@app/classes/dictionary';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { PathLike, writeFile } from 'fs';
import { readdir, readFile, rename, unlink } from 'fs/promises';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
// import { map } from 'rxjs';
import { Service } from 'typedi';
import { ValidWordService } from './validate-words.service';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://equipe303:equipe303@clusterscore.6eoob.mongodb.net/scrabble2990?retryWrites=true&w=majority';
const DATABASE_NAME = 'scrabble2990';
const DATABASE_COLLECTION_CLASSIC = 'Score';
const DATABASE_COLLECTION_LOG2990 = 'scoreLog2990';

@Service()
export class DatabaseService {
    arrayOfAllClassicGameScores: Score[] = [];
    arrayOfAllLog2990GameScores: Score[] = [];
    arrayOfAllDictionaries: LoadableDictionary[] = [];
    private db: Db;
    private client: MongoClient;

    constructor(private validateWordService: ValidWordService) {}

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        // this.addNewScore();
        return this.client;
    }
    async closeConnection(): Promise<void> {
        return this.client.close();
    }
    async getAllScores(collectionName: string): Promise<Score[]> {
        return this.db
            .collection(collectionName)
            .find({})
            .sort({ score: -1 })
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }
    get database(): Db {
        return this.db;
    }
    async addNewScore(score: Score, collectionName: string): Promise<void> {
        const scoreX: Score = { name: score.name, score: score.score };
        await this.db.collection(collectionName).insertOne(scoreX);
        // this.sortAllScores(collectionName);
    }
    async sortAllScores(collectionName: string): Promise<void> {
        this.db.collection(collectionName).find({}).sort({ score: -1 });
    }
    async fetchDataReturn(collectionName: string): Promise<void> {
        const arrayOfScoresPromises = await this.getAllScores(collectionName);
        const scoreObj: Score[] = arrayOfScoresPromises.map((res: Score) => {
            const returnedObj: Score = { name: res.name, score: res.score };
            return returnedObj;
        });
        await this.deleteDuplicatedElement(scoreObj, collectionName);
    }
    async resetAllScores(collectionName: string): Promise<Score[]> {
        await this.db.collection(collectionName).deleteMany({});
        for (const score of DEFAULT_SCORE) {
            await this.db.collection(collectionName).insertOne(score);
        }
        await this.sortAllScores(collectionName);
        return this.getAllScores(collectionName);
    }

    async getAllPlayers(collectionName: string): Promise<VirtualPlayer[]> {
        return this.db
            .collection(collectionName)
            .find({})
            .toArray()
            .then((names: VirtualPlayer[]) => {
                return names;
            });
    }

    async addPlayer(collectionName: string, playerName: string): Promise<void> {
        const player: VirtualPlayer = { name: playerName };
        await this.db.collection(collectionName).insertOne(player);
    }

    async removePlayer(collectionName: string, playerName: string): Promise<void> {
        const player: VirtualPlayer = { name: playerName };
        await this.db.collection(collectionName).deleteOne(player);
    }

    async removeAllPlayer(collectionName: string): Promise<void> {
        await this.db.collection(collectionName).deleteMany({});
    }

    async uploadFile(file: LoadableDictionary) {
        const fileString = JSON.stringify(file);
        writeFile(`./assets/Dictionaries/${file.title}.json`, fileString, (err) => {
            if (err) throw err;
        });
        this.dictMetadata();
    }

    async deleteFile(fileName: string) {
        await unlink(`./assets/Dictionaries/${fileName}.json`);
    }

    async deleteAllFile() {
        const testFolder = './assets/Dictionaries';

        const files = await readdir(testFolder);
        for (const file of files) {
            await unlink(`./assets/Dictionaries/${file}`);
        }
    }

    async dictData(title: string, oldName?: string) {
        const testFolder = './assets/Dictionaries';
        const files = await readdir(testFolder);
        if (oldName) {
            let found = false;
            files.map((dic) => {
                if (dic === `${oldName}.json`) found = true;
            });
            if (found) {
                console.log('11111111111111');

                await rename(`./assets/Dictionaries/${oldName}.json`, `./assets/Dictionaries/${title}.json`);
            }
        }
        const data = await readFile(`./assets/Dictionaries/${title}.json`);
        return JSON.parse(data.toString());
    }

    async dictMetadata(): Promise<LoadableDictionary[]> {
        const testFolder = './assets/Dictionaries';

        const files = await readdir(testFolder);
        const paths = files.map((file) => `${testFolder}/${file}` as PathLike);

        const a = paths.map(async (path) => readFile(path));
        const b = await Promise.all(a);
        const c = b.map((buffer) => buffer.toString());
        const d = c.map((z) => JSON.parse(z));
        const partialDicts = d.map((dict) => {
            dict.words = [];
            return dict;
        });
        return partialDicts;
    }
    async deleteDuplicatedElement(arrayOfScores: Score[], collectionName: string) {
        const sortedArray: Score[] = [];
        let isAlreadyExist: number;
        for (let i = 0; i < arrayOfScores.length; i++) {
            isAlreadyExist = sortedArray.findIndex(
                (scoreElement) => scoreElement.name === arrayOfScores[i].name && scoreElement.score === arrayOfScores[i].score,
            );
            if ((i === 0 || isAlreadyExist === -MAX_OCCURANCY) && sortedArray.length < BEST_SCORES) {
                sortedArray.push(arrayOfScores[i]);
            }
        }
        if (collectionName === DATABASE_COLLECTION_CLASSIC) this.arrayOfAllClassicGameScores = sortedArray;
        else if (collectionName === DATABASE_COLLECTION_LOG2990) this.arrayOfAllLog2990GameScores = sortedArray;
    }

    async getChosenDic(chosenDictionary: string) {
        if (chosenDictionary === 'dictionnaire principal') this.validateWordService.chosenDic.length = 0;
        else this.validateWordService.chosenDic[0] = chosenDictionary;
        await this.validateWordService.loadDictionary(this.validateWordService.chosenDic);
    }
}
