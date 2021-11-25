// import { injectable } from "inversify";
// import { BEST_SCORES, DEFAULT_SCORE, MAX_OCCURANCY } from '@app/classes/constants';
// import { VirtualPlayer } from '@app/classes/virtualPlayers';
// import { DATABASE_COLLECTION__CLASSIC_CLASSIC } from '@app/classes/constants';
// import { DATABASE_COLLECTION__CLASSIC_CLASSIC } from '@app/classes/constants';
import { DATABASE_COLLECTION_LOG2990, DATABASE_COLLECTION_VRNAMESBEG } from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
// import { deepEqual } from 'assert';
import {  expect } from 'chai';
// import { ScoreTest } from '@app/classes/score';
import {Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import 'reflect-metadata';
// import { Score, ScoreTest } from '../classes/score';
// import { Drawing } from '@common/communication/drawing';
// import { expect } from 'chai';
import { DatabaseService } from './database.service';
describe('database service', () => {
    // tslint:disable:no-any
    const DATABASE_NAME = 'scrabble2990';
    const DATABASE_COLLECTION__CLASSIC: string = 'Score';
    // const DATABASE_COLLECTION__LOG2990: string = 'scoreLog2990';
    let mongoServer: MongoMemoryServer;
    // let collection: Collection<any>;
    // let clientTest: MongoClient;
    let databaseService: DatabaseService;
    let db: Db;
    // let mongoServer:MongoMemoryServer;
    const score1: Score = {
        name: 'test1',
        score: 0,
    };
    const score2: Score = {
        name: 'test2',
        score: 1,
    };
    const score3: Score = {
        name: 'test3',
        score: 2,
    };

    // const virtualPlayer1:VirtualPlayer={
    //     name:'sami'
    // }
    // const virtualPlayer2:VirtualPlayer={
    //     name:'mounib'
    // }



    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await MongoClient.connect(mongoUri).then((client: MongoClient) => {
            // collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION__CLASSIC);
            db = client.db(DATABASE_NAME);
            // console.log(collection, 'collection printed');
            // db = client.db(DATABASE_NAME)
            // clientTest = client;
        });
        databaseService = new DatabaseService();
        // tslint:disable-next-line:no-string-literal
        databaseService['db'] = db;
    });

    after(async () => {
        // tslint:disable-next-line:no-string-literal

        // await clientTest.close();
        await databaseService.closeConnection();
        await mongoServer.stop();
    });
    afterEach(()=>{
        databaseService['db'].collection(DATABASE_COLLECTION__CLASSIC).deleteMany({});
        databaseService['db'].collection(DATABASE_COLLECTION_VRNAMESBEG).deleteMany({});

    })

    it('should return a client when connection is established', async () => {

        return databaseService.start(mongoServer.getUri()).then((result: MongoClient) => {
            return expect( result.db(DATABASE_NAME).collection(DATABASE_COLLECTION__CLASSIC).collectionName).to.equals(DATABASE_COLLECTION__CLASSIC);
        });
    });

    it('should throw an error when connection is note established', async (done) => {
        try {
            databaseService.start('salut')
        }
        catch(err) {
            expect(err).to.eql(new Error('Database connection error'));
        }
        done();
    });

    it('should get all Score stored in collection Scores', async () => {
        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        return databaseService.getAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result[0].name).to.equals(score1.name);
        });
    });
    it('should get all Score stored in collection Scores in case Scores is empty', async () => {
        return databaseService.getAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result[0]).to.be.undefined;
        });
    });

    it('should return the bd', async () => {
        // databaseService['db'].collection(DATABASE_COLLECTION__CLASSIC).deleteMany({});
        const bdTest:Db= databaseService.database;
        expect(bdTest.collection(DATABASE_COLLECTION__CLASSIC).collectionName).to.equal(DATABASE_COLLECTION__CLASSIC);
    });
    it('should sort all scores in the bd by score proprety', async () => {


        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score2, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.sortAllScores(DATABASE_COLLECTION__CLASSIC);

        return databaseService.getAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result[0].score).to.equals(score3.score);

        });
    });
    it('should sort all scores in the bd by score proprety', async () => {

        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score2, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.fetchDataReturn(DATABASE_COLLECTION__CLASSIC);
        expect(databaseService.arrayOfAllClassicGameScores[0].name).to.equal(score3.name)
        expect(databaseService.arrayOfAllClassicGameScores[2].name).to.equal(score1.name)
        expect(databaseService.arrayOfAllClassicGameScores[1].name).to.equal(score2.name)
    });

    it('should get all virtual players added to the collection virtual player Names ', async () => {

        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'estarossa');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then(( virtualPlayers : VirtualPlayer[] )=>{
            return expect(virtualPlayers[0].name).to.be.equal('sami');
       })
    });
    it('should remove the given vr player name ', async () => {

        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'estarossa');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'marouane');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'blk');

        databaseService.removePlayer(DATABASE_COLLECTION_VRNAMESBEG,'sami');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then(( virtualPlayers : VirtualPlayer[] )=>{

            return expect(virtualPlayers.length).to.equal(3);
       })
    });
    it('should remove the given vr player name ', async () => {

        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'estarossa');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'marouane');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG,'blk');

        databaseService.removePlayer(DATABASE_COLLECTION_VRNAMESBEG,'sami');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then(( virtualPlayers : VirtualPlayer[] )=>{

            return expect(virtualPlayers.length).to.equal(3);
       })
    });


    it('should delete all duplicated element get from database', async () => {
        const scoreX:Score={name:'sami92i', score: 10}
        const scoreY:Score={name:'yyaa', score: 9}
        const scoreZ:Score={name:'sami92i', score: 10}
        const scoreA:Score={name:'blk', score: 10}
        const scoreB:Score={name:'yaris', score: 1}
        const arrayOfScore:Score[]= [scoreX,scoreA,scoreZ, scoreY,  score3,  score2,scoreB, score1];
        databaseService.deleteDuplicatedElement(arrayOfScore, DATABASE_COLLECTION_LOG2990);
        expect(databaseService.arrayOfAllLog2990GameScores.length).to.equal(5);
    });



});
