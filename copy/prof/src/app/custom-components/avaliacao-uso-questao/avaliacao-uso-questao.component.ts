import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { iAvaliacao } from 'src/app/models/Avaliacao';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Variantes } from 'src/app/models/Variantes';

@Component({
  selector: 'app-avaliacao-uso-questao',
  templateUrl: './avaliacao-uso-questao.component.html',
  styleUrls: ['./avaliacao-uso-questao.component.scss']
})
export class AvaliacaoUsoQuestaoComponent implements OnInit {

  addQuestao: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;
  avaliacoes: iAvaliacao[] = [];
  agrupar: boolean = false;
  dtOptions: DataTables.Settings = {};
  cdQuestao: number;
  exibirTable: boolean = false;

  constructor(private api: ApiService,
    private bsModalRef: BsModalRef) {
    this.addQuestao.subscribe(cdQuestao => this.chargeAvaliacoes(cdQuestao, this.agrupar));

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[1, 'desc']],
      pageLength: 5,
    }
  }

  public changeAgrupar(){
    this.exibirTable = false;
    this.chargeAvaliacoes(this.cdQuestao, this.agrupar);
  }

  private async chargeAvaliacoes(cdQuestao: number, agrupar: boolean) {
    this.cdQuestao = cdQuestao;
    this.isLoading = true;
    await this.api.api(HttpMethod.GET, `questao/avaliacaoUtilizada/${cdQuestao}/agrupar/${agrupar}`)
      .then(res => {
        this.avaliacoes = res;
        this.exibirTable = true;
      });
    
    this.isLoading = false;
  }

  close() {
    this.bsModalRef.hide();
  }

  ngOnInit(): void {
  }

}
