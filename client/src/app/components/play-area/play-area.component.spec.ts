/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let mouseEvent: MouseEvent;
    let easelLogiscticsServiceSpy: EaselLogiscticsService;
    let reserveServiceSpy: ReserveService;
    let userServiceSpy: UserService;
    let messageServiceSpy: MessageService;
    let virtualPlayerService: VirtualPlayerService;

    beforeEach(async () => {
        reserveServiceSpy = new ReserveService();
        easelLogiscticsServiceSpy = new EaselLogiscticsService(reserveServiceSpy);
        userServiceSpy = new UserService(messageServiceSpy, virtualPlayerService);
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [PlayAreaComponent],
            providers: [
                { provide: EaselLogiscticsService, useValue: easelLogiscticsServiceSpy },
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
        const expectedPosition: Vec2 = { x: 400, y: 400 };
        const boxPosition: Vec2 = { x: 7, y: 8 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);

        expect(component.mousePosition).toEqual(boxPosition);
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- Add reason */
    it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 1,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(component.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const test = component['userService'].userSkipingTurn;
        component.detectSkipTurnBtn();
        expect(test).toBeFalse();
    });

    it('should get letter 7 times on get getLetters if all false', () => {
        easelLogiscticsServiceSpy.occupiedPos = [false, false, false, false, false, false, false];
        reserveServiceSpy.reserveSize = 100;
        const getRandomLetterSpy = spyOn(reserveServiceSpy, 'getRandomLetter').and.callThrough();
        component.getLetters();
        expect(getRandomLetterSpy).toHaveBeenCalledTimes(7);
    });
    it('should call placeEaselLetters on getLetters', () => {
        reserveServiceSpy.reserveSize = 100;
        const placeEaselLettersSpy = spyOn(easelLogiscticsServiceSpy, 'placeEaselLetters').and.callThrough();
        component.getLetters();
        expect(placeEaselLettersSpy).toHaveBeenCalled();
    });
});
