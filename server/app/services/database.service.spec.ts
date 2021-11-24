// import { injectable } from "inversify";
// import { BEST_SCORES, DEFAULT_SCORE, MAX_OCCURANCY } from '@app/classes/constants';
// import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { DATABASE_COLLECTION_CLASSIC } from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { expect } from 'chai';
// import { ScoreTest } from '@app/classes/score';
import {  Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import 'reflect-metadata';
// import { Score, ScoreTest } from '../classes/score';
// import { Drawing } from '@common/communication/drawing';
// import { expect } from 'chai';
import { DatabaseService } from './database.service';
describe('database service', () => {
// tslint:disable:no-any
const DATABASE_NAME = 'scrabble2990';
let mongoServer: MongoMemoryServer;
let collection: Collection<Score>;
let clientTest: MongoClient;
let databaseService: DatabaseService;
// let db:Db;
// let mongoServer:MongoMemoryServer;
const score1: Score = {
    name: 'test1',
    // _id: '123456987654567',
    score: 0
};

// const drawingTestTwo: ScoreTest = {
//     name: 'test2',
//     _id: 'dcfcdcdceew32332',
//     score: 10,


// };

// const drawingTestFalse: ScoreTest = {
//     name: '',
//     _id: '',
//     score: 10,
// };


before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await MongoClient.connect(mongoUri).then((client: MongoClient) => {
        collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION_CLASSIC);
        // db = client.db(DATABASE_NAME)
        clientTest = client;
    });
    databaseService = new DatabaseService();
    // tslint:disable-next-line:no-string-literal
    // databaseService['collection'] = collection;

    // console.log(db.collection(DATABASE_COLLECTION_CLASSIC).countDocuments());
    // databaseService.arrayOfAllClassicGameScores=[]
    databaseService['collection'] = collection;

});

after(async () => {
    // tslint:disable-next-line:no-string-literal
    // await databaseService..deleteMany({});
    // await clientTest.close();
    // await db.collection('Score').deleteMany({});
    await databaseService['collection'].deleteMany({});
    await clientTest.close();
    await mongoServer.stop();

});


    it('should get all Score stored in collection Scores', async () => {
        // databaseService.addDrawing(drawingTest)
        await databaseService.addNewScore(score1,DATABASE_COLLECTION_CLASSIC);

        // const expectedDrawings: ScoreTest[] = new Array<ScoreTest>();
        // expectedDrawings.push(score1);
        return databaseService.getAllScores(DATABASE_COLLECTION_CLASSIC).then((result: Score[]) => {
            // databaseService.deleteDrawing(drawingTestTwo._id);
            return expect(result[0].name).to.equals(score1.name);
        });
    });

    // it('should get one drawing', async () => {
    //     databaseService.addDrawing(drawingTestTwo);
    //     return databaseService.getDrawing(String(drawingTestTwo.name)).then((result: Drawing) => {
    //         return expect(result.name).to.equals(drawingTestTwo.name);
    //     });
    // });

    // it('should not add one drawing', async () => {
    //     databaseService.addDrawing(drawingTestFalse);
    //     return databaseService.getDrawing(String(drawingTestFalse.name)).then((result: Drawing) => {
    //         return expect(result).to.equals(null);
    //     });
    // });

    // it('should delete one drawing', async () => {
    //     databaseService.deleteDrawing(String(drawingTestOne._id));
    //     return databaseService.getDrawing(String(drawingTestOne._id)).then((result: Drawing) => {
    //         return expect(result).to.equals(null);
    //     });
    // });
});
