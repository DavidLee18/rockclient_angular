import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatComponent } from './retreat.component';

describe('RetreatComponent', () => {
  let component: RetreatComponent;
  let fixture: ComponentFixture<RetreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
