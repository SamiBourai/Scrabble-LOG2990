import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import {
    CLOSE_SNACKBAR,
    COMMA,
    DATABASE_COLLECTION_VRNAMESBEG,
    DATABASE_COLLECTION_VRNAMESEXP,
    DATA_RESET_SUCCESFULLY,
    ENTER,
    ERROR_HTTP,
    FIFTH_NAME,
    FIRST_NAME,
    FOURTH_NAME,
    MAX_TIME_SNACKBAR,
    SECOND_NAME,
    SERVER_NOT_RESPONDING,
    SIXTH_NAME,
    THIRD_NAME,
} from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { ScoresService } from '@app/services/score/scores.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { Observable } from 'rxjs';
// import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) private fileInput: ElementRef<HTMLInputElement>;
    selectable = true;
    removableBeg = true;
    removableExp = true;
    addOnBlur = true;

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        public userService: UserService,
        public scoresService: ScoresService,
        private database: DatabaseService,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.getPlayersNamesBeg();
        this.getPlayersNamesExp();
    }
    resetBestScores() {}

    getPlayersNamesBeg() {
        const vrPlayerObs: Observable<VirtualPlayer[]> = this.database.getAllPlayers(DATABASE_COLLECTION_VRNAMESBEG);
        // this.userService.vrPlayerNamesBeginner
        vrPlayerObs.subscribe((data) => {
            this.userService.vrPlayerNamesBeginner[1] = data.map((e) => {
                return e.name;
            });
        });
    }

    getPlayersNamesExp() {
        const vrPlayerObs: Observable<VirtualPlayer[]> = this.database.getAllPlayers(DATABASE_COLLECTION_VRNAMESEXP);
        vrPlayerObs.subscribe((data) => {
            // code
        });
    }

    addNameVrToList(level: string) {
        if (level === 'beginner') {
            // code
        } else if (level === 'expert') {
            // code
        } else {
            return;
        }
    }

    onFileSelected() {
        // console.log('A', a);

        const files = this.fileInput.nativeElement.files;
        if (files === null) {
            return;
        }

        const reader = new FileReader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reader.onload = (e) => {
            const possibleResult = e.target?.result;
            if (typeof possibleResult === 'string') {
                console.log(ValidWordService.loadableDictToDict(JSON.parse(possibleResult)));
            }
        };
        reader.readAsText(files[0], 'UTF-8');
    }

    // getNames(): Observable<string[][]> {
    //     // return this.http.get();
    // }

    add(event: MatChipInputEvent, level: string): void {
        const value = (event.value || '').trim();
        // let array;
        if (level === 'beginner') {
            // array = this.userService.vrPlayerNamesBeginner[1];

            this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG, value);
            this.getPlayersNamesBeg();
            console.log('111');
        } else if (level === 'expert') {
            // array = this.userService.vrPlayerNamesExpert[1];
            this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP, value);
            console.log('33333');
        }
        console.log('je suis dans add');

        // Add our name
        // if (array !== undefined) {
        //     console.log('je suis dans le if');

        //     if (value) {

        //         array.push(value);
        //         if(level==='beginner') {
        //             console.log('je suis beg');

        //             this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG, value )
        //         }else if(level==='expert') {
        //             console.log('je suis expert');

        //             this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP, value )
        //         }
        //     }
        // }
        // Clear the input value
        event.chipInput?.clear();
    }

    remove(name: string, level: string): void {
        let array;
        if (level === 'beginner') {
            array = this.userService.vrPlayerNamesBeginner[1];
        } else if (level === 'expert') {
            array = this.userService.vrPlayerNamesExpert[1];
        }

        // remove our name
        if (array !== undefined) {
            const index = array.indexOf(name);

            if (index >= 0) {
                array.splice(index, 1);
            }
        }
    }

    resetDictionaries() {
        console.log('Dictionnaires reset!');
    }

    resetVPNames() {
        this.userService.vrPlayerNamesBeginner = [[FIRST_NAME, SECOND_NAME, THIRD_NAME], []];
        this.userService.vrPlayerNamesExpert = [[FOURTH_NAME, FIFTH_NAME, SIXTH_NAME], []];
    }

    setResetData(): void {
        this.scoresService.isUserResetData = true;
        this.scoresService.getIsUserResetDataObs.next(this.scoresService.isUserResetData);
        console.log('button reset a ete cliquer : ', this.scoresService.isUserResetData);
    }

    resetScores(collectionName: string): void {
        const scores: Observable<Score[]> = this.database.resetAllScores(collectionName);
        scores.subscribe(
            () => {
                this.openSnackBar(DATA_RESET_SUCCESFULLY, CLOSE_SNACKBAR);
            },
            (rejected: number) => {
                this.openSnackBar(ERROR_HTTP + rejected + SERVER_NOT_RESPONDING, CLOSE_SNACKBAR);
            },
        );
    }
    private openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, { duration: MAX_TIME_SNACKBAR });
    }
    private addPlayerToDatabase(collectionName: string, player: string): void {
        const addPlayerObs: Observable<number> = this.database.sendPlayer(collectionName, player);
        console.log('add function');
        addPlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
        });

        // this.database.sendPlayer(collectionName, player);
        console.log('apres add fucntion');
    }
}
