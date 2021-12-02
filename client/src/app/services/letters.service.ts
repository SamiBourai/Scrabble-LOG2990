import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/easel-object';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_HEIGHT, BOARD_WIDTH, EASEL_LENGTH, LEFTSPACE, LETTERS_OBJECT, NB_TILES, NOT_A_LETTER, TOPSPACE } from '@app/constants/constants';
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

    getTheLetter(char: string): Letter {
        const letter = LETTERS_OBJECT.get(char) ?? NOT_A_LETTER;
        return letter;
    }

    wordIsAttached(command: ChatCommand): boolean {
        if (!this.isWordStickedToAnother(command)) return false;

        for (let i = 0; i < command.word.length; i++) {
            if (
                command.direction === 'h' &&
                (!this.tileIsEmpty({ x: command.position.x + i, y: command.position.y }) ||
                    (command.position.y - 1 < NB_TILES ? !this.tileIsEmpty({ x: command.position.x + i, y: command.position.y + 1 }) : false) ||
                    (command.position.y - 1 > 0 ? !this.tileIsEmpty({ x: command.position.x + i, y: command.position.y - 1 }) : false))
            )
                return true;
            if (
                command.direction === 'v' &&
                (!this.tileIsEmpty({ x: command.position.x, y: command.position.y + i }) ||
                    (command.position.x - 1 < NB_TILES ? !this.tileIsEmpty({ x: command.position.x - 1, y: command.position.y + i }) : false) ||
                    (command.position.x - 1 > 0 ? !this.tileIsEmpty({ x: command.position.x + 1, y: command.position.y + i }) : false))
            )
                return true;
        }

        return false;
    }
    wordInBoardLimits(command: ChatCommand): boolean {
        return (
            (command.direction === 'h' && command.position.x + command.word.length - 1 <= NB_TILES) ||
            (command.direction === 'v' && command.position.y + command.word.length - 1 <= NB_TILES)
        );
    }
    private isWordStickedToAnother(command: ChatCommand): boolean {
        if (
            command.direction === 'h' &&
            command.position.x - 1 !== 0 &&
            command.position.x - 1 + command.word.length < NB_TILES &&
            (this.tiles[command.position.y - 1][command.position.x - 2].charac !== NOT_A_LETTER.charac ||
                this.tiles[command.position.y - 1][command.position.x - 1 + command.word.length].charac !== NOT_A_LETTER.charac)
        )
            return false;

        if (
            command.direction === 'v' &&
            command.position.y - 1 !== 0 &&
            command.position.y - 1 + command.word.length < NB_TILES &&
            (this.tiles[command.position.y - 2][command.position.x - 1].charac !== NOT_A_LETTER.charac ||
                this.tiles[command.position.y - 1 + command.word.length][command.position.x - 1].charac !== NOT_A_LETTER.charac)
        )
            return false;

        return true;
    }
}
