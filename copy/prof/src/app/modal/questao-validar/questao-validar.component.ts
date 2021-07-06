import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpMethod, ApiService } from 'src/app/services/api.service';
import { iQuestao, iQuestaoAlternativa } from 'src/app/models/Questao';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';
import { iQuestaoStatus } from 'src/app/models/QuestaoStatus';
import { iQuestaoStatusHistorico } from 'src/app/models/QuestaoStatusHistorico';
import { Variantes } from 'src/app/models/Variantes';
import Swal from 'sweetalert2';

declare var com: any;

@Component({
  selector: 'app-questao-validar',
  templateUrl: './questao-validar.component.html',
  styleUrls: ['./questao-validar.component.scss'],
})
export class QuestaoValidarComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  questao: iQuestao;
  nmQuestaoTipo: string = '';
  alternativas: iQuestaoAlternativa[] = [];
  addQuestao: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;
  cdQuestao: number;

  dissertacao: string;
  cdQuestaoStatus: number;
  tramitar: boolean;
  tramitacoes: iQuestaoStatusHistorico[] = [];
  status: iQuestaoStatus[] = [];

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    public vincular: VincularQuestaoService
  ) {
    this.addQuestao.subscribe((cdQuestao) => this.chargeQuestao(cdQuestao));

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[2, "desc"]],
      pageLength: 10,
      columnDefs: [
        {
          targets: [0, 1],
          searchable: true,
          orderable: true,
        },
      ],
    };
  }

  ngOnInit(): void {}

  private async chargeQuestao(cdQuestao: number) {
    this.isLoading = true;
    this.cdQuestao = cdQuestao;
    await this.api
      .api(HttpMethod.GET, `questao/detalhado/${cdQuestao}`)
      .then((res) => {
        (this.questao = res), (this.nmQuestaoTipo = this.questao.nmQuestaoTipo);
      });
    await this.api
      .api(HttpMethod.GET, `alternativa/questao/${cdQuestao}`)
      .then((res) => {
        this.alternativas = res;
      });
    this.api.api(HttpMethod.GET, `questao/${cdQuestao}/status`).then((res) => {
      this.status = res.status;
      this.tramitar = res.tramitar;
    });
    this.api
      .api(HttpMethod.GET, `questao/${cdQuestao}/tramitacoes`)
      .then((res) => {
        this.tramitacoes = res;
      });

    this.isLoading = false;
    this.loadFormulas();
  }

  alterar() {
    const status = this.status.find(
      (x) => x.cdQuestaoStatus == this.cdQuestaoStatus
    );

    if (status.stDissertar && !this.dissertacao) {
      Swal.fire(
        'Validação',
        'É obrigatório preencher a dissertação para este status',
        'info'
      );
    } else
      Swal.fire({
        html:
          'Deseja realmente alterar o status da questão para ' +
          status.dsQuestaoStatus +
          '?',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
      }).then((result) => {
        if (result.isConfirmed) {
          this.api
            .api(HttpMethod.PUT, `questao/${this.cdQuestao}/tramitar`, {
              cdQuestao: this.cdQuestao,
              cdQuestaoStatus: this.cdQuestaoStatus,
              dissertacao: this.dissertacao,
            })
            .then((res) => {
              this.addQuestao.emit(this.cdQuestao);
              this.tramitacoes = res;
              const toast = Swal.mixin({
                toast: true,
                showConfirmButton: false,
                position: 'top-end',
                timer: 5000,
              });
              toast.fire('Sucesso!', 'Status da questão alterada!', 'success');
              this.cdQuestaoStatus = this.dissertacao = undefined;
              this.tramitar = false;
            });
        }
      });
  }

  close() {
    this.bsModalRef.hide();
  }

  loadFormulas() {
    com.wiris.js.JsPluginViewer.parseDocument(true);
  }
}
