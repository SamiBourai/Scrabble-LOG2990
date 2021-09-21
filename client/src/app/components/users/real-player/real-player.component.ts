import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Chronometer } from 'ngx-chronometer';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {
    // ici nous avons pas le choix que de declarer name as any, car local storage retourne string | null
    // alors ici on deux option : c'est soit on
    // Set strictNullChecks=false in tsconfig.json.
    // Declare your variable type as any

    name: unknown;
    roundTime: string = '1 min';
    turnToplay: string = 'Premier à jouer';
    score: number = 0;
    chronometer: Chronometer;
    counter: { min: number; sec: number };
    constructor(public userService: UserService) {}

    ngOnInit(): void {
        this.userService.startTimer();
    }

    getUserName() {
        this.name = localStorage.getItem('userName');
        return this.name;
    }
}
