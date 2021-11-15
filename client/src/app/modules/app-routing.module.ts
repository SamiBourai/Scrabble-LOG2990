import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '@app/components/pages/admin-page/admin-page/admin-page.component';
import { GamePageComponent } from '@app/components/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/components/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/components/pages/material-page/material-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
