import { Component } from '@angular/core';
import { Game } from '@app/interfaces/game.model';
import { GameService } from '@app/services/game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent {
    createGame: string;
    testGame: string;
    // map qui associe un jeu avec une variable booleene specifiant si le jeu a été selectionné par
    // l'utilisateur. Si c'est le cas, on affiche les proprietes specifique au jeu selectionné.
    gameIsSelected = new Map<string, boolean>();
    constructor(
        private gameService: GameService,
        private router: Router,
    ) {
        // Initialisation du tableau gameIsSelected en fonction de la visibilité des jeux.
        // lors du chargement de la page ils sont tous initialisé a false car aucun n'a ete selectionné
        for (const game of this.gameService.games) {
            if (game.isVisible === true) this.gameIsSelected.set(game.id, false);
        }
        this.createGame = 'créer une partie';
        this.testGame = 'tester le jeu';
    }
    gameSelection(id: string) {
        for (const key of this.gameIsSelected.keys()) {
            if (key === id) this.gameIsSelected.set(key, true);
            else this.gameIsSelected.set(key, false);
        }
    }
    getGames() {
        return this.gameService.games;
    }
    // permet de charger le jeu correspondant dans la Vue Tester Jeu
    sendCurrentGame(game: Game) {
        this.gameService.setCurrentPlayGame(game);
        this.router.navigate(['/test']);
    }
}
