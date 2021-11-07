import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaDetalheRelComponent } from './venda-detalhe-rel.component';

describe('VendaDetalheRelComponent', () => {
  let component: VendaDetalheRelComponent;
  let fixture: ComponentFixture<VendaDetalheRelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendaDetalheRelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaDetalheRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
