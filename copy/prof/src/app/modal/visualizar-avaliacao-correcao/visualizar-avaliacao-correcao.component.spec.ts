import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarAvaliacaoCorrecaoComponent } from './visualizar-avaliacao-correcao.component';

describe('VisualizarAvaliacaoCorrecaoComponent', () => {
  let component: VisualizarAvaliacaoCorrecaoComponent;
  let fixture: ComponentFixture<VisualizarAvaliacaoCorrecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarAvaliacaoCorrecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarAvaliacaoCorrecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
