import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erro500Component } from './erro500.component';

describe('Erro500Component', () => {
  let component: Erro500Component;
  let fixture: ComponentFixture<Erro500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erro500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erro500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
