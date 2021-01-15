import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatMessagesComponent } from './retreat-messages.component';

describe('RetreatMessagesComponent', () => {
  let component: RetreatMessagesComponent;
  let fixture: ComponentFixture<RetreatMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
