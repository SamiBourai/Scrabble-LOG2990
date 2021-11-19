import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Objectifs } from '@app/classes/objectifs';
import { EASEL_LENGTH, UNDEFINED_INDEX } from '@app/constants/constants';
// import { NUMBER_OF_OBJECTIFS, NUMBER_OF_PUBLIC_OBJECTIFS } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ObjectifManagerService {
    objectifs = new Array<Objectifs>();
    publicObjectifs = new Set<Objectifs>();
    privateObjectif: Objectifs = { name: 'Default', bonus: UNDEFINED_INDEX, completed: false };
    initializedGame: boolean = false;
    wordToplace: string = 'bonus';
    log2990Mode: boolean = false;
    private passturnCounter: number;
    constructor() {
        this.addObjectifs();
        this.generateObjectifs();
    }
    generateObjectifs() {
        this.publicObjectifs.add(this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0]);
        this.publicObjectifs.add(this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0]);
        this.privateObjectif = this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0];
    }
    verifyObjectifs(command?: ChatCommand, numberOfLetters?: number) {
        const undefinedCommand: ChatCommand = { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
        for (const objectif of this.publicObjectifs) {
            if (!objectif.completed) {
                objectif.completed = this.isObjectifAchived(objectif.name, command ?? undefinedCommand, numberOfLetters ?? UNDEFINED_INDEX);
            }
        }
        if (!this.privateObjectif.completed) {
            this.privateObjectif.completed = this.isObjectifAchived(
                this.privateObjectif.name,
                command ?? undefinedCommand,
                numberOfLetters ?? UNDEFINED_INDEX,
            );
        }
    }

    isObjectifAchived(objectif: string, command?: ChatCommand, numberOfLetters?: number): boolean {
        const undefinedCommand: ChatCommand = { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
        const chatCommand = command ?? undefinedCommand;
        switch (objectif) {
            case 'fillBox':
                return this.isFillBox(chatCommand);
            case 'pass4Times':
                return this.isPassed4Times();
            case 'exchangeAllLetters':
                return this.isExchangeAllLetters(numberOfLetters ?? UNDEFINED_INDEX);
            case 'placeXOrZ':
                return this.isXOrZPlaced(chatCommand);
            case 'place4Consonants':
                return this.is4ConsonantsPlaced(chatCommand);
            case 'wordToPlace':
                return this.isWordPlaced(chatCommand);
            case 'placeInA1':
                return this.isPlacedInA1(chatCommand);
            case 'placeNumber':
                this.isNumberPlaced(chatCommand);
                break;
        }
        return false;
    }
    private addObjectifs() {
        this.objectifs.push({ name: 'fillBox', bonus: 50, completed: false });
        this.objectifs.push({ name: 'pass4Times', bonus: 15, completed: false });
        this.objectifs.push({ name: 'exchangeAllLetters', bonus: 10, completed: false });
        this.objectifs.push({ name: 'placeXOrZ', bonus: 40, completed: false });
        this.objectifs.push({ name: 'place4Consonants', bonus: 10, completed: false });
        this.objectifs.push({ name: 'wordToPlace', bonus: 20, completed: false });
        this.objectifs.push({ name: 'placeInA1', bonus: 50, completed: false });
        this.objectifs.push({ name: 'placeNumber', bonus: 1, completed: false });
    }
    private isFillBox(command: ChatCommand): boolean {
        if (command.position.x === 4 && command.position.y === 4 && command.word.length > 5 && command.direction === 'h') return true;

        return false;
    }
    private isPassed4Times() {
        if (this.passturnCounter > 4) return true;
        return false;
    }
    private isExchangeAllLetters(numberOfLetters: number): boolean {
        if (numberOfLetters === EASEL_LENGTH) return true;
        return false;
    }
    private isXOrZPlaced(command: ChatCommand): boolean {
        if (command.word.includes('z') && command.word.includes('x')) return true;
        return false;
    }
    private is4ConsonantsPlaced(command: ChatCommand): boolean {
        let consonnantsCounter = 0;
        for (const letter of command.word) {
            if (
                !(
                    letter.includes('a') ||
                    letter.includes('e') ||
                    letter.includes('i') ||
                    letter.includes('o') ||
                    letter.includes('u') ||
                    letter.includes('y')
                )
            )
                consonnantsCounter++;
            if (consonnantsCounter >= 3) return true;
        }
        return false;
    }
    private isWordPlaced(command: ChatCommand): boolean {
        if (command.word === 'bonus') return true;
        return false;
    }
    private isPlacedInA1(command: ChatCommand): boolean {
        if (command.position.x === 1 && command.position.y === 1) return true;
        return false;
    }
    private isNumberPlaced(command: ChatCommand): boolean {
        if (command.word === 'deux') return true;
        else if (command.word === 'trois') return true;
        return false;
    }
}
