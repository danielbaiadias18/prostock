import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioBtnComponent } from './custom-radio-btn.component';

describe('CustomRadioBtnComponent', () => {
  let component: CustomRadioBtnComponent;
  let fixture: ComponentFixture<CustomRadioBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRadioBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
