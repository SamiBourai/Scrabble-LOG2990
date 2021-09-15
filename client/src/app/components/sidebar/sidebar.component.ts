import { MessageValidators } from './message.validators';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    get Message() {
        return this.form.get('message');
    }
    logMessage() {
        console.log()
        if(this.Message?.errors?.commandOrChat && !this.Message?.errors?.isValid ) window.alert("votre commande n'est pas valide")
        else this.messageY.push(this.typeArea);
        // eslint-disable-next-line no-console
        console.log(this.messageY);
        this.typeArea = '';
    }
}
