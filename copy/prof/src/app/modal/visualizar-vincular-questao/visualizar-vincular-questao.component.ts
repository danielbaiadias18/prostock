import { Component, OnInit, EventEmitter } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from '../../models/Questao';
import { ApiService, HttpMethod } from '../../services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iAvaliacao, iAvaliacaoQuestao } from '../../models/Avaliacao';
import { iDisciplinaValor } from '../../models/Disciplina';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';
import { iDisciplinaOutput } from 'src/app/pages/cadastro-avaliacao/cadastro-avaliacao.component';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { RouterEvent, Router } from '@angular/router';
import { AppsettingComponent } from 'src/app/appsetting/appsetting.component';
import { DecimalPipe } from '@angular/common';

declare var com: any;

@Component({
  selector: 'app-visualizar-vincular-questao',
  templateUrl: './visualizar-vincular-questao.component.html',
  styleUrls: ['./visualizar-vincular-questao.component.scss']
})
export class VisualizarVincularQuestaoComponent implements OnInit {

  avaliacaoModel: iAvaliacao;

  erroBanco: string;

  addAvaliacao: EventEmitter<iAvaliacao> = new EventEmitter<iAvaliacao>();
  addDisciplina: EventEmitter<iDisciplinaOutput[]> = new EventEmitter<iDisciplinaOutput[]>();
  isLoading: boolean = false;
  disciplinas: iDisciplinaOutput[] = [];
  valores: iDisciplinaValor[] = [];

  constructor(private api: ApiService, private bsModalRef: BsModalRef, private auth: AuthenticationService, private vinc: VincularQuestaoService, private router: Router, private decimalPipe: DecimalPipe) {
    this.addAvaliacao.subscribe((avaliacao: iAvaliacao) => { this.chargeAvaliacao(avaliacao) });
    this.addDisciplina.subscribe((disciplina: iDisciplinaOutput[]) => { this.chargeDisciplina(disciplina) });
  }

  ngOnInit(): void {
  }
  private async chargeAvaliacao(avaliacao: iAvaliacao) {
    this.isLoading = true;
    this.avaliacaoModel = avaliacao;

    this.isLoading = false;
    setTimeout(() => {
      this.loadFormulas();
      this.calculaPontos();
    }, 900);
  }
  private async chargeDisciplina(disciplina: iDisciplinaOutput[]) {
    this.isLoading = true;
    this.disciplinas = disciplina;

    this.isLoading = false;
    setTimeout(() => {
      this.loadFormulas();
      this.calculaPontos();
    }, 900);
  }
  public reCalculaPontos() {
    this.limpaPontos();
    this.calculaPontos();
  }

  public limpaPontos() {
    for (var j of this.avaliacaoModel.AvaliacaoQuestaoModel) {
      j.valor = 0;
    }
  }

  public calculaPontos() {
    //se a prova for dividida em notas por disciplina
    if (this.avaliacaoModel.notasPorDisciplina) {
      for (var y of this.disciplinas) {
        var counter = 0;
        var distribuido = 0;
        for (var x of this.avaliacaoModel.AvaliacaoQuestaoModel) {
          if (y.cdDisciplina == x.QuestaoModel.cdDisciplina && x.valor <= 0) {
            counter++;
          } else if (y.cdDisciplina == x.QuestaoModel.cdDisciplina && x.valor > 0) {
            distribuido += x.valor;
          }
        }
        for (var j of this.avaliacaoModel.AvaliacaoQuestaoModel) {
          if (y.cdDisciplina == j.QuestaoModel.cdDisciplina && j.valor <= 0) {
            j.valor = +((y.valor - distribuido) / counter).toFixed(1);
          }
        }
      }
    } else {
      //caso a prova não seja distribuída em notas por disciplina
      var distribuido = 0;
      for (var x of this.avaliacaoModel.AvaliacaoQuestaoModel) {
        x.valor = +(this.avaliacaoModel.valor / this.avaliacaoModel.AvaliacaoQuestaoModel.length).toFixed(1);
        distribuido += x.valor;
      }
    }
  }

  // formatToCurrency(r) {
  //   let val = this.decimalPipe.transform(r.get('Amount').value, '1.2-2')
  //   r.get('Amount').setValue(val);
  // }

