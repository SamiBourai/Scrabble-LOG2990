/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */

import { DATABASE_COLLECTION_LOG2990, DATABASE_COLLECTION_VRNAMESBEG } from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { expect } from 'chai';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import assertStub from 'sinon-assert-stub';
import sinon from 'sinon';

import { DatabaseService } from './database.service';
describe('database service', () => {
    // tslint:disable:no-any
    const DATABASE_NAME = 'scrabble2990';
    const DATABASE_COLLECTION__CLASSIC = 'Score';
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseService;
    let db: Db;
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sandbox: any;
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
            db = client.db(DATABASE_NAME);
        });
        databaseService = new DatabaseService();
        // tslint:disable-next-line:no-string-literal
        databaseService['db'] = db;
    });
    beforeEach(async () => {
        sandbox = sinon.sandbox.create();
    });

    after(async () => {
        // tslint:disable-next-line:no-string-literal
        await databaseService.closeConnection();
        await mongoServer.stop();
    });
    afterEach(() => {
        databaseService['db'].collection(DATABASE_COLLECTION__CLASSIC).deleteMany({});
        databaseService['db'].collection(DATABASE_COLLECTION_VRNAMESBEG).deleteMany({});
    });

    it('should return a client when connection is established', async () => {
        return databaseService.start(mongoServer.getUri()).then((result: MongoClient) => {
            return expect(result.db(DATABASE_NAME).collection(DATABASE_COLLECTION__CLASSIC).collectionName).to.equals(DATABASE_COLLECTION__CLASSIC);
        });
    });

    it('should throw an error when connection is note established', async (done) => {
        try {
            databaseService.start('salut');
        } catch (err) {
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
        const bdTest: Db = databaseService.database;
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
        expect(databaseService.arrayOfAllClassicGameScores[0].name).to.equal(score3.name);
        expect(databaseService.arrayOfAllClassicGameScores[2].name).to.equal(score1.name);
        expect(databaseService.arrayOfAllClassicGameScores[1].name).to.equal(score2.name);
    });

    it('should get all virtual players added to the collection virtual player Names ', async () => {
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'estarossa');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then((virtualPlayers: VirtualPlayer[]) => {
            return expect(virtualPlayers[0].name).to.be.equal('sami');
        });
    });
    it('should remove the given vr player name ', async () => {
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'estarossa');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'marouane');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'blk');

        databaseService.removePlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then((virtualPlayers: VirtualPlayer[]) => {
            return expect(virtualPlayers.length).to.equal(3);
        });
    });
    it('should remove the given vr player name ', async () => {
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'estarossa');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'marouane');
        databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'blk');

        databaseService.removePlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then((virtualPlayers: VirtualPlayer[]) => {
            return expect(virtualPlayers.length).to.equal(3);
        });
    });

    it('should delete all duplicated element get from database', async () => {
        const scoreX: Score = { name: 'sami92i', score: 10 };
        const scoreY: Score = { name: 'yyaa', score: 9 };
        const scoreZ: Score = { name: 'sami92i', score: 10 };
        const scoreA: Score = { name: 'blk', score: 10 };
        const scoreB: Score = { name: 'yaris', score: 1 };
        const arrayOfScore: Score[] = [scoreX, scoreA, scoreZ, scoreY, score3, score2, scoreB, score1];
        databaseService.deleteDuplicatedElement(arrayOfScore, DATABASE_COLLECTION_LOG2990);
        expect(databaseService.arrayOfAllLog2990GameScores.length).to.equal(5);
    });
    it('should reset all database and pupulate it with default entities', async () => {
        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score2, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);

        return databaseService.resetAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result.length).to.be.equal(5);
        });
    });
    it('', async () => {
        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score2, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);
        await databaseService.addNewScore(score3, DATABASE_COLLECTION__CLASSIC);

        return databaseService.resetAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result.length).to.be.equal(5);
        });
    });
});
