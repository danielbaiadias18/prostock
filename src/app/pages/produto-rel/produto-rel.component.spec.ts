import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoRelComponent } from './produto-rel.component';

describe('ProdutoRelComponent', () => {
  let component: ProdutoRelComponent;
  let fixture: ComponentFixture<ProdutoRelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoRelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
