import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandValidators } from './command.validators';



@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent  {

    
     messageY: string[] = []
     typeArea: string = ''
     form:FormGroup    
     

     constructor(fb:FormBuilder){

        this.form = fb.group({
            message: ['',CommandValidators.validCommand]
        })

     }

     get message(){return this.form.get("message")}
    

    print_value(){
        
        this.messageY.push(this.typeArea);
        console.log(this.messageY);
        this.typeArea = '';
    }

    



}
