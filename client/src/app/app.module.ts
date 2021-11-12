import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalScrableClassiqueComponent } from '@app/components/modals/modal-scrable-classique/modal-scrable-classique.component';
import { ModalUserNameComponent } from '@app/components/modals/modal-user-name/modal-user-name.component';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { AppComponent } from '@app/components/pages/app/app.component';
import { GamePageComponent } from '@app/components/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/components/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/components/pages/material-page/material-page.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AvatarModule } from 'ngx-avatar';
import { JoinedUserComponent } from './components/users/joined-user/joined-user.component';
import { RealPlayerComponent } from './components/users/real-player/real-player.component';
import { VrUserComponent } from './components/users/vr-user/vr-user.component';
import { ModalEndOfGameComponent } from './modal-end-of-game/modal-end-of-game.component';
// import { CommandService } from './services/command.service';
import { MessageService } from './services/message.service';
import { ValidWordService } from './services/valid-word.service';
import { WordPointsService } from './services/word-points.service';
import { ModalScoresComponent } from './components/modals/modal-scores/modal-scores.component';

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
        JoinedUserComponent,
        ModalEndOfGameComponent,
        ModalScoresComponent,
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
        CommonModule,
    ],

    providers: [MessageService, ValidWordService, WordPointsService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
