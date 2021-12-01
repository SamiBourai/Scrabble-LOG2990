/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { UserService } from '@app/services/user.service';
//import { of } from 'rxjs';

import { ModalEndOfGameComponent } from './modal-end-of-game.component';

describe('ModalEndOfGameComponent', () => {
    let component: ModalEndOfGameComponent;
    let fixture: ComponentFixture<ModalEndOfGameComponent>;
    // let userServiceSpy: jasmine.SpyObj<UserService>;

    // beforeEach(() => {
    //     userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers','setVrName']);
    
    // });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalEndOfGameComponent],
            imports: [HttpClientModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEndOfGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('ngOnInit', () => {
    //     const data = true;
    //     const spy = spyOn<any>(component.multiplayerService, 'winnerOfGame').and.returnValue(of(data));
    //     component.ngOnInit();
    //     expect(spy).not.toHaveBeenCalled();
    // });

    it('joinVrPlayer dans if', () => {
        component['userService'].playMode = 'joinMultiplayerGame';
        component.joinVrPlayer();
        expect(component['userService'].setJoinAsReal()).toHaveBeenCalled();
    });

    it('joinVrPlayer else', () => {
        component['userService'].playMode = 'none';
        component.joinVrPlayer();
        expect(component['userService'].playMode).toBe('soloGame');
        expect(component['userService'].endOfGame).toBeFalse();
    });
});
