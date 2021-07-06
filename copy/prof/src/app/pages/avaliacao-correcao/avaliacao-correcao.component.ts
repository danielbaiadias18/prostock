import { Component, OnInit, Renderer2, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { ApiService, HttpMethod, HttpMethodBody, iModel } from '../../services/api.service';
import { iAvaliacaoCorrecao, iAvaliacao } from 'src/app/models/Avaliacao';
import { AuthenticationService } from '../../services/authentication.service';
import { iSerie } from 'src/app/models/Serie';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iTurma } from 'src/app/models/Turma';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ExibirNotaComponent } from 'src/app/modal/exibir-nota/exibir-nota.component';
import { iAlunoAvaliacao, iAlunoAvaliacao2, iAvaliacaoAlunoResposta } from 'src/app/models/AlunoAvaliacao';
import { VisualizarAvaliacaoCorrecaoComponent } from 'src/app/modal/visualizar-avaliacao-correcao/visualizar-avaliacao-correcao.component';

import Swal from 'sweetalert2';
import { ConfigService } from 'src/app/services/config.service';
import { iPeriodoLetivo } from 'src/app/models/PeriodoLetivo';

@Component({
  selector: 'app-avaliacao-correcao',
  templateUrl: './avaliacao-correcao.component.html',
  styleUrls: ['./avaliacao-correcao.component.scss'],
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
export class AvaliacaoCorrecaoComponent implements OnInit {

  avaliacaoCorrecao: iAvaliacaoCorrecao;
  cdDisciplina: number = 0;
  cdSerie: string = "";
  cdTurma: number = 0;
  cdPeriodoLetivo: number = 0;
  series: iSerie[] = [];
  disciplinas: iDisciplina[] = [];
  turmas: iTurma[] = [];
  periodoLetivo: iPeriodoLetivo[] = [];
  avaliacoes: iAvaliacao[] = [];
  pesquisar: FormGroup;
  avaliacaoAberta: boolean = false;
  avaliacaoEscolhida: iAvaliacao;
  modal: BsModalRef;
  avaliacaoAlunos: iAlunoAvaliacao2[] = [];
  avaliacaoAlunoResposta: iAvaliacaoAlunoResposta;
  fileToUpload: File = null;
  fileName: string = "";
  baseUrl: string;
  indexAvaliacao: number;

  constructor(
    private modalService: BsModalService,
    private renderer: Renderer2,
    private api: ApiService,
    fb: FormBuilder,
    private auth: AuthenticationService,
    config: ConfigService) {
    this.pesquisar = fb.group({
      cdDisciplina: [0, Validators.required],
      cdSerie: [0, Validators.required],
      cdTurma: [0],
      cdPeriodoLetivo: [0]
    });

    config.Ready(config => this.baseUrl = config.api_url);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this.api.api(HttpMethod.GET, `avaliacao/correcao/ddl`)
      .then(async res => {
        this.avaliacaoCorrecao = res;
        this.disciplinas = res.Disciplinas;
        this.series = res.Series;
        this.periodoLetivo = res.PeriodoLetivos;
        this.pesquisar.controls.cdSerie.setValue(this.series[0].cdSerie);
        this.pesquisar.controls.cdDisciplina.setValue(this.disciplinas[0].cdDisciplina);
        this.pesquisar.controls.cdPeriodoLetivo.setValue(this.periodoLetivo[0].cdPeriodoLetivo);
        await this.carregaTurma().then(x => {
          this.pesquisarAvaliacoes();
        });
      });

    // this.removeSeta();
  }

  fileInput(fileInput: Event) {
    let file = (fileInput.target as HTMLInputElement).files[0];
    this.fileName = file.name;

    this.api.File(HttpMethodBody.POST,
      `correcao/avaliacao/${this.avaliacaoEscolhida.cdAvaliacao}/turma/${this.pesquisar.controls.cdTurma.value}/serie/${this.pesquisar.controls.cdSerie.value}/empresa/${this.auth.currentUserValue.cdEmpresa}`,
      file)
      .then(() => {
        Swal.fire(
          'Correção de Avaliação',
          'Importado com sucesso',
          'success');

        (fileInput.target as HTMLInputElement).value = "";
        this.abrirAvaliacao(this.avaliacaoEscolhida.cdAvaliacao);
      })
      .catch((err) => {
        Swal.fire('Correção de Avaliação',
          err instanceof iModel ? err.Message : err,
          'error');

        (fileInput.target as HTMLInputElement).value = "";
      })
  }

  async carregaTurma() {
    this.turmas = [];
    this.pesquisar.controls.cdTurma.setValue('');
    this.cdSerie = this.pesquisar.controls.cdSerie.value;
    this.cdPeriodoLetivo = this.pesquisar.controls.cdPeriodoLetivo.value;
    await this.api.api(HttpMethod.GET, `turma/serie/${this.cdSerie}/${this.auth.currentUserValue.cdEmpresa}/${this.cdPeriodoLetivo}`)
      .then(res => {
        this.turmas = res;
      });
  }

  visualizarAvaliacao(cdAvaliacao: number, cdAvaliacaoAluno: number) {
    this.modal = this.modalService.show(VisualizarAvaliacaoCorrecaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addAvaliacao as EventEmitter<number>).emit(cdAvaliacao);
    (this.modal.content.addAvaliacaoAluno as EventEmitter<number>).emit(cdAvaliacaoAluno);
  }

  pesquisarAvaliacoes() {
    this.avaliacaoAberta = false
    this.cdDisciplina = this.pesquisar.controls.cdDisciplina.value;
    this.cdSerie = this.pesquisar.controls.cdSerie.value;
    this.cdTurma = this.pesquisar.controls.cdTurma.value;
    this.cdPeriodoLetivo = this.pesquisar.controls.cdPeriodoLetivo.value;
    this.api.api(HttpMethod.GET, `avaliacao/correcao/pesquisa/serie/${+this.cdSerie}/disciplina/${this.cdDisciplina > 0 ? this.cdDisciplina : 0}/turma/${this.cdTurma > 0 ? this.cdTurma : 0}/periodo/${this.cdPeriodoLetivo > 0 ? this.cdPeriodoLetivo : 0}`)
      .then(res => {
        this.avaliacoes = res;
      });
  }

  imprimirCorrecaoAvaliacao(cdAvaliacao: number) {
    return `${this.baseUrl}relatorio/impressaoCorrecaoAvaliacao/avaliacao/${cdAvaliacao}/serie/${this.pesquisar.controls.cdSerie.value}/disciplina/${this.pesquisar.controls.cdDisciplina.value}/turma/${this.pesquisar.controls.cdTurma.value}`;
  }

  relNotasPorDisciplina(cdAvaliacao: number) {
    return `${this.baseUrl}relatorio/notaspordisciplina/avaliacao/${cdAvaliacao}`;
  }

  abrirAvaliacao(cdAvaliacao: number) {
    this.avaliacaoEscolhida = null;
    this.avaliacaoAberta = true;
    this.avaliacaoEscolhida = this.avaliacoes.find(x => x.cdAvaliacao == cdAvaliacao);
    this.indexAvaliacao = this.avaliacoes.findIndex(x => x.cdAvaliacao == cdAvaliacao);

    if(this.pesquisar.controls.cdTurma.value)
    this.api.api(HttpMethod.GET, `avaliacao/avaliacaoalunos/avaliacao/${cdAvaliacao}/turma/${this.pesquisar.controls.cdTurma.value}`)
      .then(res => {
        this.avaliacaoAlunos = res;
      });
  }

  exibirNotas(cdAvaliacaoAluno: number) {
    this.modal = this.modalService.show(ExibirNotaComponent, { animated: true, class: 'modal-md' });
    (this.modal.content.carregarNotas as EventEmitter<number>).emit(cdAvaliacaoAluno);
  }
}
