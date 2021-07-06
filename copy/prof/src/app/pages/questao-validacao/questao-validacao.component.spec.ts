import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoValidacaoComponent } from './questao-validacao.component';

describe('QuestaoValidacaoComponent', () => {
  let component: QuestaoValidacaoComponent;
  let fixture: ComponentFixture<QuestaoValidacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoValidacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
