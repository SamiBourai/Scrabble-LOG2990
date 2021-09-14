import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-name-solo',
  templateUrl: './name-solo.component.html',
  styleUrls: ['./name-solo.component.scss']
})
export class NameSoloComponent implements OnInit {

  //signUpForm: FormGroup = new FormGroup({});
  // nameRegister: FormGroup;
  userName: FormControl = new FormControl();
  
  constructor() {}

  ngOnInit(): void {
    // this.nameRegister = new FormControl({
    //   "userName": new FormControl(null) ,

    //  });
  }
  submitData(){

  } 
  // valideCritere():{ [s: string]: boolean }{

  //   if(this.signUpForm.controls['password']){
  //     const input:string=this.signUpForm.controls['password'].value;
  //   if(input.includes(' ')){
  //     return { containSpace: true }
  //   }else if(input.length>8){
  //     return { biggerThanEight: true }
  //   }

  // }
  //   return null as any;
  // }


}
