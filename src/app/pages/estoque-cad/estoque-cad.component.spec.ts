import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueCadComponent } from './estoque-cad.component';

describe('EstoqueCadComponent', () => {
  let component: EstoqueCadComponent;
  let fixture: ComponentFixture<EstoqueCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstoqueCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstoqueCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
