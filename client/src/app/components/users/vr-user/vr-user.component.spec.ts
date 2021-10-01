import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrUserComponent } from './vr-user.component';

describe('VrUserComponent', () => {
    let component: VrUserComponent;
    let fixture: ComponentFixture<VrUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VrUserComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VrUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should pass on chooseRandomName', () => {
    //     const chooseRandomNameSpy = spyOn(component, 'chooseRandomName').and.callThrough();
    //     component.chooseRandomName();
    //     expect(chooseRandomNameSpy).toHaveBeenCalled();

    //     localStorage.setItem('userName', 'Bobby1234');
    //     component.chooseRandomName();
    //     expect(chooseRandomNameSpy).toHaveBeenCalled();

    //     localStorage.setItem('userName', 'Martin1234');
    //     component.chooseRandomName();
    //     expect(chooseRandomNameSpy).toHaveBeenCalled();

    //     localStorage.setItem('userName', 'Momo1234');
    //     component.chooseRandomName();
    //     expect(chooseRandomNameSpy).toHaveBeenCalled();
    // });

    // it('should pass on pickRandomLetter', () => {
    //     const pickRandomLetterSpy = spyOn(component, 'pickRandomLetter').and.callThrough();
    //     component.pickRandomLetter();
    //     expect(pickRandomLetterSpy).toHaveBeenCalled();
    // });
});
