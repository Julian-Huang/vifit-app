import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeapButtonComponent } from './leap-button.component';

describe('LeapButtonComponent', () => {
  let component: LeapButtonComponent;
  let fixture: ComponentFixture<LeapButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeapButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeapButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
