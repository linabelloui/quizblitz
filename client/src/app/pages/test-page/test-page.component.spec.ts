/* eslint-disable no-restricted-imports */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionQCMComponent } from '@app/components/question-qcm/question-qcm.component';
import { GameService } from '@app/services/game.service';
import { InGameService } from '@app/services/in-game.service';
import { CreateGamePageComponent } from '../create-game-page/create-game-page.component';
import { CREATE_GAME_PAGE_PATH, SNACKBAR_DURATION_BONUS, SNACKBAR_DURATION_EXIT } from '../page.constant';
import { TestPageComponent } from './test-page.component';

describe('TestPageComponent', () => {
    let component: TestPageComponent;
    let fixture: ComponentFixture<TestPageComponent>;
    let router: Router;
    let gameService: GameService;
    let inGameService: InGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestPageComponent, QuestionQCMComponent, CreateGamePageComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'creategame', component: CreateGamePageComponent }]), BrowserAnimationsModule],
            providers: [MatSnackBar, GameService, InGameService],
        });
        fixture = TestBed.createComponent(TestPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
        router.initialNavigation();
        gameService = TestBed.inject(GameService);
        inGameService = TestBed.inject(InGameService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('runTimer', () => {
        it('should decrement time correctly', () => {
            component.time = 3;
            component.runTimer();
            expect(component.time).toEqual(2);
        });

        it('should call validateAnswers if timer reaches 0 and isShowingAnswers is true and reset time', () => {
            const gameDuration = 30;
            const spy1 = spyOn(component, 'validateAnswers');
            spyOn(gameService, 'getCurrentDuration').and.returnValue(gameDuration);
            component.isShowingAnswers = true;
            component.time = 1;
            component.runTimer();
            expect(spy1).toHaveBeenCalled();
            expect(component.time).toEqual(gameDuration);
        });

        it('runTimer should toggle and retoggle isShowingAnswers', () => {
            component.isShowingAnswers = false;
            component.runTimer();
            expect(component.isShowingAnswers).toBeFalse();
        });
    });

    describe('KeyPressing', () => {
        it('should call validateAnswers when Enter key is pressed', () => {
            const spy1 = spyOn(component, 'validateAnswers');
            component.questionComponent.selectedAnswers = ['choice 1'];
            const mockEvent: KeyboardEvent = {
                key: 'Enter',
                target: {
                    className: 'mat-typography',
                },
            } as unknown as KeyboardEvent;
            component.onKeyDown(mockEvent);
            expect(spy1).toHaveBeenCalled();
        });

        it('should call validateAnswers when Enter key is pressed', () => {
            const spy1 = spyOn(component, 'validateAnswers');
            component.questionComponent.selectedAnswers = ['choice 1'];
            const mockEvent: KeyboardEvent = {
                key: 'Enter',
                target: {
                    className: 'enter-button',
                },
            } as unknown as KeyboardEvent;
            component.onKeyDown(mockEvent);
            expect(spy1).toHaveBeenCalled();
        });

        it('should call selectAnswerFromButtons when a valid number key is pressed', () => {
            const spy1 = spyOn(component.questionComponent, 'selectAnswerFromButtons');
            component.questionComponent.choices = ['choice 1', 'choice 2', 'choice 3'];
            const mockEvent: KeyboardEvent = {
                key: '2',
                target: {
                    className: 'mat-typography',
                },
            } as unknown as KeyboardEvent;
            component.onKeyDown(mockEvent);
            expect(spy1).toHaveBeenCalledWith('choice 2');
        });

        it('should call selectAnswerFromButtons when a valid number key is pressed', () => {
            const spy1 = spyOn(component.questionComponent, 'selectAnswerFromButtons');
            component.questionComponent.choices = ['choice 1', 'choice 2', 'choice 3', 'choice 4'];
            const mockEvent: KeyboardEvent = {
                key: '1',
                target: {
                    className: 'choice-button selected',
                },
            } as unknown as KeyboardEvent;
            component.onKeyDown(mockEvent);
            expect(spy1).toHaveBeenCalledWith('choice 1');
        });

        it('should validate answers only if at least one choice is selected', () => {
            const spy1 = spyOn(component, 'validateAnswers');
            component.questionComponent.selectedAnswers = ['choice 1', 'choice 2', 'choice 3'];
            component.clickEnterButton();
            component.questionComponent.selectedAnswers = [];
            component.clickEnterButton();
            expect(spy1).toHaveBeenCalledTimes(1);
        });
    });

    describe('setScore', () => {
        it('setScore should correctly update score', () => {
            const newScore = 50;
            component.setScore(`${newScore}`);
            expect(component.score).toEqual(newScore);
        });
    });

    describe('validateAnswers', () => {
        it('should increase the score and open a snackbar for correct answers', () => {
            component.score = 0;
            component.isShowingAnswers = false;
            const expectedScore = 10;
            component.questionComponent.selectedAnswers = ['choice 1', 'choice 2', 'choice 3'];
            component.questionComponent.answers = ['choice 1', 'choice 2', 'choice 3'];
            component.questionComponent.points = 10;
            spyOn(TestBed.inject(MatSnackBar), 'open');
            component.validateAnswers();
            expect(component.score).toBe(expectedScore);
            expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalledWith('You have a 20% bonus !', '', {
                duration: SNACKBAR_DURATION_BONUS,
                verticalPosition: 'top',
            });
        });

        it('should not increase the score for one or more wrong answers', () => {
            component.isShowingAnswers = false;
            component.questionComponent.answers = ['Choice 1', 'Choice 2'];
            component.questionComponent.selectedAnswers = ['Choice 1', 'Choice 2', 'Choice 3'];
            component.validateAnswers();
            expect(component.score).toBe(component.score);
        });

        it('should toggle isShowingAnswers to true and isAllowedToChange to false when validateAnswers is called', () => {
            component.isShowingAnswers = false;
            component.validateAnswers();
            expect(component.isShowingAnswers).toBeTrue();
            expect(component.isAllowedToChange).toBeFalse();
        });

        it('should load next question if there are more questions', () => {
            component.isShowingAnswers = true;
            const currentQuestionIndex = 1;
            const gameLength = 2;
            const spy1 = spyOn(component.questionComponent, 'loadQuestion');
            const spy2 = spyOn(inGameService, 'increaseCurrentQuestionIndex').and.callThrough();
            spyOn(inGameService, 'getCurrentQuestionIndex').and.returnValue(currentQuestionIndex);
            spyOn(gameService, 'getCurrentGameLength').and.returnValue(gameLength);
            component.validateAnswers();
            expect(spy2).toHaveBeenCalledTimes(1);
            expect(spy1).toHaveBeenCalledTimes(1);
        });

        it('should add choice to selectedAnswers at the end if not already in it', () => {
            component.questionComponent.selectedAnswers = ['choice 1', 'choice 2'];
            component.questionComponent.selectAnswerFromButtons('choice 3');
            expect(component.questionComponent.selectedAnswers).toEqual(['choice 1', 'choice 2', 'choice 3']);
        });

        it('should not load next question if there is no more questions and navigate to creategame page', () => {
            component.isShowingAnswers = true;
            const spy1 = spyOn(component.questionComponent, 'loadQuestion');
            const spy2 = spyOn(router, 'navigateByUrl');
            spyOn(inGameService, 'getCurrentQuestionIndex').and.returnValue(3);
            spyOn(gameService, 'getCurrentGameLength').and.returnValue(2);
            component.validateAnswers();
            expect(spy1).toHaveBeenCalledTimes(0);
            expect(spy2).toHaveBeenCalledOnceWith(CREATE_GAME_PAGE_PATH);
        });
    });

    describe('quitGame', () => {
        it('quitting should redirect to creategame page and show a snackbar while exiting', () => {
            const spy1 = spyOn(router, 'navigateByUrl');
            spyOn(TestBed.inject(MatSnackBar), 'open');
            component.quitGame();
            expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalledWith('Exited the game', '', {
                duration: SNACKBAR_DURATION_EXIT,
                verticalPosition: 'top',
            });
            expect(spy1).toHaveBeenCalledWith(CREATE_GAME_PAGE_PATH);
        });
    });
});
