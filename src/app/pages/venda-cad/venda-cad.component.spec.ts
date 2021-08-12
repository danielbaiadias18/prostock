import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaCadComponent } from './venda-cad.component';

describe('VendaCadComponent', () => {
  let component: VendaCadComponent;
  let fixture: ComponentFixture<VendaCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendaCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
