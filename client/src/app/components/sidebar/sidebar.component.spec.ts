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
          letterServiceSpy = jasmine.createSpyObj('letterServiceSpy',['changeLetterFromReserve','wordInEasel','laceLettersInScrable','wordIsPlacable'])
        
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

    it('verify that arrayOfMessages is pushing', () => {

        component.arrayOfMessages = [];
        
        spyOn(component,'isYourTurn').and.callFake(() => {
            return true;
        });
        messageServiceSpy.isSubstring.and.callFake(() => {
            return false;
        });
        component.logMessage()
        
        expect(component.arrayOfMessages).toHaveSize(1);

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
    
    it('verify that isSkipButtonClicked return true when the bouton is pressed', () => {
        messageServiceSpy.skipTurnIsPressed = true;
        expect(component.isSkipButtonClicked()).toBeTrue();
    });

    it('verify that isSkipButtonClicked return false when the bouton is not pressed', () => {
        messageServiceSpy.skipTurnIsPressed = false;
        expect(component.isSkipButtonClicked()).toBeFalse();
    });

    //test logDebug

    it('verify that if the debugCommand method return true logDebug do the same', () => {

        messageServiceSpy.debugCommand.and.callFake(() => {
            return true;
        })
        expect(component.logDebug()).toBeTrue()
    });

    it('verify that if the debugCommand method return false logDebug do the same', () => {

        messageServiceSpy.debugCommand.and.callFake(() => {
            return false;
        });
        expect(component.logDebug()).toBeFalse()
    });


    //test for isYourTurn
    it('verify that if the skipTurnValidUser return true isYourTurn do the same', () => {

       userServiceSpy.skipTurnValidUser.and.callFake(() => {
           return true;
       });

       expect(component.isYourTurn()).toBeTrue();

    });

    it('verify that if the skipTurnValidUser return false isYourTurn do the same', () => {

        userServiceSpy.skipTurnValidUser.and.callFake(() => {
            return false;
        });
 
        expect(component.isYourTurn()).toBeFalse();
 
     });

     // test getLettersFromChat

    //  it('test qui va sauter', () => {

    //     component.firstTurn = true;
    //     messageServiceSpy.command.column = 8;
    //     messageServiceSpy.command.column = parseInt(messageServiceSpy.command.line);
    //     component.getLettersFromChat()
    //     expect(component.firstTurn).toBeTrue()
 
    //  });

















    


    


});
