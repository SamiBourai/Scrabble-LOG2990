import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalScrableClassiqueComponent } from './modal-scrable-classique.component';

describe('ModalScrableClassiqueComponent', () => {
    let component: ModalScrableClassiqueComponent;
    let fixture: ComponentFixture<ModalScrableClassiqueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalScrableClassiqueComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalScrableClassiqueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
