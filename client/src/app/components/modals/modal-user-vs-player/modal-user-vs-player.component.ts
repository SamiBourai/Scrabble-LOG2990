import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-user-vs-player',
    templateUrl: './modal-user-vs-player.component.html',
    styleUrls: ['./modal-user-vs-player.component.scss'],
})
export class ModalUserVsPlayerComponent {
    @ViewChild('divX') divX:ElementRef<HTMLDivElement>
    isUserReturnToMenu:boolean;
    // isUserClickOnGiveUp:string="0";
    constructor(public userService: UserService, public timeService: TimeService) {
    }

    getNameFromLocalStorage() {
        return localStorage.getItem('userName');
    }
    setIsUserQuitGame():void{
        this.userService.isUserQuitGame=false;
    }




    // @HostListener('document.click', ['$event.target'])
    // setDivToHidden():void{
    //     this.divX.nativeElement.hidden=false;
    // }

}
