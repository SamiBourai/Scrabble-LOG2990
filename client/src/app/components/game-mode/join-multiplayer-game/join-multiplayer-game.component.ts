import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageServer } from '@app/classes/message-server';
import { MAX_LENGTH, MIN_LENGTH, ONE_SECOND_MS } from '@app/constants/constants';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-join-multiplayer-game',
    templateUrl: './join-multiplayer-game.component.html',
    styleUrls: ['./join-multiplayer-game.component.scss'],
})
export class JoinMultiplayerGameComponent implements OnInit {
    playerName: string = '';
    isRandom = false;
    rooms: MessageServer[];
    guestFormControl: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    isOptional = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    game: MessageServer;
    requestAccepted: boolean = false;
    isEmptyRoom: boolean = true;
    roomJoined: boolean = false;
    constructor(
        public userService: UserService,
        private formBuilder: FormBuilder,
        private socketManagementService: SocketManagementService,
        private multiplayerModeService: MultiplayerModeService,
        public objectifManagerService: ObjectifManagerService,
    ) {}

    ngOnInit(): void {
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
}
