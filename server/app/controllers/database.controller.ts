// import { CREATED_HTTP_STATUS, NOT_FOUND_HTTP_STATUS, OK_HTTP_STATUS } from '@app/constants';
import { CREATED_HTTP_STATUS, NOT_FOUND_HTTP_STATUS } from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { DatabaseService } from '@app/services/database.service';
// import * as Httpstatus from "http-status-codes";
// import { TYPES } from '@app/types';
// import { Drawing } from '@common/communication/drawing';
import { NextFunction, Request, Response, Router } from 'express';
// import { inject, injectable } from 'inversify';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // TODO : Find a way of getting an array of parameters

        this.router.get('/Scores/:collectionName', async (req: Request, res: Response, next: NextFunction) => {
                console.log('parametre',req.params.collectionName);

                try{
                    await this.databaseService.fetchDataReturn(req.params.collectionName);
                    res.json(this.databaseService.arrayOfAllClassicGameScores);
                }catch(error){
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                }
        });
        this.router.post('/Score/addScore', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .addNewScore(req.body.score, req.body.collectionName)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
        this.router.get('/Scores/resetAllScores', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .resetAllScores(req.body.collectionName)
                .then((scores: Score[]) => {
                    res.json(scores);
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
    }
}
