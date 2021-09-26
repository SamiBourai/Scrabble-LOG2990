import { UserService } from '@app/services/user.service';
import { MessageService } from '@app/services/message.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import SpyObj = jasmine.SpyObj;

fdescribe('SidebarComponent', () => {
    let messageServiceSpy: SpyObj<MessageService>;
    let userServiceSpy: SpyObj<UserService>;
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(() => {
        
        messageServiceSpy = jasmine.createSpyObj('MessageServiceSpy', ['isCommand', 'containsSwapCommand', 'isValid', 
         'isSubstring','debugCommand','containsPlaceCommand']);

         userServiceSpy = jasmine.createSpyObj('UserServiceSpy',['skipTurnValidUser'])
        
      });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [{ provide: MessageService, useValue: messageServiceSpy }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call the methods of messageService', () => {

        component.logMessage();
        expect(messageServiceSpy.isCommand).toHaveBeenCalled();
        expect(messageServiceSpy.isValid).toHaveBeenCalled();
        expect(messageServiceSpy.containsPlaceCommand).toHaveBeenCalled();
        expect(messageServiceSpy.isSubstring).toHaveBeenCalled();

    });

    


});
