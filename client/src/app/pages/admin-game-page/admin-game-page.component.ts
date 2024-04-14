import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Game, Question } from '@app/interfaces/game.model';
import {
    DEFAULT_DURATION,
    MAX_CHOICE_LENGTH,
    MAX_DURATION,
    MAX_POINTS,
    MIN_CHOICE_LENGTH,
    MIN_DURATION,
    MIN_POINTS,
    SNACKBAR_DURATION_EXIT,
} from '@app/pages/page.constant';
import { GameService } from '@app/services/game.service';
import * as gameSchema from '@assets/quiz-schema.json';
import Ajv from 'ajv';
import AjvFormats from 'ajv-formats';

@Component({
    selector: 'app-admin-game-page',
    templateUrl: './admin-game-page.component.html',
    styleUrls: ['./admin-game-page.component.scss'],
})
export class AdminGamePageComponent implements OnInit {
    games: Game[] = [];

    // Lint disabled because of the max parmaters rule warning
    /* eslint-disable */
    constructor(
        public gameService: GameService,
        public router: Router,
        protected ajv: Ajv,
        public snackBar: MatSnackBar,
    ) /* eslint-enable */ {
        if (!ajv.formats['date-time']) {
            AjvFormats(ajv);
        }
    }

    goToEditGamePage(gameId: string) {
        this.router.navigate(['/editgame', gameId]);
    }

    exportGame(game: Game) {
        const gameWithoutVisibility = {
            ...game,
            isVisible: undefined,
        };

        const jsonData = JSON.stringify(gameWithoutVisibility, null, 2);

        const blob = new Blob([jsonData], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'game.json';
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);

        if (link.download) {
            this.snackBar.open('Game exported successfully', 'Close', {
                duration: SNACKBAR_DURATION_EXIT,
            });
        }

        return gameWithoutVisibility;
    }

    toggleVisibility(game: Game): void {
        game.isVisible = !game.isVisible;
    }

    async importGame(event: Event): Promise<Game | undefined> {
        return new Promise((resolve) => {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const importedData = e.target?.result as string | null;

                    if (importedData) {
                        try {
                            const importedGame: Game = JSON.parse(importedData);

                            while (this.isNameExists(importedGame.title)) {
                                const newName = prompt('Ce nom existe déjà. Veuillez choisir un nouveau nom:');
                                if (newName) {
                                    importedGame.title = newName;
                                }
                            }

                            this.validateGameSchema(importedGame);

                            const errors = this.validateGame(importedGame);

                            if (errors.length > 0) {
                                const errorMessage = errors.join('\n');
                                alert(`Jeu invalide:\n${errorMessage}`);
                                return;
                            }

                            importedGame.id = this.gameService.generateNewId();
                            importedGame.isVisible = false;
                            this.games.push(importedGame);

                            fileInput.value = '';
                            resolve(importedGame);
                        } catch (error) {
                            this.snackBar.open('Error parsing JSON: ' + error, 'Close', { duration: SNACKBAR_DURATION_EXIT });
                            resolve(undefined);
                        }
                    }
                };

                reader.readAsText(file);
            }
        });
    }

    deleteGame(game: Game) {
        this.gameService.getAllGames().subscribe((games) => {
            let gameFound = false;

            for (const gameItem of games) {
                if (gameItem.id === game.id) {
                    this.gameService.deleteGameById(game.id);
                    gameFound = true;
                    break;
                }
            }
            if (!gameFound) {
                this.snackBar.open("Ce jeu n'existe pas", 'Close', {
                    duration: SNACKBAR_DURATION_EXIT,
                });
            }
        });
    }

    initNewGame(newGameId: string) {
        const newGame: Game = {
            id: newGameId,
            title: 'New Game',
            isVisible: false,
            lastModification: new Date(),
            duration: DEFAULT_DURATION,
            description: 'Description for New Game',
            questions: [],
        };

        this.games.push(newGame);
    }

    createNewGame(): void {
        const newGameId = this.gameService.generateNewId();
        this.router.navigate(['/editgame', newGameId]);
        this.initNewGame(newGameId);
    }

    validateGameSchema(game: Game) {
        const isValid = this.ajv.validate(gameSchema, game);
        if (!isValid) {
            const errorMessages = this.ajv.errorsText();
            throw new Error(`Validation Error. ${errorMessages}`);
        }
        return game;
    }

    validateGame(game: Game) {
        const errors: string[] = [];

        this.checkQuestions(game, errors);

        return errors;
    }

    checkQuestions(game: Game, errors: string[]): void {
        if (game.questions.length === 0) {
            errors.push('Le jeu doit contenir au moins une question.');
        } else {
            game.questions.forEach((question) => {
                this.checkQuestionTimes(game, errors);
                this.checkQuestionPoints(question, errors);
                if (question.type === 'QCM') {
                    this.checkQCMQuestion(question, errors);
                }
            });
        }
    }

    checkQCMQuestion(question: Question, errors: string[]): void {
        const hasCorrectChoice = question.choices.some((choice) => choice.isCorrect);
        const hasIncorrectChoice = question.choices.some((choice) => !choice.isCorrect);

        if (!hasCorrectChoice || !hasIncorrectChoice) {
            errors.push('Les questions QCM doivent contenir au moins un bon et un mauvais choix.');
        }
        if (question.choices.length < MIN_CHOICE_LENGTH || question.choices.length > MAX_CHOICE_LENGTH) {
            errors.push('Les questions QCM doivent contenir entre 2 et 4 choix de réponse inclusivement.');
        }
    }

    checkQuestionPoints(question: Question, errors: string[]): void {
        if (
            !Number.isInteger(question.points) ||
            question.points < MIN_POINTS ||
            question.points > MAX_POINTS ||
            question.points % MIN_POINTS !== 0
        ) {
            errors.push('Chaque question doit valoir entre 10 et 100 points, multiple de 10.');
        }
    }

    checkQuestionTimes(game: Game, errors: string[]): void {
        const qmcQuestions = game.questions.filter((question) => question.type === 'QCM');
        const qrlQuestions = game.questions.filter((question) => question.type === 'QRL');
        if (qmcQuestions.length > 0 && (game.duration < MIN_DURATION || game.duration > MAX_DURATION)) {
            errors.push('Le temps pour chaque question QCM doit être entre 10 et 60 secondes.');
        } else if (qrlQuestions.length > 0 && game.duration !== MAX_DURATION) {
            errors.push('Le temps pour chaque question QRL doit être de 60 secondes.');
        }
    }

    ngOnInit() {
        this.gameService.getAllGames().subscribe((games) => {
            this.games = games;
        });
    }

    private isNameExists(title: string): boolean {
        return this.games.some((game) => game.title === title);
    }
}
