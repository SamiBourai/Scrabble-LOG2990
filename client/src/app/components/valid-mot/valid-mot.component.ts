import { Component } from '@angular/core';
import { ValidWorldService } from '@app/services/valid-world.service';

@Component({
    selector: 'app-valid-mot',
    templateUrl: './valid-mot.component.html',
    styleUrls: ['./valid-mot.component.scss'],
})
export class ValidMotComponent {
    constructor(vws: ValidWorldService) {
        console.log('Valid mot component created');
        vws.load_dictionary();
    }
}
