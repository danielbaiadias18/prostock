import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCadComponent } from './cliente-cad.component';

describe('ClienteCadComponent', () => {
  let component: ClienteCadComponent;
  let fixture: ComponentFixture<ClienteCadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteCadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
