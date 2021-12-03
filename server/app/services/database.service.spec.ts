/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */

import { DATABASE_COLLECTION_LOG2990, DATABASE_COLLECTION_VRNAMESBEG } from '@app/classes/constants';
import { LoadableDictionary } from '@app/classes/dictionary';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { expect } from 'chai';
import * as fs from 'fs';
import { readdir, unlink, writeFile } from 'fs/promises';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { DatabaseService } from './database.service';
import { ValidWordService } from './validate-words.service';
import assert = require('assert');
import sinon = require('sinon');

describe('database service', () => {
    // tslint:disable:no-any
    const DATABASE_NAME = 'scrabble2990';
    const DATABASE_COLLECTION__CLASSIC = 'Score';
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseService;
    let validateWordService: SinonStubbedInstance<ValidWordService>;
    let db: Db;

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
    beforeEach(async () => {
        validateWordService = createStubInstance(ValidWordService);
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await MongoClient.connect(mongoUri).then((client: MongoClient) => {
            db = client.db(DATABASE_NAME);
        });
        databaseService = new DatabaseService(validateWordService);
        // tslint:disable-next-line:no-string-literal
        databaseService['db'] = db;
    });

    after(() => {
        databaseService.closeConnection();
        mongoServer.stop();
    });
    afterEach(async () => {
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
        await databaseService.addNewScore(score1, DATABASE_COLLECTION__CLASSIC);
        return databaseService.getAllScores(DATABASE_COLLECTION__CLASSIC).then((result: Score[]) => {
            return expect(result.length).to.equal(1);
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
        await databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'sami');
        await databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'estarossa');

        return databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then((virtualPlayers: VirtualPlayer[]) => {
            return expect(virtualPlayers.length).to.be.greaterThan(0);
        });
    });
    it('should remove the given vr player name ', async () => {
        await databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'izi');
        await databaseService.removePlayer(DATABASE_COLLECTION_VRNAMESBEG, 'izi');

        return await databaseService.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG).then(async (virtualPlayers: VirtualPlayer[]) => {
            return expect(virtualPlayers.length).to.equal(0);
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

    it('should rturn an empty array in case we pass a none existing collection in our database service', async () => {
        const scoreX: Score = { name: 'sami92i', score: 10 };
        const scoreY: Score = { name: 'yyaa', score: 9 };
        const scoreZ: Score = { name: 'sami92i', score: 10 };
        const scoreA: Score = { name: 'blk', score: 10 };
        const scoreB: Score = { name: 'yaris', score: 1 };
        const arrayOfScore: Score[] = [scoreX, scoreA, scoreZ, scoreY, score3, score2, scoreB, score1];
        databaseService.deleteDuplicatedElement(arrayOfScore, 'deede');
        expect(databaseService.arrayOfAllLog2990GameScores.length).to.equal(0);
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
    it('updatePlayer() should update the spicifide vr name', async () => {
        await databaseService.addPlayer(DATABASE_COLLECTION_VRNAMESBEG, 'yanis');

        databaseService.updatePlayer(DATABASE_COLLECTION__CLASSIC, 'sami', 'yanis');
        databaseService.getAllPlayers(DATABASE_COLLECTION__CLASSIC).then((players: VirtualPlayer[]) => {
            return expect(players[0].name).to.be.equal('sami');
        });
    });
    it('removeAllPlayer() should remove all players', async () => {
        await databaseService.addPlayer('test', DATABASE_COLLECTION__CLASSIC);

        databaseService.removeAllPlayer(DATABASE_COLLECTION__CLASSIC);
        databaseService.getAllPlayers(DATABASE_COLLECTION__CLASSIC).then((players: VirtualPlayer[]) => {
            return expect(players.length).to.be.equal(0);
        });
    });

    it('should writefile in assert/Dictionnaries diratory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const spy = sinon.spy(fs, 'writeFile');
        const spyX = sinon.spy(databaseService, 'dictMetadata');
        await databaseService.uploadFile(loadableDictionary).then(async () => {
            assert(spy.calledOnce);
            assert(spyX.calledOnce);
        });
        await databaseService.deleteAllFile();
        spy.restore();
    });
    it('should writefile infreferferfre assert/Dictionnaries diratory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const spy = sinon.stub(fs, 'writeFile').returns();

        const spyX = sinon.spy(databaseService, 'dictMetadata');
        await databaseService.uploadFile(loadableDictionary);
        const err1 = new Error('erreeur');
        try {
            spy.args[0][2](err1);
        } catch (err) {
            expect(err).equal(err1);
        }

        assert(spy.calledOnce);
        assert(spyX.calledOnce);
        spy.restore();
        await databaseService.deleteAllFile();
    });

    // it('writeFile() should throw an error', async () => {
    //     const loadableDictionary: LoadableDictionary = {
    //         title: '',
    //         description: '',
    //         words: ['', ''],
    //     };
    // sinon.stub(fs, 'writeFile').rejects(new Error());

    //     // const spy = sinon.spy(fs, 'writeFile');
    // const spyX = sinon.spy(databaseService, 'dictMetadata');
    //     // await databaseService.uploadFile(loadableDictionary);
    //     // await unlink('./assets/Dictionaries/sami.json');
    //     // assert(spy.calledOnce);
    //     // assert(spyX.calledOnce);

    //     expect(await databaseService.uploadFile.bind(loadableDictionary)).to.throw();
    //     await databaseService.deleteAllFile();
    //     // try {
    //     //     await databaseService.uploadFile(loadableDictionary);
    //     // } catch (err) {
    //     //     expect(err).to.eql('Error');
    //     // }
    //     // done();
    // });

    it('deleteAllFile() delete all files in the diractory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'izi',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/izi.json', fileString);
        await databaseService.deleteAllFile();
        return await readdir('./assets/Dictionaries').then(async (e) => {
            return expect(e.length).equal(0);
        });
    });

    it('delete() should delete a file in the diractory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'rert',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/rert.json', fileString);
        await databaseService.deleteFile('rert').then(async () => {
            const files = await readdir('./assets/Dictionaries');
            for (const file of files) {
                expect(file).to.not.equal('rert.json');
            }
        });
        await databaseService.deleteAllFile();
    });

    it('dictData() should get the dictionary data', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'test3',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/test3.json', fileString);
        await databaseService.dictData('test3').then(async (data) => {
            expect(data.title + '.json').to.equal('test3.json');
        });
        await unlink('./assets/Dictionaries/test3.json');
    });

    it('dictData() should update dictionary name and store its data on it', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'first',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/first.json', fileString);
        await databaseService.dictData('first', 'first').then(async (data) => {
            expect(data.title + '.json').to.equal('first.json');
        });
        await databaseService.deleteAllFile();
    });

    it('dictData() should return the default dictionnary already in the diractory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'try',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/try.json', fileString);
        await databaseService.dictData('try', 'derfer').then(async (data) => {
            expect(data.title + '.json').to.equal('try.json');
        });
        await databaseService.deleteAllFile();
    });

    it('dictMetadata() should should return metadata of diractory', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'first',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        const fileString = JSON.stringify(loadableDictionary);
        await writeFile('./assets/Dictionaries/first.json', fileString);
        await databaseService.dictMetadata().then(async (dic: LoadableDictionary[]) => {
            expect(dic.length).to.equal(1);
        });
        await databaseService.deleteAllFile();
    });
});
