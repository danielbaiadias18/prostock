import { Component, OnInit, EventEmitter } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from '../../models/Questao';
import { ApiService, HttpMethod } from '../../services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iAvaliacao } from '../../models/Avaliacao';
import { iDisciplinaValor } from '../../models/Disciplina';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';

declare var com: any;

@Component({
  selector: 'app-visualizar-avaliacao',
  templateUrl: './visualizar-avaliacao.component.html',
  styleUrls: ['./visualizar-avaliacao.component.scss']
})
export class VisualizarAvaliacaoComponent implements OnInit {

  avaliacaoModel: iAvaliacao;
  addAvaliacao: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;
  disciplinas: iDisciplinaAvaliacao;
  validarAvaliacaoEmitter: EventEmitter<boolean>;
  valores: iDisciplinaValor[] = [];
  validador: boolean = false;

  constructor(private api: ApiService, private bsModalRef: BsModalRef, private auth: AuthenticationService) {
    this.addAvaliacao.subscribe(cdAvaliacao => { this.chargeAvaliacao(cdAvaliacao) });
  }

  ngOnInit(): void {
  }

  private async chargeAvaliacao(cdAvaliacao: number) {
    this.isLoading = true;
    await this.api.api(HttpMethod.GET, `avaliacao/${cdAvaliacao}`)
      .then(res => {
        this.avaliacaoModel = res
      });

    await this.api.api(HttpMethod.GET, `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}/avaliacao/${cdAvaliacao}`)
      .then(res => {
        this.valores = res;
      })

    // await this.api.api(HttpMethod.GET, `avaliacao/validador/avaliacao/${cdAvaliacao}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
    //   .then(res => {
    //     this.validador = res;
    //   })

    this.isLoading = false;
    this.loadFormulas();
  }


  close() {
    this.bsModalRef.hide();
  }

  validar() {
    this.api.api(HttpMethod.GET, `avaliacao/validar/avaliacao/${this.avaliacaoModel.cdAvaliacao}`)
      .then(res => {
        if (res) {
        } else {
          if (this.validarAvaliacaoEmitter) this.validarAvaliacaoEmitter.emit(true);
          this.close();
          Swal.fire('Validação!', 'A validação foi realizada com sucesso!', 'success');
        }
      })
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
