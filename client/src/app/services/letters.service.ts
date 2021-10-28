import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/EaselObject';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    A,
    B,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    C,
    D,
    E,
    EASEL_LENGTH,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    LEFTSPACE,
    M,
    N,
    NB_TILES,
    NOT_A_LETTER,
    O,
    P,
    Q,
    R,
    S,
    T,
    TOPSPACE,
    U,
    V,
    W,
    X,
    Y,
    Z
} from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class LettersService {
    usedAllEaselLetters: boolean = false;
    gridContext: CanvasRenderingContext2D;

    tiles = new Array<Letter[]>(NB_TILES);

    constructor(private easelLogisticsService: EaselLogiscticsService, private reserveService: ReserveService) {
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }
    }

    placeLetter(lett: Letter, pos: Vec2): void {
        if (this.tiles[pos.y - 1][pos.x - 1].charac === NOT_A_LETTER.charac) {
            this.tiles[pos.y - 1][pos.x - 1] = lett;

            const imgLetter = new Image();
            imgLetter.src = lett.img;
            imgLetter.onload = () => {
                this.gridContext.drawImage(
                    imgLetter,
                    LEFTSPACE + ((pos.x - 1) * BOARD_WIDTH) / NB_TILES,
                    TOPSPACE + ((pos.y - 1) * BOARD_WIDTH) / NB_TILES,
                    BOARD_WIDTH / NB_TILES,
                    BOARD_HEIGHT / NB_TILES,
                );
            };
        }
    }

    tileIsEmpty(pos: Vec2): boolean {
        if (this.tiles[pos.y - 1][pos.x - 1].charac === NOT_A_LETTER.charac) return true;
        else return false;
    }

    changeLetterFromReserve(letterToChange: string, easel: EaselObject): boolean {
        const temp: Letter[] = [];
        if (easel.contains(letterToChange) && !this.reserveService.isReserveEmpty()) {
            for (let i = 0; i < letterToChange.length; i++) {
                temp.push(this.easelLogisticsService.getLetterFromEasel(easel, easel.indexOfEaselLetters[i]));
                easel.occupiedPos[easel.indexOfEaselLetters[i]] = false;
            }
            this.easelLogisticsService.refillEasel(easel, true);
            for (const lett of temp) {
                this.reserveService.reFillReserve(lett);
            }

            easel.resetVariables();
            return true;
        }
        return false;
    }
    placeLettersInScrable(command: ChatCommand, easel: EaselObject, user: boolean): void {
        this.usedAllEaselLetters = false;
        this.placeLettersWithDirection(command);

        if (easel.indexOfEaselLetters.length === EASEL_LENGTH) this.usedAllEaselLetters = true;
        this.easelLogisticsService.refillEasel(easel, user);
        easel.resetVariables();
    }
    placeLettersWithDirection(command: ChatCommand): void {
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h') {
                this.placeLetter(this.getTheLetter(command.word.charAt(i)), {
                    x: command.position.x + i,
                    y: command.position.y,
                });
            } else if (command.direction === 'v') {
                this.placeLetter(this.getTheLetter(command.word.charAt(i)), {
                    x: command.position.x,
                    y: command.position.y + i,
                });
            }
        }
    }

    wordIsPlacable(command: ChatCommand, easel: EaselObject): boolean {
        let saveLetter = '';
        let letterFromEasel = '';
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h') {
                saveLetter = this.tiles[command.position.y - 1][command.position.x - 1 + i].charac;
            } else if (command.direction === 'v') {
                saveLetter = this.tiles[command.position.y - 1 + i][command.position.x - 1].charac;
            }
            if (saveLetter !== command.word.charAt(i)) {
                letterFromEasel += command.word.charAt(i);
            }
        }
        if (easel.contains(letterFromEasel)) {
            return true;
        }

        easel.resetVariables();

        return false;
    }
    fromWordToLetters(word: string): Letter[] {
        const letters: Letter[] = [];
        for (let i = 0; i < word.length; i++) {
            letters.push(this.getTheLetter(word.charAt(i)));
        }
        return letters;
    }
    // eslint-disable-next-line complexity
    getTheLetter(char: string): Letter {
        switch (char) {
            case 'a': {
                return A;
            }
            case 'b': {
                return B;
            }
            case 'c': {
                return C;
            }
            case 'd': {
                return D;
            }
            case 'e': {
                return E;
            }
            case 'f': {
                return F;
            }
            case 'g': {
                return G;
            }
            case 'h': {
                return H;
            }
            case 'i': {
                return I;
            }
            case 'j': {
                return J;
            }
            case 'k': {
                return K;
            }
            case 'l': {
                return L;
            }
            case 'm': {
                return M;
            }
            case 'n': {
                return N;
            }
            case 'o': {
                return O;
            }
            case 'p': {
                return P;
            }
            case 'q': {
                return Q;
            }
            case 'r': {
                return R;
            }
            case 's': {
                return S;
            }
            case 't': {
                return T;
            }
            case 'u': {
                return U;
            }
            case 'v': {
                return V;
            }
            case 'w': {
                return W;
            }
            case 'x': {
                return X;
            }
            case 'y': {
                return Y;
            }
            case 'z': {
                return Z;
            }
        }
        return NOT_A_LETTER;
    }

    // eslint-disable-next-line complexity
    wordIsAttached(command: ChatCommand): boolean {
        if (
            command.direction === 'h' &&
            (this.tiles[command.position.y - 1][command.position.x - 2].charac !== NOT_A_LETTER.charac ||
                this.tiles[command.position.y - 1][command.position.x - 1 + command.word.length].charac !== NOT_A_LETTER.charac)
        )
            return false;

        if (
            command.direction === 'v' &&
            (this.tiles[command.position.y - 2][command.position.x - 1].charac !== NOT_A_LETTER.charac ||
                this.tiles[command.position.y - 1 + command.word.length][command.position.x - 1].charac !== NOT_A_LETTER.charac)
        )
            return false;

        for (let i = 0; i < command.word.length; i++) {
            if (
                command.direction === 'h' &&
                (!this.tileIsEmpty({ x: command.position.x + i, y: command.position.y }) ||
                    !this.tileIsEmpty({ x: command.position.x + i, y: command.position.y + 1 }) ||
                    !this.tileIsEmpty({ x: command.position.x + i, y: command.position.y - 1 }))
            )
                return true;
            if (
                command.direction === 'v' &&
                (!this.tileIsEmpty({ x: command.position.x, y: command.position.y + i }) ||
                    !this.tileIsEmpty({ x: command.position.x - 1, y: command.position.y + i }) ||
                    !this.tileIsEmpty({ x: command.position.x + 1, y: command.position.y + i }))
            )
                return true;
        }

        return false;
    }
    wordInBoardLimits(command: ChatCommand): boolean {
        if (
            (command.direction === 'h' && command.position.x + command.word.length - 1 > NB_TILES) ||
            (command.direction === 'v' && command.position.y + command.word.length - 1 > NB_TILES)
        ) {
            return false;
        }
        return true;
    }
}
