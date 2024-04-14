import { Injectable } from '@angular/core';
import { Game, Question } from '@app/interfaces/game.model';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    games: Game[] = [
        {
            id: '1',
            title: 'Game 1',
            description: 'Description of Game 1',
            isVisible: true,
            lastModification: new Date(),
            duration: 10,
            questions: [
                {
                    id: '1',
                    type: 'QCM',
                    text: 'Question 1 and more characters to show of the truncation',
                    points: 20,
                    choices: [
                        { text: 'Choix 1', isCorrect: true },
                        { text: 'Choix 2', isCorrect: false },
                        // Add more choices as needed
                    ],
                },
                // Add more questions as needed
            ],
        },
        {
            id: '2',
            title: 'Game 2',
            description: 'Description of Game 2',
            isVisible: false,
            lastModification: new Date(),
            duration: 15,
            questions: [
                {
                    id: '1',
                    type: 'QCM',
                    text: 'Question 1',
                    points: 30,
                    choices: [
                        { text: 'Choix 1: Faux', isCorrect: false },
                        { text: 'Choix 2: Vrai', isCorrect: true },
                        // Add more choices as needed
                    ],
                },
                {
                    id: '2',
                    type: 'QCM',
                    text: 'Question 2',
                    points: 30,
                    choices: [
                        { text: 'Choix 1: Faux', isCorrect: false },
                        { text: 'Choix 2: Vrai', isCorrect: true },
                        { text: 'Choix 3: Faux', isCorrect: false },
                        { text: 'Choix 4: Vrai', isCorrect: true },
                        // Add more choices as needed
                    ],
                },
                {
                    id: '3',
                    type: 'QCM',
                    text: 'Question 3',
                    points: 30,
                    choices: [
                        { text: 'Choix 1: Faux', isCorrect: false },
                        { text: 'Choix 2: Vrai', isCorrect: true },
                        { text: 'Choix 3: Vrai', isCorrect: true },
                        // Add more choices as needed
                    ],
                },
                // Add more questions as needed
            ],
        },
        // Add more games as needed
    ];

    protected currentQuestionList: Question[] = [];
    protected currentGameLength: number;
    private currentGame: Game;

    constructor() {
        this.currentGame = this.games[1];
        this.currentGameLength = this.currentGame.questions.length;
        for (const question of this.currentGame.questions) {
            this.currentQuestionList.push(question);
        }
    }

    getAllGames() {
        return of(this.games);
    }

    getGameById(id: string) {
        return of(this.games.find((game) => game.id === id));
    }

    generateNewId(): string {
        const MAX_RANDOM = 100;
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * MAX_RANDOM).toString();
        return timestamp + randomNum;
    }

    deleteGameById(gameId: string): void {
        const index = this.games.findIndex((game) => game.id === gameId);
        const NOT_FOUND = -1;
        if (index !== NOT_FOUND) {
            this.games.splice(index, 1);
        }
    }

    getCurrentQuestionByIndex(index: number): Question {
        const question: Question = this.currentQuestionList[index];
        return question;
    }

    getCurrentDuration(): number {
        return this.currentGame.duration;
    }

    getCurrentGameId() {
        return this.currentGame.id;
    }

    getCurrentGameLength() {
        return this.currentGameLength;
    }

    // on change la valeur du jeu actuel, des questions correspondantes et de la longueur des questions
    // ces changements seront utilisés pour charger la partie qui sera chargé dans la vue de tester jeu et jeu du joueur.
    setCurrentPlayGame(game: Game) {
        this.currentGame = game;
        const tempCurrentQuestionList: Question[] = [];
        for (const question of game.questions) {
            tempCurrentQuestionList.push(question);
        }
        this.currentQuestionList = tempCurrentQuestionList;
        this.currentGameLength = game.questions.length;
    }
}
