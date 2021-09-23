import { Component, OnInit } from '@angular/core';
import { Chronometer } from 'ngx-chronometer';

@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit {
    name: string = 'sami';
    level: string = 'Débutant';
    round: string = '1 min';
    score: number = 0;
    turnToPplay: string;
    chronometer: Chronometer;

    ngOnInit(): void {
        this.name = this.chooseRandomName();
    }

    chooseRandomName(): string {
        const vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];
        let randomInteger = 0;

        while (true) {
            randomInteger = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            if (vrPlayerNames[randomInteger] === localStorage.getItem('userName')) {
                continue;
            } else break;
        }
        return vrPlayerNames[randomInteger];
    }
    pickRandomLetter(): string[] {
        return ['a', 'b', 'c', 'd', 'e', 'f', '7'];
    }

}
