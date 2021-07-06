import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicarQuestaoComponent } from './duplicar-questao.component';

describe('DuplicarQuestaoComponent', () => {
  let component: DuplicarQuestaoComponent;
  let fixture: ComponentFixture<DuplicarQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicarQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicarQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
