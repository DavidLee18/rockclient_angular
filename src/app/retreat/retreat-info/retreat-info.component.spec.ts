import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatInfoComponent } from './retreat-info.component';

describe('RetreatInfoComponent', () => {
  let component: RetreatInfoComponent;
  let fixture: ComponentFixture<RetreatInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
