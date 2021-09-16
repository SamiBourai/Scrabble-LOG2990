import { Component } from '@angular/core';
import { ValidWorldService } from '@app/services/valid-world.service';
import { WordPointsService } from '@app/services/word-points.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(vws: ValidWorldService, pws: WordPointsService) {
        console.log('Valid mot component created');
        vws.load_dictionary().then(() => {
            if (vws.verify_word('whiskys')) {
                console.log('Mot existant');
                console.log(pws.points_word('whiskys'));
            } else {
                console.log('Mot inexistant');
            }
        });
    }
}
