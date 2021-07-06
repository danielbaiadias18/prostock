import { Component, OnInit, EventEmitter, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Variantes } from '../../models/Variantes';
import { FiltroAvaliacaoComponent } from '../../modal/filtro-avaliacao/filtro-avaliacao.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { ApiService, HttpMethod } from '../../services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { LoadingService } from '../../helpers/loading-screen/loading-screen.service';
import { iAvaliacao } from '../../models/Avaliacao';
import { VisualizarAvaliacaoComponent } from '../../modal/visualizar-avaliacao/visualizar-avaliacao.component';
import { DuplicarAvaliacaoComponent } from '../../modal/duplicar-avaliacao/duplicar-avaliacao.component';
import { VincularAlunosAvaliacaoComponent } from '../../modal/vincular-alunos-avaliacao/vincular-alunos-avaliacao.component';
import Swal from 'sweetalert2';
import { AnularQuestaoComponent } from 'src/app/modal/anular-questao/anular-questao.component';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';

declare var $: any;

//#region Component

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss'],
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
export class AvaliacaoComponent implements OnInit, OnDestroy {

  //#region Atributos

  @ViewChild(DataTableDirective) dt: DataTableDirective;

  dtOptions: DataTables.Settings = {}
  showFilters = false;
  modal: BsModalRef;
  pesquisar: FormGroup;

  filtros: iFiltro[] = [];
  menuLength: number = 10;

  addFiltroEmitter: EventEmitter<iFiltro[]> = new EventEmitter<iFiltro[]>();
  addDuplicarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  vincularAlunosEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  validarAvaliacaoEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  anularQuestaoEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  avaliacoes;

  //#endregion

