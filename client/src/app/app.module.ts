import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminPasswordComponent } from '@app/pages/admin-password-page/admin-password-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Ajv from 'ajv';
import { CountdownModule } from 'ngx-countdown';
import { ChatBarComponent } from './components/chat-bar/chat-bar.component';
import { ChatComponent } from './components/chat/chat.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { QuestionQCMComponent } from './components/question-qcm/question-qcm.component';
import { ScorerComponent } from './components/scorer/scorer.component';
import { TimerComponent } from './components/timer/timer.component';
import { AdminEditgamePageComponent } from './pages/admin-editgame-page/admin-editgame-page.component';
import { AdminGamePageComponent } from './pages/admin-game-page/admin-game-page.component';
import { AdminHistoryPageComponent } from './pages/admin-history-page/admin-history-page.component';
import { PlayerPageComponent } from './pages/player-page/player-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { WaitingForPlayersPageComponent } from './pages/waiting-for-players-page/waiting-for-players-page.component';
import { GameService } from './services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
        QuestionQCMComponent,
        PlayerPageComponent,
        NavbarComponent,
        ChatComponent,
        AdminPasswordComponent,
        AdminGamePageComponent,
        AdminEditgamePageComponent,
        AdminHistoryPageComponent,
        CreateGamePageComponent,
        ResultPageComponent,
        TestPageComponent,
        ScorerComponent,
        TimerComponent,
        ChatBarComponent,
        WaitingForPlayersPageComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule,
        CountdownModule,
        RouterModule,
    ],
    providers: [Ajv, GameService, MatSnackBar],
    bootstrap: [AppComponent],
})
export class AppModule {}
