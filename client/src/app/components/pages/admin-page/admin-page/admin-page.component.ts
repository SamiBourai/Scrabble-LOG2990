import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import {
    COMMA,
    DATABASE_COLLECTION_VRNAMESBEG,
    DATABASE_COLLECTION_VRNAMESEXP,
    ENTER,
    FIFTH_NAME,
    FIRST_NAME,
    FOURTH_NAME,
    SECOND_NAME,
    SIXTH_NAME,
    THIRD_NAME,
} from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
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
    change = true;
    addOnBlur = true;

    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    arrayOfDictionnaries:string[] = [];
    errorMessage:boolean = false;

    constructor(public userService: UserService, private database: DatabaseService) {}

    ngOnInit(): void {
        this.getPlayersNamesBeg();
        this.getPlayersNamesExp();
    }

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
            this.userService.vrPlayerNamesExpert[1] = data.map((e) => {
                return e.name;
            });
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
            let possibleResult = e.target?.result;
            if (typeof possibleResult === 'string') {
                //console.log(ValidWordService.loadableDictToDict(JSON.parse(possibleResult)));
                ValidWordService.loadableDictToDict(JSON.parse(possibleResult))
                this.arrayOfDictionnaries.push(possibleResult as string);
                console.log(this.arrayOfDictionnaries);
            }
        };

        reader.readAsText(files[0], 'UTF-8');
    }


    add(event: MatChipInputEvent, level: string): void {
        const value = (event.value || '').trim();
        // let array;
        if (level === 'beginner') {
            if (this.verifyValidity(value)) this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG, value);
            this.getPlayersNamesBeg();
        } else if (level === 'expert') {
            if (this.verifyValidity(value)) this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP, value);
            this.getPlayersNamesExp();
        }
        console.log('je suis dans add');
        // Clear the input value
        event.chipInput?.clear();
    }

    remove(name: string, level: string): void {
        if (level === 'beginner') {
            this.removePlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG, name);
            this.getPlayersNamesBeg();
        } else if (level === 'expert') {
            this.removePlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP, name);
            this.getPlayersNamesExp();
        }
    }

    resetDictionaries() {
        console.log('Dictionnaires reset!');
    }

    resetVPNames() {
         this.userService.vrPlayerNamesBeginner = [[FIRST_NAME, SECOND_NAME, THIRD_NAME], []];
         this.userService.vrPlayerNamesExpert = [[FOURTH_NAME, FIFTH_NAME, SIXTH_NAME], []];
        this.removeAllPlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG);
        this.removeAllPlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP);
    }

    private addPlayerToDatabase(collectionName: string, player: string): void {
        const addPlayerObs: Observable<number> = this.database.sendPlayer(collectionName, player);
        console.log('add function');
        addPlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
        console.log('apres add fucntion');
    }

    private removePlayerToDatabase(collectionName: string, player: string): void {
        const removePlayerObs = this.database.removePlayer(collectionName, player);
        console.log('remove function');
        removePlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
        console.log('apres remove fucntion');
    }

    private removeAllPlayerToDatabase(collectionName: string): void {
        const removeAllPlayerObs = this.database.removeAllPlayer(collectionName);
        console.log('remove function');
        removeAllPlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
        console.log('apres remove fucntion');
    }

    private verifyValidity(name: string): boolean {
        const isNameInBeginnerArray =
            this.userService.vrPlayerNamesBeginner[0].includes(name) || this.userService.vrPlayerNamesBeginner[1].includes(name);
        const isNameInExpertArray = this.userService.vrPlayerNamesExpert[0].includes(name) || this.userService.vrPlayerNamesExpert[1].includes(name);
        if (this.userService.vrPlayerNamesBeginner[1].length > 0) {
            if (isNameInBeginnerArray || isNameInExpertArray){
                this.errorMessage = true;
                return false;
            }
            this.errorMessage = false;
            return true;
        }
        return true;
    }
}
