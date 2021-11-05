import { expect } from 'chai';
import { describe } from 'mocha';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { Timer } from './timer';

describe('Timer', () => {
    let timer: Timer;
    let clock: SinonFakeTimers;
    beforeEach(async () => {
        clock = useFakeTimers();
        timer = new Timer();
        timer.timeUser = { min: 0, sec: 0 };
        timer.timerConfig = { min: 0, sec: 0 };
    });
    afterEach(async () => {
        clock.restore();
    });
    it('startTime test should set boolean playerPlayed to false after time simulation', () => {
        timer.timeUser = { min: 0, sec: 5 };
        timer.timerConfig = { min: 0, sec: 5 };
        timer.startTime();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        clock.tick(3000);
        expect(timer.playerPlayed).to.be.equal(false);
    });

    it('startTime test should set boolean playerPlayed to false after time simulation and tim eqal to 1 min', () => {
        timer.timeUser = { min: 1, sec: 5 };
        timer.timerConfig = { min: 1, sec: 5 };
        timer.startTime();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        clock.tick(4000);
        expect(timer.playerPlayed).to.be.equal(false);
    });

    it('startTime test should set boolean creatorTurn to false after time simulation', () => {
        timer.timeUser = { min: 0, sec: 1 };
        timer.timerConfig = { min: 0, sec: 1 };
        timer.creatorTurn = true;
        timer.startTime();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        clock.tick(1000);
        expect(timer.creatorTurn).to.be.equal(true);
    });
});
