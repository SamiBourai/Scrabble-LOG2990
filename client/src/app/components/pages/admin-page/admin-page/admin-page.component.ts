import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { DialogBoxComponent } from '@app/components/modals/dialog-box/dialog-box.component';
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
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { DictionaryPresentation, LoadableDictionary } from './../../../../classes/dictionary';

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
        // public scoresService: ScoresService,
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

    updateRowData(element: DictionaryPresentation) {
        const minusOne = -1;
        let oldName = localStorage.getItem('dic') as string;
        oldName = oldName.slice(1, minusOne);
        const tableName: DictionaryPresentation[] = [];

        this.dataSource = this.dataSource.filter((value) => {
            if (value.title === element.title || value.description === element.description) {
                if (!this.isSameDictionnaryName(value.title, tableName)) {
                    for (const i of this.dataSource) {
                        tableName.push(i);
                    }

                    const dictionaryObs: Observable<LoadableDictionary> = this.database.getDictionary(element.title, oldName);

                    dictionaryObs.subscribe((data) => {
                        const dictionary = ValidWordService.loadableDictToDict(data);
                        dictionary.title = value.title;
                        dictionary.description = value.description;

                        this.database
                            .sendDictionary({
                                title: dictionary.title,
                                description: dictionary.description,
                                words: this.setToArrayString(dictionary.words),
                            } as unknown as LoadableDictionary)
                            .subscribe();
                        this.table.renderRows();
                    });
                } else {
                    element.title = oldName;
                    this.snackBar.open('Ce nom est deja utilisé', 'Close');
                }
            }

            return true;
        });
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
        const files = this.fileInput.nativeElement.files;
        if (files === null) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const possibleResult = e.target?.result as string;
            if (this.validateJson(possibleResult) && typeof possibleResult === 'string') {
                const dictionnary = ValidWordService.loadableDictToDict(JSON.parse(possibleResult));
                this.arrayOfDictionnaries.push(dictionnary as unknown as LoadableDictionary);
                this.snackBar.open('Téléversement réussi', 'Close');

                if (!this.isSameDictionnaryName(dictionnary.title, this.dataSource)) {
                    this.dataSource.push({ title: dictionnary.title, description: dictionnary.description });
                    this.database
                        .sendDictionary({
                            title: dictionnary.title,
                            description: dictionnary.description,
                            words: this.setToArrayString(dictionnary.words),
                        } as unknown as LoadableDictionary)
                        .subscribe();
                } else {
                    this.snackBar.open('Ce nom est deja utilisé', 'Close');
                }
                this.table.renderRows();
            } else {
                this.snackBar.open('Veuillez séléctionner un fichier JSON', 'Close');
            }
        };

        reader.readAsText(files[0], 'UTF-8');
    }

    download(dictionnary: LoadableDictionary) {
        this.database.getDictionary(dictionnary.title).subscribe((dic: LoadableDictionary) => {
            const strDictionnary = JSON.stringify(dic);
            const blob = new Blob([strDictionnary as unknown as ArrayBuffer], { type: 'text/json; charset=utf-8' });
            saveAs(blob, dic.title + '.json');
        });
    }

    add(event: MatChipInputEvent, level: string): void {
        const value = (event.value || '').trim();
        if (level === 'beginner') {
            if (this.verifyValidity(value)) this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESBEG, value);
            this.getPlayersNamesBeg();
        } else if (level === 'expert') {
            if (this.verifyValidity(value)) this.addPlayerToDatabase(DATABASE_COLLECTION_VRNAMESEXP, value);
            this.getPlayersNamesExp();
        }
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
        this.database.deleteAllDictionaries().subscribe(() => {
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

    setResetData(): void {
        this.userService.isUserResetData = true;
        this.userService.getIsUserResetDataObs.next(this.userService.isUserResetData);
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

    private removePlayerToDatabase(collectionName: string, player: string): void {
        const removePlayerObs = this.database.removePlayer(collectionName, player);
        removePlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
    }

    private removeAllPlayerToDatabase(collectionName: string): void {
        const removeAllPlayerObs = this.database.removeAllPlayer(collectionName);
        removeAllPlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
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

    private isSameDictionnaryName(name: string, tableName: DictionaryPresentation[]) {
        const dictionnatyNames: string[] = [];
        for (const dic of tableName) {
            dictionnatyNames.push(dic.title);
        }
        if (!dictionnatyNames.includes(name)) return false;
        return true;
    }

    private validateJson(data: string) {
        try {
            JSON.parse(data);
        } catch {
            return false;
        }
        return true;
    }
    private addPlayerToDatabase(collectionName: string, player: string): void {
        const addPlayerObs: Observable<number> = this.database.sendPlayer(collectionName, player);
        addPlayerObs.subscribe(() => {
            this.getPlayersNamesBeg();
            this.getPlayersNamesExp();
        });
    }

    private openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, { duration: MAX_TIME_SNACKBAR });
    }
}
