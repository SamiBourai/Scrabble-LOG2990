import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-modal-user-vs-player',
  templateUrl: './modal-user-vs-player.component.html',
  styleUrls: ['./modal-user-vs-player.component.scss']
})
export class ModalUserVsPlayerComponent implements OnInit {

  constructor(public userService:UserService) { }

  ngOnInit(): void {
    //   this.userService.chooseFirstToPlay();
    
  }
  getNameFromLocalStorage() {
    return localStorage.getItem('userName');
  }
}
