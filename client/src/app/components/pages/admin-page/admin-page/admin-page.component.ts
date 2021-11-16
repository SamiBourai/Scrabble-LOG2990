import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, FIFTH_NAME, FIRST_NAME, FOURTH_NAME, SECOND_NAME, SIXTH_NAME, THIRD_NAME } from '@app/constants/constants';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
// import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    @ViewChild('fileInput', { static: false }) private fileInput: ElementRef<HTMLInputElement>;
    selectable = true;
    removableBeg = true;
    removableExp = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // eslint-disable-next-line @typescript-eslint/member-ordering

    constructor(public userService: UserService) {}
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
        let array;
        if (level === 'beginner') {
            array = this.userService.vrPlayerNamesBeginner[1];
        } else if (level === 'expert') {
            array = this.userService.vrPlayerNamesExpert[1];
        }

        // Add our name
        if (array !== undefined) {
            if (value) {
                array.push(value);
            }
        }
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
}
