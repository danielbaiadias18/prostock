import { Component, OnInit, EventEmitter, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Variantes } from '../../models/Variantes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { ApiService, HttpMethod } from '../../services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { LoadingService } from '../../helpers/loading-screen/loading-screen.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { iTrilha } from 'src/app/models/Trilha';
import { FiltroTrilhaComponent } from 'src/app/modal/filtro-trilha/filtro-trilha.component';

declare var $: any;

//#region Component

@Component({
  selector: 'app-trilha',
  templateUrl: './trilha.component.html',
  styleUrls: ['./trilha.component.scss'],
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
export class TrilhaComponent implements OnInit, OnDestroy {

  //#region Atributos

  @ViewChild(DataTableDirective) dt: DataTableDirective;

  dtOptions: DataTables.Settings = {}
  showFilters = false;
  modal: BsModalRef;
  pesquisar: FormGroup;

  filtros: iFiltro[] = [];
  menuLength: number = 10;

  addFiltroEmitter: EventEmitter<iFiltro[]> = new EventEmitter<iFiltro[]>();
  validarTrilhaEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  trilhas;

  //#endregion

  constructor(
    private modalService: BsModalService,
    fb: FormBuilder,
    private api: ApiService,
    private renderer: Renderer2,
    private loading: LoadingService,
    private router: Router) {
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

    this.validarTrilhaEmitter.subscribe((x: boolean) => {
      if (x) {
        this.loading.load(async () => {
          setTimeout(() => this.upDateWithFilter(), 300);
        })
      }
    });

    this.loading.load(async () => {
      await new Promise<void>(ok => setTimeout(() => ok(), 500));
      await this.api.api(HttpMethod.GET, 'trilha').then(res => {
        this.trilhas = res;
      //  console.log(res, "res");
      });
    })
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'sidebar-collapse');
  }

  show() {
    this.modal = this.modalService.show(FiltroTrilhaComponent, { animated: true, class: 'modal-lg' });
    this.modal.content.addFiltroEmitter = this.addFiltroEmitter;
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
          temp.label = "Status";
          break;
        case 4:
          temp.label = "Disciplina";
          break;
        case 5:
          temp.label = "Área do Conhecimento";
          break;
        case 6:
          //temp.label = "Etapa";
          break;
        case 7:
          temp.label = "Segmento";
          break;
        case 8:
          temp.label = "Período Letivo";
          break;
        case 9:
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
        this.filtros[index].label = "Status";
        break;
      case 4:
        this.filtros[index].label = "Disciplina";
        break;
      case 5:
        this.filtros[index].label = "Área do Conhecimento";
        break;
      case 6:

        break;
      case 7:
        this.filtros[index].label = "Segmento";
        break;
      case 8:
        this.filtros[index].label = "Período Letivo";
        break;
      case 9:
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
    this.trilhas = null;
    this.loading.load(async () => {
      let filtroTrilha: iFiltroTrilha = new FiltroTrilha(this.filtros);

    //  console.log(this.filtros, "this.filtros");
      await this.api
        .api(HttpMethod.POST,
          `trilha/filtroTrilha`, filtroTrilha)
        .then(res => {
          this.trilhas = res;
        });
    })
  }
  async desativar(trilha: iTrilha) {
    let alert: Promise<boolean> = new Promise((ok) => {
      if (!trilha.idAtivo)
        ok(true);
      else
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Deseja realmente desativar esta trilha?",
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
      this.api.api(HttpMethod.DELETE, `trilha/${trilha.cdTrilha}`)
        .then(() => {
          trilha.idAtivo = !trilha.idAtivo;

          const toast = Swal.mixin({
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top-end'
          });

          toast.fire(`Trilha ${trilha.idAtivo ? 'ativada' : 'desativada'} com sucesso`);
        });
  }
  //#endregion

}

//#region Classes e Interfaces complementares

class FiltroTrilha {
  cdSerie?: number;
  cdPeriodoLetivo?: number;
  cdSegmento?: number;
  cdDisciplina?: number;
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
          this.cdPesquisarEm = filtro.tipo;
          this.txtPesquisa = filtro.value;
          break;
        case 4:
          this.cdDisciplina = +filtro.value;
          break;
        case 5:
          this.cdAreaConhecimento = +filtro.value;
          break;
        case 6:

          break;
        case 7:
          this.cdSegmento = +filtro.value;
          break;
        case 8:
          this.cdPeriodoLetivo = +filtro.value;
          break;
        case 9:
          this.cdSerie = +filtro.value;
          break;
      }
    }
  }
}

interface iFiltroTrilha {
  cdSerie?: number;
  cdPeriodoLetivo?: number;
  cdSegmento?: number;
  cdAreaConhecimento?: number;
  cdDisciplina?: number;
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
