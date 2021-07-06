import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAvaliacaoComponent } from './cadastro-avaliacao.component';

describe('CadastroAvaliacaoComponent', () => {
  let component: CadastroAvaliacaoComponent;
  let fixture: ComponentFixture<CadastroAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroAvaliacaoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
