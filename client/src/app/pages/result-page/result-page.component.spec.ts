import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { ResultPageComponent } from './result-page.component';

describe('ResultPageComponent', () => {
    let router: Router;
    let component: ResultPageComponent;
    let fixture: ComponentFixture<ResultPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResultPageComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'creategame', component: CreateGamePageComponent }])],
        });
        fixture = TestBed.createComponent(ResultPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        router = TestBed.inject(Router);
        router.initialNavigation();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('quitting should redirect to /creategame', () => {
        const spy1 = spyOn(router, 'navigateByUrl');
        component.quitGame();
        expect(spy1).toHaveBeenCalledWith('/creategame');
    });
});
