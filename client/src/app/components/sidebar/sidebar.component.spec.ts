import { UserService } from '@app/services/user.service';
import { MessageService } from '@app/services/message.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import SpyObj = jasmine.SpyObj;
import { LettersService } from '@app/services/letters.service';


fdescribe('SidebarComponent', () => {
    let messageServiceSpy: SpyObj<MessageService>;
    let letterServiceSpy: SpyObj<LettersService>;
    let userServiceSpy: SpyObj<UserService>;
    //let letterService: LettersService;
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    //let messageService:MessageService;

    beforeEach(() => {
        
        messageServiceSpy = jasmine.createSpyObj('MessageServiceSpy', ['isCommand', 'containsSwapCommand', 'isValid', 
         'isSubstring','debugCommand','containsPlaceCommand','swapCommand']);

         userServiceSpy = jasmine.createSpyObj('UserServiceSpy',['detectSkipTurnBtn', 'getNameCurrentPlayer','getUserName','skipTurnValidUser'])
          letterServiceSpy = jasmine.createSpyObj('letterServiceSpy',['changeLetterFromReserve'])
        
      });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [{ provide: MessageService, useValue: messageServiceSpy }, { provide: LettersService, useValue:letterServiceSpy}, { provide: UserService, useValue:userServiceSpy} ]
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

    it('should call the methods of messageService and the the method getNameCurrentPlayer', () => {

        let spy = spyOn(component,'getNameCurrentPlayer')
        component.logMessage();
        expect(messageServiceSpy.isCommand).toHaveBeenCalled();
        expect(messageServiceSpy.isValid).toHaveBeenCalled();
        expect(messageServiceSpy.containsPlaceCommand).toHaveBeenCalled();
        expect(messageServiceSpy.isSubstring).toHaveBeenCalled();
        
        
        expect(spy).toHaveBeenCalled()

    });

    it('should call the method getLetterFromChat', () => {

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() =>{
            return true;
        })

        messageServiceSpy.containsPlaceCommand.and.callFake(() => {
            return true
        });

        spyOn(component,'isYourTurn').and.callFake(() => {
            return true
        });
        const spy = spyOn(component,'getLettersFromChat')
        
        component.logMessage();
        expect(spy).toHaveBeenCalled();
        expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();

        
    });

    it('should call the method changeLetterFromReserve', () => {

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() =>{
            return true;
        })

        messageServiceSpy.containsSwapCommand.and.callFake(() => {
            return true
        });

        spyOn(component,'isYourTurn').and.callFake(() => {
            return true
        });
        
        
        component.logMessage();
        expect(letterServiceSpy.changeLetterFromReserve).toHaveBeenCalled()
        
    });


    it('verify that boolean skipTurn isImpossible are set to true', () => {
        
        spyOn(component,'isYourTurn').and.callFake(() => {
            return false;
        });
        messageServiceSpy.isSubstring.and.callFake(() => {
            return true;
        });
        component.logMessage()
        
        expect(component.skipTurn).toBeTrue();
        expect(component.isImpossible).toBeTrue();


    });

    it('verify that detectSkipTurnBtn has been called when typeArea = !passer', () => {
        
        spyOn(component,'isYourTurn').and.callFake(() => {
            return true
        });
        component.typeArea = '!passer'
        component.logMessage();
        expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();
    });


    //test isSkipButtonClicked
    
    // it('', () => {
        
    //     spyOn(component,'isYourTurn').and.callFake(() => {
    //         return true
    //     });
    //     component.typeArea = '!passer'
    //     component.logMessage();
    //     expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();
    // });









    


    


});
