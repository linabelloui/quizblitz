import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Question } from '@app/interfaces/game.model';
import { GameService } from '@app/services/game.service';
import { InGameService } from '@app/services/in-game.service';
import { EMPTY_TEXT, INITIAL_SCORE_AND_POINTS, INVALID } from './question-qcm.component.constants';

@Component({
    selector: 'app-question-qcm',
    templateUrl: './question-qcm.component.html',
    styleUrls: ['./question-qcm.component.scss'],
})
export class QuestionQCMComponent {
    @Output() scorerEvent = new EventEmitter<string>();
    @Input() showRightAnswersTest: boolean = false;
    @Input() isAllowedToChange: boolean = true;

    inGameService = inject(InGameService);
    title: string = EMPTY_TEXT;
    description: string = EMPTY_TEXT;
    score: number = INITIAL_SCORE_AND_POINTS;
    points: number = INITIAL_SCORE_AND_POINTS;
    choices: string[] = [];
    answers: string[] = [];
    selectedAnswers: string[] = [];

    constructor(private gameService: GameService) {
        this.inGameService.reset();
        this.loadQuestion();
    }

    updateScore(value: number) {
        this.scorerEvent.emit(String(value));
        this.inGameService.updateScore(this.score);
    }

    selectAnswerFromButtons(targetChoice: string) {
        // Add or remove selected choice into selectedAsnwers
        const indexInTable: number = this.selectedAnswers.indexOf(targetChoice);
        if (indexInTable !== INVALID) {
            this.selectedAnswers.splice(indexInTable, 1);
        } else {
            this.selectedAnswers.push(targetChoice);
        }
    }

    loadQuestion() {
        const question: Question = this.gameService.getCurrentQuestionByIndex(this.inGameService.getCurrentQuestionIndex());
        this.title = question.text;
        this.points = question.points;
        this.choices = [];
        this.selectedAnswers = [];
        this.answers = [];

        // Stocking valid choices in answers array
        for (const choice of question.choices) {
            this.choices.push(choice.text);
            if (choice.isCorrect) {
                this.answers.push(choice.text);
            }
        }
    }

    validateAnswers() {
        const correctAnswers: string[] = this.selectedAnswers.filter((value) => this.answers.includes(value));
        const incorrectAnswer: string[] = this.selectedAnswers.filter((value) => !this.answers.includes(value));
        // All good answers chosen and no incorrect answer chosen
        if (correctAnswers.length === this.answers.length && incorrectAnswer.length === 0) {
            this.score += this.points;
        }

        this.inGameService.increaseCurrentQuestionIndex();
        this.updateScore(this.score);
    }

    onClick(event: MouseEvent) {
        this.selectAnswerFromButtons((event.target as Element).id);
    }
    getGameService() {
        return this.gameService;
    }
}
