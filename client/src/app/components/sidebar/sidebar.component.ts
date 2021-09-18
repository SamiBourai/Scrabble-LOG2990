// import { MessageService } from './../../message.service';

import { MessageValidators } from './message.validators';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from '@app/message.service';
// import { Parameter } from '@app/classes/parameter';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    messageY: string[] = [];
    typeArea: string = '';
    form = new FormGroup({
        message: new FormControl('', [MessageValidators.isValid, MessageValidators.commandOrChat]),
    });
    // parameter:Parameter;

    constructor(private m:MessageService){

    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    get Message() {
        return this.form.get('message');
    }
    logMessage() {
        
        if(this.Message?.errors?.commandOrChat && !this.Message?.errors?.isValid ) window.alert("votre commande n'est pas valide")
        else this.messageY.push(this.typeArea);
            
        // test que les parametres des commandes sont biens recuperes
        let placer = this.m.commandPlacer(this.typeArea);
        let echanger = this.m.commandEchanger(this.typeArea)
        console.log(placer);
        console.log(echanger);
         
        // console.log(this.getParameter())
        console.log(this.messageY);
        
        this.typeArea = '';
    }


    logDebug(){
        return this.m.commandDebug(this.typeArea)
    }

    


}

