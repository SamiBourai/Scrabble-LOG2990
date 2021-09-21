import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { AvatarModule } from 'ngx-avatar';
import { EaselComponent } from './components/easel/easel.component';
import { RealPlayerComponent } from './components/users/real-player/real-player.component';
import { VrUserComponent } from './components/users/vr-user/vr-user.component';
import { ModalScrableClassiqueComponent } from './modal-scrable-classique/modal-scrable-classique.component';
import { ModalUserNameComponent } from './modal-user-name/modal-user-name.component';
import { ModalUserVsPlayerComponent } from './modal-user-vs-player/modal-user-vs-player.component';
import { CommandService } from './services/command.service';
import { MessageService } from './message.service';
import { ValidWorldService } from './services/valid-world.service';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */

@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        ModalScrableClassiqueComponent,
        ModalUserNameComponent,
        ModalUserVsPlayerComponent,
        RealPlayerComponent,
        VrUserComponent,
        EaselComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AvatarModule,
    ],

    providers: [CommandService, MessageService, ValidWorldService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
