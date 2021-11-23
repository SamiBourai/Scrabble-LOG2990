import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
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
import { ScoresService } from '@app/services/score/scores.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { Observable } from 'rxjs';
import { DictionaryPresentation, LoadableDictionary } from './../../../../classes/dictionary';
import { DialogBoxComponent } from '@app/components/modals/dialog-box/dialog-box.component';
import fileDownload from 'file-saver';

const ELEMENT_DATA: DictionaryPresentation[] = [{ title: 'dictionnaire principal', description: 'le dictionnaire par defaut' }];
@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<unknown>;
    @ViewChild('fileInput', { static: false }) private fileInput: ElementRef<HTMLInputElement>;
    selectable = true;
    removableBeg = true;
    removableExp = true;
    change = true;
    addOnBlur = true;
    displayedColumns: string[] = ['titre', 'description', 'modifier', 'telecharger', 'supprimer'];
    dataSource = ELEMENT_DATA;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    arrayOfDictionnaries: LoadableDictionary[] = [];
    errorMessage: boolean = false;

    index = 0;

    constructor(
        public userService: UserService,
        public database: DatabaseService,
        private snackBar: MatSnackBar,
        public scoresService: ScoresService,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.getPlayersNamesBeg();
        this.getPlayersNamesExp();
        this.getDictionaries();
    }

    openDialog(action: string, obj: DictionaryPresentation) {
        obj.action = action;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '250px',
            data: obj,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === 'modifier') {
                this.updateRowData(result.data);
            }
        });
    }

    updateRowData(newDic: DictionaryPresentation) {
        this.dataSource = this.dataSource.filter((value) => {
            if (value.title === newDic.title || value.description === newDic.description) {
                console.log(value);
                value.description = newDic.description;
                value.title = newDic.title;
                this.table.renderRows();
            }

            return true;
        });
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
            this.userService.vrPlayerNamesExpert[1] = data.map((e) => {
                return e.name;
            });
        });
    }

    getDictionaries() {
        const dictionaryObs: Observable<LoadableDictionary[]> = this.database.getMetaDictionary();
        dictionaryObs.subscribe((data) => {
            data.forEach((dic) => {
                this.dataSource.push({ title: dic.title, description: dic.description });
            });
        });
        this.table.renderRows();
    }

    deleteDic(dictionary: LoadableDictionary) {
        this.database.deleteDictionary(dictionary).subscribe(() => {
            const index = this.dataSource.indexOf({ title: dictionary.title, description: dictionary.description });
            this.dataSource.splice(index, 1);
            this.table.renderRows();
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

    setToArrayString(tab: Set<string>[]) {
        const strArray = [];
        for (const element of tab) {
            for (const item of element) {
                strArray.push(item);
            }
        }
        return strArray;
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
                const dictionnary = ValidWordService.loadableDictToDict(JSON.parse(possibleResult));
                this.arrayOfDictionnaries.push(dictionnary as unknown as LoadableDictionary);
                console.log(this.isSameDictionnaryName(dictionnary.title));

                if (!this.isSameDictionnaryName(dictionnary.title)) {
                    this.dataSource.push({ title: dictionnary.title, description: dictionnary.description });
                    this.database
                        .sendDictionary({
                            title: dictionnary.title,
                            description: dictionnary.description,
                            words: this.setToArrayString(dictionnary.words),
                        } as unknown as LoadableDictionary)
                        .subscribe((reject: number) => {
                            console.log('rejected', reject);
                        });
                } else {
                    this.snackBar.open('Ce nom est deja utilise', 'Close');
                }
                this.table.renderRows();
            }
        };

        reader.readAsText(files[0], 'UTF-8');
    }

    download(dictionnary: LoadableDictionary) {
        this.database.getDictionary(dictionnary.title).subscribe((dic: LoadableDictionary) => {
            const strDictionnary = JSON.stringify(dic);

            const blob = new Blob([strDictionnary as unknown as ArrayBuffer], { type: 'text/json; charset=utf-8' });

            fileDownload.saveAs(blob, dic.title + '.json');
        });
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
        this.database.deleteAllDictionaries().subscribe(() => {
            console.log(this.dataSource.length);
            this.dataSource.splice(1);
            this.table.renderRows();
        });
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
            if (isNameInBeginnerArray || isNameInExpertArray) {
                this.snackBar.open('Ce nom est deja dans la liste', 'Close');
                return false;
            }

            return true;
        }
        return true;
    }

    private isSameDictionnaryName(name: string) {
        const dictionnatyNames: string[] = [];
        for (const dic of this.dataSource) {
            dictionnatyNames.push(dic.title);
        }

        if (!dictionnatyNames.includes(name)) return false;
        return true;
    }
}


