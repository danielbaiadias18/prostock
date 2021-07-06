import { Component, OnInit, EventEmitter } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from '../../models/Questao';
import { ApiService, HttpMethod } from '../../services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iAvaliacao } from '../../models/Avaliacao';
import { iDisciplinaValor } from '../../models/Disciplina';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';
import { iAvaliacaoAlunoResposta } from 'src/app/models/AlunoAvaliacao';

declare var com: any;

@Component({
  selector: 'app-visualizar-avaliacao-correcao',
  templateUrl: './visualizar-avaliacao-correcao.component.html',
  styleUrls: ['./visualizar-avaliacao-correcao.component.scss'],
})
export class VisualizarAvaliacaoCorrecaoComponent implements OnInit {
  avaliacaoModel: iAvaliacao;
  addAvaliacao: EventEmitter<number> = new EventEmitter<number>();
  addAvaliacaoAluno: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;
  disciplinas: iDisciplinaAvaliacao;
  valores: iDisciplinaValor[] = [];
  respostas: iAvaliacaoAlunoResposta[] = [];
  feedBacks: any[] = [];
  cdAvaliacaoAluno: number;

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    private auth: AuthenticationService
  ) {
    this.addAvaliacao.subscribe((cdAvaliacao) => {
      this.chargeAvaliacao(cdAvaliacao);
    });
  }

  ngOnInit(): void {}

  private async chargeAvaliacao(cdAvaliacao: number) {
    this.isLoading = true;
    await this.addAvaliacaoAluno.subscribe((cdAvaliacaoAluno) => {
      this.cdAvaliacaoAluno = cdAvaliacaoAluno;
    });
    await this.api
      .api(
        HttpMethod.GET,
        `avaliacao/correcao/avaliacao/${cdAvaliacao}/avaliacaoaluno/${this.cdAvaliacaoAluno}`
      )
      .then((res) => {
        this.avaliacaoModel = res;
      });

    await this.api
      .api(
        HttpMethod.GET,
        `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}/avaliacao/${cdAvaliacao}`
      )
      .then((res) => {
        this.valores = res;
      });

    await this.api
      .api(
        HttpMethod.GET,
        `avaliacao/alunoresposta/avaliacaoaluno/${this.cdAvaliacaoAluno}`
      )
      .then((res) => {
        this.respostas = res;
      });

    await this.api
      .api(
        HttpMethod.GET,
        `avaliacao/carregarfeedback/avaliacaoaluno/${this.cdAvaliacaoAluno}`
      )
      .then((res) => {
        this.feedBacks = res;
      });

    this.isLoading = false;
    this.loadFormulas();
  }

  getResposta(cdQuestao: number) {
    return this.feedBacks.find((x) => x.cdQuestao == cdQuestao);
  }

  close() {
    this.bsModalRef.hide();
  }

  loadFormulas() {
    com.wiris.js.JsPluginViewer.parseDocument(true);
  }

  // carregaRespostas(res: iAvaliacao) {

  //   for (var x of res.AvaliacaoQuestaoModel) {
  //     for (var j of x.QuestaoModel.Alternativas) {
  //       for (var y of this.respostas) {

  //           if (y.cdAlternativa == j.cdQuestaoAlternativa) {

  //             if (j.correta && y.verdadeiro)
  //               j.acertou = true;
  //             else
  //               j.acertou = false;
  //           }

  //       }
  //     }
  //   }

  //   this.avaliacaoModel = res;
  // }
}

export interface iDisciplinaAvaliacao {
  cdDisciplina: number;
  nmDisciplina: string;
  valor: number;
  perc: number;
}
