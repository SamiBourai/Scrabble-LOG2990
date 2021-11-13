import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Score } from '@app/classes/score';
import { DATABASE_COLLECTION_CLASSIC } from '@app/constants/constants';
// import { DATABASE_COLLECTION_CLASSIC } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { Observable } from 'rxjs';
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
    selector: 'app-modal-scores',
    templateUrl: './modal-scores.component.html',
    styleUrls: ['./modal-scores.component.scss'],
})
export class ModalScoresComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['position','name', 'score'];
    arrayOfNumber:number[]=[1,2,4,3,4,5,6,7]
    dataSource=ELEMENT_DATA;

    arrayOfScoresClassicMode: Score[];

    arrayOfScoresLog2990Mode: any;
    constructor(private databaseService: DatabaseService) {}

    ngOnInit(): void {
        // this.getScores(DATABASE_COLLECTION_CLASSIC);
        // console.log(this.arrayOfScoresClassicMode);

        // this.arrayOfScoresLog2990Mode=this.getScores(DATABASE_COLLECTION_LOG2990);
        // console.log(this.arrayOfScoresLog2990Mode);

    }
    ngAfterViewInit():void{
        this.getScores(DATABASE_COLLECTION_CLASSIC);

    }

    getScores(collectionName:string):void {
        const scores: Observable<Score[]> = this.databaseService.getAllScores(collectionName);
        scores.subscribe((data) => {
            // console.log(data[0]);
            this.arrayOfScoresClassicMode= data.map((score)=>{
                return {name:score.name, score:score.score}
                // this.arrayOfScoresClassicMode.push({name:score.name, score:score.score });
            });
        });
        // this.dataSource = this.arrayOfScoresClassicMode;
        console.log('salut: ',this.arrayOfScoresClassicMode);
    }

}
