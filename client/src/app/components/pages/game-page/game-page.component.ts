import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEndOfGameComponent } from '@app/modal-end-of-game/modal-end-of-game.component';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit, AfterViewInit {
    remainingLetters: number = 0;
    soloMode: boolean = false;
    event:any;
    constructor(
        public userService: UserService,
        private reserverService: ReserveService,
        private dialogRef: MatDialog,
        public virtualPlayerService: VirtualPlayerService,
    ) {}

    detectSkipTurnBtn() {
        this.userService.userSkipingTurn = true;
    }
    ngOnInit() {
        this.getLetter();
        if (this.userService.playMode === 'soloGame') {
            this.soloMode = true;
        }
        this.isUserEaselEmpty();
        // this.onWindowClose(event);
    }
    ngAfterViewInit() {
        this.openDialog();
    }
    openDialog() {
        this.userService.isEndOfGame.subscribe((response) => {
            if (response) {
                this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
            }
        });
    }
    getLetter() {
        this.reserverService.size.subscribe((res) => {
            setTimeout(() => {
                this.remainingLetters = res;
            }, 0);
        });
    }

    isUserEaselEmpty() {
        this.userService.turnToPlayObs.subscribe(() => {
            setTimeout(() => {
                if (
                    this.remainingLetters === 0 &&
                    (this.userService.realUser.easel.getEaselSize() === 0 || this.virtualPlayerService.easel.getEaselSize() === 0)
                ) {
                    if (this.userService.realUser.easel.getEaselSize() === 0) {
                        this.userService.realUser.score += this.virtualPlayerService.easel.pointInEasel();
                    } else {
                        this.userService.vrUser.score += this.userService.realUser.easel.pointInEasel();
                    }
                    this.userService.endOfGame = true;
                    this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
                }
            }, 0);
        });
    }

    @HostListener('window:unload', ['$event'])
    onWindowClose(event: any): void {
       // Do something
        event.preventDefault();
        // event.returnValue = 'You have unsaved changes, leave anyway?';
        // setTimeout(()=>{
        //     console.log("vous avez quitter");
        // },5000);
        // envoyer un signal au serveur, comme quoi il a fermer la page
        // le serveur attend 5 seconde
        // se serveur envoi un signal a l'autre joueur afin de dire qu'il a a gagner car l'autre a quitte
        
        localStorage.clear();


    }
}
