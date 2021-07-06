import { Component, OnInit, HostListener, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { VincularQuestaoService } from '../services/vincular-questao.service';
import { iAvaliacao, iAvaliacaoQuestao } from '../models/Avaliacao';
import { Subscription } from 'rxjs';
import { iDisciplinaOutput } from '../pages/cadastro-avaliacao/cadastro-avaliacao.component';
import { ApiService, HttpMethod } from '../services/api.service';
import { VisualizarVincularQuestaoComponent } from '../modal/visualizar-vincular-questao/visualizar-vincular-questao.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { iQuestao } from '../models/Questao';
import { VisualizarQuestaoComponent } from '../modal/visualizar-questao/visualizar-questao.component';

import Swal from 'sweetalert2';
import { Variantes } from '../models/Variantes';
declare var $: JQueryStatic;
const classes = ['bg-primary', 'bg-secondary', 'bg-info', 'bg-success', 'bg-warning', 'bg-danger']

@Component({
  selector: 'app-appsetting',
  templateUrl: './appsetting.component.html',
  styleUrls: ['./appsetting.component.scss']
})
export class AppsettingComponent implements OnInit {
  @ViewChild('fullContent') content: ElementRef;
  @ViewChild('AvaliacaoHeader') header: ElementRef;
  @ViewChild('scrollableContent') scrollableContent: ElementRef;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (this.avaliacao) {
      setTimeout(() => {
        let totalHeight = $(this.content.nativeElement).outerHeight();
        let height = $(this.header.nativeElement).outerHeight();
        $(this.scrollableContent.nativeElement).css('max-height', `calc(${totalHeight - (height)}px - 2rem)`)
      }, 300)
    }
  }

  get icons() { return Variantes.icons; }

  avaliacao: iAvaliacao;
  questoes: iAvaliacaoQuestao[] = [];
  disciplinas: iDisciplinaOutput[];
  modal: BsModalRef;

  isLoading: boolean = false;

  newAvaliacao: Subscription;
  newQuestao: Subscription;

  constructor(
    private modalService: BsModalService,
    private vincular: VincularQuestaoService,
    private api: ApiService) { }

  ngOnInit(): void {
    //#region Nova avaliacao

    this.newAvaliacao = this.vincular.avaliacaoEmitter.subscribe(ava => {
      if (!ava) {
        this.avaliacao = undefined;
        this.questoes = [];
      } else {
        this.questoes = [];
        this.reload(ava);
      }
    })

    //#endregion

    //#region Adiciona ou Remove Questao

    this.newQuestao = this.vincular.questaoAddEmitter.subscribe(async q => {
      let indice;
      if ((indice = this.questoes.findIndex(x => x.QuestaoModel.cdQuestao == q.cdQuestao)) > -1) {
        this.questoes.splice(indice, 1);
      } else {
        this.isLoading = true;

        await this.api.api(HttpMethod.GET, `questao/detalhado/${q.cdQuestao}`)
          .then(res => q = res);

        await this.api.api(HttpMethod.GET, `alternativa/questao/${q.cdQuestao}`)
          .then(res => {
            q.Alternativas = res;
          })

        this.questoes.push({
          cdAvaliacaoQuestao: 0,
          ordem: 0,
          ordemDisciplina: this.disciplinas.find(x => x.cdDisciplina == q.cdDisciplina).nrOrdem,
          valor: 0,
          QuestaoModel: q
        });

        this.questoes = this.questoes.sort((a, b) => {
          if (a.ordemDisciplina - b.ordemDisciplina > 0)
            return 1
          else if (a.ordemDisciplina - b.ordemDisciplina < 0)
            return -1
        });

        let ordem = 0;
        for (let q of this.questoes)
          q.ordem = ++ordem;

        this.isLoading = false;
      }
    })

    //#endregion

    //#region Register Reload

    this.vincular.reloader.subscribe(() => this.reload());

    //#endregion
  }

  drop(event: CdkDragDrop<iAvaliacaoQuestao[]>) {
    moveItemInArray(this.questoes, event.previousIndex, event.currentIndex);

    this.questoes = this.questoes.sort((a, b) => {
      if (a.ordemDisciplina - b.ordemDisciplina > 0)
        return 1
      else if (a.ordemDisciplina - b.ordemDisciplina < 0)
        return -1
    });

    let ordem = 1;
    for (let q of this.questoes)
      q.ordem = ordem++;
  }

  visualizarAvaliacaoQuestoes() {
    this.avaliacao.AvaliacaoQuestaoModel = this.questoes;
    this.modal = this.modalService.show(VisualizarVincularQuestaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addAvaliacao as EventEmitter<iAvaliacao>).emit(this.avaliacao);
    (this.modal.content.addDisciplina as EventEmitter<iDisciplinaOutput[]>).emit(this.disciplinas);
  }

  tryOpen() {
    if (!$(document.body).hasClass('control-sidebar-slide-open'))
      this.toggle();
  }

  toggle() {
    $(document.getElementById('rightBarToggle')).click();
  }

  // map: Map<iAvaliacaoQuestao, string> = new Map();
  // controle: number = 0;
  getClass(q: iAvaliacaoQuestao) {
    return classes[q.QuestaoModel.cdQuestaoTipo - 1];
  }

  visualizarQuestao(questao: iQuestao) {
    this.modal = this.modalService.show(VisualizarQuestaoComponent, { animated: true, class: 'modal-xl' });
    (this.modal.content.addQuestao as EventEmitter<number>).emit(questao.cdQuestao);
  }

  cancelar() {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Deseja realmente cancelar a a vinculação atual? As alterações não serão salvas!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(result => {
      if (result.value) {
        this.vincular.cancelarVinculacao();
        if ($(document.body).hasClass('control-sidebar-slide-open'))
          setTimeout(() => { this.toggle(); }, 500);
      }
    })
  }

  async reload(ava?: iAvaliacao) {
    if (!ava) ava = this.avaliacao;

    this.isLoading = true;
    this.tryOpen();

    await this.api.api(HttpMethod.GET, `avaliacao/${ava.cdAvaliacao}`)
      .then(res => {
        this.avaliacao = res
        if (this.questoes.length === 0)
          this.questoes = this.avaliacao.AvaliacaoQuestaoModel;
        this.onScroll(null);
      });

    await this.api.api(HttpMethod.GET, `disciplina/avaliacao/${ava.cdAvaliacao}`)
      .then((res: iDisciplinaOutput[]) => {
        this.disciplinas = res;
      });

    this.vincular.registerCanIShowActionButton((questao) => {
      return this.disciplinas.findIndex(x => x.cdDisciplina == questao.cdDisciplina) > -1;
    });

    this.vincular.registerHasAdd((questao) => this.questoes.findIndex(x => x.QuestaoModel.cdQuestao == questao.cdQuestao) > -1);

    this.isLoading = false;
  }
}