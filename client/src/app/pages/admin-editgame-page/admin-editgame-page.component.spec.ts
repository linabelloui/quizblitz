import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Game } from '@app/interfaces/game.model';
import { AdminEditgamePageComponent } from './admin-editgame-page.component';
/* eslint-disable */
describe('AdminEditgamePageComponent', () => {
    let component: AdminEditgamePageComponent;
    let fixture: ComponentFixture<AdminEditgamePageComponent>;
    const mockGames: Game[] = [
        {
            id: '1',
            title: 'Mock Game 1',
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
                    ],
                },
            ],
        },
        {
            id: '2',
            title: 'Mock Game 2',
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
                        { text: 'Choix 1', isCorrect: false },
                        { text: 'Choix 2', isCorrect: true },
                    ],
                },
            ],
        },
    ];
    const mockGame = mockGames[0];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminEditgamePageComponent],
            providers: [
                MatSnackBar,
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: convertToParamMap({ id: '123' }) } },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminEditgamePageComponent);
        component = fixture.componentInstance;
        component.game = mockGame;
        fixture.detectChanges();
    });

    function newMockEvent(val: string): Event {
        const mockEvent = new Event('input');
        const mockTarget = {
            value: val,
        };
        Object.defineProperty(mockEvent, 'target', { value: mockTarget });
        return mockEvent;
    }

    it('should create', () => {
        mockGames[0] = mockGame;
        expect(component).toBeTruthy();
    });

    it('should allow editing the game description', () => {
        const newDescription = 'New game description';
        component.game = mockGame;
        component.editGameDescription();
        component.newText = newDescription;
        component.saveGameDescription();

        expect(mockGame.description).toBe(newDescription);
    });

    it('should not allow editing the game title when taken', () => {
        spyOn(TestBed.inject(MatSnackBar), 'open');
        const newTitle = 'Game 1';
        component.editGameTitle();
        component.newText = newTitle;
        component.saveGameTitle();
        expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalled();
        expect(component.showTextBubble.game).toBeTruthy();
    });

    it('should allow editing the game title when unique', () => {
        const newTitle = 'New game title';
        component.editGameTitle();
        component.newText = newTitle;
        component.saveGameTitle();

        expect(component.game.title).toBe(newTitle);
    });

    it('should update game duration', () => {
        const mockEvent = newMockEvent('20');
        component.game.duration = 10;
        const newDuration = 20;
        component.onDurationChanged(mockEvent);
        expect(component.game.duration).toBe(newDuration);
    });

    it('should create a new question', () => {
        component.gameId = '1';
        const lenQuestions = component.game.questions.length;
        component.createNewQuestion();
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        expect(component.game.questions.length).toBeGreaterThan(lenQuestions);
        expect(component.game.questions.length).toBe(lenQuestions + 1);
        for (const question of component.game.questions) {
            expect(question).toBeDefined();
        }
    });

    it('should delete a question', () => {
        component.gameId = '1';
        const lenQuestions = component.game.questions.length;
        component.deleteQuestion('1');
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        expect(component.game.questions.length).toBeLessThan(lenQuestions);
        expect(component.game.questions.length).toBe(lenQuestions - 1);
        for (const question of component.game.questions) {
            expect(question).toBeDefined();
        }
    });

    it('should create a choice', () => {
        component.gameId = '1';
        const questionId = '1';
        const lenChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices.length;
        component.createNewChoice(questionId);
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        const newChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices;
        if (!newChoices || !lenChoices) {
            expect(true).toBe(false);
            return; // fail test
        }
        expect(newChoices.length).toBeGreaterThan(lenChoices);
        expect(newChoices.length).toBe(lenChoices + 1);
        for (const choice of newChoices) {
            expect(choice).toBeDefined();
        }
    });

    it('should not create a choice when list is at maximum (4)', () => {
        component.gameId = '1';
        const questionId = '1';
        component.createNewChoice(questionId); // length now 3
        component.createNewChoice(questionId); // length now 4
        const lenChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices.length;
        component.createNewChoice(questionId); // should stay at 4
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        const newChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices;
        if (!newChoices || !lenChoices) {
            expect(true).toBe(false);
            return; // fail test
        }
        expect(newChoices.length).toBe(lenChoices);
        for (const choice of newChoices) {
            expect(choice).toBeDefined();
        }
    });

    it('should delete a choice', () => {
        component.gameId = '1';
        const questionId = '1';
        const choiceIndex = 1;
        component.createNewChoice(questionId); // length now 3
        const lenChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices.length;
        component.deleteChoice(questionId, choiceIndex); // should go down to 2
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        const newChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices;
        if (!newChoices || !lenChoices) {
            expect(true).toBe(false);
            return; // fail test
        }
        expect(newChoices.length).toBeLessThan(lenChoices);
        expect(newChoices.length).toBe(lenChoices - 1);
        for (const choice of newChoices) {
            expect(choice).toBeDefined();
        }
    });

    it('should not delete a choice when the minimum is reached (2)', () => {
        component.gameId = '1';
        const questionId = '1';
        const choiceIndex = 1;
        const lenChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices.length;
        component.deleteChoice(questionId, choiceIndex);
        // update game model
        component.gameService.getGameById(component.gameId).subscribe((game) => {
            if (game) {
                component.game = game;
            }
        });
        const newChoices = component.questionService.getQuestionById(component.gameId, questionId)?.choices;
        if (!newChoices || !lenChoices) {
            expect(true).toBe(false);
            return; // fail test
        }
        expect(newChoices.length).toBe(lenChoices);
        for (const choice of newChoices) {
            expect(choice).toBeDefined();
        }
    });

    it('should update question points', () => {
        component.gameId = '1';
        const questionId = '1';
        const question = component.questionService.getQuestionById(component.gameId, questionId);
        if (!question) {
            expect(true).toBe(false); // fail test
            return;
        }
        question.points = 50;
        const mockEvent = newMockEvent('80');
        const newPoints = 80;
        component.onPointsChanged(mockEvent, questionId);
        expect(question.points).toBe(newPoints);
    });

    it('points should always be multiples of 10', () => {
        const multiple = 10;
        component.gameId = '1';
        const questionId = '1';
        const mockEvent = newMockEvent('84');
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#points-changing');
        spyOn(component, 'onPointsChanged').and.callThrough();
        inputElement.dispatchEvent(mockEvent);
        const newPoints = 80;
        fixture.detectChanges();
        expect(component.onPointsChanged).toHaveBeenCalledWith(mockEvent, questionId);
        const question = component.questionService.getQuestionById(component.gameId, questionId);
        if (!question) {
            expect(true).toBe(false); // fail test
            return;
        }
        expect(question.points % multiple).toBe(0);
        expect(question.points).toBe(newPoints);
    });

    it('points should always be between 10 and 100', () => {
        const max = 100;
        const min = 10;
        component.gameId = '1';
        const questionId = '1';
        const question = component.questionService.getQuestionById(component.gameId, questionId);
        spyOn(component, 'onPointsChanged').and.callThrough();
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#points-changing');
        if (!question) {
            expect(true).toBe(false); // fail test
            return;
        }
        // upper case
        let mockEvent = newMockEvent('115');
        inputElement.dispatchEvent(mockEvent);
        let newPoints = max;

        expect(component.onPointsChanged).toHaveBeenCalledWith(mockEvent, questionId);
        expect(question.points).toBeLessThanOrEqual(max);
        expect(question.points).toBeGreaterThanOrEqual(min);
        expect(question.points).toBe(newPoints);

        // lower case
        mockEvent = newMockEvent('5');
        inputElement.dispatchEvent(mockEvent);
        newPoints = min;

        expect(component.onPointsChanged).toHaveBeenCalledWith(mockEvent, questionId);
        expect(question.points).toBeLessThanOrEqual(max);
        expect(question.points).toBeGreaterThanOrEqual(min);
        expect(question.points).toBe(newPoints);
    });

    it('should allow editing the question title', () => {
        component.gameId = '1';
        const newTitle = 'New question title';
        const questionId = '1';
        component.editQuestionTitle(questionId);
        component.newText = newTitle;
        component.saveQuestionTitle(questionId);
        const question = component.game.questions.find((qst) => qst.id === questionId);
        expect(question?.text).toBeDefined();
        expect(question?.text).toBe(newTitle);
    });

    it('should not allow editing the question title if question doesnt exist', () => {
        component.gameId = '1';
        const newTitle = 'New question title';
        const questionId = '3';
        component.editQuestionTitle(questionId);
        component.newText = newTitle;
        component.saveQuestionTitle(questionId);
        const question = component.game.questions.find((qst) => qst.id === questionId);
        expect(question).not.toBeDefined();
        expect(question?.text).not.toEqual(newTitle);
    });

    it('should allow editing the choice title', () => {
        component.gameId = '1';
        const newTitle = 'New choice title';
        const questionId = '1';
        const choiceIndex = 1;
        component.editChoiceTitle(questionId, choiceIndex);
        component.newText = newTitle;
        component.saveChoiceTitle(questionId, choiceIndex);
        const choice = component.game.questions.find((qst) => qst.id === questionId)?.choices[choiceIndex];
        expect(choice?.text).toBeDefined();
        expect(choice?.text).toBe(newTitle);
    });

    it('should not allow editing the choice title if there is no choice or if there is no question', () => {
        component.gameId = '1';
        const newTitle = 'New choice title';
        let questionId = '1';
        const choiceIndex = 4;
        component.editChoiceTitle(questionId, choiceIndex);
        component.newText = newTitle;
        component.saveChoiceTitle(questionId, choiceIndex);
        let choice = component.game.questions.find((qst) => qst.id === questionId)?.choices[choiceIndex];
        expect(choice?.text).not.toBe(newTitle);
        expect(choice?.text).not.toBeDefined();

        questionId = '3';
        component.editChoiceTitle(questionId, choiceIndex);
        component.newText = newTitle;
        component.saveChoiceTitle(questionId, choiceIndex);
        choice = component.game.questions.find((qst) => qst.id === questionId)?.choices[choiceIndex];
        expect(choice?.text).not.toBe(newTitle);
        expect(choice?.text).not.toBeDefined();
    });

    it('should be able to move a question up or down', () => {
        component.gameId = '1';
        const questions = [
            { id: '1', text: 'Question 1', choices: [], points: 10, type: 'QCM' },
            { id: '2', text: 'Question 2', choices: [], points: 10, type: 'QCM' },
        ];
        component.questionService.setQuestionsForGame(questions, component.gameId);
        component.updateQuestionPosition(true, 1); // Move "Question 2" up

        const updatedQuestions = component.questionService.getQuestionsForGame(component.gameId);

        expect(updatedQuestions[0].id).toBe('2'); // "Question 2" should be in the first position
        expect(updatedQuestions[1].id).toBe('1'); // "Question 1" should be in the second position

        component.updateQuestionPosition(false, 0); // Move "Question 2" down

        expect(updatedQuestions[0].id).toBe('1'); // "Question 1" should be in the first position
        expect(updatedQuestions[1].id).toBe('2'); // "Question 2" should be in the second position
    });

    it('should not be able to move a question up or down at the edge', () => {
        component.gameId = '1';
        const questions = [
            { id: '1', text: 'Question 1', choices: [], points: 10, type: 'QCM' },
            { id: '2', text: 'Question 2', choices: [], points: 10, type: 'QCM' },
        ];
        component.questionService.setQuestionsForGame(questions, component.gameId);
        component.updateQuestionPosition(false, 1); // Move "Question 2" down

        const updatedQuestions = component.questionService.getQuestionsForGame(component.gameId);

        expect(updatedQuestions[0].id).toBe('1'); // "Question 1" should be in the first position
        expect(updatedQuestions[1].id).toBe('2'); // "Question 2" should be in the second position

        component.updateQuestionPosition(true, 0); // Move "Question 1" up

        expect(updatedQuestions[0].id).toBe('1'); // "Question 1" should be in the first position
        expect(updatedQuestions[1].id).toBe('2'); // "Question 2" should be in the second position
    });

    it('should be able to move a choice up or down', () => {
        component.gameId = '1';
        const questionId = '1';
        const choices = component.choiceService.getChoicesForQuestionGame(questionId, component.gameId);
        // Choix 1
        // Choix 2
        component.updateChoiceIndex(true, questionId, 1); // Move "Choix 2" up

        expect(choices[0].text).toBe('Choix 2'); // "Choix 2" should be in the first position
        expect(choices[1].text).toBe('Choix 1'); // "Choix 1" should be in the second position

        component.updateChoiceIndex(false, questionId, 0); // Move "Choix 2" down

        expect(choices[0].text).toBe('Choix 1'); // "Choix 1" should be in the first position
        expect(choices[1].text).toBe('Choix 2'); // "Choix 2" should be in the second position
    });

    it('should not be able to move a choice up or down at the edge', () => {
        component.gameId = '1';
        const questionId = '1';
        const choices = component.choiceService.getChoicesForQuestionGame(questionId, component.gameId);
        // Choix 1
        // Choix 2
        component.updateChoiceIndex(false, questionId, 1); // Move "Choix 2" down

        expect(choices[0].text).toBe('Choix 1'); // "Choix 1" should be in the first position
        expect(choices[1].text).toBe('Choix 2'); // "Choix 2" should be in the second position

        component.updateChoiceIndex(true, questionId, 0); // Move "Choix 1" up

        expect(choices[0].text).toBe('Choix 1'); // "Choix 1" should be in the first position
        expect(choices[1].text).toBe('Choix 2'); // "Choix 2" should be in the second position
    });

    it('should be able to change the value of a choice', () => {
        component.gameId = '1';
        const questionId = '1';
        const choiceIndex = 0;

        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        const choice = component.choiceService.getChoicesForQuestionGame(component.gameId, questionId)[choiceIndex];
        if (!choice) {
            expect(true).toBe(false); // fail test
            return;
        }
        spyOn(component, 'updateValue').and.callThrough();
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#check-value');

        let value = choice.isCorrect; // true to false or false to true, doesn't matter
        inputElement.dispatchEvent(clickEvent);

        expect(component.updateValue).toHaveBeenCalledWith(questionId, choiceIndex);
        expect(choice.isCorrect).toBe(!value);

        value = choice.isCorrect; // the one left
        inputElement.dispatchEvent(clickEvent);

        expect(component.updateValue).toHaveBeenCalledWith(questionId, choiceIndex);
        expect(choice.isCorrect).toBe(!value);
    });

    it('points should always be multiples of 10', () => {
        const multiple = 10;
        component.gameId = '1';
        const questionId = '1';
        const mockEvent = newMockEvent('84');
        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#points-changing');
        spyOn(component, 'onPointsChanged').and.callThrough();
        inputElement.dispatchEvent(mockEvent);
        const newPoints = 80;
        fixture.detectChanges();
        expect(component.onPointsChanged).toHaveBeenCalledWith(mockEvent, questionId);
        const question = component.questionService.getQuestionById(component.gameId, questionId);
        if (!question) {
            expect(true).toBe(false); // fail test
            return;
        }
        expect(question.points % multiple).toBe(0);
        expect(question.points).toBe(newPoints);
    });

    it('should return true when questions have both correct and incorrect choices', () => {
        component.gameId = '1';
        const choices = [
            { text: 'Choix 1', isCorrect: true },
            { text: 'Choix 2', isCorrect: false },
        ];
        component.game.questions[0].choices = choices;
        const result = component.validateQuestions();
        expect(result).toBe(true);
    });

    it('should return false when questions have only correct choices', () => {
        component.gameId = '1';
        const choices = [
            { text: 'Choix 1', isCorrect: true },
            { text: 'Choix 2', isCorrect: true },
        ];
        component.game.questions[0].choices = choices;
        const result = component.validateQuestions();
        expect(result).toBe(false);
    });

    it('should return false when questions have only false choices', () => {
        component.gameId = '1';
        const choices = [
            { text: 'Choix 1', isCorrect: false },
            { text: 'Choix 2', isCorrect: false },
        ];
        component.game.questions[0].choices = choices;
        const result = component.validateQuestions();
        expect(result).toBe(false);
    });

    it('should alert when validateQuestions is false and not returning', () => {
        spyOn(TestBed.inject(MatSnackBar), 'open');
        component.gameId = '1';
        const questionId = '1';
        component.updateValue(questionId, 0);
        component.game.questions[0].choices = component.choiceService.getChoicesForQuestionGame(component.gameId, questionId);
        const result = component.validateQuestions();
        expect(result).toBe(false);
        component.onSaveAndReturn();
        expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalled;
    });

    it('creating a question for a game that doesnt exist should not be possible', () => {
        spyOn(component.questionService, 'createNewQuestion');
        component.gameId = '3';
        component.createNewQuestion();
        expect(component.questionService.createNewQuestion).not.toHaveBeenCalled();
    });
});
