import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralVideoComponent } from './central-video.component';

describe('CentralVideoComponent', () => {
  let component: CentralVideoComponent;
  let fixture: ComponentFixture<CentralVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
