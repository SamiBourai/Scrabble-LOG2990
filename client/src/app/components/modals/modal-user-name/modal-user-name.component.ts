import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '@app/classes/game';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
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
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    isOptional = false;
    userName: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    name: string;
    createdGame: Game = { clientName: 'YAN', gameName: 'GAME1' };
    clientName: string = '';
    gameName: string = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rooms: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    game: any;
    isEmptyRoom: boolean = true;
    constructor(
        private dialogRef: MatDialog,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
    ) {}
    ngOnInit(): void {
        switch (this.userService.playMode) {
            case 'soloGame':
                this.soloMode = true;
                break;
            case 'createMultiplayerGame':
                this.createMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    firstCtrl: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.secondFormGroup = this.formBuilder.group({
                    secondCtrl: new FormControl(''),
                });
                this.socketManagementService.listen('userJoined').subscribe((room) => {
                    this.game = room;
                    localStorage.setItem('userName', this.createdGame.clientName);
                    localStorage.setItem('joinedUserName', this.game.joinedUserName);
                    console.log(this.game, 'userJoined');
                });
                break;
            case 'joinMultiplayerGame':
                this.createMultiplayerGame = false;
                this.joinMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    firstCtrl: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.generateRooms();
                break;
        }
    }

    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }

    storeNameInLocalStorage(): void {
        switch (true) {
            case this.soloMode:
                this.name = this.userName.value;
                localStorage.setItem('userName', this.name);
                break;
            case this.createMultiplayerGame:
                this.name = this.createdGame.clientName;
                localStorage.setItem('userName', this.name);
                break;
        }
    }
    passInSoloMode(): void {
        this.soloMode = true;
        this.createMultiplayerGame = false;
        this.disconnectUser();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createGame() {
        this.createdGame = { clientName: this.clientName, gameName: this.gameName };
        this.socketManagementService.emit('createGame', this.createdGame);
    }
    generateRooms() {
        this.socketManagementService.emit('generateAllRooms');
        this.socketManagementService.listen('createdGames').subscribe((data) => {
            this.rooms = data;
            if (this.rooms.length === 0) this.isEmptyRoom = true;
            else this.isEmptyRoom = false;
        });
    }
    disconnectUser() {
        this.socketManagementService.emit('disconnect', undefined, 'user gave up the game');
    }
    joinGame(room: Game) {
        room = { clientName: room.clientName, gameName: room.gameName, joinedUserName: this.clientName };
        this.socketManagementService.emit('joinRoom', room);
        localStorage.setItem('userName', this.clientName);
        localStorage.setItem('gameCreaterName', room.clientName);
    }
    // console.log('data');
    // this.socketManagementService.listen('hello').subscribe((data) => {
    //     console.log(data);
    //     return data;
    // });
}
