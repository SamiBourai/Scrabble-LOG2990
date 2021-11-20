import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrableLog2990ModalComponent } from './scrable-log2990-modal.component';


describe('ScrableLog2990ModalComponent', () => {
    let component: ScrableLog2990ModalComponent;
    let fixture: ComponentFixture<ScrableLog2990ModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrableLog2990ModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScrableLog2990ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
