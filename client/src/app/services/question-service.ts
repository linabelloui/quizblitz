import { Injectable } from '@angular/core';
import { Question } from '@app/interfaces/game.model';
// import { ChoiceService } from './choice-service';
import { GameService } from './game.service';
@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private idCounter: number = 1;
    constructor(private gameservice: GameService) {}

    getQuestionsForGame(gameId: string) {
        const game = this.gameservice.games.find((gameIterator) => gameIterator.id === gameId);
        return game ? game.questions : [];
    }

    getQuestionById(gameId: string, questionId: string) {
        const game = this.gameservice.games.find((gameIterator) => gameIterator.id === gameId);
        return game?.questions.filter((question) => question.id === questionId)[0];
    }

    setQuestionsForGame(questions: Question[], gameId: string) {
        this.gameservice.games.filter((game) => game.id === gameId)[0].questions = questions;
        return questions;
    }

    generateNewId(): string {
        return (this.idCounter += 1).toString();
    }

    createNewQuestion(): Question {
        const newId = this.generateNewId();
        const newQuestion: Question = {
            id: newId,
            text: 'Question ' + newId,
            type: 'QCM',
            points: 50,
            choices: [],
        };
        return newQuestion;
    }

    deleteQuestionsById(questionId: string, gameId: string): void {
        const questions = this.getQuestionsForGame(gameId);
        const updatedQuestions = questions.filter((question) => question.id !== questionId);
        this.setQuestionsForGame(updatedQuestions, gameId);
    }
}
