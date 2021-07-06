import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarVincularQuestaoComponent } from './visualizar-vincular-questao.component';

describe('VisualizarVincularQuestaoComponent', () => {
  let component: VisualizarVincularQuestaoComponent;
  let fixture: ComponentFixture<VisualizarVincularQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarVincularQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarVincularQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
