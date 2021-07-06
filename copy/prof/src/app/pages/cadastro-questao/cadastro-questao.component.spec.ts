import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroQuestaoComponent } from './cadastro-questao.component';

describe('CadastroQuestaoComponent', () => {
  let component: CadastroQuestaoComponent;
  let fixture: ComponentFixture<CadastroQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
