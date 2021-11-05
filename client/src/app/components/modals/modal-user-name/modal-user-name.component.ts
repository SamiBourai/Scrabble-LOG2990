import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageServer } from '@app/classes/message-server';
import { GameTime } from '@app/classes/time';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { DEFAULT_MODE, DEFAULT_TIME, MAX_LENGTH, MIN_LENGTH, MODES, ONE_SECOND_MS, TIME_CHOICE } from '@app/constants/constants';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-user-name',
    templateUrl: './modal-user-name.component.html',
    styleUrls: ['./modal-user-name.component.scss'],
})
export class ModalUserNameComponent implements OnInit {
    soloMode: boolean = false;
    createMultiplayerGame: boolean = false;
    joinMultiplayerGame: boolean = false;
    userFormGroup: FormGroup;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    isOptional = false;
    userName: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    userNameMutiplayer: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    guestFormControl: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    gameNameMutiplayer: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    name: string;
    playerName: string = '';
    guestName: string = '';
    gameName: string = '';
    timeCounter: number = DEFAULT_TIME;
    time: GameTime = TIME_CHOICE[DEFAULT_TIME];
    isRandom = false;
    rooms: MessageServer[];
    game: MessageServer;
    isEmptyRoom: boolean = true;
    roomJoined: boolean = false;
    requestAccepted: boolean = false;
    modes: string[] = MODES;
    chosenMode: string = MODES[DEFAULT_MODE];
    chooseSoloMode: boolean = false;
    constructor(
        private dialogRef: MatDialog,
        public userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
        private timeService: TimeService,
        private multiplayerModeService: MultiplayerModeService,
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
        this.userService.playMode = this.userService.firstMode;
        switch (this.userService.firstMode) {
            case 'soloGame':
                this.soloMode = true;
                this.userFormGroup = new FormGroup({
                    userName: new FormControl('', [
                        Validators.pattern('^[A-Za-z0-9]+$'),
                        Validators.required,
                        Validators.minLength(MIN_LENGTH),
                        Validators.maxLength(MAX_LENGTH),
                    ]),
                });

                this.userService.initiliseUsers(this.soloMode);

                break;
            case 'createMultiplayerGame':
                this.createMultiplayerGame = true;
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
                break;
            case 'joinMultiplayerGame':
                this.joinMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    guestFormControl: new FormControl('', [
                        Validators.pattern('^[A-Za-z0-9]+$'),
                        Validators.required,
                        Validators.minLength(MIN_LENGTH),
                        Validators.maxLength(MAX_LENGTH),
                    ]),
                });
                this.generateRooms();
                this.gameAccepted();
                break;
        }
    }
    beginGame(response: boolean): void {
        this.socketManagementService.emit('acceptGame', { gameName: this.gameName, gameAccepted: response });
        if (!response) {
            this.disconnectUser();
        }
    }
    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }

    storeNameInLocalStorage(): void {
        this.userService.realUser.name = this.name;
        localStorage.setItem('userName', this.name);
    }
    passInSoloMode(): void {
        this.socketManagementService.emit('userPassedInSoloMode', { gameName: this.gameName });
        this.soloMode = true;
        this.createMultiplayerGame = false;
        this.name = this.userNameMutiplayer.value;
        this.chooseSoloMode = true;
        this.userService.playMode = 'soloGame';
        this.userService.initiliseUsers(true);
        this.openDialogOfVrUser();
    }
    createGame(): void {
        this.socketManagementService.emit('createGame', {
            user: { name: this.playerName },
            gameName: this.gameName,
            timeConfig: { min: this.time.min, sec: this.time.sec },
            aleatoryBonus: this.userService.isBonusBox,
        });
        this.userService.realUser.name = this.playerName;
        this.userService.gameName = this.gameName;
    }
    generateRooms(): void {
        const intervalId = setInterval(() => {
            if (this.roomJoined) clearInterval(intervalId);
            else this.socketManagementService.emit('generateAllRooms');
            this.socketManagementService.getRooms().subscribe((data) => {
                this.rooms = data;
                if (this.rooms.length === 0) this.isEmptyRoom = true;
                else this.isEmptyRoom = false;
            });
        }, ONE_SECOND_MS);
    }
    disconnectUser(): void {
        this.socketManagementService.emit('userCanceled', { gameName: this.gameName });
    }
    joinGame(room: MessageServer): void {
        this.multiplayerModeService.setGameInformations(room, this.playerName);
        this.roomJoined = true;
        this.userService.isBonusBox = room.aleatoryBonus ?? false;
    }
    gameAccepted(): void {
        this.socketManagementService.listen('gameAccepted').subscribe((data) => {
            this.requestAccepted = data.gameAccepted ?? false;
        });
    }
    onSubmitUserName(): void {
        this.openDialogOfVrUser();
        this.storeNameInLocalStorage();
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
}
