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
    rooms = new Array<Game>();
    dataArray: unknown;

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
                break;
            case 'joinMultiplayerGame':
                this.createMultiplayerGame = false;
                this.joinMultiplayerGame = true;
                this.generateRooms();
                console.log(this.dataArray);
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
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createGame() {
        this.socketManagementService.emit('createGame', this.createdGame);
    }
    generateRooms() {
        this.socketManagementService.listen('createdGame').subscribe((data) => {
            console.log(data);
            this.dataArray = data;
        });
    }
    joinGame() {
        this.socketManagementService.listen('joinRoom');
    }
    // console.log('data');
    // this.socketManagementService.listen('hello').subscribe((data) => {
    //     console.log(data);
    //     return data;
    // });
}
