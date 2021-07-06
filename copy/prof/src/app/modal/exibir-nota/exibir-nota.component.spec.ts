import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirNotaComponent } from './exibir-nota.component';

describe('ExibirNotaComponent', () => {
  let component: ExibirNotaComponent;
  let fixture: ComponentFixture<ExibirNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExibirNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExibirNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
