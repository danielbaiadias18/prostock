import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTrilhaComponent } from './cadastro-trilha.component';

describe('CadastroTrilhaComponent', () => {
  let component: CadastroTrilhaComponent;
  let fixture: ComponentFixture<CadastroTrilhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroTrilhaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTrilhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
