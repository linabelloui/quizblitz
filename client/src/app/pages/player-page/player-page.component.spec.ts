/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionQCMComponent } from '@app/components/question-qcm/question-qcm.component';
import { ResultPageComponent } from '@app/pages/result-page/result-page.component';
import { GameService } from '@app/services/game.service';
import { InGameService } from '@app/services/in-game.service';
import { PlayerPageComponent } from './player-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PlayerPageComponent', () => {
    let router: Router;
    let gameService: GameService;
    let inGameService: InGameService;
    let component: PlayerPageComponent;
    let fixture: ComponentFixture<PlayerPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerPageComponent, QuestionQCMComponent, ResultPageComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'results', component: ResultPageComponent }])],
            providers: [MatSnackBar, GameService, InGameService],
        }).compileComponents();
        fixture = TestBed.createComponent(PlayerPageComponent);
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
        component.questionComponent.choices = ['choice 1', 'choice 2', 'choice 3'];
        const mockEvent: KeyboardEvent = {
            key: '3',
            target: {
                className: 'choice-button',
            },
        } as unknown as KeyboardEvent;
        component.onKeyDown(mockEvent);
        expect(spy1).toHaveBeenCalledWith('choice 3');
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

    it('updatescoreTimer should correctly update time and score', () => {
        const spy1 = spyOn(gameService, 'getCurrentDuration').and.returnValue(30);
        component.updateScoreTimer('50');
        expect(component.score).toEqual(50);
        expect(spy1).toHaveBeenCalled();
        expect(component.time).toEqual(30);
    });

    it('should decrement time correctly', () => {
        component.time = 3;
        component.runTimer();
        expect(component.time).toEqual(2);
        component.time = 0;
    });

    it('should validate answers if timer reaches 0 and reset time', () => {
        const spy1 = spyOn(component, 'validateAnswers');
        spyOn(gameService, 'getCurrentDuration').and.returnValue(30);
        component.time = 1;
        component.runTimer();
        expect(spy1).toHaveBeenCalled();
        expect(component.time).toEqual(30);
    });

    it('should not load next question if there is no more questions', () => {
        const spy1 = spyOn(component.questionComponent, 'loadQuestion');
        const spy2 = spyOn(router, 'navigateByUrl');
        spyOn(inGameService, 'getCurrentQuestionIndex').and.returnValue(4);
        spyOn(gameService, 'getCurrentGameLength').and.returnValue(4);
        component.validateAnswers();
        expect(spy1).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledOnceWith('/results');
    });

    it('should load next question if there are more questions', () => {
        const spy1 = spyOn(component.questionComponent, 'loadQuestion');
        spyOn(inGameService, 'getCurrentQuestionIndex').and.returnValue(2);
        spyOn(gameService, 'getCurrentGameLength').and.returnValue(4);
        component.validateAnswers();
        expect(spy1).toHaveBeenCalledTimes(1);
    });

    it('quitting should redirect to /creategame', () => {
        const spy1 = spyOn(router, 'navigateByUrl');
        component.quitGame();
        expect(spy1).toHaveBeenCalledWith('/creategame');
    });
});
