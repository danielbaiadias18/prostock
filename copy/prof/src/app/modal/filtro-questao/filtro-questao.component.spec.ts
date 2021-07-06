import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroQuestaoComponent } from './filtro-questao.component';

describe('FiltroQuestaoComponent', () => {
  let component: FiltroQuestaoComponent;
  let fixture: ComponentFixture<FiltroQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
