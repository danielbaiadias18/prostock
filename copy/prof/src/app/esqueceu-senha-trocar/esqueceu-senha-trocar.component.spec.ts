import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsqueceuSenhaTrocarComponent } from './esqueceu-senha-trocar.component';

describe('EsqueceuSenhaTrocarComponent', () => {
  let component: EsqueceuSenhaTrocarComponent;
  let fixture: ComponentFixture<EsqueceuSenhaTrocarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsqueceuSenhaTrocarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsqueceuSenhaTrocarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
