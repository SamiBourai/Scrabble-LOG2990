import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameManagementService {
   public isUserQuitGame:boolean = false;
   constructor() { }


}
