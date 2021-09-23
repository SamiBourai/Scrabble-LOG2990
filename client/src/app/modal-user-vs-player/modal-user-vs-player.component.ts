import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-user-vs-player',
    templateUrl: './modal-user-vs-player.component.html',
    styleUrls: ['./modal-user-vs-player.component.scss'],
})
export class ModalUserVsPlayerComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
    getNameFromLocalStorage() {
        return localStorage.getItem('userName');
    }
}
