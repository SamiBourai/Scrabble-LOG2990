// import { MessageService } from './../../message.service';

import { MessageValidators } from './message.validators';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
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
    isValid: boolean = true;
    form = new FormGroup({
        message: new FormControl('', [MessageValidators.isValid, MessageValidators.commandOrChat]),
    });
    // parameter:Parameter;

    constructor(private m:MessageService, cd :ChangeDetectorRef){

    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    get Message() {
        return this.form.get('message') as AbstractControl
    }
    logMessage() {

        let placer = this.m.commandPlacer(this.typeArea);

        //console.log(placer.length)
        
        let echanger = this.m.commandEchanger(this.typeArea);
        
        if((this.Message?.errors?.commandOrChat && !this.Message?.errors?.isValid ) || (placer.length == 0 && !this.Message?.errors?.isValid )  ) this.isValid = false  //window.alert("votre commande n'est pas valide")
        else this.messageY.push(this.typeArea);
            
        // test que les parametres des commandes sont biens recuperes
       
        
        console.log(placer);
        console.log(echanger);

        if(echanger){
            this.isValid = true;
        }
        if(!this.Message?.errors?.commandOrChat){
            this.isValid = true;
            this.messageY.push(this.typeArea)
        }
        else if( placer.length == 0 && !this.typeArea.includes('!debug') && !this.typeArea.includes('!echanger') && !this.typeArea.includes('!aide') && (!this.messageY[this.messageY.length-1].includes('!echanger') || !this.messageY[this.messageY.length-1].includes('!placer') || !this.messageY[this.messageY.length-1].includes('!') ) ){

            this.isValid = false;
            this.messageY.pop()
            
        }
        // console.log(this.getParameter())
        console.log(this.messageY);
        
        this.typeArea = '';
        
    }
    
    logDebug(){
        return this.m.commandDebug(this.typeArea)
    }


}

