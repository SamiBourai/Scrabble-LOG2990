import { DEFAULT_DICTIONNARY } from './../../../constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { DictionaryPresentation } from './../../../../../../server/app/classes/dictionary';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GameTime } from '@app/classes/time';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { DEFAULT_MODE, DEFAULT_TIME, LVL_JV, MAX_LENGTH, MIN_LENGTH, MODES, TIME_CHOICE } from '@app/constants/constants';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';


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
    chosenDictionnary: string = DEFAULT_DICTIONNARY.title;
    dictionnaries: DictionaryPresentation[] = [DEFAULT_DICTIONNARY];
    modes: string[] = MODES;
    constructor(
        private dialogRef: MatDialog,
        public userService: UserService,
        private timeService: TimeService,
        private virtualPlayerService: VirtualPlayerService,
        private objectifManagerService: ObjectifManagerService,
        private database: DatabaseService,
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
        this.chosenDictionnary = DEFAULT_DICTIONNARY.title;
        console.log(this.chosenDictionnary);
    }
    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
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

    getDictionnaries(dictionnaryArray: DictionaryPresentation[]) {
        this.database.getMetaDictionary().subscribe((dictionnaries) => {
            for (const dic of dictionnaries) {
                dictionnaryArray.push(dic);
            }
            console.log(dictionnaryArray);
        });
    }

    selectedDictionnary(event: Event): void {
        this.chosenDictionnary = (event.target as HTMLInputElement)?.value;
        console.log(this.chosenDictionnary);
        console.log(this.dictionnaries);
        localStorage.setItem('chosenDictionnarySolo', this.chosenDictionnary);
    }
}
