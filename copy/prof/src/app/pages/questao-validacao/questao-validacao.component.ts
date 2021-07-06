import { Component, OnInit, EventEmitter, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Variantes } from '../../models/Variantes';
import { FiltroQuestaoComponent } from '../../modal/filtro-questao/filtro-questao.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { ApiService, HttpMethod } from '../../services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { LoadingService } from '../../helpers/loading-screen/loading-screen.service';
import { iQuestao } from '../../models/Questao';
import { VisualizarQuestaoComponent } from '../../modal/visualizar-questao/visualizar-questao.component';

declare var $: JQueryStatic;

import Swal from 'sweetalert2';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';
import { AvaliacaoUsoQuestaoComponent } from 'src/app/custom-components/avaliacao-uso-questao/avaliacao-uso-questao.component';
import { QuestaoValidarComponent } from 'src/app/modal/questao-validar/questao-validar.component';

//#region Component

@Component({
  selector: 'app-questao-validacao',
  templateUrl: './questao-validacao.component.html',
  styleUrls: ['./questao-validacao.component.scss'],
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
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            width: '0px', margin: '0px', padding: '0px'
          }))
      ])
    ])
  ]
})

//#endregion
export class QuestaoValidacaoComponent implements OnInit, OnDestroy {

  //#region Atributos

  @ViewChild(DataTableDirective) dt: DataTableDirective;

  dtOptions: DataTables.Settings = {}
  showFilters = false;
  modal: BsModalRef;
  pesquisar: FormGroup;

  filtros: iFiltro[] = [];

  addFiltroEmitter: EventEmitter<iFiltro[]> = new EventEmitter<iFiltro[]>();

  _questoes: iQuestao[];

  get questoes() {
    return this._questoes;
  }

  //#endregion

  constructor(
    private modalService: BsModalService,
    fb: FormBuilder,
    private api: ApiService,
    private renderer: Renderer2,
    private loading: LoadingService,
    public vincular: VincularQuestaoService) {
    this.pesquisar = fb.group({
      tipo: ['2'],
      text: ['', Validators.required]
    });

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[7, 'asc'], [2, 'desc']],
      pageLength: 11,
      columnDefs: [
        {
          targets: [0],
          searchable: false,
          orderable: false
        },
        {
          targets: [1],
          searchable: false,
          orderable: false
        },
        {
          targets: [7],
          visible: false
        }
      ]
    }
  }

  //#region Métodos

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this.addFiltroEmitter.subscribe((filtro: iFiltro[]) => {
      if (filtro && filtro.length > 0) {
        for (let f of filtro)
          this.addFiltro(f, false, f.tipo);

        setTimeout(() => this.upDateWithFilter(), 300);
      }
    });

    this.loading.load(async () => {
      await new Promise<void>(ok => setTimeout(() => ok(), 500));
      await this.api.api(HttpMethod.GET, 'questao').then(res => {
        this._questoes = res;
      });
    });

  }

  ngOnDestroy() {
    // this.renderer.removeClass(document.body, 'sidebar-collapse');
  }

  retornaCor(cdQuestaoStatus: number) {
    if (cdQuestaoStatus == 1 || cdQuestaoStatus == 2) {
      return "#006eff";
    } else if (cdQuestaoStatus == 3 || cdQuestaoStatus == 4) {
      return "#ad0000";
    }
  }

  show() {
    this.modal = this.modalService.show(FiltroQuestaoComponent, { animated: true, class: 'modal-xl' });
    this.modal.content.addFiltroEmitter = this.addFiltroEmitter;
  }

  addFiltro(value: iFiltro, upDate: boolean, ...tipo: number[]) {
    const index = this.filtros.findIndex(x => tipo.indexOf(+x.tipo) > -1);
    if (index == -1) {
      this.filtros.push({
        text: value.text,
        value: value.value ? value.value : value.text,
        tipo: +value.tipo,
        label: value.tipo == 1 ?
          "Código" :
          value.tipo == 2 ?
            "Suporte" :
            value.label
      });

      if (upDate)
        setTimeout(() => this.upDateWithFilter(), 300);
      return;
    }

    this.filtros[index].value = value.value ? value.value : value.text;
    this.filtros[index].tipo = +value.tipo;
    this.filtros[index].text = value.text;
    this.filtros[index].label = value.tipo == 1 ? "Código" : value.tipo == 2 ? "Suporte" : value.label;

    if (upDate)
      setTimeout(() => this.upDateWithFilter(), 300);
  }

  rmFiltro(tipo: number);
  rmFiltro(value: iFiltro);
  rmFiltro(value: number | iFiltro) {
    const index: number = value instanceof Number ?
      this.filtros.findIndex(x => x.tipo == value) :
      this.filtros.indexOf(value as iFiltro);

    if (index !== -1) {
      this.filtros.splice(index, 1);
    }

    setTimeout(() => this.upDateWithFilter(), 300);
  }

  async desativar(questao: iQuestao) {
    let alert: Promise<boolean> = new Promise((ok) => {
      if (!questao.idAtivo)
        ok(true);
      else
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Deseja realmente desativar esta questão?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then(result => {
          if (result.value) { ok(true); } else { ok(false); }
        })
    });

    if (await alert)
      this.api.api(HttpMethod.DELETE, `questao/${questao.cdQuestao}`)
        .then(() => {
          questao.idAtivo = !questao.idAtivo;

          const toast = Swal.mixin({
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top-end'
          });

          toast.fire(`Questão ${questao.idAtivo ? 'ativada' : 'desativada'} com sucesso`);
        });
  }

  upDateWithFilter() {
    this._questoes = null;
    let filtroQuestao: iFiltroQuestao = new FiltroQuestao(this.filtros);
    this.loading.load(async () => {
      await this.api
        .api(HttpMethod.POST,
          `questao/filtroQuestao`, filtroQuestao)
        .then(res => {
          this._questoes = res;
        });
    })
  }

  visualizarQuestao(questao: iQuestao) {
    this.modal = this.modalService.show(QuestaoValidarComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addQuestao as EventEmitter<number>).emit(questao.cdQuestao);
    (this.modal.content.addQuestao as EventEmitter<number>).subscribe(()=> {
      this.api.api(HttpMethod.GET, 'questao').then(res => {
        this._questoes = res;
      });
    });
  }

  usoQuestao(questao: iQuestao) {
    this.modal = this.modalService.show(AvaliacaoUsoQuestaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addQuestao as EventEmitter<number>).emit(questao.cdQuestao);
  }

  vincularQuestao(questao: iQuestao) {
    this.vincular.addQuestao(questao);
  }

  //#endregion
}

