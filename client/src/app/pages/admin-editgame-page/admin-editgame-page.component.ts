import { Component, OnInit } from '@angular/core';
import { Game } from '@app/interfaces/game.model';
import { TextBubble } from '@app/interfaces/text-bubble.model';
import { ChoiceService } from '@app/services/choice-service';
// import { CommunicationGameService } from '@app/services/communication-game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '@app/services/game.service';
import { QuestionService } from '@app/services/question-service';
const TAKEN_MESSAGE = 'Ce nom est déjà pris.';
const INVALID_MESSAGE = 'Au moins une question na pas de bonne réponse ou na pas de mauvaise réponse';
const SNACKBAR_DURATION_BONUS = 4000;
@Component({
    selector: 'app-admin-editgame-page',
    templateUrl: './admin-editgame-page.component.html',
    styleUrls: ['./admin-editgame-page.component.scss'],
})
export class AdminEditgamePageComponent implements OnInit {
    currentDate = new Date();
    tempCID = 0;
    tempQID = '0';
    gameId = '0';
    game: Game;
    showTextBubble: TextBubble = {
        game: false,
        description: false,
        question: false,
        choice: false,
        duration: false,
    };
    newText = '';

    // Lint disabled because of the max parmaters rule warning
    /* eslint-disable */
    constructor(
        public questionService: QuestionService,
        public choiceService: ChoiceService,
        public gameService: GameService,
        private snackBar: MatSnackBar,
    ) { }
    /* eslint-enable */

    editGameTitle() {
        this.showTextBubble.game = true;
        this.newText = this.game.title;
    }

    saveGameTitle() {
        if (this.gameService.games.find((game) => game.title === this.newText)) {
            this.snackBar.open(TAKEN_MESSAGE, '', {
                duration: SNACKBAR_DURATION_BONUS,
                verticalPosition: 'top',
            });
            return;
        }
        this.game.title = this.newText;
        this.showTextBubble.game = false;
    }

    editGameDescription() {
        this.showTextBubble.description = true;
        this.newText = this.game.description;
    }

    saveGameDescription() {
        this.game.description = this.newText;
        this.showTextBubble.description = false;
    }

    editQuestionTitle(questionId: string) {
        const title = this.questionService.getQuestionById(this.gameId, questionId)?.text;
        if (!title) {
            return;
        }
        this.showTextBubble.question = true;
        this.newText = title;
        this.tempQID = questionId;
    }

    saveQuestionTitle(questionId: string) {
        const question = this.game.questions.find((qst) => qst.id === questionId);
        if (!question) {
            return;
        }
        question.text = this.newText;
        this.showTextBubble.question = false;
    }

    editChoiceTitle(questionId: string, choiceIndex: number) {
        const choices = this.choiceService.getChoicesForQuestionGame(questionId, this.gameId);
        if (choiceIndex < 0 || choiceIndex >= choices.length || !choices) {
            return;
        }
        this.showTextBubble.choice = true;
        this.newText = choices[choiceIndex].text;
        this.tempCID = choiceIndex;
        this.tempQID = questionId;
    }

    saveChoiceTitle(questionId: string, choiceIndex: number) {
        const choices = this.game.questions.find((question) => question.id === questionId)?.choices;
        if (!choices) {
            return;
        } else if (choiceIndex < 0 || choiceIndex >= choices?.length) {
            return;
        }
        choices[choiceIndex].text = this.newText;
        this.showTextBubble.choice = false;
    }

    updateValue(questionId: string, choiceIndex: number) {
        this.choiceService.updateIsCorrect(this.gameId, questionId, choiceIndex);
    }

    updateChoiceIndex(direction: boolean, questionId: string, choiceIndex: number) {
        const choices = this.choiceService.getChoicesForQuestionGame(questionId, this.gameId);
        let newIndex = choiceIndex;
        if (direction) {
            newIndex -= 1;
            if (newIndex < 0) return;
        } else {
            newIndex += 1;
            if (newIndex >= choices.length) return;
        }
        const temp = choices[choiceIndex];
        choices[choiceIndex] = choices[newIndex];
        choices[newIndex] = temp;
    }

    updateQuestionPosition(direction: boolean, questionIndex: number) {
        const questions = this.questionService.getQuestionsForGame(this.gameId);
        let newIndex = questionIndex;
        if (direction) {
            newIndex -= 1;
            if (newIndex < 0) return;
        } else {
            newIndex += 1;
            if (newIndex >= questions.length) return;
        }
        const temp = questions[questionIndex];
        questions[questionIndex] = questions[newIndex];
        questions[newIndex] = temp;
    }
    getGameId() {
        const url = window.location.href;
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        return id;
    }

    deleteChoice(questionId: string, choiceId: number) {
        this.choiceService.deleteChoicesById(questionId, this.gameId, choiceId);
    }

    createNewChoice(questionId: string): void {
        const newChoice = this.choiceService.createNewChoice(questionId, this.gameId);
        const question = this.questionService.getQuestionById(this.gameId, questionId);
        if (question && newChoice) {
            question.choices.push(newChoice);
            this.choiceService.setChoicesForQuestionGame(question.choices, questionId, this.gameId);
        }
    }

    deleteQuestion(questionId: string) {
        const choices = this.choiceService.getChoicesForQuestionGame(questionId, this.gameId);
        if (choices) {
            this.choiceService.setChoicesForQuestionGame([], questionId, this.gameId);
        }
        this.questionService.deleteQuestionsById(questionId, this.gameId);
    }

    createNewQuestion(): void {
        const questions = this.questionService.getQuestionsForGame(this.gameId);
        if (questions.length === 0) {
            return;
        }
        const newQuestion = this.questionService.createNewQuestion();
        questions.push(newQuestion);
        this.choiceService.initChoicesNewQuestion(newQuestion.id, this.gameId);
    }

    validateQuestions(): boolean {
        let violatesRule = false;
        for (const question of this.game.questions) {
            const hasCorrectChoice = question.choices.some((choice) => choice.isCorrect);
            const hasIncorrectChoice = question.choices.some((choice) => !choice.isCorrect);
            if (!hasCorrectChoice || !hasIncorrectChoice) {
                violatesRule = true;
                break;
            }
        }
        return !violatesRule;
    }

    onPointsChanged($event: Event, questionId: string) {
        const multiple = 10;
        const min = 10;
        const max = 100;
        const questions = this.gameService.games.filter((game) => game.id === this.gameId)[0].questions;
        let newPoints = Number(($event.target as HTMLInputElement).value);
        if (newPoints > max) {
            newPoints = max;
        } else if (newPoints < min) {
            newPoints = min;
        } else if (newPoints % multiple !== 0) {
            newPoints = Math.round(newPoints / multiple) * multiple;
        }
        questions.filter((question) => question.id === questionId)[0].points = newPoints;
    }

    onDurationChanged($event: Event) {
        this.game.duration = Number(($event.target as HTMLInputElement).value);
    }

    onSaveAndReturn() {
        if (!this.validateQuestions()) {
            this.snackBar.open(INVALID_MESSAGE, '', {
                duration: SNACKBAR_DURATION_BONUS,
                verticalPosition: 'top',
            });
        }
        sessionStorage.setItem('isAdminAuthenticated', 'true');
    }

    ngOnInit() {
        this.gameId = this.getGameId();
        this.gameService.getGameById(this.gameId).subscribe((game) => {
            if (game) {
                this.game = game;
            }
        });
    }
}
