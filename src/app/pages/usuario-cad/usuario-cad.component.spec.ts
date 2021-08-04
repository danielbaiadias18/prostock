import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCadComponent } from './usuario-cad.component';

describe('UsuarioCadComponent', () => {
  let component: UsuarioCadComponent;
  let fixture: ComponentFixture<UsuarioCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
