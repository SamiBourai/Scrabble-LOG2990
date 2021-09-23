import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, LEFTSPACE, TOPSPACE } from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';
@Injectable({
    providedIn: 'root',
})
export class LettersService {
    gridContext: CanvasRenderingContext2D;
    foundLetter: Array<Boolean> = [false, false, false, false, false, false, false];
    indexOfEaselLetters: Array<number> = [];
    indexLettersAlreadyInBoard: Array<number> = [];

    tiles = new Array<Array<Letter>>(15);

    constructor(private easelLogisticsService: EaselLogiscticsService, private reserveService: ReserveService) {
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = new Array<Letter>(15);
        }
    }

    placeLetter(lett: Letter, pos: Vec2): void {
        if (this.boxIsEmpty(pos)) {
            this.tiles[pos.x - 1][pos.y - 1] = lett;
            const imgLetter = new Image();
            imgLetter.src = lett.img;
            imgLetter.onload = () => {
                this.gridContext.drawImage(
                    imgLetter,
                    LEFTSPACE + ((pos.x - 1) * DEFAULT_WIDTH) / BOX,
                    TOPSPACE + ((pos.y - 1) * DEFAULT_WIDTH) / BOX,
                    DEFAULT_WIDTH / BOX,
                    DEFAULT_HEIGHT / BOX,
                );
            };
        }
    }

    boxIsEmpty(pos: Vec2): boolean {
        if (this.tiles[pos.x - 1][pos.y - 1] != undefined) return false;
        else return true;
    }

    wordInEasel(word: string): boolean {
        let found: boolean = false;
        let first: boolean = true;
        for (var i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < 7; j++) {
                    if (word.charAt(i) == this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j] == false) {
                        this.foundLetter[j] = true;
                        this.indexOfEaselLetters.push(j);
                        console.log('indexFind ' + j);
                        found = true;
                        break;
                    }
                }
            } else {
                window.alert('votre mot ne contient pas les lettres dans le chavlet');
                break;
            }
        }
        console.log(this.foundLetter);

        return found;
    }
    changeLetterFromReserve(letterToChange: string): void {
        if (this.wordInEasel(letterToChange)) {
            for (let i = 0; i < letterToChange.length; i++) {
                let temp: Letter = {
                    score: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.score,
                    charac: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.charac,
                    img: this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]]?.letters?.img,
                };

                this.easelLogisticsService.easelLetters[this.indexOfEaselLetters[i]] = {
                    index: this.indexOfEaselLetters[i],
                    letters: this.reserveService.getRandomLetter(),
                };

                this.reserveService.reFillReserve(temp);
            }
            this.easelLogisticsService.placeEaselLetters();
        }
        this.resetVariables();
        this.refillEasel();
    }
    resetVariables(): void {
        for (let i = 0; i < this.foundLetter.length; i++) this.foundLetter[i] = false;
        this.indexOfEaselLetters.splice(0, this.indexOfEaselLetters.length);
        this.indexLettersAlreadyInBoard.splice(0, this.indexOfEaselLetters.length);

        console.log(this.indexOfEaselLetters);
        console.log(this.indexLettersAlreadyInBoard);
    }
    placeLettersInScrable(command: ChatCommand): void {
        let boardLetterCounter: number = 0;
        let easelLetterCounter: number = 0;
        for (let i = 0; i < command.word.length; i++) {
            if (i == this.indexLettersAlreadyInBoard[boardLetterCounter]) {
                boardLetterCounter++;
            } else {
                if (command.direction == 'h') {
                    this.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.indexOfEaselLetters[easelLetterCounter]), {
                        x: command.column,
                        y: command.line + i,
                    });
                } else if (command.direction == 'v') {
                    this.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.indexOfEaselLetters[easelLetterCounter]), {
                        x: command.column + i,
                        y: command.line,
                    });
                }
                easelLetterCounter++;
            }
        }

        this.resetVariables();
        this.refillEasel();
    }

    refillEasel(): void {
        for (let i = 0; i < 7; i++) {
            if (this.easelLogisticsService.occupiedPos[i] == false) {
                let temp: Letter = this.reserveService.getRandomLetter();
                this.easelLogisticsService.easelLetters[i] = {
                    index: i,
                    letters: temp,
                };
            }
        }
        this.easelLogisticsService.placeEaselLetters();
    }

    wordIsPlacable(command: ChatCommand): boolean {
        let saveLetter: string = '';
        let letterFromEasel: string = '';
        for (let i = 0; i < command.word.length; i++) {
            if (command.direction == 'h') {
                saveLetter = this.tiles[command.column - 1][command.line - 1 + i]?.charac;
            } else if (command.direction == 'v') {
                saveLetter = this.tiles[command.column - 1 + i][command.line - 1]?.charac;
            }

            if (saveLetter == command.word.charAt(i)) {
                this.indexLettersAlreadyInBoard.push(i);
            } else {
                letterFromEasel = letterFromEasel + command.word.charAt(i);
            }
        }
        if (this.wordInEasel(letterFromEasel)) return true;

        return false;
    }
}
