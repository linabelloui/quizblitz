import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InGameService } from '@app/services/in-game.service';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-result-page',
    templateUrl: './result-page.component.html',
    styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent {
    inGameService = inject(InGameService);
    faTrophy = faTrophy;
    score = this.inGameService.getCurrentPoints();

    constructor(private router: Router) {}

    quitGame() {
        this.router.navigateByUrl('/creategame');
    }
}
