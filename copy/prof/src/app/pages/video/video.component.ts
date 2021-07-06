import { Component, OnInit, ViewChild, EventEmitter, Renderer2 } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/helpers/loading-screen/loading-screen.service';
import { Variantes } from 'src/app/models/Variantes';
import { iVideo } from 'src/app/models/CentralVideo';
import Swal from 'sweetalert2';
import { FiltroVideoComponent } from 'src/app/modal/filtro-video/filtro-video.component';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { VisualizarVideoComponent } from 'src/app/modal/visualizar-video/visualizar-video.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
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
export class VideoComponent implements OnInit {

  @ViewChild(DataTableDirective) dt: DataTableDirective;

  dtOptions: DataTables.Settings = {}
  showFilters = false;
  modal: BsModalRef;
  pesquisar: FormGroup;

  filtros: iFiltro[] = [];

  addFiltroEmitter: EventEmitter<iFiltro[]> = new EventEmitter<iFiltro[]>();

  _videos: iVideo[];

  get videos() {
    return this._videos;
  }

  constructor(
    private modalService: BsModalService,
    fb: FormBuilder,
    private api: ApiService,
    private renderer: Renderer2,
    private loading: LoadingService) {
    this.pesquisar = fb.group({
      tipo: ['2'],
      text: ['', Validators.required]
    });

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[1, 'desc']],
      pageLength: 6,
      columnDefs: [
        {
          targets: [0],
          searchable: false,
          orderable: false
        },
      ]
    }
  }

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
      await this.api.api(HttpMethod.GET, 'video').then(res => {
        this._videos = res;
      });
    })
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
            "Titulo" :
            value.label
      });

      if (upDate)
        setTimeout(() => this.upDateWithFilter(), 300);
      return;
    }

    this.filtros[index].value = value.value ? value.value : value.text;
    this.filtros[index].tipo = +value.tipo;
    this.filtros[index].text = value.text;
    this.filtros[index].label = value.tipo == 1 ? "Código" : value.tipo == 2 ? "Título" : value.label;

    if (upDate)
      setTimeout(() => this.upDateWithFilter(), 300);
  }

  show() {
    this.modal = this.modalService.show(FiltroVideoComponent, { animated: true, class: 'modal-xl' });
    this.modal.content.addFiltroEmitter = this.addFiltroEmitter;
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

  async desativar(video: iVideo) {
    let alert: Promise<boolean> = new Promise((ok) => {
      if (!video.idAtivo)
        ok(true);
      else
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Deseja realmente desativar este vídeo?",
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
      this.api.api(HttpMethod.DELETE, `video/${video.cdVideo}`)
        .then(() => {
          video.idAtivo = !video.idAtivo;

          const toast = Swal.mixin({
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top-end'
          });

          toast.fire(`Vídeo ${video.idAtivo ? 'ativada' : 'desativada'} com sucesso`);
        });
  }


  upDateWithFilter() {
    this._videos = null;
    let filtroVideo: iFiltroVideo = new FiltroVideo(this.filtros);
    this.loading.load(async () => {
      await this.api
        .api(HttpMethod.POST,
          `video/filtroVideo`, filtroVideo)
        .then(res => {
          this._videos = res;
        });
    })
  }

  visualizarVideo(video: iVideo) {
    this.modal = this.modalService.show(VisualizarVideoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addVideo as EventEmitter<number>).emit(video.cdVideo);
  }


}

class FiltroVideo implements iFiltroVideo {
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
          this.cdDisciplina = +filtro.value;
          break;
        case 6:
          this.cdProfessor = +filtro.value;
          break;
        case 7:
          this.cdSerie = +filtro.value;
          break;
        case 8:
          this.cdSubTopico = +filtro.value;
          break;
        case 9:
          this.cdUsuario = +filtro.value;
          break;
      }
    }
  }
}

interface iFiltroVideo {
  cdUsuario?: number;
  cdProfessor?: number;
  cdSerie?: number;
  cdAreaConhecimento?: number;
  cdDisciplina?: number;
  cdTopico?: number;
  cdSubTopico?: number;
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
