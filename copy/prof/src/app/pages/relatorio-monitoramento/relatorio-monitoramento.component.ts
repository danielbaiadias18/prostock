import { Component, OnInit, Renderer2 } from '@angular/core';
import { trigger, stagger, animateChild, query, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { iAvaliacao } from 'src/app/models/Avaliacao';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iSerie } from 'src/app/models/Serie';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { iTurma } from 'src/app/models/Turma';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-relatorio-monitoramento',
  templateUrl: './relatorio-monitoramento.component.html',
  styleUrls: ['./relatorio-monitoramento.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(300, animateChild()))
      ]),
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ])
  ]
})
export class RelatorioMonitoramentoComponent implements OnInit {

  cdDisciplina: number = 0;
  cdSerie: string = "";
  cdTurma: number = 0;
  series: iSerie[] = [];
  disciplinas: iDisciplina[] = [];
  turmas: iTurma[] = [];
  avaliacoes: iAvaliacao[] = [];
  pesquisar: FormGroup;
  modal: BsModalRef;
  linkApi: string;

  constructor(
    private modalService: BsModalService,
    private renderer: Renderer2,
    private api: ApiService,
    fb: FormBuilder,
    private auth: AuthenticationService,
    private config: ConfigService
  ) {
    this.pesquisar = fb.group({
      cdDisciplina: [0, Validators.required],
      cdSerie: [0, Validators.required],
    });
    config.Ready(config => this.linkApi = config.api_url);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this.api.api(HttpMethod.GET, `avaliacao/correcao/ddl`)
      .then(res => {
        this.disciplinas = res.Disciplinas;
        this.series = res.Series;
        this.pesquisar.controls.cdSerie.setValue(this.series[0].cdSerie);
        this.pesquisar.controls.cdDisciplina.setValue(this.disciplinas[0].cdDisciplina);
        this.pesquisarAvaliacoes();

      });

  }

  gerarMonitoramentoResultado(cdAvaliacao: number){
    this.api.api(HttpMethod.GET, `relatorio/monitoramentoresultado/avaliacao/${cdAvaliacao}/serie/${this.pesquisar.controls.cdSerie.value}/disciplina/${this.pesquisar.controls.cdDisciplina.value}`)
      .then(res => {
      });
  }

  pesquisarAvaliacoes() {
    this.cdDisciplina = this.pesquisar.controls.cdDisciplina.value;
    this.cdSerie = this.pesquisar.controls.cdSerie.value;
    this.api.api(HttpMethod.GET, `avaliacao/correcao/pesquisa/serie/${this.cdSerie}/disciplina/${this.cdDisciplina > 0 ? this.cdDisciplina : 0}/turma/${this.cdTurma > 0 ? this.cdTurma : 0}`)
      .then(res => {
        this.avaliacoes = res;
      });
  }


  relatorio() {
    this.api.api(HttpMethod.GET, `relatorio/relatorioPdf`)
      .then(res => {
      });
  }

}
