import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroVideoComponent } from './filtro-video.component';

describe('FiltroVideoComponent', () => {
  let component: FiltroVideoComponent;
  let fixture: ComponentFixture<FiltroVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
