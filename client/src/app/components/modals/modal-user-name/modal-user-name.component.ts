import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageServer } from '@app/classes/message-server';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
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
    aleatoryBonus: boolean = false;
    playerName: string = '';
    guestName: string = '';
    gameName: string = '';
    rooms: MessageServer[];
    game: MessageServer;
    isEmptyRoom: boolean = true;
    roomJoined: boolean = false;
    requestAccepted: boolean = false;
    constructor(
        private dialogRef: MatDialog,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
        private multiplayerModeService: MultiplayerModeService,
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
                    this.guestName = room.guestPlayer?.name ?? 'default';
                    this.multiplayerModeService.setGuestPlayerInfromation(this.guestName);
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
        this.socketManagementService.emit('acceptGame', { gameName: this.gameName, gameAccepted: response });
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
        this.socketManagementService.emit('createGame', {
            user: { name: this.playerName },
            gameName: this.gameName,
            timeConfig: { min: 0, sec: 59 },
            aleatoryBonus: this.aleatoryBonus,
        });
        this.userService.realUser.name = this.playerName;
        this.userService.gameName = this.gameName;
    }
    generateRooms(): void {
        this.socketManagementService.emit('generateAllRooms');
        this.socketManagementService.getRooms().subscribe((data) => {
            this.rooms = data;
            if (this.rooms.length === 0) this.isEmptyRoom = true;
            else this.isEmptyRoom = false;
        });
    }
    disconnectUser(): void {
        this.socketManagementService.emit('disconnect', { gameName: this.gameName, reason: 'le joueur a refusé de jouer' });
    }
    joinGame(room: MessageServer): void {
        this.multiplayerModeService.setGameInformations(room, this.playerName);
        this.roomJoined = true;
        this.aleatoryBonus = room.aleatoryBonus ?? false;
    }
    gameAccepted(): void {
        this.socketManagementService.listen('gameAccepted').subscribe((data) => {
            this.requestAccepted = data.gameAccepted ?? false;
        });
    }
}
