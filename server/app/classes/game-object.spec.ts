/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { expect } from 'chai';
import { describe } from 'mocha';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { GameObject } from './game-object';
import { Player } from './players';
import { Timer } from './timer';
import sinon = require('sinon');
// import { Timer } from './timer';

describe('GameObject', () => {
    let timer: SinonStubbedInstance<Timer>;
    let gameObject: GameObject;
    let player1: Player;
    beforeEach(async () => {
        timer = createStubInstance(Timer);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        player1 = {
            name: 'sami',
            score: 0,
            easelLetters: 7,
            socketId: '58',
        };

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        gameObject = new GameObject('game1', false, player1, 0, 0, false);
        gameObject.timer = timer;
    });
    // afterEach(async () => {
    //     console.log('ffgefrefr');
    //     console.log('ffgefrefr');
    // });
    it('test setTimer should set creatorTurn to True', () => {
        sinon.stub(gameObject, 'chooseFirstToPlay').returns(true);
        // gameObject.setTimer()
        // sinon.stub().returns(true);
        // gameObject.timeConfig = { min: 10, sec: 0 };

        gameObject.setTimer();

        // expect(gameObject.timer.timeUser).to.be.equal({ sec: 0, min: 10 });
        // expect(gameObject.timer.timerConfig).to.be.equal({ sec: 0, min: 10 });
        expect(gameObject.timer.creatorTurn).to.be.true;
    });

    it('test setTimer should set creatorTurn to False', () => {
        sinon.stub(gameObject, 'chooseFirstToPlay').returns(false);
        // gameObject.setTimer()
        // sinon.stub().returns(true);
        // gameObject.timeConfig = { min: 10, sec: 0 };

        gameObject.setTimer();

        // expect(gameObject.timer.timeUser).to.be.equal({ sec: 0, min: 10 });
        // expect(gameObject.timer.timerConfig).to.be.equal({ sec: 0, min: 10 });
        expect(gameObject.timer.creatorTurn).to.be.false;
    });

    it('chooseFirstToplay should return true', () => {
        const stub = sinon.stub(Math, 'floor').returns(1);
        const firstToPlay = gameObject.chooseFirstToPlay();
        expect(firstToPlay).to.be.true;
        stub.restore();
    });

    it('chooseFirstToplay should return true', () => {
        const stub = sinon.stub(Math, 'floor').returns(5);
        const firstToPlay = gameObject.chooseFirstToPlay();
        expect(firstToPlay).to.be.true;
        stub.restore();
    });

    it('chooseFirstToplay should return false', () => {
        const stub = sinon.stub(Math, 'floor').returns(10);
        const firstToPlay = gameObject.chooseFirstToPlay();
        expect(firstToPlay).to.be.false;

        stub.restore();
    });
});
