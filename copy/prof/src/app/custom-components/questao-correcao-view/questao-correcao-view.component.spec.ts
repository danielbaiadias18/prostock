import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoCorrecaoViewComponent } from './questao-correcao-view.component';

describe('QuestaoCorrecaoViewComponent', () => {
  let component: QuestaoCorrecaoViewComponent;
  let fixture: ComponentFixture<QuestaoCorrecaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoCorrecaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoCorrecaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
