import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicarAvaliacaoComponent } from './duplicar-avaliacao.component';

describe('DuplicarAvaliacaoComponent', () => {
  let component: DuplicarAvaliacaoComponent;
  let fixture: ComponentFixture<DuplicarAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicarAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicarAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
