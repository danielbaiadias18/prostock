import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroTrilhaComponent } from './filtro-trilha.component';

describe('FiltroTrilhaComponent', () => {
  let component: FiltroTrilhaComponent;
  let fixture: ComponentFixture<FiltroTrilhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroTrilhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroTrilhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
