/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */

import { Application } from '@app/app';
import { LoadableDictionary } from '@app/classes/dictionary';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { DatabaseService } from '@app/services/database.service';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { Container } from 'typedi';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import supertest = require('supertest');

describe('DatabaseController', async () => {
    let databaseService: SinonStubbedInstance<DatabaseService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        databaseService = createStubInstance(DatabaseService);

        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['databaseController'], 'databaseService', { value: databaseService });
        expressApp = app.app;
    });

    it('should resolve when we tryna get all scores', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.getAllScores.resolves(scoreArrayX);
        return supertest(expressApp).get('/api/database/Scores/Score').expect(200);
    });

    it('should resolve when we tryna get all scores', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.getAllScores.resolves(scoreArrayX);
        databaseService.fetchDataReturn.resolves();
        databaseService.arrayOfAllClassicGameScores = scoreArrayX;
        return supertest(expressApp).get('/api/database/Scores/scoreLog2990').send(scoreArrayX).expect(200);
    });
    it('should resolve when we tryna get all scores when it equal', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.fetchDataReturn.resolves();
        databaseService.arrayOfAllClassicGameScores = scoreArrayX;
        return supertest(expressApp).get('/api/database/Scores/Score').send(scoreArrayX).expect(200);
    });
    it('should reject when trying the route get all scores from classic mode', async () => {
        databaseService.fetchDataReturn.rejects(new Error('error'));
        return await supertest(expressApp).get('/api/database/Scores/Score').expect(404);
    });

    it('should reject when trying the route get all scores from no collection', async () => {
        databaseService.fetchDataReturn.resolves();
        return supertest(expressApp).get('/api/database/Scores/reg').expect(200);
    });

    it('should catch error when rejected deleteAllFile', async () => {
        databaseService.deleteAllFile.rejects(new Error('error'));
        return supertest(expressApp).delete('/api/database/dictionaries').expect(404);
    });
    it('should catch error when rejected deleting all file', async () => {
        databaseService.deleteAllFile.resolves();
        return supertest(expressApp).delete('/api/database/dictionaries').expect(204);
    });

    it('should test if addscore() is ok', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.addNewScore.resolves();
        return supertest(expressApp).post('/api/database/addScore/Score/sami/10').send(scoreArrayX).expect(201);
    });
    it('should reject when trying the route post AddScore() score from classic mode', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.addNewScore.rejects(new Error('error'));
        return supertest(expressApp).post('/api/database/addScore/Score/sami/10').send(scoreArrayX).expect(404);
    });

    it('should resetAllScore() GET', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.resetAllScores.resolves(scoreArrayX);
        return supertest(expressApp).get('/api/database/resetAllScores/Score').expect(200);
    });

    it('should reject when trying the route post AddScore() score from classic mode', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.resetAllScores.rejects(new Error('error'));
        return supertest(expressApp).get('/api/database/resetAllScores/Score').send(scoreArrayX).expect(404);
    });

    it('should getAllPlayers() GET and respond with 200', async () => {
        const scoreArrayX: Score[] = [{ name: 'sami', score: 10 }];
        databaseService.getAllPlayers.resolves(scoreArrayX);
        return supertest(expressApp).get('/api/database/vrNames/izi').expect(200);
    });

    it('should reject when trying the route post getAllPlayers() from it collection', async () => {
        const scoreArrayX: VirtualPlayer[] = [{ name: 'sami' }];
        databaseService.getAllPlayers.rejects(new Error('error'));
        return supertest(expressApp).get('/api/database//vrNames/izi').send(scoreArrayX).expect(404);
    });

    it('should reject when trying the route post addPlayer() ', async () => {
        const scoreArrayX: VirtualPlayer[] = [{ name: 'sami' }];
        databaseService.addPlayer.rejects(new Error('error'));
        return supertest(expressApp).post('/api/database/addPlayer/izi/score').send(scoreArrayX).expect(404);
    });

    it('should addPlayer() Post', async () => {
        databaseService.addPlayer.resolves();
        return supertest(expressApp).post('/api/database/addPlayer/izi/score').expect(201);
    });

    it('should catch error when rejected removePlayer', async () => {
        databaseService.removePlayer.rejects(new Error('error'));
        return supertest(expressApp).delete('/api/database/removePlayer/score/player').expect(404);
    });
    it('should catch error when rejected removePlayer()', async () => {
        databaseService.removePlayer.resolves();
        return supertest(expressApp).delete('/api/database/removePlayer/score/player').expect(201);
    });

    it('should catch error when rejected removeAllPlayer()', async () => {
        databaseService.removeAllPlayer.rejects(new Error('error'));
        return supertest(expressApp).delete('/api/database/removeAllPlayer/izi').expect(404);
    });
    it('should delete all player when taking route of removeAllPlayer()', async () => {
        databaseService.removeAllPlayer.resolves();
        return supertest(expressApp).delete('/api/database/removeAllPlayer/izi').expect(201);
    });

    it('should reject when trying the route post updatePlayer()  ', async () => {
        const scoreArrayX: VirtualPlayer[] = [{ name: 'sami' }];
        databaseService.updatePlayer.rejects(new Error('error'));
        return supertest(expressApp).patch('/api/database/updatePlayer/Score/sami/izi').send(scoreArrayX).expect(404);
    });

    it('should updatePlayer() player into the db', async () => {
        const scoreArrayX: VirtualPlayer[] = [{ name: 'sami' }];
        databaseService.updatePlayer.resolves();
        return supertest(expressApp).patch('/api/database/updatePlayer/Score/sami/izi').send(scoreArrayX).expect(201);
    });

    it('should reject when trying the route post updatePlayer()', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.uploadFile.rejects(new Error('error'));
        return supertest(expressApp).post('/api/database/upload').send(loadableDictionary).expect(404);
    });

    it('should uploadFile() Post dictionary into the server', async () => {
        databaseService.uploadFile.resolves();
        return supertest(expressApp).post('/api/database/upload').expect(201);
    });

    it('should take the route of deleteFile', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.deleteFile.rejects(new Error('error'));
        return supertest(expressApp).delete('/api/database/dictionary/sami').send(loadableDictionary).expect(404);
    });
    it('should catch error when rejected deleteFil()', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.deleteFile.resolves();
        return supertest(expressApp).delete('/api/database/dictionary/sami').send(loadableDictionary).expect(204);
    });
    it('dicData() should reject and throw an error', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.dictData.rejects(new Error('error'));
        return supertest(expressApp).get('/api/database/dictionary/title/oldName').send(loadableDictionary).expect(404);
    });
    it('dicData() should reject and throw an error', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.dictData.rejects(new Error('error'));
        return supertest(expressApp).get('/api/database/dictionary/title').send(loadableDictionary).expect(404);
    });
    it('dicData() should be executed and return OK status', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.dictData.resolves();
        return supertest(expressApp).get('/api/database/dictionary/title/oldName').send(loadableDictionary).expect(200);
    });

    it('dictMetadata() should reject and throw an error', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.dictMetadata.rejects(new Error('error'));
        return supertest(expressApp).get('/api/database/dictionaries').send(loadableDictionary).expect(404);
    });
    it('dictMetadata() should be executed and return OK status', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.dictMetadata.resolves();
        return supertest(expressApp).get('/api/database/dictionaries').send(loadableDictionary).expect(200);
    });

    it('getChosenDic() should reject and throw an error', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.getChosenDic.rejects(new Error('error'));
        return supertest(expressApp).post('/api/database/localStorage/chosenDictionary').send(loadableDictionary).expect(404);
    });
    it('getChosenDic() should be executed and return OK status', async () => {
        const loadableDictionary: LoadableDictionary = {
            title: 'sami',
            description: 'francais',
            words: ['sami', 'aa'],
        };
        databaseService.getChosenDic.resolves();
        return supertest(expressApp).post('/api/database/localStorage/chosenDictionary').send(loadableDictionary).expect(201);
    });
});
