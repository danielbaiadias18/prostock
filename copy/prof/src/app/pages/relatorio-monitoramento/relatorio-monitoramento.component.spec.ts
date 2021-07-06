import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioMonitoramentoComponent } from './relatorio-monitoramento.component';

describe('RelatorioMonitoramentoComponent', () => {
  let component: RelatorioMonitoramentoComponent;
  let fixture: ComponentFixture<RelatorioMonitoramentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioMonitoramentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioMonitoramentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
