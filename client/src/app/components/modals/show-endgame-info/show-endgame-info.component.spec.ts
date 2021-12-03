/* eslint-disable prettier/prettier */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShowEaselEndGameService } from '@app/services/show-easel-end-game.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { ShowEndgameInfoComponent } from './show-endgame-info.component';

describe('ShowEndgameInfoComponent', () => {
    let component: ShowEndgameInfoComponent;
    let fixture: ComponentFixture<ShowEndgameInfoComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let showEaselspy: jasmine.SpyObj<ShowEaselEndGameService>;
    let virtualPlayerSpy: jasmine.SpyObj<VirtualPlayerService>;
    // const mockShowEaselEndGameService = {
    //     // listen: (name: string) => {
    //     //     return new BehaviorSubject(name).asObservable()
    //     // },
    //     drawHand : () => '',
    //     drawEasel : () => '',
    //     getContext : () => '',
    //     //emit: () => ''
    // };

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['realUser', 'playMode', 'joinedUser']);
        // const nativeElement = jasmine.createSpyObj('nativeElement', ['getContext']);
        showEaselspy = jasmine.createSpyObj('ShowEaselEndGameService', ['easelOneCtx', 'easelTwoCtx', 'drawHands', 'drawEasel', 'setCanvasElements']);
        virtualPlayerSpy = jasmine.createSpyObj('VirtualPlayerService', ['easel', '']);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShowEndgameInfoComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: ShowEaselEndGameService, useValue: showEaselspy },
                { provide: VirtualPlayerService, useValue: virtualPlayerSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowEndgameInfoComponent);
        component = fixture.componentInstance;
        //const canvasSize = component['canvasSize'];
        const nativeElement = jasmine.createSpyObj('nativeElement', ['getContext']);
        const test = jasmine.createSpyObj('EaselOne', [], {nativeElement: nativeElement})
        const test2 = jasmine.createSpyObj('EaselTwo', [], {nativeElement: nativeElement})
        component['easelOne'] = test;
        component['easelTwo'] = test2;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit if', () => {
        component['userService'].playMode = 'soloGame';
        //const spy = spyOn(component['showEasel'], 'drawEasel');
        component.ngAfterViewInit();
        // expect(component['showEasel'].drawEasel(component['virtualPlayer'].easel, component['showEasel'].easelTwoCtx)).toHaveBeenCalled();
        expect(showEaselspy.drawEasel).toHaveBeenCalled();
    });
    
    it('ngOnInit else', () => {
        component['userService'].playMode = 'none';
        component.ngAfterViewInit();
        expect(showEaselspy.drawEasel).toHaveBeenCalled();
        // expect(component['showEasel'].drawEasel(component['userService'].joinedUser.easel, component['showEasel'].easelTwoCtx)).toHaveBeenCalled();
    });

    it('get width', () => {
        expect(component.width).toBeInstanceOf(Number);
    });

    it('get height', () => {
        expect(component.height).toBeInstanceOf(Number);
    });

    
});