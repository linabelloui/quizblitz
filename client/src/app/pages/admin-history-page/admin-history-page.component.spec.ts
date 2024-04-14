import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryPageComponent } from './admin-history-page.component';

describe('AdminHistoryPageComponent', () => {
    let component: AdminHistoryPageComponent;
    let fixture: ComponentFixture<AdminHistoryPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminHistoryPageComponent],
        });
        fixture = TestBed.createComponent(AdminHistoryPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
