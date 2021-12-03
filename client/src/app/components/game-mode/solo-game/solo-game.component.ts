import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryPresentation } from '@app/classes/dictionary';
import { GameTime } from '@app/classes/time';
import { ViewModalComponent } from '@app/components/modals/view-modal/ViewModal.component';
import { DatabaseService } from '@app/services/database.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import {
    DEFAULT_DICTIONNARY,
    DEFAULT_MODE,
    DEFAULT_TIME,
    LVL_JV,
    MAX_LENGTH,
    MIN_LENGTH,
    MODES,
    TIME_CHOICE,
    USER_NAME_RULES,
} from './../../../constants/constants';

@Component({
    selector: 'app-solo-game',
    templateUrl: './solo-game.component.html',
    styleUrls: ['./solo-game.component.scss'],
})
export class SoloGameComponent implements OnInit {
    userFormGroup: FormGroup;
    name: string;
    timeCounter: number = DEFAULT_TIME;
    time: GameTime = TIME_CHOICE[DEFAULT_TIME];
    lvls: string[] = LVL_JV;
    chosenMode: string = MODES[DEFAULT_MODE];
    chosenDictionnary: string = '---- Selectionnez un dictionnaire ----';
    dictionnaries: DictionaryPresentation[] = [DEFAULT_DICTIONNARY];
    updateDics: DictionaryPresentation[] = [DEFAULT_DICTIONNARY];
    modes: string[] = MODES;
    isDeleted: boolean = false;
    isNextBtnClicked: boolean = false;
    toolTip: string = USER_NAME_RULES;

    constructor(
        private dialogRef: MatDialog,
        public userService: UserService,
        private timeService: TimeService,
        private virtualPlayerService: VirtualPlayerService,
        private objectifManagerService: ObjectifManagerService,
        private database: DatabaseService,
        private snackBar: MatSnackBar,
        private validWordService: ValidWordService,
    ) {}

    @HostListener('document:click.minusBtn', ['$eventX'])
    onClickInAddButton(event: Event) {
        event.preventDefault();
        if (this.timeCounter === TIME_CHOICE.length) {
            return;
        } else if (this.timeCounter > TIME_CHOICE.length) {
            this.timeCounter = TIME_CHOICE.length;
            return;
        } else if (this.timeCounter < TIME_CHOICE.length) {
            this.timeCounter++;
            this.time = TIME_CHOICE[this.timeCounter];
        }
        this.timeService.setGameTime(this.time);
    }

    @HostListener('document:click.minusBtn', ['$eventX'])
    onClickInMinusButton(event: Event) {
        event.preventDefault();
        if (this.timeCounter === 0) {
            return;
        } else if (this.timeCounter < 0) {
            this.timeCounter = 0;
        } else if (this.timeCounter > 0) {
            this.timeCounter--;
            this.time = TIME_CHOICE[this.timeCounter];
        }
        this.timeService.setGameTime(this.time);
    }

    ngOnInit(): void {
        this.userFormGroup = new FormGroup({
            userName: new FormControl('', [
                Validators.pattern('^[A-Za-z0-9]+$'),
                Validators.required,
                Validators.minLength(MIN_LENGTH),
                Validators.maxLength(MAX_LENGTH),
            ]),
        });
        if (this.objectifManagerService.log2990Mode) this.objectifManagerService.generateObjectifs('soloGame');

        this.getDictionnaries(this.dictionnaries);
    }

    openDialogOfVrUser(): void {
        this.dialogRef.open(ViewModalComponent);
    }

    onSubmitUserName(): void {
        this.openDialogOfVrUser();
        this.storeNameInLocalStorage();
    }

    storeNameInLocalStorage(): void {
        this.userService.realUser.name = this.name;
        localStorage.setItem('userName', this.name);
    }

    setLevelJv(event: Event): void {
        if ((event.target as HTMLInputElement)?.value === 'Expert') {
            this.virtualPlayerService.expert = true;
            this.userService.setVrName();
        } else {
            this.virtualPlayerService.expert = false;
            this.userService.setVrName();
        }
    }

    randomBonusActivated(event: Event): void {
        this.chosenMode = (event.target as HTMLInputElement)?.value;

        if (this.chosenMode === this.modes[0]) {
            this.userService.isBonusBox = true;
            return;
        }

        this.chosenMode = this.modes[DEFAULT_MODE];
        this.userService.isBonusBox = false;
    }

    getDictionnaries(dictionnaryArray: DictionaryPresentation[]): void {
        this.database.getMetaDictionary().subscribe((dictionnaries) => {
            for (const dic of dictionnaries) {
                dictionnaryArray.push(dic);
            }
        });
    }

    selectedDictionnary(event: Event): void {
        this.isDeleted = false;
        const names = [];
        this.chosenDictionnary = (event.target as HTMLInputElement)?.value;
        const updatedDictionnariesInString = localStorage.getItem('updateDics') as string;
        const updatedDictionnaries: DictionaryPresentation[] = JSON.parse(updatedDictionnariesInString);

        for (const dic of updatedDictionnaries) {
            names.push(dic.title);
        }

        if (names.includes(this.chosenDictionnary)) {
            if (this.chosenDictionnary === 'dictionnaire principal') this.validWordService.loadDictionary();
            else if (this.chosenDictionnary === '---- Selectionnez un dictionnaire ----') {
                this.snackBar.open('Veuillez choisir un dictionnaire', 'Fermer');
                this.isDeleted = false;
            } else this.validWordService.loadDictionary(this.chosenDictionnary);

            this.snackBar.dismiss();
        } else if (
            !names.includes(this.chosenDictionnary) &&
            !this.isNextBtnClicked &&
            this.chosenDictionnary !== '---- Selectionnez un dictionnaire ----'
        ) {
            this.isDeleted = true;
            this.snackBar.open('Ce dictionnaire a ete supprimé', 'Fermer');
        }
    }
    enableBtn(): void {
        this.isNextBtnClicked = !this.isNextBtnClicked;
    }

    getDictionnariesDelete(): void {
        this.updateDics = [DEFAULT_DICTIONNARY];
        this.database.getMetaDictionary().subscribe((dictionnaries) => {
            for (const dic of dictionnaries) {
                this.updateDics.push(dic);
            }

            localStorage.setItem('updateDics', JSON.stringify(this.updateDics));
        });
    }
}
