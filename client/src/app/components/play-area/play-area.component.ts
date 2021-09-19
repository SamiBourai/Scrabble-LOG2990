import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, HEIGHT, LEFTSPACE, TOPSPACE, WIDTH } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { ReserveService } from '@app/services/reserve.service';

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
    letters: Letter[] = [];
    private canvasSize = { x: WIDTH, y: HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly reserveService: ReserveService,
        private readonly easelLogisticsService: EaselLogiscticsService,
    ) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.lettersService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.easelLogisticsService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawCoor();
        this.gridService.drawBonusBox();
        this.gridService.drawGrid();
        this.gridService.drawHand();
        this.gridService.drawWord('NIKBABAKUS');
        this.gridService.drawPlayer();
        //this.lettersService.placeLetter(this.letters, { x: 2, y: 2 });
        this.getLetters();
        this.easelLogisticsService.placeEaselLetters(this.letters);

        // this.lettersService.placeLetter(this.reserveService.getRandomLetter(), { x: 2, y: 2 });
        // this.lettersService.placeLetter(this.reserveService.getRandomLetter(), { x: 6, y: 6 });

        this.gridService.drawPlayerName('bob');
        this.gridService.drawOpponentName('bob');
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    getLetters(): void {
        for (let i = 0; i < 7; i++) {
            this.letters.push(this.reserveService.getRandomLetter());
        }
    }
    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (
            event.button === MouseButton.Left &&
            event.offsetX > LEFTSPACE &&
            event.offsetX < DEFAULT_WIDTH + LEFTSPACE &&
            event.offsetY > TOPSPACE &&
            event.offsetY < DEFAULT_HEIGHT + TOPSPACE
        ) {
            this.mousePosition = {
                x: Math.ceil((event.offsetX - LEFTSPACE) / (DEFAULT_WIDTH / BOX)),
                y: Math.ceil((event.offsetY - TOPSPACE) / (DEFAULT_HEIGHT / BOX)),
            };
        }
    }
}
