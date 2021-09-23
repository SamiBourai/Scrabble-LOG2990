import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { A, B, BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, E, HEIGHT, L, LEFTSPACE, R, S, T, TOPSPACE, WIDTH } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { ReserveService } from '@app/services/reserve.service';
import { ValidWordService } from '@app/services/valid-world.service';

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
    containsAllChars: boolean = true;
    chatWord: string;

    private canvasSize = { x: WIDTH, y: HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly reserveService: ReserveService,
        private readonly easelLogisticsService: EaselLogiscticsService,
        pvs: ValidWordService,
    ) {
        // let usedPosition: any = [
        //     [undefined, P, T],
        //     [undefined, O, A],
        //     [undefined, M, B],
        //     [undefined, M, L],
        //     [undefined, E, E],
        //     [undefined, S, E],
        //     [undefined, undefined, undefined],
        // ];
        let usedPosition: any = [
            [A, R, B, R, E, S],
            [T, A, B, L, E, E],
        ];
        let wordDirection = 'v';
        let word = [S, E];
        // let position: Vec2[] = [
        //     { x: 1, y: 5 },
        //     { x: 2, y: 5 },
        // ];
        let position: Vec2[] = [
            { x: 5, y: 0 },
            { x: 5, y: 1 },
        ];
        pvs.load_dictionary().then(() => {
            pvs.readWordsAndGivePointsIfValid(word, position, usedPosition, wordDirection);
        });
    }

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
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    placeFromEasel(): void {
        this.lettersService.placeLetter(this.easelLogisticsService.getLetterFromEasel(2), { x: 2, y: 2 });
        this.lettersService.placeLetter(this.easelLogisticsService.getLetterFromEasel(4), { x: 7, y: 8 });
    }

    getLetters(): void {
        for (let i = 0; i < 7; i++) {
            if (this.easelLogisticsService.occupiedPos[i] == false) {
                let temp: Letter = this.reserveService.getRandomLetter();
                this.easelLogisticsService.easelLetters[i] = {
                    index: i,
                    letters: temp,
                };
            }
        }
        this.easelLogisticsService.placeEaselLetters();
        console.log(this.easelLogisticsService.easelLetters);
        console.log(this.reserveService._size);
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
