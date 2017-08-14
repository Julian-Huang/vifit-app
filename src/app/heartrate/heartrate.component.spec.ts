import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartrateComponent } from './heartrate.component';

describe('HeartrateComponent', () => {
  let component: HeartrateComponent;
  let fixture: ComponentFixture<HeartrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
