import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InGameService {
    private currentQuestionIndex: number = 0;
    private score: number = 0;

    getCurrentQuestionIndex(): number {
        return this.currentQuestionIndex;
    }

    getCurrentPoints(): number {
        return this.score;
    }

    increaseCurrentQuestionIndex() {
        this.currentQuestionIndex += 1;
    }

    decreaseCurrentQuestionIndex() {
        --this.currentQuestionIndex;
    }

    updateScore(newPoints: number) {
        this.score = newPoints;
    }

    reset() {
        this.score = 0;
        this.currentQuestionIndex = 0;
    }
}
