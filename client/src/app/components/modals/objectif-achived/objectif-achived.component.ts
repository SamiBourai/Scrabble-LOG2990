import { Component, OnInit } from '@angular/core';
import { Objectifs } from '@app/classes/objectifs';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-objectif-achived',
    templateUrl: './objectif-achived.component.html',
    styleUrls: ['./objectif-achived.component.scss'],
})
export class ObjectifAchivedComponent implements OnInit {
    diplayCompltedObjectif: string = '';

    constructor(
        public objectifManagerService: ObjectifManagerService,
        private socketManagementService: SocketManagementService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        if (this.objectifManagerService.completedObjectif && !this.objectifManagerService.objectifAchivedByOpponnent) {
            this.updateScore(this.objectifManagerService.achivedObjectif);
        } else if (this.objectifManagerService.objectifAchivedByOpponnent) {
            this.diplayCompltedObjectif = this.objectifManagerService.displayOppenentObjectifs(this.objectifManagerService.achivedObjectif);
        }
    }

    close() {
        this.objectifManagerService.achivedObjectif.name = '';
        this.diplayCompltedObjectif = '';
        this.objectifManagerService.objectifAchivedByOpponnent = false;
        this.objectifManagerService.completedObjectif = false;
    }
    private updateScore(objectif: Objectifs) {
        switch (this.userService.playMode) {
            case 'joinMultiplayerGame':
                this.userService.joinedUser.score = this.objectifManagerService.updateScore(objectif, this.userService.joinedUser.score);
                this.socketManagementService.emit('objectifAchived', {
                    gameName: this.userService.gameName,
                    achivedObjectif: objectif,
                    user: this.userService.joinedUser,
                });
                break;
            case 'createMultiplayerGame':
                this.userService.realUser.score = this.objectifManagerService.updateScore(objectif, this.userService.realUser.score);
                this.socketManagementService.emit('objectifAchived', {
                    gameName: this.userService.gameName,
                    achivedObjectif: objectif,
                    user: this.userService.realUser,
                });
                break;
            case 'soloGame':
                if (this.objectifManagerService.userPlay) {
                    this.userService.realUser.score = this.objectifManagerService.updateScore(objectif, this.userService.realUser.score);
                } else {
                    this.userService.vrUser.score = this.objectifManagerService.updateScore(objectif, this.userService.vrUser.score);
                    this.objectifManagerService.displayOppenentObjectifs(this.objectifManagerService.achivedObjectif);
                }
                break;
        }
        if (this.objectifManagerService.userPlay) {
            this.diplayCompltedObjectif = 'vous avez réussi à ' + objectif.definition;
        }
    }
}
