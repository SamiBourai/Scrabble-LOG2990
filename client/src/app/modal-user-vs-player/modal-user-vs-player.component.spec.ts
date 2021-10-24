// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ModalUserNameComponent } from '@app/modal-user-name/modal-user-name.component';
// import { AppMaterialModule } from '@app/modules/material.module';

// describe('ModalUserNameComponent', () => {
//     let component: ModalUserNameComponent;
//     let fixture: ComponentFixture<ModalUserNameComponent>;
//     const mockDialogRef = {
//         open: jasmine.createSpy('open'),
//     };

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [AppMaterialModule, BrowserAnimationsModule],
//             declarations: [ModalUserNameComponent],
//             providers: [{ provide: MatDialog, useValue: mockDialogRef }],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ModalUserNameComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should open on openDialogOfVrUser', () => {
//         component.openDialogOfVrUser();
//         expect(mockDialogRef.open).toHaveBeenCalled();
//     });

//     it('should pass on storeNameInLocalStorage', () => {
//         const storeNameInLocalStorageSpy = spyOn(component, 'storeNameInLocalStorage').and.callThrough();
//         component.storeNameInLocalStorage();
//         expect(storeNameInLocalStorageSpy).toHaveBeenCalled();
//     });
// });
