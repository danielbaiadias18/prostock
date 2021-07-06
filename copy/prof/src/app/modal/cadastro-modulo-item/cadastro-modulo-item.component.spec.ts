import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroModuloItemComponent } from './cadastro-modulo-item.component';

describe('CadastroModuloItemComponent', () => {
  let component: CadastroModuloItemComponent;
  let fixture: ComponentFixture<CadastroModuloItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroModuloItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroModuloItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
