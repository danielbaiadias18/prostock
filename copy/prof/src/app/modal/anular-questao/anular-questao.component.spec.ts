import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnularQuestaoComponent } from './anular-questao.component';

describe('AnularQuestaoComponent', () => {
  let component: AnularQuestaoComponent;
  let fixture: ComponentFixture<AnularQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnularQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnularQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
