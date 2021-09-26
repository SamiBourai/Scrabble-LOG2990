import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    A,
    B,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CANEVAS_HEIGHT,
    CANEVAS_WIDTH,
    D,
    E,
    EASEL_LENGTH,
    L,
    LEFTSPACE,
    M,
    NB_TILES,
    O,
    P,
    S,
    T,
    TOPSPACE,
} from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
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
export class PlayAreaComponent implements AfterViewInit, OnInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    // @ViewChild('skipTurn') private btnSkipTurn: HTMLButtonElement;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    containsAllChars: boolean = true;
    chatWord: string;
    let: Letter[] = [D, A, B, A];
    remainingLetters: number = 0;
    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };
    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly easelLogisticsService: EaselLogiscticsService,
        public userService: UserService,
        private readonly reserveService: ReserveService,
        private readonly pvs: ValidWordService,
    ) {
        const usedPosition = new Array<Letter[]>(15);
        for (let i = 0; i < usedPosition.length; ++i) {
            usedPosition[i] = new Array<Letter>(15);
        }
        usedPosition[0][0] = P;
        usedPosition[1][0] = O;
        usedPosition[2][0] = M;
        usedPosition[3][0] = M;
        usedPosition[4][0] = E;
        usedPosition[5][0] = S;
        usedPosition[0][1] = T;
        usedPosition[1][1] = A;
        usedPosition[2][1] = B;
        usedPosition[3][1] = L;
        usedPosition[4][1] = E;
        usedPosition[5][1] = E;

        const command: ChatCommand = {
            word: 'se',
            direction: 'v',
            position: { x: 6, y: 1 },
        };
        // let usedPosition: Letter[][] = [
        //     [A, R, B, R, E, S],
        //     [T, A, B, L, E, E],
        // ];

        // let position: Vec2[] = [
        //     { x: 5, y: 0 },
        //     { x: 5, y: 1 },
        // ];
        this.pvs.loadDictionary().then(() => {
            this.pvs.readWordsAndGivePointsIfValid(usedPosition, command);
        });
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    // @HostListener('click', ['$skipTurn'])
    // onClick(){
    //     console.log(this.userService.userSkipingTurn);

    //     console.log("!passer");

    //     this.userService.userSkipingTurn=true;
    //     console.log(this.userService.userSkipingTurn);
    // }
    detectSkipTurnBtn() {
        console.log(this.userService.userSkipingTurn);

        console.log('!passer');

        this.userService.userSkipingTurn = true;
        console.log(this.userService.userSkipingTurn);
    }

    ngOnInit() {
        this.userService.startTimer();
        // this.onClick();
    }
    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.lettersService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.easelLogisticsService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawCentralTile();
        this.gridService.drawCoor();
        this.gridService.drawBonusBox();
        this.gridService.drawGrid();
        this.gridService.drawHand();
        this.gridCanvas.nativeElement.focus();

        this.reserveService.size.subscribe((res) => {
            this.remainingLetters = res;
        });
    }

    // @HostListener('click', ['$skipTurn'])
    // onClick(){
    //     console.log(this.userService.userSkipingTurn);

    getLetters(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            if (this.easelLogisticsService.occupiedPos[i] === false && this.reserveService.reserveSize > 0) {
                const temp: Letter = this.reserveService.getRandomLetter();
                this.easelLogisticsService.easelLetters[i] = {
                    index: i,
                    letters: temp,
                };
            }
        }
        if (this.reserveService.reserveSize > 0) {
            this.easelLogisticsService.placeEaselLetters();
        }
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
            event.button === MouseButton.Left &&
            event.offsetX > LEFTSPACE &&
            event.offsetX < BOARD_WIDTH + LEFTSPACE &&
            event.offsetY > TOPSPACE &&
            event.offsetY < BOARD_HEIGHT + TOPSPACE
        ) {
            this.mousePosition = {
                x: Math.ceil((event.offsetX - LEFTSPACE) / (BOARD_WIDTH / NB_TILES)),
                y: Math.ceil((event.offsetY - TOPSPACE) / (BOARD_HEIGHT / NB_TILES)),
            };
        }
    }
}
