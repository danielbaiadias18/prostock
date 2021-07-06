import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoValidarComponent } from './questao-validar.component';

describe('QuestaoValidarComponent', () => {
  let component: QuestaoValidarComponent;
  let fixture: ComponentFixture<QuestaoValidarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoValidarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoValidarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
