import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatRegisterComponent } from './retreat-register.component';

describe('RetreatRegisterComponent', () => {
  let component: RetreatRegisterComponent;
  let fixture: ComponentFixture<RetreatRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
