import { Injectable } from '@angular/core';
import { Choice } from '@app/interfaces/game.model';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class ChoiceService {
    constructor(private gameservice: GameService) {}

    getChoicesForQuestionGame(questionId: string, gameId: string) {
        const questions = this.gameservice.games.find((game) => game.id === gameId)?.questions;
        const choices = questions?.find((question) => question.id === questionId)?.choices;
        if (!choices) {
            return [];
        }
        return choices;
    }

    setChoicesForQuestionGame(choices: Choice[], questionId: string, gameId: string) {
        this.gameservice.games.filter((game) => game.id === gameId)[0].questions.filter((question) => question.id === questionId)[0].choices =
            choices;
        return choices;
    }

    generateNewId(questionId: string, gameId: string): number {
        return this.getChoicesForQuestionGame(questionId, gameId)?.length + 1;
    }

    initChoicesNewQuestion(newQuestion: string, gameId: string) {
        return this.setChoicesForQuestionGame(
            [
                { text: 'Choix 1', isCorrect: false },
                { text: 'Choix 2', isCorrect: true },
            ],
            newQuestion,
            gameId,
        );
    }

    createNewChoice(questionId: string, gameId: string) {
        if (this.getChoicesForQuestionGame(questionId, gameId).length > 3) {
            return;
        }

        const newId = this.generateNewId(questionId, gameId).toString();
        const newChoice: Choice = {
            text: 'Choix ' + newId,
            isCorrect: false,
        };
        return newChoice;
    }

    deleteChoicesById(questionId: string, gameId: string, choiceIndex: number): void {
        const len = this.getChoicesForQuestionGame(questionId, gameId).length;
        if (len === 2) {
            return;
        }
        if (len >= choiceIndex) {
            this.getChoicesForQuestionGame(questionId, gameId).splice(choiceIndex, 1);
        }
    }

    updateIsCorrect(questionId: string, gameId: string, choiceIndex: number): void {
        const choices = this.getChoicesForQuestionGame(gameId, questionId);
        if (choices.length > choiceIndex) {
            choices[choiceIndex].isCorrect = !choices[choiceIndex].isCorrect;
        }
    }
}
