import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackStrengthComponent } from './back-strength.component';

describe('BackStrengthComponent', () => {
  let component: BackStrengthComponent;
  let fixture: ComponentFixture<BackStrengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackStrengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
