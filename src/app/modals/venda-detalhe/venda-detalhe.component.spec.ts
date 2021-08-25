import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaDetalheComponent } from './venda-detalhe.component';

describe('VendaDetalheComponent', () => {
  let component: VendaDetalheComponent;
  let fixture: ComponentFixture<VendaDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendaDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
