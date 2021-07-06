import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularAlunosAvaliacaoComponent } from './vincular-alunos-avaliacao.component';

describe('VincularAlunosAvaliacaoComponent', () => {
  let component: VincularAlunosAvaliacaoComponent;
  let fixture: ComponentFixture<VincularAlunosAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularAlunosAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularAlunosAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
