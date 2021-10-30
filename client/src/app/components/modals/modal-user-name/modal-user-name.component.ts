/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '@app/classes/game';
import { GameTime } from '@app/classes/time';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { DEFAULT_TIME, TIME_CHOICE } from '@app/constants/constants';
import { GridService } from '@app/services/grid.service';
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
    modes:string[]=['Aléatoire', 'Normal'];
    chosenMode:string=this.modes[1];
    constructor(
        private dialogRef: MatDialog,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
        private gridService:GridService,
        private timeService:TimeService,
    ) {}
    ngOnInit(): void {
        switch (this.userService.playMode) {
            case 'soloGame':
                this.soloMode = true;
                this.userFormGroup = new FormGroup({
                    userName: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });

                this.userService.initiliseUsers(this.soloMode);
                break;
            case 'createMultiplayerGame':
                this.createMultiplayerGame = true;
                this.userFormGroup = this.formBuilder.group({
                    userName: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.firstFormGroup = this.formBuilder.group({
                    firstCtrl: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.secondFormGroup = this.formBuilder.group({
                    secondCtrl: new FormControl(''),
                });
                this.socketManagementService.listen('userJoined').subscribe((room) => {
                    this.game = room;
                    this.userService.initiliseUsers(this.soloMode);
                    this.userService.joinedUser.name = this.game.joinedUserName;
                    this.socketManagementService.emit('chooseFirstToPlay', this.game.gameName);
                });
                this.chooseFirstPlayer();
                break;
            case 'joinMultiplayerGame':
                this.createMultiplayerGame = false;
                this.joinMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    firstCtrl: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.generateRooms();
                this.chooseFirstPlayer();

                break;
        }
    }
    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }

    storeNameInLocalStorage(): void {
        this.name = this.userName.value;
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
        this.socketManagementService.emit('createGame', this.createdGame);
        this.userService.realUser.name = this.createdGame.clientName;
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
        room = { clientName: room.clientName, gameName: room.gameName, joinedUserName: this.joinedUserName };
        this.socketManagementService.emit('joinRoom', room);
        this.userService.initiliseUsers(this.soloMode);
        this.userService.realUser.name = room.clientName;
        this.userService.joinedUser.name = this.joinedUserName;
    }
    chooseFirstPlayer(): void {
        this.socketManagementService.listen('chooseFirstToPlay').subscribe((data) => {
            const firstPlayer: any = data;
            this.userService.realUser.firstToPlay = firstPlayer;
            this.userService.realUser.turnToPlay = firstPlayer;
            this.userService.joinedUser.turnToPlay = !firstPlayer;
        });
    }


    randomBonusActivated() {
        this.gridService.isBonusRandom = true;
    }
    setMultiplayerGame() {
        this.timeService.timeMultiplayer(this.time);
    }
    @HostListener('document:click.minusBtn', ['$eventX'])
    onClickInMinusButton(event: Event) {
        event.preventDefault()

        if (this.timeCounter === 0) {
            return;
        }else if(this.timeCounter<0){
            this.timeCounter=0
        }
        else if (this.timeCounter > 0) {
            this.timeCounter--;
            this.time=TIME_CHOICE[this.timeCounter];
        }
    }
    @HostListener('document:click.addBtn', ['$event'])
    onClickInAddButton(event: Event) {
        event.preventDefault()

        if (this.timeCounter === TIME_CHOICE.length) {
            return;

        } else if (this.timeCounter > TIME_CHOICE.length) {
            this.timeCounter = TIME_CHOICE.length;
            return;

        } else if (this.timeCounter < TIME_CHOICE.length) {
            this.timeCounter++;
            this.time=TIME_CHOICE[this.timeCounter];
        }

    }

    onSubmitUserName():void{
        console.log("forme : "+this.userName.value);
        this.openDialogOfVrUser();
        this.storeNameInLocalStorage()
        console.log("salut mec");

    }

    radioChagesHandler(event:any):void{
        this.chosenMode=event.target.value;

        if(this.chosenMode===this.modes[0]){
            console.log("mo0de aleatoire detecte");


        }

    }



}