  constructor(
    private modalService: BsModalService,
    fb: FormBuilder,
    private api: ApiService,
    private renderer: Renderer2,
    private loading: LoadingService,
    private vincular: VincularQuestaoService) {
    this.pesquisar = fb.group({
      tipo: ['2'],
      text: ['', Validators.required]
    });

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[1, 'desc']],
      pageLength: 10,
      columnDefs: [
        {
          targets: [0],
          searchable: false,
          orderable: false
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
          this.addFiltro(f, false, +f.tipo);

        setTimeout(() => this.upDateWithFilter(), 300);
      }
    });

    this.addDuplicarEmitter.subscribe((x: boolean) => {
      if (x) {
        this.loading.load(async () => {
          setTimeout(() => this.upDateWithFilter(), 300);
        })
      }
    });

    this.validarAvaliacaoEmitter.subscribe((x: boolean) => {
      if (x) {
        this.loading.load(async () => {
          setTimeout(() => this.upDateWithFilter(), 300);
        })
      }
    });

    this.loading.load(async () => {
      await new Promise<void>(ok => setTimeout(() => ok(), 500));
      await this.api.api(HttpMethod.GET, 'avaliacao').then(res => {
        this.avaliacoes = res;
      });
    })
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'sidebar-collapse');
  }

  show() {
    this.modal = this.modalService.show(FiltroAvaliacaoComponent, { animated: true, class: 'modal-lg' });
    this.modal.content.addFiltroEmitter = this.addFiltroEmitter;
  }

  showDuplicar(avaliacao: iAvaliacao) {
    this.modal = this.modalService.show(DuplicarAvaliacaoComponent, { animated: true, class: 'modal-md' });
    (this.modal.content.dupAvaliacao as EventEmitter<number>).emit(avaliacao.cdAvaliacao);
    this.modal.content.addDuplicarEmitter = this.addDuplicarEmitter;
  }

  showVincularAlunos(avaliacao: iAvaliacao) {
    this.modal = this.modalService.show(VincularAlunosAvaliacaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.vincularAlunosEmitter as EventEmitter<number>).emit(avaliacao.cdAvaliacao);
    this.modal.content.vincularAlunosEmitter = this.vincularAlunosEmitter;
  }

  showAnularQuestao(avaliacao: iAvaliacao) {
    this.modal = this.modalService.show(AnularQuestaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.anularQuestaoEmitter as EventEmitter<number>).emit(avaliacao.cdAvaliacao);
    this.modal.content.anularQuestaoEmitter = this.anularQuestaoEmitter;
  }

  addFiltro(value: iFiltro, upDate: boolean, ...tipo: number[]) {
    const index = this.filtros.findIndex(x => tipo.indexOf(+x.tipo) > -1);
    if (index == -1) {
      let temp: iFiltro = {
        text: value.text,
        value: value.value ? value.value : value.text,
        tipo: +value.tipo,
      };

      switch (+value.tipo) {
        case 1:
          temp.label = "Código";
          break;
        case 2:
          temp.label = "Nome";
          break;
        case 3:
          temp.label = "Valor";
          break;
        case 4:
          temp.label = "Status";
          break;
        case 5:
          temp.label = "Disciplina";
          break;
        case 6:
          temp.label = "Área do Conhecimento";
          break;
        case 7:
          temp.label = "Série";
          break;
        default:
          temp.label = value.label;
          break;
      }

      this.filtros.push(temp);

      if (upDate)
        setTimeout(() => this.upDateWithFilter(), 300);
      return;
    }

    this.filtros[index].value = value.value ? value.value : value.text;
    this.filtros[index].tipo = +value.tipo;
    this.filtros[index].text = value.text;

    switch (+value.tipo) {
      case 1:
        this.filtros[index].label = "Código";
        break;
      case 2:
        this.filtros[index].label = "Nome";
        break;
      case 3:
        this.filtros[index].label = "Valor";
        break;
      case 4:
        this.filtros[index].label = "Status";
        break;
      case 5:
        this.filtros[index].label = "Disciplina";
        break;
      case 6:
        this.filtros[index].label = "Área do Conhecimento";
        break;
      case 7:
        this.filtros[index].label = "Série";
        break;
      default:
        this.filtros[index].label = value.label;
        break;
    }

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

  upDateWithFilter() {
    this.avaliacoes = null;
    this.loading.load(async () => {
      let filtroAvaliacao: iFiltroAvaliacao = new FiltroAvaliacao(this.filtros);
      await this.api
        .api(HttpMethod.POST,
          `avaliacao/filtroAvaliacao`, filtroAvaliacao)
        .then(res => {
          this.avaliacoes = res;
        });
    })
  }

  visualizarAvaliacao(avaliacao: iAvaliacao) {
    this.modal = this.modalService.show(VisualizarAvaliacaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addAvaliacao as EventEmitter<number>).emit(avaliacao.cdAvaliacao);
    this.modal.content.validarAvaliacaoEmitter = this.validarAvaliacaoEmitter;
  }

  async desativar(avaliacao: iAvaliacao) {
    let alert: Promise<boolean> = new Promise((ok) => {
      if (!avaliacao.idAtivo)
        ok(true);
      else
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Deseja realmente desativar esta avaliação?",
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
      this.api.api(HttpMethod.DELETE, `avaliacao/${avaliacao.cdAvaliacao}`)
        .then(() => {
          avaliacao.idAtivo = !avaliacao.idAtivo;

          const toast = Swal.mixin({
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top-end'
          });

          toast.fire(`Avaliação ${avaliacao.idAtivo ? 'ativada' : 'desativada'} com sucesso`);
        });
  }
  //#endregion

  Enviar(avaliacao: iAvaliacao) {
    this.api.api(HttpMethod.GET, `avaliacao/${avaliacao.cdAvaliacao}/enviar`)
      .then(res => {
        if (!res) {
          const toast = Swal.mixin({
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top-end'
          });

          toast.fire('Avaliação enviada para a validação com sucesso');

          avaliacao.cdStatus = 2;
          avaliacao.nmStatus = "Aguardando Validação";
        }
      })
  }

  async alertSubstituir(): Promise<boolean> {
    return new Promise((ok) => {
      if (!this.vincular.isVinculando) ok(true)
      else
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Um processo de vinculação de questão já se encontra em andamento, esta operação irá cancelar a que está sendo feita.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then(result => {
          if (result.value) { ok(true); } else { ok(false); }
        })
    });
  }

  async vincularQuestao(avaliacao: iAvaliacao) {
    if (await this.alertSubstituir())
      this.vincular.setAvaliacao(avaliacao);
  }
}

//#region Classes e Interfaces complementares

class FiltroAvaliacao implements iFiltroAvaliacao {
  cdAvaliacaoTipo?: number;
  cdAvaliacaoSubTipo?: number;
  cdEtapa?: number;
  cdSegmento?: number;
  cdAreaConhecimento?: number;
  cdPesquisarEm?: number
  cdTipoPesquisa?: number;
  txtPesquisa?: string;

  constructor(filtros: iFiltro[]) {
    for (let filtro of filtros) {

      switch (filtro.tipo) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          this.cdPesquisarEm = filtro.tipo;
          this.txtPesquisa = filtro.value;
          break;
        case 8:
          this.cdAvaliacaoTipo = +filtro.value;
          break;
        case 9:
          this.cdAvaliacaoSubTipo = +filtro.value;
          break;
        case 10:
          this.cdEtapa = +filtro.value;
          break;
        case 11:
          this.cdSegmento = +filtro.value;
          break;
        case 12:
          this.cdAreaConhecimento = +filtro.value;
          break;
      }
    }
  }
}

interface iFiltroAvaliacao {
  cdAvaliacaoTipo?: number;
  cdAvaliacaoSubTipo?: number;
  cdEtapa?: number;
  cdSegmento?: number;
  cdAreaConhecimento?: number;
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