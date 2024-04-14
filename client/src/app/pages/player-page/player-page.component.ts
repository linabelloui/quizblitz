import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionQCMComponent } from '@app/components/question-qcm/question-qcm.component';
import { GameService } from '@app/services/game.service';

import {
    CHOICE_BUTTON_SELECTED_CLASS,
    CHOICE_BUTTON_UNSELECTED_CLASS,
    CREATE_GAME_PAGE_PATH,
    DURATION_INTERVAL,
    ENTER_BUTTON_CLASS,
    ENTER_KEY,
    INITIAL_SCORE,
    PAGE_BODY_CLASS,
    RESULT_PAGE_PATH,
} from '@app/pages/page.constant';
import { InGameService } from '@app/services/in-game.service';

@Component({
    selector: 'app-player-page',
    templateUrl: './player-page.component.html',
    styleUrls: ['./player-page.component.scss'],
})
export class PlayerPageComponent {
    @ViewChild(QuestionQCMComponent) questionComponent: QuestionQCMComponent;
    gameService = inject(GameService);
    inGameService = inject(InGameService);
    score: number = INITIAL_SCORE;
    time: number;
    interval;

    constructor(private router: Router) {
        this.time = this.gameService.getCurrentDuration();
        const intervalDuration = DURATION_INTERVAL;
        this.interval = setInterval(() => this.runTimer(), intervalDuration);
    }

    runTimer() {
        this.time--;
        if (this.time === 0) {
            this.validateAnswers();
            this.time = this.gameService.getCurrentDuration();
        }
    }

    validateAnswers() {
        this.questionComponent.validateAnswers();
        if (this.inGameService.getCurrentQuestionIndex() >= this.gameService.getCurrentGameLength()) {
            clearInterval(this.interval);
            this.router.navigateByUrl(RESULT_PAGE_PATH);
        } else {
            this.questionComponent.loadQuestion();
        }
    }

    updateScoreTimer(newScore: string) {
        this.score = Number(newScore);
        this.time = this.gameService.getCurrentDuration();
    }

    quitGame() {
        clearInterval(this.interval);
        this.router.navigateByUrl(CREATE_GAME_PAGE_PATH);
    }

    clickEnterButton() {
        if (this.questionComponent.selectedAnswers.length > 0) this.validateAnswers();
    }

    onKeyDown(event: KeyboardEvent) {
        const targetClassName: string = (event.target as HTMLElement).className;
        if (
            targetClassName === PAGE_BODY_CLASS ||
            targetClassName === ENTER_BUTTON_CLASS ||
            targetClassName === CHOICE_BUTTON_SELECTED_CLASS ||
            targetClassName === CHOICE_BUTTON_UNSELECTED_CLASS
        ) {
            if (event.key === ENTER_KEY && this.questionComponent.selectedAnswers.length > 0) {
                this.validateAnswers();
            } else if (Number(event.key) <= this.questionComponent.choices.length) {
                this.questionComponent.selectAnswerFromButtons(this.questionComponent.choices[Number(event.key) - 1]);
            }
        }
    }
}
