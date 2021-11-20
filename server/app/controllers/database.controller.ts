// import { CREATED_HTTP_STATUS, NOT_FOUND_HTTP_STATUS, OK_HTTP_STATUS } from '@app/constants';
import { CREATED_HTTP_STATUS, NOT_FOUND_HTTP_STATUS } from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { DatabaseService } from '@app/services/database.service';
// import * as Httpstatus from "http-status-codes";
// import { TYPES } from '@app/types';
// import { Drawing } from '@common/communication/drawing';
import { Request, Response, Router } from 'express';
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

        this.router.get('/Scores/:collectionName', async (req: Request, res: Response) => {
            console.log('parametre', req.params.collectionName);

            try {
                await this.databaseService.fetchDataReturn(req.params.collectionName);
                res.json(this.databaseService.arrayOfAllClassicGameScores);
            } catch (error) {
                res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
            }
        });
        this.router.post('/Score/addScore', async (req: Request, res: Response) => {
            this.databaseService
                .addNewScore(req.body.score, req.body.collectionName)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
        this.router.get('/Scores/resetAllScores', async (req: Request, res: Response) => {
            this.databaseService
                .resetAllScores(req.body.collectionName)
                .then((scores: Score[]) => {
                    res.json(scores);
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
        this.router.get('/vrNames/:collectionName', async (req: Request, res: Response, nex) => {
            this.databaseService
                .getAllPlayers(req.params.collectionName)
                .then((virtualPlayers: VirtualPlayer[]) => {
                    res.json(virtualPlayers);
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.post('/addPlayer/:collectionName/:player', async (req: Request, res: Response) => {
            this.databaseService
                .addPlayer(req.params.collectionName, req.params.player)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.delete('/removePlayer/:collectionName/:player', async (req: Request, res: Response) => {
            this.databaseService
                .removePlayer(req.params.collectionName, req.params.player)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.delete('/removeAllPlayer/:collectionName', async (req: Request, res: Response) => {
            this.databaseService
                .removeAllPlayer(req.params.collectionName)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.post('/upload', async (req: Request, res: Response) => {
            this.databaseService
                .uploadFile(req.body)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.get('/getDictionary', async (req: Request, res: Response) => {
            this.databaseService
                .filesArray()
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
    }
}