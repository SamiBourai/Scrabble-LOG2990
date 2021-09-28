import { MessageService } from '@app/services/message.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { A, BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, E, HEIGHT, I, LEFTSPACE, M, R, TOPSPACE, WIDTH } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
// import { skip } from 'rxjs/operators';
import { ValidWordService } from '@app/services/valid-world.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';


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
    let: Letter[] = [A, I, E, E, M, R];

    private canvasSize = { x: WIDTH, y: HEIGHT };
    remainingLetters: number;

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly reserveService: ReserveService,
        private readonly easelLogisticsService: EaselLogiscticsService,
        public userService: UserService,
        private readonly virtualPlayerService: VirtualPlayerService,
        pvs: ValidWordService,
        private messageService:MessageService
    ) {
        pvs.load_dictionary().then(() => {
            this.virtualPlayerService.manageVrPlayerActions();
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

        this.messageService.skipTurnIsPressed = true;
        this.userService.userSkipingTurn = true;
       
    }

    ngOnInit() {
        this.userService.startTimer();
        // this.onClick();
        this.reserveService.size.subscribe((res: number) => {

            setTimeout(() =>{
                this.remainingLetters = res;
                console.log("taille de la reserve : "+this.remainingLetters);
            },0);

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
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
 
    // @HostListener('click', ['$skipTurn'])
    // onClick(){
    //     console.log(this.userService.userSkipingTurn);

    //     console.log("!passer");

    //     this.userService.userSkipingTurn=true;
    //     console.log(this.userService.userSkipingTurn);
    // }
    
    placeFromEasel(): void {
        if (this.lettersService.boxIsEmpty({ x: 2, y: 2 })) {
            this.lettersService.placeLetter(this.easelLogisticsService.getLetterFromEasel(2), { x: 2, y: 2 });
        }
        if (this.lettersService.boxIsEmpty({ x: 2, y: 2 })) {
            this.lettersService.placeLetter(this.easelLogisticsService.getLetterFromEasel(4), { x: 2, y: 2 });
        }
    }

    getLetters(): void {
        for (let i = 0; i < 7; i++) {
            if (this.easelLogisticsService.occupiedPos[i] === false) {
                const temp: Letter = this.reserveService.getRandomLetter();
                this.easelLogisticsService.easelLetters[i] = {
                    index: i,
                    letters: temp,
                };
            }
        }
        this.easelLogisticsService.placeEaselLetters();
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
