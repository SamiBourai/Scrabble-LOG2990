import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const WIDTH = 800;
export const HEIGHT = 800;
export const BOX = 15;
export const TOPSPACE = 50;
export const LEFTSPACE = 2 * TOPSPACE;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: WIDTH, y: HEIGHT };

    constructor(private readonly gridService: GridService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // this.gridService.playerImage=this.imgPlayer.nativeElement.getAt
        this.gridService.drawCoor();
        this.gridService.drawBonusBox();
        this.gridService.drawGrid();
        this.gridService.drawHand();
        this.gridService.drawWord('NIKOUMOUK');
        this.gridService.drawPlayer();
        this.gridCanvas.nativeElement.focus();
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (
            event.button === MouseButton.Left
            // &&
            // event.offsetX > LEFTSPACE &&
            // event.offsetX < this.gridService.width + LEFTSPACE &&
            // event.offsetY > TOPSPACE &&
            // event.offsetY < this.gridService.height + TOPSPACE
        ) {
            this.mousePosition = {
                // x: Math.ceil((event.offsetX - LEFTSPACE) / (this.gridService.width / BOX)),
                // y: Math.ceil((event.offsetY - TOPSPACE) / (this.gridService.height / BOX)),
                x: event.offsetX,
                y: event.offsetY,
            };
        }
    }
}
