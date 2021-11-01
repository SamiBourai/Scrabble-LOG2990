/* eslint-disable @typescript-eslint/no-explicit-any */
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
    createdGame: Game;
    aleatoryBonus: boolean = false;
    joinedUserName: string = '';
    creatorName: string = '';
    gameName: string = '';
    rooms: any;
    game: any;
    isEmptyRoom: boolean = true;
    roomJoined: boolean = false;
    requestAccepted: boolean = false;
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
                this.userService.initiliseUsers(this.soloMode);
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
                    this.userService.initiliseUsers(this.soloMode);
                    this.userService.joinedUser.name = this.game.joinedUserName;
                    this.userService.joinedUser.guestPlayer = false;
                });
                break;
            case 'joinMultiplayerGame':
                this.joinMultiplayerGame = true;
                this.firstFormGroup = this.formBuilder.group({
                    firstCtrl: new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]),
                });
                this.generateRooms();
                this.gameAccepted();
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
        this.name = this.userName.value;
        localStorage.setItem('userName', this.name);
    }
    passInSoloMode(): void {
        this.soloMode = true;
        this.createMultiplayerGame = false;
        this.disconnectUser();
    }
    createGame(): void {
        this.createdGame = {
            clientName: this.creatorName,
            gameName: this.gameName,
            gameTime: { min: 0, sec: 59 },
            aleatoryBonus: this.aleatoryBonus,
        };
        this.socketManagementService.emit('createGame', this.createdGame);
        this.userService.realUser.name = this.creatorName;
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
        const joinedUserInformations = {
            gameName: room.gameName,
            joinedUserName: this.joinedUserName,
        };
        this.socketManagementService.emit('joinRoom', undefined, undefined, joinedUserInformations);
        this.userService.initiliseUsers(this.soloMode);
        this.userService.realUser.name = room.clientName ?? 'default';
        this.userService.joinedUser.name = this.joinedUserName;
        this.userService.joinedUser.guestPlayer = true;
        this.userService.gameName = room.gameName;
        this.roomJoined = true;
        this.aleatoryBonus = room.aleatoryBonus ?? false;
    }
    gameAccepted(): void {
        this.socketManagementService.listen('gameAccepted').subscribe((data) => {
            const acceptGame: any = data;
            this.requestAccepted = acceptGame;
        });
    }
}