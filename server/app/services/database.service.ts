//import { injectable } from "inversify";
import { Score } from '../classes/score';
import { MongoClient, Db } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DEFAULT_SCORE } from '@app/classes/constants';
import { VirtualPlayer} from '@app/classes/virtualPlayers';

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
            let client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        // this.resetAllScores(DATABASE_COLLECTION_LOG2990);
        // this.removeDuplicatedDocument(DATABASE_COLLECTION_LOG2990);
        // this.addPlayer('virtualPlayerExpert', '3aziz1234');
        // this.fetchPlayer('virtualPlayerExpert');
        // // this.removePlayer('virtualPlayerExpert', 'Messi1234');
        // this.fetchPlayer('virtualPlayerExpert');

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
            .limit(5)
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }
    get database(): Db {
        return this.db;
    }
    async addNewScore(score: Score, collectionName: string): Promise<void> {
        await this.db.collection(collectionName).insertOne(score);
        this.sortAllScores(collectionName);
    }
    async sortAllScores(collectionName: string): Promise<void> {
        this.db.collection(collectionName).find({}).sort({ score: -1 });
    }
    async fetchDataReturn(collectionName: string): Promise<void> {
        let arrayOfScoresPromises = await this.getAllScores(collectionName);
        console.log('array 1 : ', arrayOfScoresPromises);
        const scoreObj = arrayOfScoresPromises.map((res: Score) => {
            const returnedObj: Score = { name: res.name, score: res.score };
            return returnedObj;
        });
        if (collectionName === DATABASE_COLLECTION_CLASSIC) this.arrayOfAllClassicGameScores = scoreObj;
        else if (collectionName === DATABASE_COLLECTION_LOG2990) this.arrayOfAllLog2990GameScores = scoreObj;

        console.log('array 2', scoreObj);
    }
    async resetAllScores(collectionName: string): Promise<Score[]> {
        await this.db.collection(collectionName).deleteMany({});
        for (let score of DEFAULT_SCORE) {
            await this.db.collection(collectionName).insertOne(score);
        }
        await this.sortAllScores(collectionName);
        return this.getAllScores(collectionName);
    }

    async removeDuplicatedDocument(collectionName: string):Promise<void>{
        this.db.collection(collectionName).aggregate([
            {$group: {
                _score: { score: '$_score' },
                dups: { $addToSet: '$_score'  },
             }
            }
        ]);
    }

    async getAllPlayers(collectionName:string):Promise<VirtualPlayer[]>{
        return this.db.collection(collectionName)
        .find({})
        .toArray()
        .then((names: VirtualPlayer[]) => {
            return names;
        });
    }

    async addPlayer(collectionName:string, playerName:string):Promise<void>{
        let player:VirtualPlayer={name:playerName};
        await this.db.collection(collectionName).insertOne(player);
    }

    // async removePlayer(collectionName:string, playerName:string):Promise<VirtualPlayer>{
    //     let player:VirtualPlayer={name:playerName};
    //     return this.db.collection(collectionName).findOneAndDelete(({player}))
    // }
    // async removePlayer(collectionName:string, playerName:string): Promise<void> {
    //     return this.collection(collectionName)
    //     .findOneAndDelete({ subjectCode: sbjCode })
    //     .then((res:FindAndModifyWriteOpResultObject<Course>) => {
    //     if(!res.value){ throw new Error("Could not find course"); }
    //     })
    //     .catch(() => {throw new Error("Failed to delete course");});
    //     }

    async fetchPlayer(collectionName: string): Promise<void> {
        let arrayOfScoresPromises = await this.getAllPlayers(collectionName);
        // console.log('array 1 : ', arrayOfScoresPromises);
        const scoreObj:VirtualPlayer[] = arrayOfScoresPromises.map((res: VirtualPlayer) => {
            const returnedObj: VirtualPlayer = { name: res.name };
            return returnedObj;
        });
        // if (collectionName === DATABASE_COLLECTION_CLASSIC) this.arrayOfAllClassicGameScores = scoreObj;
        // else if (collectionName === DATABASE_COLLECTION_LOG2990) this.arrayOfAllLog2990GameScores = scoreObj;

        console.log('playerNames :', scoreObj);
    }


}