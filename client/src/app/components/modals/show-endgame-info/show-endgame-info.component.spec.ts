import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowEndgameInfoComponent } from './show-endgame-info.component';

describe('ShowEndgameInfoComponent', () => {
    let component: ShowEndgameInfoComponent;
    let fixture: ComponentFixture<ShowEndgameInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShowEndgameInfoComponent],
            imports: [HttpClientModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowEndgameInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
