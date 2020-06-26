import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatStatisticsComponent } from './retreat-statistics.component';

describe('Retreat.StatisticsComponent', () => {
  let component: RetreatStatisticsComponent;
  let fixture: ComponentFixture<RetreatStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
