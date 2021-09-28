import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
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
    gridContext: CanvasRenderingContext2D;
    foundLetter: boolean[] = [false, false, false, false, false, false, false];
    indexOfEaselLetters: number[] = [];
    indexLettersAlreadyInBoard: number[] = [];
    tiles = new Array<(Letter)[]>(NB_TILES);

    constructor(private easelLogisticsService: EaselLogiscticsService, private reserveService: ReserveService) {
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }
    }

    placeLetter(lett: Letter, pos: Vec2): void {
        // if (this.tileIsEmpty(pos)) {
            this.tiles[pos.y - 1][pos.x - 1] = lett;
            console.log(this.tiles);
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
        // }
    }

    tileIsEmpty(pos: Vec2): boolean {
        if (this.tiles[pos.y - 1][pos.x - 1] !== undefined) return false;
        else return true;
    }

    wordInEasel(word: string): boolean {
        // console.log(word);
        let found = false;
        let first = true;

        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < EASEL_LENGTH; j++) {
                    //  console.log(word.charAt(i) + ' : ' + this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j]);
                    if (word.charAt(i) === this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j] === false) {
                        this.foundLetter[j] = true;

                        this.indexOfEaselLetters.push(j);
                        // console.log('indexFind ' + j);
                        found = true;
                        break;
                    }
                }
            } else {
                window.alert('votre mot ne contient pas les lettres dans le chavlet');
                break;
            }
        }
        // console.log(this.foundLetter);

        return found;
    }
    changeLetterFromReserve(letterToChange: string): void {
        const temp: Letter[] = [];
        if (this.wordInEasel(letterToChange)) {
            for (let i = 0; i < letterToChange.length; i++) {
                temp.push({
                    score: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.score,
                    charac: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.charac,
                    img: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.img,
                });

                this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]] = {
                    index: this.indexOfEaselLetters[i],
                    letters: this.reserveService.getRandomLetter(),
                };
            }
            for (const lett of temp) {
                this.reserveService.reFillReserve(lett);
            }
            this.easelLogisticsService.placeEaselLetters();
        }
        this.resetVariables();
        this.easelLogisticsService.refillEasel();
    }
    resetVariables(): void {
        for (let i = 0; i < this.foundLetter.length; i++) this.foundLetter[i] = false;
        this.indexOfEaselLetters.splice(0, this.indexOfEaselLetters.length);
        this.indexLettersAlreadyInBoard.splice(0, this.indexLettersAlreadyInBoard.length);

        // console.log(this.indexOfEaselLetters);
        // console.log(this.indexLettersAlreadyInBoard);
    }
    placeLettersInScrable(command: ChatCommand): void {
        let boardLetterCounter = 0;
        let easelLetterCounter = 0;
        for (let i = 0; i < command.word.length; i++) {
            if (i === this.indexLettersAlreadyInBoard[boardLetterCounter]) {
                boardLetterCounter++;
            } else {
                if (command.direction === 'h') {
                    this.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.indexOfEaselLetters[easelLetterCounter]), {
                        x: command.position.x + i,
                        y: command.position.y,
                    });
                } else if (command.direction === 'v') {
                    this.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.indexOfEaselLetters[easelLetterCounter]), {
                        x: command.position.x,
                        y: command.position.y + i,
                    });
                }
                easelLetterCounter++;
            }
        }

        this.resetVariables();
        this.easelLogisticsService.refillEasel();
    }
    wordIsPlacable(command: ChatCommand): boolean {
        let saveLetter = '';
        let letterFromEasel = '';
        // console.log('direction : ' + command.direction);
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h') {
                saveLetter = this.tiles[command.position.y - 1][command.position.x - 1 + i]!.charac;
            } else if (command.direction === 'v') {
                saveLetter = this.tiles[command.position.y - 1 + i][command.position.x - 1]!.charac;
            }

            if (saveLetter === command.word.charAt(i)) {
                this.indexLettersAlreadyInBoard.push(i);
                // console.log(i + ' the letter are equals');
            } else {
                letterFromEasel = letterFromEasel + command.word.charAt(i);
                // console.log(i + ' : ' + letterFromEasel);
            }
        }
        if (this.wordInEasel(letterFromEasel)) {
            // console.log(save + 'are in easel');
            return true;
        }

        return false;
    }
    fromWordToLetters(word: string): Letter[] {
        const letters: Letter[] = [];
        for (let i = 0; i < word.length; i++) {
            letters.push(this.getTheLetter(word.charAt(i)));
        }
        return letters;
    }
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
        return A;
    }

    wordIsAttached(command: ChatCommand): boolean {
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction === 'h' && !this.tileIsEmpty({ x: command.position.x + i, y: command.position.y })) return true;
            if (command.direction === 'v' && !this.tileIsEmpty({ x: command.position.x, y: command.position.y + i })) return true;
        }
        return false;
    }
    wordInBoardLimits(command: ChatCommand): boolean {
        if (
            (command.direction === 'h' && command.position.x + command.word.length > NB_TILES) ||
            (command.direction === 'v' && command.position.y + command.word.length > NB_TILES)
        ) {
            return false;
        }
        return true;
    }
}
