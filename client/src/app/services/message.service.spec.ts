import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

fdescribe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // test for isCommand
    it('it should confirm that string possess an !', () => {
        const text = '!bonjour';
        expect(service.isCommand(text)).toBeTrue();
    });

    it('it should confirm that string dont possess an !', () => {
        const text = 'bonjour';
        expect(service.isCommand(text)).toBeFalse();
    });

    it('it should confirm that its valid only if the ! is at the fisrt position', () => {
        const text = 'bonjour!';
        expect(service.isCommand(text)).toBeFalse();
    });

    // test for containsPlaceCommand
    it('confirm that a command contains the substring !placer return true', () => {
        const command = '!placer h12h mot';
        expect(service.containsPlaceCommand(command)).toBeTrue();
    });

    it('confirm that a command that not contains the substring !placer return false', () => {
        const command = 'placer h12h mot';
        expect(service.containsPlaceCommand(command)).toBeFalse();
    });

    // test for containsSwapCommand
    it('confirm that a command contains the substring !echanger return true', () => {
        const command = '!echanger as';
        expect(service.containsSwapCommand(command)).toBeTrue();
    });

    it('confirm that a command that not contains the substring !echanger return false', () => {
        const command = 'echanger as';
        expect(service.containsSwapCommand(command)).toBeFalse();
    });

    // test for isInside
    it('confirm that the given command is inside the array of commands', () => {
        const command = '!passer';
        const arrayOfCommands = ['!passer', '!aide', '!debug'];
        expect(service.isInside(command, arrayOfCommands)).toBeTrue();
    });

    it('confirm that the given command who is not inside the array of commands returns false', () => {
        const command = '!marouane';
        const arrayOfCommands = ['!passer', '!aide', '!debug'];
        expect(service.isInside(command, arrayOfCommands)).toBeFalse();
    });

    it('confirm that the given command who is not inside the array of commands but looks like to one char returns false', () => {
        const command = '!passerr';
        const arrayOfCommands = ['!passer', '!aide', '!debug'];
        expect(service.isInside(command, arrayOfCommands)).toBeFalse();
    });

    // test for placeCommand
    it('it should return the parameters of the place command inside an array. PS:the column is > 10', () => {
        const command = '!placer h12h mot';

        expect(service.placeCommand(command)).toEqual([{ word: 'mot', position: { x: 12, y: 8 }, direction: 'h' }]);
    });

    it('it should return the parameters of the place command inside an array. PS:the column < 10', () => {
        const command = '!placer a2v mot';

        expect(service.placeCommand(command)).toEqual([{ word: 'mot', position: { x: 2, y: 1 }, direction: 'v' }]);
    });

    it('confirm that if the parameters of the place command are out of the grid(here the line not between a and o), the return array is empty', () => {
        const command = '!placer q1h mot';

        expect(service.placeCommand(command)).toEqual([]);
    });

    it('confirm that if the parameters of the place command are out of the grid(here the column not between 1 and 15), the return array is empty', () => {
        const command = '!placer a18h mot';

        expect(service.placeCommand(command)).toEqual([]);
    });

    it('confirm that if the parameters of the place command are out of the grid(here the orientation not h or v), the return array is empty', () => {
        const command = '!placer a1g mot';

        expect(service.placeCommand(command)).toEqual([]);
    });

    it('confirm that if the parameters of the place command are out of the grid(here the word is null), the return array is empty', () => {
        const command = '!placer a1g ';

        expect(service.placeCommand(command)).toEqual([]);
    });

    // test for isValid
    it('confirm if the command is valid when it contains the command place and the parameters are valid ', () => {
        const command = '!placer a1h mot';
        spyOn(service, 'isCommand').and.callFake(() => {
            return true;
        });
        spyOn(service, 'containsPlaceCommand').and.callFake(() => {
            return true;
        });
        expect(service.isValid(command)).toBeTrue();
        // expect(spy).toHaveBeenCalled();
        // expect(service.containsPlaceCommand(command)).toBeTrue()
        // expect(command.length != PLACE_LENGTH).toBeTrue();
    });

    it('confirm if the command is valid when it contains the swap command with the valid parameters', () => {
        const command = '!echanger as ';
        spyOn(service, 'isCommand').and.callFake(() => {
            return true;
        });
        spyOn(service, 'containsPlaceCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'containsSwapCommand').and.callFake(() => {
            return true;
        });
        expect(service.isValid(command)).toBeTrue();
    });

    it('confirm if the command is valid when the command is !debug, !aide, !passer', () => {
        const command = '!debug';
        spyOn(service, 'isCommand').and.callFake(() => {
            return true;
        });
        spyOn(service, 'containsPlaceCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'containsSwapCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isInside').and.callFake(() => {
            return true;
        });
        expect(service.isValid(command)).toBeTrue();
    });

    it('confirm if the command is valid when its not a command', () => {
        const command = 'message';
        spyOn(service, 'isCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'containsPlaceCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'containsSwapCommand').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isInside').and.callFake(() => {
            return false;
        });
        expect(service.isValid(command)).toBeTrue();
    });

    it('confirm if the command is invalid when the command dont correspond to a existant command', () => {
        const command = '!commande';
        expect(service.isValid(command)).toBeFalse();
    });

    // test for debugCommand
});
