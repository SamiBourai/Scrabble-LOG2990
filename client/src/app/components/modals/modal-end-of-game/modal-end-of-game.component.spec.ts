/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';
// import { of } from 'rxjs';
import { ModalEndOfGameComponent } from './modal-end-of-game.component';

describe('ModalEndOfGameComponent', () => {
    let component: ModalEndOfGameComponent;
    let fixture: ComponentFixture<ModalEndOfGameComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', [
            'playMode',
            'isBonusBox',
            'initiliseUsers',
            'setVrName',
            'setJoinAsReal',
            'isPlayerTurn',
            'endOfGame',
        ]);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalEndOfGameComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatSnackBar, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
            ],
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
        const joinVrSpy = spyOn(component['userService'], 'setJoinAsReal');
        expect(joinVrSpy).toHaveBeenCalled();
    });

    it('joinVrPlayer else', () => {
        component['userService'].playMode = 'none';
        component['userService'].realUserTurnObs = new BehaviorSubject<boolean>(true);
        component['userService'].gameModeObs = new BehaviorSubject<string>('');
        component.joinVrPlayer();
        expect(component['userService'].playMode).toBe('soloGame');
        expect(component['userService'].endOfGame).toBeFalse();
        // const joinVrSpy = spyOn(component['userService'].gameModeObs, 'next');
        // expect(joinVrSpy).toHaveBeenCalled();
    });
});
