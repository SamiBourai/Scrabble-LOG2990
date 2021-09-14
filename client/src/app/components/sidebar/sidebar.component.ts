import { Component } from '@angular/core';
import { ValidWorldService } from '@app/services/valid-world.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(vws: ValidWorldService) {
        console.log('Valid mot component created');
        vws.load_dictionary().then(() => {
            if (vws.verify_word('tableeeee')) {
                console.log('Mot existant');
            } else {
                console.log('Mot inexistant');
            }
        });
    }
}
