import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaRelComponent } from './venda-rel.component';

describe('VendaRelComponent', () => {
  let component: VendaRelComponent;
  let fixture: ComponentFixture<VendaRelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendaRelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
