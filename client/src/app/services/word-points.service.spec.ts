/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { ChatCommand } from '@app/classes/chat-command';
import { A, B, S } from '@app/constants/constants';
import { WordPointsService } from './word-points.service';

describe('WordPointsService', () => {
    let service: WordPointsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordPointsService);
        service.usedBonus = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('we detect a REDBOX', () => {
        const test = service.pointsWord(
            [B, A, S],
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
            ],
            false,
        );

        expect(test).toEqual(15);
    });

    it('we detect a PINKBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
            ],
            false,
        );
        expect(test).toEqual(12);
    });

    it('we detect a AZURBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 0, y: 3 },
                { x: 1, y: 3 },
                { x: 2, y: 3 },
                { x: 3, y: 3 },
            ],
            false,
        );
        expect(test).toEqual(18);
    });

    it('we detect a BLUEBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 5, y: 1 },
                { x: 6, y: 1 },
                { x: 7, y: 1 },
                { x: 8, y: 1 },
            ],
            false,
        );
        expect(test).toEqual(12);
    });

    it('handleBestPointsVP first if', () => {
        const x = 1;
        const maxPoint: number[] = [0, 1, 2, 3];
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const tabCommand: ChatCommand[] = [];
        tabCommand.push(command);
        service.handleBestPointsVP(1, command, maxPoint, tabCommand);
        expect(x).toEqual(1);
    });

    it('handleBestPointsVP second if', () => {
        const x = 1;
        const maxPoint: number[] = [1, 0, 2, 3];
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const tabCommand: ChatCommand[] = [];
        tabCommand.push(command);
        service.handleBestPointsVP(1, command, maxPoint, tabCommand);
        expect(x).toEqual(1);
    });

    it('handleBestPointsVP third if', () => {
        const x = 1;
        const maxPoint: number[] = [1, 1, 0, 3];
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const tabCommand: ChatCommand[] = [];
        tabCommand.push(command);
        service.handleBestPointsVP(1, command, maxPoint, tabCommand);
        expect(x).toEqual(1);
    });

    it('handleBestPointsVP fourth if', () => {
        const x = 1;
        const maxPoint: number[] = [1, 1, 2, 0];
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const tabCommand: ChatCommand[] = [];
        tabCommand.push(command);
        service.handleBestPointsVP(1, command, maxPoint, tabCommand);
        expect(x).toEqual(1);
    });

    it('handleBestPointsVP nothing works', () => {
        const x = 1;
        const maxPoint: number[] = [1, 1, 2, 1];
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const tabCommand: ChatCommand[] = [];
        tabCommand.push(command);
        service.handleBestPointsVP(1, command, maxPoint, tabCommand);
        expect(x).toEqual(1);
    });

    it('a bonus is used', () => {
        service.usedBonus.push({ x: 0, y: 0 });
        const test = { x: 0, y: 0 };

        const isUsed = service['isUsedBonus'](test);
        expect(isUsed).toBeTrue();
    });

    it('buildPointCommandText', () => {
        const command: ChatCommand = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };

        const isUsed = service.buildPointCommandText(command, 1);
        expect(isUsed).toEqual('!placer a1p azzz  (1)<br/>');
    });

    it('letterBonus', () => {
        const word = [B, A, S, S];
        const position = [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
        ];
        const newBonus = false;
        spyOn<any>(service, 'compareVec2').and.returnValue(true);
        spyOn<any>(service, 'isUsedBonus').and.returnValue(false);
        const test = service['letterBonus'](word, position, 1, 1, newBonus);
        expect(test).toEqual(2);
    });
});
