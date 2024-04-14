import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Game } from '@app/interfaces/game.model';
import { GameService } from '@app/services/game.service';
import * as jsonGame from '@assets/quiz-example.json';
import Ajv from 'ajv';
import { of } from 'rxjs';
import { AdminGamePageComponent } from './admin-game-page.component';

const SNACKBAR_DURATION = 3000;

describe('AdminGamePageComponent', () => {
    let component: AdminGamePageComponent;
    let fixture: ComponentFixture<AdminGamePageComponent>;
    let gameService: GameService;

    const mockGames: Game[] = [
        {
            id: '1hd8hk',
            title: 'Mock Game 1',
            description: 'Description of Game 1',
            isVisible: true,
            lastModification: new Date('2023-10-01T10:00:00'),
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
            id: '274s6shd8',
            title: 'Mock Game 2',
            description: 'Description of Game 2',
            isVisible: false,
            lastModification: new Date(),
            duration: 15,
            questions: [
                {
                    id: '2',
                    type: 'QRL',
                    text: 'Question 1',
                    points: 30,
                    choices: [],
                },
            ],
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminGamePageComponent],
            imports: [MatSnackBarModule, BrowserAnimationsModule],
            providers: [
                MatSnackBar,
                GameService,
                {
                    provide: Ajv,
                    useValue: new Ajv(),
                },
            ],
        });
        fixture = TestBed.createComponent(AdminGamePageComponent);
        component = fixture.componentInstance;
        gameService = TestBed.inject(GameService);

        fixture.detectChanges();
    });

    it('should navigate to editgame with the correct game ID', () => {
        const gameId = mockGames[0].id;
        spyOn(component.router, 'navigate').and.stub();
        component.goToEditGamePage(gameId);
        expect(component.router.navigate).toHaveBeenCalledWith(['/editgame', gameId]);
    });

    it('should create a new game and navigate to editgame', () => {
        const newGameId = mockGames[1].id;
        spyOn(gameService, 'generateNewId').and.returnValue(newGameId);
        spyOn(component.router, 'navigate').and.stub();
        component.createNewGame();
        expect(gameService.generateNewId).toHaveBeenCalled();
        expect(component.router.navigate).toHaveBeenCalledWith(['/editgame', newGameId]);
    });

    it('should delete a game', () => {
        const gameTest = mockGames[0];
        component.games.push(gameTest);
        const deleteGameByIdSpy = spyOn(component.gameService, 'deleteGameById').and.callThrough();
        component.deleteGame(gameTest);
        expect(deleteGameByIdSpy).toHaveBeenCalledWith(gameTest.id);
        expect(component.games).not.toContain(gameTest);
    });

    it('should display games with visibility and last modification date', () => {
        expect(component.games.length).toBe(mockGames.length);

        for (const game of mockGames) {
            expect(game.isVisible).toBeDefined();
            expect(game.lastModification).toBeDefined();
        }
    });

    it('should toggle visibility of a game', () => {
        const visibleGame = mockGames[0];
        const unvisibleGame = mockGames[1];
        component.toggleVisibility(visibleGame);
        component.toggleVisibility(unvisibleGame);
        expect(visibleGame.isVisible).toBe(false);
        expect(unvisibleGame.isVisible).toBe(true);
    });

    it('should handle an attempt to delete a non-existing game', () => {
        mockGames[1].id = 'unexistant-id';
        const unexistantGame = mockGames[1];

        const snackBarSpy = spyOn(component.snackBar, 'open');
        component.deleteGame(unexistantGame);
        expect(snackBarSpy).toHaveBeenCalledWith("Ce jeu n'existe pas", 'Close', {
            duration: SNACKBAR_DURATION,
        });
    });

    it('should export a game with no visibility parameter', () => {
        const gameToExport = mockGames[0];
        const snackBarOpenSpy = spyOn(component.snackBar, 'open');

        const exportedGame = component.exportGame(gameToExport);

        expect(snackBarOpenSpy).toHaveBeenCalledWith('Game exported successfully', 'Close', {
            duration: SNACKBAR_DURATION,
        });

        expect(exportedGame.isVisible).toBeUndefined();
        expect(exportedGame.isVisible).toBe(undefined);

        expect(exportedGame.id).toBeDefined();
        expect(exportedGame.title).toBeDefined();
        expect(exportedGame.lastModification).toBeDefined();
        expect(exportedGame.duration).toBeDefined();
        expect(exportedGame.description).toBeDefined();
        expect(exportedGame.questions).toBeDefined();
    });

    it('should allow importing a new game with hidden visibility', async () => {
        const jsonGameData = JSON.stringify(jsonGame);
        const blob = new Blob([jsonGameData], { type: 'application/json' });

        const event = {
            target: {
                files: [blob],
            },
        } as unknown as Event;

        const snackBarOpenSpy = spyOn(component.snackBar, 'open');
        const importedGame = await component.importGame(event);

        expect(snackBarOpenSpy).not.toHaveBeenCalledWith('Error parsing JSON:', 'Close', {
            duration: SNACKBAR_DURATION,
        });

        const isGameInList = component.games.some((game) => game.id === importedGame?.id);
        expect(isGameInList).toBe(true);

        expect(importedGame?.isVisible).toBe(false);
    });

    it('should inform the user of invalid data when importing', async () => {
        const game = mockGames[1];
        game.questions[0].type = 'InvalidType';

        const jsonGameData = JSON.stringify(game);
        const blob = new Blob([jsonGameData], { type: 'application/json' });

        const event = {
            target: {
                files: [blob],
            },
        } as unknown as Event;

        const snackBarOpenSpy = spyOn(component.snackBar, 'open');
        await component.importGame(event);

        expect(snackBarOpenSpy).toHaveBeenCalledWith(
            'Error parsing JSON: Error: Validation Error. data/questions/0/type must be equal to one of the allowed values',
            'Close',
            {
                duration: SNACKBAR_DURATION,
            },
        );
    });

    it('should rename the game if the name already exists', async () => {
        component.games.push(mockGames[0]);

        const newGameTitle = 'New Game';
        const duplicateGameTitle = 'Mock Game 1';

        const gameWithDuplicateTitle = {
            id: 'h93bd8',
            title: duplicateGameTitle,
            description: 'Description of Game',
            isVisible: true,
            lastModification: new Date('2023-10-01T10:00:00'),
            duration: 20,
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
        };

        const jsonGameData = JSON.stringify(gameWithDuplicateTitle);
        const blob = new Blob([jsonGameData], { type: 'application/json' });

        const event = {
            target: {
                files: [blob],
            },
        } as unknown as Event;

        spyOn(window, 'prompt').and.returnValues(newGameTitle, null);
        const resolvedGame = await component.importGame(event);

        expect(resolvedGame?.title).toEqual(newGameTitle);
    });

    it('should add an error if the game has no questions', () => {
        const gameWithNoQuestions: Game = {
            id: 'h93bd8',
            title: 'Game with no question',
            description: 'Description of Game',
            isVisible: true,
            lastModification: new Date('2023-10-01T10:00:00'),
            duration: 20,
            questions: [],
        };

        const errors = component.validateGame(gameWithNoQuestions);

        expect(errors).toContain('Le jeu doit contenir au moins une question.');
    });

    it('should add an error if a QCM question has not at least one correct and one incorrect choice.', () => {
        const gameWithIncorrectChoiceType = mockGames[0];
        gameWithIncorrectChoiceType.questions[0].choices[1].isCorrect = true;

        const errors = component.validateGame(gameWithIncorrectChoiceType);

        expect(errors).toContain('Les questions QCM doivent contenir au moins un bon et un mauvais choix.');
    });

    it('should add an error if a QCM question has too many or not enough choices', () => {
        const gameWithOneChoice: Game = {
            id: 'h93bd8',
            title: 'Game with no question',
            description: 'Description of Game',
            isVisible: true,
            lastModification: new Date('2023-10-01T10:00:00'),
            duration: 20,
            questions: [
                {
                    id: '1',
                    type: 'QCM',
                    text: 'Question 1 and more characters to show of the truncation',
                    points: 20,
                    choices: [{ text: 'Choix 1', isCorrect: true }],
                },
            ],
        };

        const gameWithManyChoices: Game = {
            id: 'h93bd8',
            title: 'Game with no question',
            description: 'Description of Game',
            isVisible: true,
            lastModification: new Date('2023-10-01T10:00:00'),
            duration: 20,
            questions: [
                {
                    id: '1',
                    type: 'QCM',
                    text: 'Question 1 and more characters to show of the truncation',
                    points: 20,
                    choices: [
                        { text: 'Choix 1', isCorrect: true },
                        { text: 'Choix 2', isCorrect: false },
                        { text: 'Choix 3', isCorrect: true },
                        { text: 'Choix 4', isCorrect: false },
                        { text: 'Choix 5', isCorrect: true },
                    ],
                },
            ],
        };

        const errors = component.validateGame(gameWithOneChoice);
        const errors2 = component.validateGame(gameWithManyChoices);
        expect(errors).toContain('Les questions QCM doivent contenir entre 2 et 4 choix de réponse inclusivement.');
        expect(errors2).toContain('Les questions QCM doivent contenir entre 2 et 4 choix de réponse inclusivement.');
    });

    it('should add an error if question points is less than 10, greater than 100 or not a multiple of 10', () => {
        const gameWithIncorrectPoints = mockGames[0];
        const TOO_MANY_POINTS = 200;
        const NOT_MULTIPLE_OF_TEN_POINTS = 35;

        gameWithIncorrectPoints.questions[0].points = TOO_MANY_POINTS;
        const error2 = component.validateGame(gameWithIncorrectPoints);
        expect(error2).toContain('Chaque question doit valoir entre 10 et 100 points, multiple de 10.');
        gameWithIncorrectPoints.questions[0].points = NOT_MULTIPLE_OF_TEN_POINTS;
        const error3 = component.validateGame(gameWithIncorrectPoints);
        expect(error3).toContain('Chaque question doit valoir entre 10 et 100 points, multiple de 10.');
    });

    it('should add an error if QCM question duration is less than 10 or greater than 60 seconds.', () => {
        const WRONG_DURATION = 5;
        const gameWithWrongDuration = mockGames[0];
        gameWithWrongDuration.duration = WRONG_DURATION;
        const errors = component.validateGame(gameWithWrongDuration);
        expect(errors).toContain('Le temps pour chaque question QCM doit être entre 10 et 60 secondes.');
    });

    it('should fetch and set games on ngOnInit', () => {
        const games = [...mockGames];
        spyOn(gameService, 'getAllGames').and.returnValue(of(games));
        component.ngOnInit();
        expect(gameService.getAllGames).toHaveBeenCalled();
        expect(component.games).toEqual(games);
    });
});
