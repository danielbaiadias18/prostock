import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarAvaliacaoComponent } from './visualizar-avaliacao.component';

describe('VisualizarAvaliacaoComponent', () => {
  let component: VisualizarAvaliacaoComponent;
  let fixture: ComponentFixture<VisualizarAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
