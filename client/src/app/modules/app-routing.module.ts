import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from '@app/guards/admin-auth.guard';
import { AdminEditgamePageComponent } from '@app/pages/admin-editgame-page/admin-editgame-page.component';
import { AdminGamePageComponent } from '@app/pages/admin-game-page/admin-game-page.component';
import { AdminHistoryPageComponent } from '@app/pages/admin-history-page/admin-history-page.component';
import { AdminPasswordComponent } from '@app/pages/admin-password-page/admin-password-page.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { PlayerPageComponent } from '@app/pages/player-page/player-page.component';
import { ResultPageComponent } from '@app/pages/result-page/result-page.component';
import { TestPageComponent } from '@app/pages/test-page/test-page.component';
import { WaitingForPlayersPageComponent } from '@app/pages/waiting-for-players-page/waiting-for-players-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'admin', component: AdminGamePageComponent, canActivate: [adminAuthGuard] },
    { path: 'password', component: AdminPasswordComponent },
    { path: 'history', component: AdminHistoryPageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'editgame/:id', component: AdminEditgamePageComponent },
    { path: 'creategame', component: CreateGamePageComponent },
    { path: 'results', component: ResultPageComponent },
    { path: 'question', component: PlayerPageComponent },
    { path: 'test', component: TestPageComponent },
    { path: 'waitingplayers', component: WaitingForPlayersPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
