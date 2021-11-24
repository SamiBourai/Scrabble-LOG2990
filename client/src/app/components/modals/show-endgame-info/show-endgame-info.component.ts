import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Score } from '@app/classes/score';
import { BOARD_WIDTH, CLOSE_SNACKBAR, DATABASE_COLLECTION_CLASSIC, EASEL_LENGTH, ERROR_HTTP, MAX_TIME_SNACKBAR, NB_TILES, SCORE_HAS_BEEN_SAVED, SCORE_NOT_SAVED } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { ShowEaselEndGameService } from '@app/services/show-easel-end-game.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-show-endgame-info',
    templateUrl: './show-endgame-info.component.html',
    styleUrls: ['./show-endgame-info.component.scss'],
})
export class ShowEndgameInfoComponent implements AfterViewInit, OnInit {
    @ViewChild('easelOne', { static: false }) private easelOne!: ElementRef<HTMLCanvasElement>;
    @ViewChild('easelTwo', { static: false }) private easelTwo!: ElementRef<HTMLCanvasElement>;

    private canvasSize = { x: EASEL_LENGTH * (BOARD_WIDTH / NB_TILES), y: BOARD_WIDTH / NB_TILES };
    constructor(private showEasel: ShowEaselEndGameService, public userService: UserService, private virtualPlayer: VirtualPlayerService,private snackBar: MatSnackBar, private databaseService:DatabaseService) {}
    ngOnInit():void{
        this.userService.endOfGameBehaviorSubject.subscribe((response:boolean)=>{
            console.log('end game', response);
            setTimeout(()=>{
                if(response)
                    this.addScores();
            },0)

        })
    }
    ngAfterViewInit(): void {
        this.showEasel.easelOneCtx = this.easelOne.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.showEasel.easelTwoCtx = this.easelTwo.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.showEasel.drawEasel(this.userService.realUser.easel, this.showEasel.easelOneCtx);
        if (this.userService.playMode === 'soloGame') this.showEasel.drawEasel(this.virtualPlayer.easel, this.showEasel.easelTwoCtx);
        else this.showEasel.drawEasel(this.userService.joinedUser.easel, this.showEasel.easelTwoCtx);

        this.showEasel.drawHand(this.showEasel.easelTwoCtx);
        this.showEasel.drawHand(this.showEasel.easelOneCtx);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    private openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, { duration: MAX_TIME_SNACKBAR });
    }

    addScores(): void {
        // A REMPLACER QUAND FIN DE PARTIE VA MARCHER
        const score: Score = { name: 'Mounib', score: 10 };
        this.databaseService.sendScore(DATABASE_COLLECTION_CLASSIC, score).subscribe(
            () => {
                this.openSnackBar(SCORE_HAS_BEEN_SAVED, CLOSE_SNACKBAR);
            },
            (reject: number) => {
                this.openSnackBar(ERROR_HTTP + reject + SCORE_NOT_SAVED, CLOSE_SNACKBAR);
            },
        );
    }



}