  async vincular() {
    if (this.avaliacaoModel.AvaliacaoQuestaoModel.find(x => x.valor <= 0)) {
      Swal.fire('Vincular Questões', 'Todas as questões devem possuir valor!', 'warning');
    }
    else if (this.somatoriaTotal() > 0) {
      if (this.somatoriaTotal() == 1)
        Swal.fire('Vincular Questões', 'Ainda existe ' + this.somatoriaTotal() + ' ponto a ser distribuído! ', 'warning');
      else
        Swal.fire('Vincular Questões', 'Ainda existem ' + this.somatoriaTotal() + ' pontos a serem distribuídos! ', 'warning');
    }
    else if (this.somatoriaTotal() < 0) {
      Swal.fire('Vincular Questões', this.somatoriaTotal() == (-1)?
      'Foi distribuído mais ' + this.somatoriaTotal() * (-1) + ' ponto que o necessário! '
      : 'Foram distribuídos mais ' + this.somatoriaTotal() * (-1) + ' pontos que o necessário! ', 'warning');
    }
    else {
      this.isLoading = true;

      await this.api.api(HttpMethod.PUT, `avaliacao/${this.avaliacaoModel.cdAvaliacao}/vincular`, this.novaAssinatura(this.avaliacaoModel.AvaliacaoQuestaoModel))
        .then(res => {
          Swal.fire('Vincular Questões', 'As vinculações foram feitas com sucesso', 'success');
          this.router.navigate(["/avaliacao"]);
          this.close();
          this.erroBanco = res;
          this.vinc.cancelarVinculacao();

          if ($(document.body).hasClass('control-sidebar-slide-open'))
            setTimeout(() => { $(document.getElementById('rightBarToggle')).click(); }, 500);

        }).catch(err => {
          Swal.fire('Vincular Questões', 'Não foi possível fazer a vinculação de questões', 'warning');
        });

      this.isLoading = false;
    }
  }

  novaAssinatura(avaliacaoQuestaos: iAvaliacaoQuestao[]) {
    let retorno: iAvaliacaoQuestao[] = [];

    for (let a of avaliacaoQuestaos) {
      let avaliacaoQuestao = new cAvaliacaoQuestao();
      let propName;

      for (propName in avaliacaoQuestao)
        avaliacaoQuestao[propName] = a[propName];

      avaliacaoQuestao.QuestaoModel = new cQuestao();

      for (propName in avaliacaoQuestao.QuestaoModel)
        avaliacaoQuestao.QuestaoModel[propName] = a.QuestaoModel[propName];

      avaliacaoQuestao.QuestaoModel.dsComando = " ";
      avaliacaoQuestao.QuestaoModel.dsSuporte = " ";
      avaliacaoQuestao.QuestaoModel.cdEmpresa = 1;

      retorno.push(avaliacaoQuestao);
    }

    return retorno;
  }

  close() {
    this.bsModalRef.hide();
  }

  somatoria(cdDisciplina: number) {
    let total = 0;
    if (this.avaliacaoModel.notasPorDisciplina) {
      if (cdDisciplina > 0) {
        for (let questao of this.avaliacaoModel.AvaliacaoQuestaoModel.filter(x => x.QuestaoModel.cdDisciplina == cdDisciplina)) {
          total += questao.valor;
        }
      }
    } else {
      for (let questao of this.avaliacaoModel.AvaliacaoQuestaoModel) {
        total += questao.valor;
      }
    }
    return total;
  }

  somatoriaTotal() {
    var distribuidos = 0;
    var ttotal = 0;
    if (this.avaliacaoModel.notasPorDisciplina) {
      for (let questao of this.avaliacaoModel.AvaliacaoQuestaoModel) {
        distribuidos += questao.valor;
      }
      for (let disciplina of this.disciplinas) {
        ttotal += disciplina.valor;
      }
      return Math.round((ttotal - distribuidos) * 100) / 100;
    } else {
      for (let questao of this.avaliacaoModel.AvaliacaoQuestaoModel) {
        distribuidos += questao.valor;
      }
      return Math.round((this.avaliacaoModel.valor - distribuidos) * 100) / 100;
    }
  }

  loadFormulas() {
    com.wiris.js.JsPluginViewer.parseDocument(true);
  }
}

export interface iDisciplinaAvaliacao {
  cdDisciplina: number;
  nmDisciplina: string;
  valor: number;
  perc: number;
}

class cQuestao implements iQuestao {
  cdAreaConhecimento: number = 0;
  cdTopico: number = 0;
  cdDificuldade: number = 0;
  cdDisciplina: number = 0;
  cdEmpresa: number = 1;
  cdGrupoQuestao: number = 0;
  cdGrupoQuestaoItem: number = 0;
  cdHabilidade: number = 0;
  cdCompetencia: number = 0;
  cdProfessorResponsavel: number = 0;
  cdQuestao: number = 0;
  cdQuestaoTipo: number = 0;
  cdSerie: number = 0;
  cdSubTopico: number = 0;
  cdUsuarioInc: number = 0;
  dsComando: string = "";
  dsSuporte: string = "";
  idAtivo: boolean;
  imgComando: boolean;
  imgSuporte: boolean;
  nmAreaConhecimento: string;
  nmDificuldade: string;
  nmDisciplina: string;
  nmSerie: string;
  nmQuestaoTipo: string;
  nuComputador: string;
  stRedacao: boolean = false;
  Alternativas?: iQuestaoAlternativa[] = [];
  verdadeiro: boolean;
  acertou: boolean;
  pontuacao: number;
  feedback: string;
  refComando: string;
  refSuporte: string;
  dsResposta: string;
  comentario: string;
  ano: string;
  cdOrigem: number;
}

class cAvaliacaoQuestao implements iAvaliacaoQuestao {
  cdAvaliacaoQuestao: number = 0;
  ordem: number = 0;
  ordemDisciplina?: number = 0;
  valor?: number = 0;
  QuestaoModel: cQuestao = new cQuestao();
}
