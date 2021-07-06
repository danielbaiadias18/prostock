import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoViewComponent } from './questao-view.component';

describe('QuestaoViewComponent', () => {
  let component: QuestaoViewComponent;
  let fixture: ComponentFixture<QuestaoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
