import { AbstractControl } from "@angular/forms";


export class CommandValidators{

    static validCommand(control: AbstractControl){

        return new Promise((resolve) => {
            if(control.value == "!debug")
                resolve({isValid:true})
            else
                resolve(null)

        })
    }
}