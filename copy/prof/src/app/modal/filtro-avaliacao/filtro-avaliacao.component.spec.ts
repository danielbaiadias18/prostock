import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroAvaliacaoComponent } from './filtro-avaliacao.component';

describe('FiltroAvaliacaoComponent', () => {
  let component: FiltroAvaliacaoComponent;
  let fixture: ComponentFixture<FiltroAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
