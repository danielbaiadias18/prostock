import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoUsoQuestaoComponent } from './avaliacao-uso-questao.component';

describe('AvaliacaoUsoQuestaoComponent', () => {
  let component: AvaliacaoUsoQuestaoComponent;
  let fixture: ComponentFixture<AvaliacaoUsoQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoUsoQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoUsoQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
