import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrilhaComponent } from './trilha.component';

describe('TrilhaComponent', () => {
  let component: TrilhaComponent;
  let fixture: ComponentFixture<TrilhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrilhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrilhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
