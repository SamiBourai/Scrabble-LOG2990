import { Component, ElementRef, ViewChild } from '@angular/core';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
@Component({
    selector: 'app-modal-scrable-classique',
    templateUrl: './modal-scrable-classique.component.html',
    styleUrls: ['./modal-scrable-classique.component.scss'],
})
export class ModalScrableClassiqueComponent {
    @ViewChild('button', { static: false }) private button: ElementRef<HTMLElement>;
    mainPageComponent: MainPageComponent;
    // constructor() {}
    closeWindow(): void {
        console.log(this.button);
        this.button.nativeElement.style.display = 'none';
    }
}
