import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Objectifs } from '@app/classes/objectifs';
import {
    BONUS_MULTIPLICATOR_2,
    BONUS_MULTIPLICATOR_3,
    EASEL_LENGTH,
    EXCHANGE_ALL_LETTERS_DEFINITION,
    FILL_BOX_DEFINITION,
    NUMBER_OF_CONSONNANT_CONDITION,
    PASS_4_TIMES_DEFINITION,
    PASS_TURN_OBJECTIF_CONDITION,
    PLACE_3_CONSONANTS_DEFINITION,
    PLACE_IN_A1_DEFINITION,
    PLACE_NUMBER_DEFINITION,
    PLACE_X_OR_Z_DEFINITION,
    POSITION_FILL_BOX_CONDITION,
    UNDEFINED_INDEX,
    WORD_LENGHT_FILL_BOX_CONDITION,
    WORD_TO_PLACE_DEFINITION,
} from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ObjectifManagerService {
    objectifs = new Array<Objectifs>();
    choosedObjectifs = new Array<Objectifs>();
    initializedGame: boolean = false;
    log2990Mode: boolean = false;
    passTurnCounter: number = 0;
    vrPassTurnCounter: number = 0;
    achivedObjectif: Objectifs = {
        name: 'Default',
        bonus: UNDEFINED_INDEX,
        completed: false,
        definition: '',
    };
    bonusMultupticator: number = 0;
    opponentPrivateObjectif: Objectifs = {
        name: '',
        bonus: UNDEFINED_INDEX,
        completed: false,
        definition: '',
    };
    userPlay: boolean = false;
    objectifAchived: boolean = false;
    objectifAchivedByOpponnent: boolean = false;
    verifyObjectifs(user: boolean, command?: ChatCommand, numberOfLetters?: number) {
        const undefinedCommand: ChatCommand = { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
        this.userPlay = user;
        for (let i = 0; i <= 2; i++) {
            if (!this.choosedObjectifs[i].completed) {
                if (i !== 2) this.updateObjectifs(this.choosedObjectifs[i], command ?? undefinedCommand, numberOfLetters ?? UNDEFINED_INDEX);
                else if (user) this.updateObjectifs(this.choosedObjectifs[i], command ?? undefinedCommand, numberOfLetters ?? UNDEFINED_INDEX);
                else this.updateObjectifs(this.opponentPrivateObjectif, command ?? undefinedCommand, numberOfLetters ?? UNDEFINED_INDEX);
            }
        }
    }
    generateObjectifs(playMode: string) {
        this.addObjectifs();
        if (playMode === 'joinMultiplayerGame') {
            let notFound = true;
            while (notFound) {
                const objectif = this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0];
                if (
                    objectif.name !== this.choosedObjectifs[0].name &&
                    objectif.name !== this.choosedObjectifs[1].name &&
                    objectif.name !== this.choosedObjectifs[2].name
                ) {
                    this.choosedObjectifs.pop();
                    this.choosedObjectifs.push(objectif);
                    notFound = false;
                }
            }
        } else
            for (let i = 0; i <= 2; i++) {
                this.choosedObjectifs.push(this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0]);
            }
        if (playMode === 'soloGame') this.opponentPrivateObjectif = this.objectifs.splice(Math.floor(Math.random() * this.objectifs.length), 1)[0];
    }
    resetObjectifs() {
        this.objectifs = new Array<Objectifs>();
        this.choosedObjectifs = new Array<Objectifs>();
        this.passTurnCounter = 0;
        this.vrPassTurnCounter = 0;
        this.bonusMultupticator = 0;
        this.initializedGame = false;
        this.log2990Mode = false;
    }
    displayOppenentObjectifs(achivedObjectif: Objectifs): string {
        for (const objectif of this.choosedObjectifs)
            if (objectif.name === achivedObjectif.name) {
                objectif.completed = true;
                objectif.definition += '. (complété par votre adversaire)';
                return "votre adversaire à complété l'objectif public qui consiste à " + objectif.definition;
            }
        this.opponentPrivateObjectif = achivedObjectif;
        return 'votre adversaire à complété son objectif privé qui consiste à ' + achivedObjectif.definition;
    }
    updateScore(objectif: Objectifs, score: number): number {
        if (objectif.name === 'placeNumber') return score * this.bonusMultupticator;
        else return score + objectif.bonus;
    }
    private updateObjectifs(objectif: Objectifs, command: ChatCommand, numberOfLetters: number) {
        if (this.isObjectifAchived(objectif.name, command, numberOfLetters)) {
            if (this.userPlay) objectif.completed = true;
            this.achivedObjectif = { name: objectif.name, bonus: objectif.bonus, definition: objectif.definition, completed: true };
            this.objectifAchived = true;
        }
    }
    private isObjectifAchived(objectif: string, command?: ChatCommand, numberOfLetters?: number): boolean {
        const undefinedCommand: ChatCommand = { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
        const chatCommand = command ?? undefinedCommand;
        switch (objectif) {
            case 'fillBox':
                return this.isFillBox(chatCommand);
            case 'pass4Times':
                return this.isPassed4Times();
            case 'exchangeAllLetters':
                return numberOfLetters === EASEL_LENGTH;
            case 'placeXOrZ':
                return chatCommand.word.includes('z') && chatCommand.word.includes('x');
            case 'place3Consonants':
                return this.is3ConsonantsPlaced(chatCommand);
            case 'wordToPlace':
                return chatCommand.word === 'bonus';
            case 'placeInA1':
                return chatCommand.position.x === 1 && chatCommand.position.y === 1;
            case 'placeNumber':
                return this.isNumberPlaced(chatCommand);
        }
        return false;
    }
    private addObjectifs() {
        this.objectifs.push({ name: 'fillBox', bonus: 50, completed: false, definition: FILL_BOX_DEFINITION });
        this.objectifs.push({ name: 'pass4Times', bonus: 15, completed: false, definition: PASS_4_TIMES_DEFINITION });
        this.objectifs.push({ name: 'exchangeAllLetters', bonus: 10, completed: false, definition: EXCHANGE_ALL_LETTERS_DEFINITION });
        this.objectifs.push({ name: 'placeXOrZ', bonus: 40, completed: false, definition: PLACE_X_OR_Z_DEFINITION });
        this.objectifs.push({ name: 'place3Consonants', bonus: 10, completed: false, definition: PLACE_3_CONSONANTS_DEFINITION });
        this.objectifs.push({ name: 'wordToPlace', bonus: 20, completed: false, definition: WORD_TO_PLACE_DEFINITION });
        this.objectifs.push({ name: 'placeInA1', bonus: 50, completed: false, definition: PLACE_IN_A1_DEFINITION });
        this.objectifs.push({ name: 'placeNumber', bonus: 1, completed: false, definition: PLACE_NUMBER_DEFINITION });
    }
    private isFillBox(command: ChatCommand): boolean {
        return (
            command.position.x === POSITION_FILL_BOX_CONDITION.x &&
            command.position.y === POSITION_FILL_BOX_CONDITION.y &&
            command.word.length >= WORD_LENGHT_FILL_BOX_CONDITION &&
            command.direction === 'h'
        );
    }
    private isPassed4Times() {
        if (this.passTurnCounter >= PASS_TURN_OBJECTIF_CONDITION && this.userPlay) return true;
        else if (this.vrPassTurnCounter >= PASS_TURN_OBJECTIF_CONDITION && !this.userPlay) return true;
        return false;
    }
    private is3ConsonantsPlaced(command: ChatCommand): boolean {
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
            if (consonnantsCounter >= NUMBER_OF_CONSONNANT_CONDITION) return true;
        }
        return false;
    }
    private isNumberPlaced(command: ChatCommand): boolean {
        if (command.word === 'deux') {
            this.bonusMultupticator = BONUS_MULTIPLICATOR_2;
            return true;
        } else if (command.word === 'trois') {
            this.bonusMultupticator = BONUS_MULTIPLICATOR_3;
            return true;
        }
        return false;
    }
}
