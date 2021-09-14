import { Component, ViewChild } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { MainPageComponent } from '@app/pages/main-page/main-page.component';
@Component({
    selector: 'app-modal-scrable-classique',
    templateUrl: './modal-scrable-classique.component.html',
    styleUrls: ['./modal-scrable-classique.component.scss'],
})
export class ModalScrableClassiqueComponent {
    // mainPageComponent: MainPageComponent;
    // @ViewChild('button', { static: false }) button: ElementRef<HTMLElement>;
    @ViewChild('button') button: { nativeElement: { click: () => void } };
    // constructor(button: HTMLElement) {
    //     t
    // }
    // ngOnInit() {}
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    // ngAfterViewInit() {
    //     setTimeout(() => {this.button.nativeElement.click();
    //         console.log(this.abc.nativeElement.innerText);
    //     }, 1000);
    // }
    closeWindow(): void {
        if (this.button) this.button.nativeElement.click();
    }
}
