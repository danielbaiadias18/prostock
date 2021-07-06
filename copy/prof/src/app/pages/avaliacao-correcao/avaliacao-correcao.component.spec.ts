import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCorrecaoComponent } from './avaliacao-correcao.component';

describe('AvaliacaoCorrecaoComponent', () => {
  let component: AvaliacaoCorrecaoComponent;
  let fixture: ComponentFixture<AvaliacaoCorrecaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoCorrecaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoCorrecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
