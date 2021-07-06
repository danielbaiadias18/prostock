import { Component, OnInit, EventEmitter } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from 'src/app/models/Questao';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';

declare var com: any;

@Component({
  selector: 'app-visualizar-questao',
  templateUrl: './visualizar-questao.component.html',
  styleUrls: ['./visualizar-questao.component.scss']
})
export class VisualizarQuestaoComponent implements OnInit {

  questao: iQuestao;
  nmQuestaoTipo: string = "";
  alternativas: iQuestaoAlternativa[] = [];
  addQuestao: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    public vincular: VincularQuestaoService) {
    this.addQuestao.subscribe(cdQuestao => this.chargeQuestao(cdQuestao));
  }

  ngOnInit(): void {
  }

  private async chargeQuestao(cdQuestao: number) {
    this.isLoading = true;
    await this.api.api(HttpMethod.GET, `questao/detalhado/${cdQuestao}`)
      .then(res => {
        this.questao = res,
          this.nmQuestaoTipo = this.questao.nmQuestaoTipo
      });
    await this.api.api(HttpMethod.GET, `alternativa/questao/${cdQuestao}`)
      .then(res => {
        this.alternativas = res;
      })

    this.isLoading = false;
    this.loadFormulas()
  }

  close() {
    this.bsModalRef.hide();
  }

  loadFormulas() {
    com.wiris.js.JsPluginViewer.parseDocument(true);
  }
}
