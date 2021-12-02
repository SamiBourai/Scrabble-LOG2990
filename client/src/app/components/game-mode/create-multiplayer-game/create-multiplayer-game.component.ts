import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryPresentation } from '@app/classes/dictionary';
import { MessageServer } from '@app/classes/message-server';
import { GameTime } from '@app/classes/time';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { DEFAULT_DICTIONNARY, DEFAULT_MODE, DEFAULT_TIME, MAX_LENGTH, MIN_LENGTH, MODES, TIME_CHOICE } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { USER_NAME_RULES } from './../../../constants/constants';

@Component({
    selector: 'app-create-multiplayer-game',
    templateUrl: './create-multiplayer-game.component.html',
    styleUrls: ['./create-multiplayer-game.component.scss'],
})
export class CreateMultiplayerGameComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    userNameMutiplayer: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    gameNameMutiplayer: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    userFormGroup: FormGroup;
    playerName: string = '';
    guestName: string = '';
    name: string;
    gameName: string = '';
    modes: string[] = MODES;
    chosenMode: string = MODES[DEFAULT_MODE];
    chosenDictionnary: string = '---- Selectionnez un dictionnaire ----';
    dictionnaries: DictionaryPresentation[] = [DEFAULT_DICTIONNARY];
    timeCounter: number = DEFAULT_TIME;
    time: GameTime = TIME_CHOICE[DEFAULT_TIME];
    isOptional = false;
    isNextBtnClicked: boolean = false;
    isDeleted: boolean = false;
    updateDics: DictionaryPresentation[] = [DEFAULT_DICTIONNARY];
    toolTip: string = USER_NAME_RULES;

    constructor(
        private dialogRef: MatDialog,
        public userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
        private timeService: TimeService,
        private multiplayerModeService: MultiplayerModeService,
        public objectifManagerService: ObjectifManagerService,
        private database: DatabaseService,
        private snackBar: MatSnackBar,
        private validWordService: ValidWordService,
        private mutltiplayerModeService: MultiplayerModeService,
    ) {}
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
    @HostListener('document:click.addBtn', ['$event'])
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

    ngOnInit(): void {
        this.mutltiplayerModeService.playerLeftObs.subscribe((response) => {
            console.log('dictionaryLoaded');
            if (response === true) {
                if (this.chosenDictionnary === 'dictionnaire principal') this.validWordService.loadDictionary();
                else this.validWordService.loadDictionary(this.chosenDictionnary);
            }
        });
        this.userFormGroup = this.formBuilder.group({
            userName: new FormControl('', [
                Validators.pattern('^[A-Za-z0-9]+$'),
                Validators.required,
                Validators.minLength(MIN_LENGTH),
                Validators.maxLength(MAX_LENGTH),
            ]),
        });
        this.firstFormGroup = this.formBuilder.group({
            userNameMutiplayer: new FormControl('', [
                Validators.pattern('^[A-Za-z0-9]+$'),
                Validators.required,
                Validators.minLength(MIN_LENGTH),
                Validators.maxLength(MAX_LENGTH),
            ]),
        });
        this.secondFormGroup = this.formBuilder.group({
            gameNameMutiplayer: new FormControl(''),
        });
        this.socketManagementService.listen('userJoined').subscribe((room) => {
            this.guestName = room.guestPlayer?.name ?? 'default';
            this.multiplayerModeService.setGuestPlayerInfromation(this.guestName);
        });
        this.getDictionnaries();
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
    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }
    passInSoloMode(): void {
        this.socketManagementService.emit('userPassedInSoloMode', { gameName: this.gameName });
        // this.soloMode = true;
        // this.createMultiplayerGame = false;
        // this.name = this.userNameMutiplayer.value;
        // this.chooseSoloMode = true;
        this.userService.playMode = 'soloGame';
        this.userService.initiliseUsers(true);
        this.openDialogOfVrUser();
    }
    createGame(): void {
        const game: MessageServer = {
            user: { name: this.playerName },
            gameName: this.gameName,
            timeConfig: { min: this.time.min, sec: this.time.sec },
            aleatoryBonus: this.userService.isBonusBox,
            modeLog2990: this.objectifManagerService.log2990Mode,
        };
        if (this.objectifManagerService.log2990Mode) {
            this.objectifManagerService.generateObjectifs(this.userService.playMode);
            game.objectifs = this.objectifManagerService.choosedObjectifs;
        }
        this.socketManagementService.emit('createGame', game);
        this.userService.realUser.name = this.playerName;
        this.userService.gameName = this.gameName;
    }
    disconnectUser(): void {
        this.socketManagementService.emit('userCanceled', { gameName: this.gameName });
    }
    beginGame(response: boolean): void {
        this.socketManagementService.emit('acceptGame', { gameName: this.gameName, gameAccepted: response });
        if (!response) {
            this.disconnectUser();
        }
    }

    getDictionnaries() {
        this.database.getMetaDictionary().subscribe((dictionnaries) => {
            for (const dic of dictionnaries) {
                this.dictionnaries.push(dic);
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
            if (this.chosenDictionnary === '---- Selectionnez un dictionnaire ----') {
                this.snackBar.open('Veuillez choisir un dictionnaire', 'Fermer');
                this.isDeleted = false;
            } else this.database.sendChosenDic(this.chosenDictionnary).subscribe();
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

    enableBtn() {
        this.isNextBtnClicked = !this.isNextBtnClicked;
    }

    getDictionnariesDelete() {
        this.updateDics = [DEFAULT_DICTIONNARY];
        this.database.getMetaDictionary().subscribe((dictionnaries) => {
            for (const dic of dictionnaries) {
                this.updateDics.push(dic);
            }

            localStorage.setItem('updateDics', JSON.stringify(this.updateDics));
        });
    }
}
