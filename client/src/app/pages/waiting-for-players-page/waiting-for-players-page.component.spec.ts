import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForPlayersPageComponent } from './waiting-for-players-page.component';

describe('WaitingForPlayersPageComponent', () => {
    let component: WaitingForPlayersPageComponent;
    let fixture: ComponentFixture<WaitingForPlayersPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WaitingForPlayersPageComponent],
        });
        fixture = TestBed.createComponent(WaitingForPlayersPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
