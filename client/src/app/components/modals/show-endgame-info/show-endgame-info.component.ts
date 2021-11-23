import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BOARD_WIDTH, EASEL_LENGTH, NB_TILES } from '@app/constants/constants';
import { ShowEaselEndGameService } from '@app/services/show-easel-end-game.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-show-endgame-info',
    templateUrl: './show-endgame-info.component.html',
    styleUrls: ['./show-endgame-info.component.scss'],
})
export class ShowEndgameInfoComponent implements AfterViewInit {
    @ViewChild('easelOne', { static: false }) private easelOne!: ElementRef<HTMLCanvasElement>;
    @ViewChild('easelTwo', { static: false }) private easelTwo!: ElementRef<HTMLCanvasElement>;

    private canvasSize = { x: EASEL_LENGTH * (BOARD_WIDTH / NB_TILES), y: BOARD_WIDTH / NB_TILES };
    constructor(private showEasel: ShowEaselEndGameService, public userService: UserService, private virtualPlayer: VirtualPlayerService) {}

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
}
