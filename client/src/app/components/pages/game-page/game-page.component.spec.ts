
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';
fdescribe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    const mockDialogRef2 = {
        open: jasmine.createSpy('open'),
    };
    // let userServiceSpy: jasmine.SpyObj<UserService>;
    // let dataBaseSpy: jasmine.SpyObj<DatabaseService>;
    // let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    
    beforeEach(() => {
        // userServiceSpy = jasmine.createSpyObj('UserService', ['userSkipingTurn', 'endOfGameBehaviorSubject']);
        // dataBaseSpy = jasmine.createSpyObj('DatabaseService', ['addScores', 'sendChosenDic']);
        // objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', ['log2initializedGame990Mode']);
        jasmine.getEnv().allowRespy(true);
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            return;
        });
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent],
            imports: [HttpClientModule],
            providers: [ 
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: MatSnackBar, useValue: mockDialogRef2 },
                // { provide: UserService, useValue: userServiceSpy },
                // { provide: DatabaseService, useValue: dataBaseSpy },
                // { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
            ],
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('detectSkipTurnBtn', () => {
        //const spy = spyOn(component['userService'], 'userSkipingTurn')
        component.detectSkipTurnBtn();
        expect(component['userService'].userSkipingTurn).toBeTrue();
    });

    // it('ngOnInit', () => {
    //     //const spy = spyOn(component['userService'], 'userSkipingTurn')
    //     component.ngOnInit();
    //     expect(window.addEventListener).toHaveBeenCalled();
    // });

    it('openShowEasel', () => {
        spyOn<any>(component['userService'].endOfGameBehaviorSubject, 'subscribe').and.returnValue(of(true));
        const spy1 = spyOn(component['dataBase'], 'addScores');
        const spy2 = spyOn(component['dialogRef'], 'open');
        component.openShowEasel();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('ngOnDestroy', () => {
        const spy = spyOn(component, 'assign');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});