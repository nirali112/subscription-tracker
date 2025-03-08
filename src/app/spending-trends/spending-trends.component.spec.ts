import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingTrendsComponent } from './spending-trends.component';

describe('SpendingTrendsComponent', () => {
  let component: SpendingTrendsComponent;
  let fixture: ComponentFixture<SpendingTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
