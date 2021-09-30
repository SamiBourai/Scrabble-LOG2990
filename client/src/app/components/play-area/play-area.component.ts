import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
    EASEL_LENGTH,
    LEFTSPACE,
    NB_TILES,
    TOPSPACE,
} from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
//import { VirtualPlayerService } from '@app/services/virtual-player.service';

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
        // private readonly virtualPlayerService: VirtualPlayerService,

        private messageService: MessageService,
    ) {
        this.pvs.loadDictionary().then(() => {
            //this.virtualPlayerService.manageVrPlayerActions();
        });
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    detectSkipTurnBtn() {
        this.userService.skipTurn();
        console.log(this.userService.userSkipingTurn);

        console.log('!passer');

        this.messageService.skipTurnIsPressed = true;
        this.userService.userSkipingTurn = true;
    }

    ngOnInit() {
        this.userService.startTimer();
        // this.onClick();
        this.reserveService.size.subscribe((res: number) => {
            setTimeout(() => {
                this.remainingLetters = res;
                console.log('taille de la reserve : ' + this.remainingLetters);
            }, 0);
        });
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
        this.getLetters();
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

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

    testVr() {
        //  this.virtualPlayerService.getLetterForEachColumn();
        //this.virtualPlayerService.generateVrPlayerEasel();
        //this.virtualPlayerService.getLetterForEachLine();
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
