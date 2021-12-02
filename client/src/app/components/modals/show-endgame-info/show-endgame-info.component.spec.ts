import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['realUser', 'playMode', 'joinedUser']);
        showEaselspy = jasmine.createSpyObj('ShowEaselEndGameService', ['easelOneCtx', 'easelTwoCtx', 'drawHand']);
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit if', () => {
        component['userService'].playMode = 'soloGame';
        //const spy = spyOn(component['showEasel'], 'drawEasel');
        component.ngAfterViewInit();
        expect(component['showEasel'].drawEasel(component['virtualPlayer'].easel, component['showEasel'].easelTwoCtx)).toHaveBeenCalled();
    });

    it('ngOnInit else', () => {
        component['userService'].playMode = 'none';
        //const spy = spyOn(component['showEasel'], 'drawEasel');
        component.ngAfterViewInit();
        expect(component['showEasel'].drawEasel(component['userService'].joinedUser.easel, component['showEasel'].easelTwoCtx)).toHaveBeenCalled();
    });

    
});
