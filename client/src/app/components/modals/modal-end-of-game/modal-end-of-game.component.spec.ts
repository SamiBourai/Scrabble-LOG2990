/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { DatabaseService } from '@app/services/database.service';
//import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { UserService } from '@app/services/user.service';
// import { of } from 'rxjs';
import { ModalEndOfGameComponent } from './modal-end-of-game.component';

describe('ModalEndOfGameComponent', () => {
    let component: ModalEndOfGameComponent;
    let fixture: ComponentFixture<ModalEndOfGameComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    //let multiplayerServiceSpy: jasmine.SpyObj<MultiplayerModeService>;
    //let databaseServiceSpy: jasmine.SpyObj<DatabaseService>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };


    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers','setVrName','setJoinAsReal', 'isPlayerTurn', 'endOfGame']);
        //multiplayerServiceSpy = jasmine.createSpyObj('MultiplayerModeService', ['playerLeftObs', 'subscribe']);
        //databaseServiceSpy = jasmine.createSpyObj('DatabaseService', []);
        jasmine.getEnv().allowRespy(true);

    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalEndOfGameComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatSnackBar, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                //{ provide: MultiplayerModeService, useValue: multiplayerServiceSpy },
                //{ provide: DatabaseService, useValue: databaseServiceSpy },
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
        component.joinVrPlayer();
        expect(component['userService'].playMode).toBe('soloGame');
        expect(component['userService'].endOfGame).toBeFalse();
        const joinVrSpy = spyOn(component['userService'].gameModeObs, 'next');
        expect(joinVrSpy).toHaveBeenCalled();
    });
});
