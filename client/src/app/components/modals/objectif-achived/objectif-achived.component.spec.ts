/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UNDEFINED_INDEX } from '@app/constants/constants';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { ObjectifAchivedComponent } from './objectif-achived.component';

fdescribe('ObjectifAchivedComponent', () => {
    let component: ObjectifAchivedComponent;
    let fixture: ComponentFixture<ObjectifAchivedComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    const socketMock = {
        setGuestPlayerInfromation: () => '',
        emit: () => '',
    };
    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'firstMode', 'realUser', 'joinedUser', 'vrUser']);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', [
            'initializedGame',
            'objectifAchived',
            'objectifAchivedByOpponnent',
            'choosedObjectifs',
            'completedObjectif',
            'log2990Mode',
            'displayOppenentObjectifs',
            'updateScore',
            'userPlay',
        ]);
        await TestBed.configureTestingModule({
            declarations: [ObjectifAchivedComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
                { provide: SocketManagementService, useValue: socketMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectifAchivedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should pass on ngOnit and enter in the first if', () => {
        objectifManagerServiceSpy.completedObjectif = true;
        objectifManagerServiceSpy.objectifAchivedByOpponnent = false;
        const spyUpdateScore = spyOn<any>(component, 'updateScore');
        component.ngOnInit();
        expect(spyUpdateScore).toHaveBeenCalled();
    });
    it('should pass on ngOnit and do nothing', () => {
        objectifManagerServiceSpy.completedObjectif = false;
        objectifManagerServiceSpy.objectifAchivedByOpponnent = false;
        const spyUpdateScore = spyOn<any>(component, 'updateScore');
        component.ngOnInit();
        expect(spyUpdateScore).not.toHaveBeenCalled();
    });
    it('should pass on ngOnit and enter in the second if', () => {
        objectifManagerServiceSpy.objectifAchivedByOpponnent = true;
        component.ngOnInit();
        expect(objectifManagerServiceSpy.displayOppenentObjectifs).toHaveBeenCalled();
    });
    it('should pass in the close method', () => {
        component.diplayCompltedObjectif = 'jeje';
        objectifManagerServiceSpy.achivedObjectif = {
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: 'fill',
        };
        component.close();
        expect(objectifManagerServiceSpy.achivedObjectif.name).toEqual('');
        expect(component.diplayCompltedObjectif).toEqual('');
        expect(objectifManagerServiceSpy.objectifAchivedByOpponnent).toBeFalsy();
        expect(objectifManagerServiceSpy.completedObjectif).toBeFalsy();
    });
    it('should in updateScore with joinMultiplayer', () => {
        objectifManagerServiceSpy.updateScore.and.returnValue(3);
        userServiceSpy.playMode = 'joinMultiplayerGame';
        component['updateScore']({
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: 'fill',
        });
        expect(userServiceSpy.joinedUser.score).toEqual(3);
    });
    it('should in updateScore with createMultiplayerGame', () => {
        objectifManagerServiceSpy.updateScore.and.returnValue(5);
        userServiceSpy.playMode = 'createMultiplayerGame';
        component['updateScore']({
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: 'fill',
        });
        expect(userServiceSpy.realUser.score).toEqual(5);
    });
    it('should in updateScore with soloGame userplayed', () => {
        objectifManagerServiceSpy.updateScore.and.returnValue(10);
        userServiceSpy.playMode = 'soloGame';
        objectifManagerServiceSpy.userPlay = true;
        component['updateScore']({
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: 'fill',
        });
        expect(userServiceSpy.realUser.score).toEqual(10);
    });
    it('should in updateScore with soloGame vrPlayed', () => {
        objectifManagerServiceSpy.updateScore.and.returnValue(10);
        userServiceSpy.playMode = 'soloGame';
        objectifManagerServiceSpy.userPlay = false;
        component['updateScore']({
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: 'fill',
        });
        expect(userServiceSpy.vrUser.score).toEqual(10);
        expect(objectifManagerServiceSpy.displayOppenentObjectifs).toHaveBeenCalled();
    });
});
