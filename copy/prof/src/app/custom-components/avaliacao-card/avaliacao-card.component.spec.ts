import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCardComponent } from './avaliacao-card.component';

describe('AvaliacaoCardComponent', () => {
  let component: AvaliacaoCardComponent;
  let fixture: ComponentFixture<AvaliacaoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