//#region Classes e Interfaces complementares

class FiltroQuestao implements iFiltroQuestao {
  cdUsuario?: number;
  cdProfessor?: number;
  cdQuestaoTipo?: number;
  cdSerie?: number;
  cdAreaConhecimento?: number;
  cdDisciplina?: number;
  cdTopico?: number;
  cdSubTopico?: number;
  cdHabilidade?: number;
  cdDificuldade?: number;
  cdPesquisarEm?: number
  cdTipoPesquisa?: number;
  txtPesquisa?: string;

  constructor(filtros: iFiltro[]) {
    for (let filtro of filtros) {
      switch (filtro.tipo) {
        case 1:
        case 2:
          this.cdPesquisarEm = filtro.tipo;
          this.txtPesquisa = filtro.value;
          break;
        case 3:
          this.cdAreaConhecimento = +filtro.value;
          break;
        case 4:
          this.cdTopico = +filtro.value;
          break;
        case 5:
          this.cdDificuldade = +filtro.value;
          break;
        case 6:
          this.cdDisciplina = +filtro.value;
          break;
        case 7:
          this.cdHabilidade = +filtro.value;
          break;
        case 8:
          this.cdProfessor = +filtro.value;
          break;
        case 9:
          this.cdQuestaoTipo = +filtro.value;
          break;
        case 10:
          this.cdSerie = +filtro.value;
          break;
        case 11:
          this.cdSubTopico = +filtro.value;
          break;
        case 12:
          this.cdUsuario = +filtro.value;
          break;
      }
    }
  }
}

interface iFiltroQuestao {
  cdUsuario?: number;
  cdProfessor?: number;
  cdQuestaoTipo?: number;
  cdSerie?: number;
  cdAreaConhecimento?: number;
  cdDisciplina?: number;
  cdTopico?: number;
  cdSubTopico?: number;
  cdHabilidade?: number;
  cdDificuldade?: number;
  cdPesquisarEm?: number
  cdTipoPesquisa?: number;
  txtPesquisa?: string;
}

export interface iFiltro {
  tipo: number;
  text: string;
  value: string;
  label?: string;
}

//#endregion
