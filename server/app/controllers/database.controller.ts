import {
    CREATED_HTTP_STATUS,
    DATABASE_COLLECTION_CLASSIC,
    DATABASE_COLLECTION_LOG2990,
    NOT_FOUND_HTTP_STATUS,
    NO_CONTENT_HTTP_STATUS,
} from '@app/classes/constants';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { DatabaseService } from '@app/services/database.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/Scores/:collectionName', async (req: Request, res: Response) => {
            try {
                await this.databaseService.fetchDataReturn(req.params.collectionName);
                if (req.params.collectionName === DATABASE_COLLECTION_CLASSIC) {
                    res.json(this.databaseService.arrayOfAllClassicGameScores);
                } else if (req.params.collectionName === DATABASE_COLLECTION_LOG2990) {
                    res.json(this.databaseService.arrayOfAllLog2990GameScores);
                }
            } catch (error) {
                res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
            }
        });
        this.router.post('/addScore/:collectionName/:name/:score', async (req: Request, res: Response) => {
            this.databaseService
                .addNewScore({ name: req.params.name, score: +req.params.score }, req.params.collectionName)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.get('/resetAllScores/:collectionName', async (req: Request, res: Response) => {
            this.databaseService
                .resetAllScores(req.params.collectionName)
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

        this.router.delete('/dictionary/:title', async (req: Request, res: Response) => {
            this.databaseService
                .deleteFile(req.params.title)
                .then(() => {
                    res.sendStatus(NO_CONTENT_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.delete('/dictionaries', async (req: Request, res: Response) => {
            this.databaseService
                .deleteAllFile()
                .then(() => {
                    res.sendStatus(NO_CONTENT_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.get('/dictionary/:title/:oldName?', async (req: Request, res: Response) => {
            this.databaseService
                .dictData(req.params.title, req.params.oldName ?? '')
                .then((dict) => {
                    res.json(dict);
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });

        this.router.get('/dictionaries', async (req: Request, res: Response) => {
            this.databaseService
                .dictMetadata()
                .then((dicts) => {
                    res.json(dicts);
                })
                .catch((error: Error) => {
                    res.status(NOT_FOUND_HTTP_STATUS).send(error.message);
                });
        });
    }
}
