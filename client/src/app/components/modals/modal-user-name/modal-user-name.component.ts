/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '@app/classes/game';
import { GameTime } from '@app/classes/time';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { DEFAULT_TIME, MAX_LENGTH, MIN_LENGTH, TIME_CHOICE } from '@app/constants/constants';
import { SocketManagementService } from '@app/services/socket-management.service';
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
    joignerFormControl: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    gameNameMutiplayer: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    name: string;
    createdGame: Game = { clientName: 'YAN', gameName: 'GAME1' };
    joinedUserName: string = '';
    creatorName: string = '';
    gameName: string = '';
    rooms: any;
    game: any;
    timeCounter: number = DEFAULT_TIME;
    time: GameTime = TIME_CHOICE[this.timeCounter];
    isRandom = false;
    isEmptyRoom: boolean = true;
    roomJoined: boolean = false;
    requestAccepted: boolean = false;
    modes: string[] = ['Aléatoire', 'Normal'];
    chosenMode: string = this.modes[1];
    constructor(
        private dialogRef: MatDialog,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
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
    }
    ngOnInit(): void {
        switch (this.userService.playMode) {
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
                    this.game = room;
                    this.userService.initiliseUsers(this.soloMode);
                    this.userService.joinedUser.name = this.game.joinedUserName;
                    this.userService.joinedUser.guestPlayer = false;
                });
                break;
            case 'joinMultiplayerGame':
                this.createMultiplayerGame = false;
                this.joinMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    joignerFormControl: new FormControl('', [
                        Validators.pattern('^[A-Za-z0-9]+$'),
                        Validators.required,
                        Validators.minLength(MIN_LENGTH),
                        Validators.maxLength(MAX_LENGTH),
                    ]),
                });
                this.generateRooms();
                this.gameAccepted();
                this.socketManagementService.listen('randomBonusActivited').subscribe((data) => {
                    const bonus: any = data;
                    this.userService.isBonusBox = bonus;
                });
                break;
        }
    }
    beginGame(response: boolean): void {
        const gamerResponse = { gameName: this.game.gameName, accepted: response };
        this.socketManagementService.emit('acceptGame', undefined, undefined, gamerResponse);
    }
    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }

    storeNameInLocalStorage(): void {
        this.userService.realUser.name = this.name;
        localStorage.setItem('userName', this.name);
    }
    passInSoloMode(): void {
        this.soloMode = true;
        this.createMultiplayerGame = false;
        this.disconnectUser();
        // this.timeService.timeMultiplayer(this.time);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createGame(): void {
        this.createdGame = { clientName: this.creatorName, gameName: this.gameName };
        const gameCongif = { clientName: this.creatorName, gameName: this.gameName, bonusBox: this.userService.isBonusBox };
        this.socketManagementService.emit('createGame', undefined, undefined, gameCongif);
        this.userService.realUser.name = this.createdGame.clientName;
        this.userService.gameName = this.gameName;
    }
    generateRooms(): void {
        this.socketManagementService.emit('generateAllRooms');
        this.socketManagementService.listen('createdGames').subscribe((data) => {
            this.rooms = data;
            if (this.rooms.length === 0) this.isEmptyRoom = true;
            else this.isEmptyRoom = false;
        });
    }
    disconnectUser(): void {
        this.socketManagementService.emit('disconnect', undefined, 'user gave up the game');
    }
    joinGame(room: Game): void {
        room = { clientName: room.clientName, gameName: room.gameName, joinedUserName: this.joinedUserName, bonus: room.bonus };
        this.socketManagementService.emit('joinRoom', room);
        this.userService.initiliseUsers(this.soloMode);
        this.userService.realUser.name = room.clientName;
        this.userService.joinedUser.name = this.joinedUserName;
        this.userService.joinedUser.guestPlayer = true;
        this.userService.gameName = room.gameName;
        this.userService.isBonusBox = room.bonus ?? false;
        this.roomJoined = true;
    }
    gameAccepted(): void {
        this.socketManagementService.listen('gameAccepted').subscribe((data) => {
            const acceptGame: any = data;
            this.requestAccepted = acceptGame;
            console.log('zebi', this.requestAccepted);
        });
    }

    // setMultiplayerGame() {
    //     this.timeService.timeMultiplayer(this.time);
    // }

    onSubmitUserName(): void {
        console.log('forme : ' + this.name);
        this.openDialogOfVrUser();
        this.storeNameInLocalStorage();
        console.log('salut mec');
    }

    randomBonusActivated(event: any): void {
        this.chosenMode = event.target.value;
        if (this.chosenMode === this.modes[0]) {
            this.userService.isBonusBox = true;
        }
    }
}
// chooseFirstPlayer(): void {
//     this.socketManagementService.listen('chooseFirstToPlay').subscribe((data) => {
//         const firstPlayer: any = data;
//         this.userService.realUser.firstToPlay = firstPlayer;
//         this.userService.realUser.turnToPlay = firstPlayer;
//         this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
//         this.firstPlayerChoosed = true;
//     });
// }
