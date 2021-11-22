import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameInitializationComponent } from '@app/components/modals/game-initialization/game-initialization.component';
import { ModalScrableClassiqueComponent } from '@app/components/modals/modal-scrable-classique/modal-scrable-classique.component';
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
import { ModalEndOfGameComponent } from './components/modals/modal-end-of-game/modal-end-of-game.component';
import { ModalScoresComponent } from './components/modals/modal-scores/modal-scores.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page/admin-page.component';
import { JoinedUserComponent } from './components/users/joined-user/joined-user.component';
import { RealPlayerComponent } from './components/users/real-player/real-player.component';
import { VrUserComponent } from './components/users/vr-user/vr-user.component';
// import { CommandService } from './services/command.service';
import { MessageService } from './services/message.service';
import { ValidWordService } from './services/valid-word.service';
import { WordPointsService } from './services/word-points.service';
import { ScrableLog2990ModalComponent } from './components/modals/scrable-log2990-modal/scrable-log2990-modal.component';
import { CreateMultiplayerGameComponent } from './components/game-mode/create-multiplayer-game/create-multiplayer-game.component';
import { JoinMultiplayerGameComponent } from './components/game-mode/join-multiplayer-game/join-multiplayer-game.component';
import { SoloGameComponent } from './components/game-mode/solo-game/solo-game.component';
import { DialogBoxComponent } from './components/modals/dialog-box/dialog-box.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */

@NgModule({
    declarations: [
        AdminPageComponent,
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        ModalScrableClassiqueComponent,
        GameInitializationComponent,
        ModalUserVsPlayerComponent,
        RealPlayerComponent,
        VrUserComponent,
        JoinedUserComponent,
        ModalEndOfGameComponent,
        ModalScoresComponent,
        ScrableLog2990ModalComponent,
        CreateMultiplayerGameComponent,
        JoinMultiplayerGameComponent,
        SoloGameComponent,
        DialogBoxComponent,
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
