// import { injectable } from "inversify";
import { BEST_SCORES, DEFAULT_SCORE, MAX_OCCURANCY } from '@app/classes/constants';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
// import { map } from 'rxjs';
import { Service } from 'typedi';
import { Score } from '../classes/score';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://equipe303:equipe303@clusterscore.6eoob.mongodb.net/scrabble2990?retryWrites=true&w=majority';
const DATABASE_NAME = 'scrabble2990';
const DATABASE_COLLECTION_CLASSIC = 'Score';
const DATABASE_COLLECTION_LOG2990 = 'scoreLog2990';

@Service()
export class DatabaseService {
    arrayOfAllClassicGameScores: Score[] = [];
    arrayOfAllLog2990GameScores: Score[] = [];
    private db: Db;
    private client: MongoClient;

    //   private options: MongoClientOptions = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   };

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
        console.log('hey je suis la dedans');
        let scoreX:Score={name:score.name, score:score.score};
        await this.db.collection(collectionName).insertOne(scoreX);
    }
    async sortAllScores(collectionName: string): Promise<void> {
        this.db.collection(collectionName).find({}).sort({ score: -1 });
    }
    async fetchDataReturn(collectionName: string): Promise<void> {
        const arrayOfScoresPromises = await this.getAllScores(collectionName);
        let scoreObj: Score[] = arrayOfScoresPromises.map((res: Score) => {
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

    // async fetchPlayer(collectionName: string): Promise<void> {
    //     const arrayOfScoresPromises = await this.getAllPlayers(collectionName);
    //     // console.log('array 1 : ', arrayOfScoresPromises);
    //     const scoreObj: VirtualPlayer[] = arrayOfScoresPromises.map((res: VirtualPlayer) => {
    //         const returnedObj: VirtualPlayer = { name: res.name };
    //         return returnedObj;
    //     });

    //     console.log('playerNames :', scoreObj);
    // }
    async deleteDuplicatedElement(arrayOfScores: Score[], collectionName:string) {
        let sortedArray: Score[] = [];
        let isAlreadyExist: number;
        for (let i: number = 0; i < arrayOfScores.length; i++) {
            isAlreadyExist = sortedArray.findIndex(
                (scoreElement) => scoreElement.name === arrayOfScores[i].name && scoreElement.score === arrayOfScores[i].score,
            );
            if ((i === 0 || isAlreadyExist === -MAX_OCCURANCY) && sortedArray.length <BEST_SCORES) {
                sortedArray.push(arrayOfScores[i]);
            }
        }
        if (collectionName === DATABASE_COLLECTION_CLASSIC) this.arrayOfAllClassicGameScores = sortedArray;
        else if (collectionName === DATABASE_COLLECTION_LOG2990) this.arrayOfAllLog2990GameScores = sortedArray;

    }

}
