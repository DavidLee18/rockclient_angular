import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiSignUpComponent } from './semi-sign-up.component';

describe('SemiSignUpComponent', () => {
  let component: SemiSignUpComponent;
  let fixture: ComponentFixture<SemiSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemiSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
