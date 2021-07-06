import { Component, OnInit, EventEmitter } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from '../../models/Questao';
import { ApiService, HttpMethod } from '../../services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';
import { iAvaliacao } from 'src/app/models/Avaliacao';
import { FormGroup, FormBuilder } from '@angular/forms';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iTurma } from 'src/app/models/Turma';
import { iAnularQuestoes } from 'src/app/models/AnularQuestao';

@Component({
  selector: 'app-anular-questao',
  templateUrl: './anular-questao.component.html',
  styleUrls: ['./anular-questao.component.scss'],
})
export class AnularQuestaoComponent implements OnInit {
  anular: FormGroup;
  cdAvaliacao: number;
  anularQuestaoEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  isLoading: boolean = false;
  questoes: iQuestao[] = [];
  questoesAdicionadas: iQuestao[] = [];
  avaliacao: iAvaliacao;
  disciplinas: iDisciplina[] = [];
  turmas: iTurma[] = [];
  anularQuestoes: iAnularQuestoes = {
    cdAvaliacao: 0,
    cdEmpresa: 0,
    cederPontos: false,
    questoes: [],
    turmas: [],
  };

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private auth: AuthenticationService
  ) {
    this.anularQuestaoEmitter.subscribe((cdAvaliacao) => {
      this.chargeQuestoes(cdAvaliacao);
    });

    this.anular = this.fb.group({
      cdsQuestoes: [[]],
      cdsTurmas: [[]],
      cederOuRecalcular: [true],
      cdDisciplina: [0],
      cdQuestao: [''],
      cdTurma: [[]],
    });

    this.anular.controls.cdDisciplina.valueChanges.subscribe((cdDisciplina) =>
      this.questaoChange(cdDisciplina)
    );
  }

  ngOnInit(): void {}

  adicionarQuestao() {
    if (
      !this.questoesAdicionadas.find(
        (x) => x.cdQuestao == this.anular.controls.cdQuestao.value
      )
    )
      this.questoesAdicionadas.push(
        this.questoes[
          this.questoes.findIndex(
            (y) => y.cdQuestao == this.anular.controls.cdQuestao.value
          )
        ]
      );
  }

  questaoChange(cdDisciplina) {
    this.anular.controls.cdQuestao.setValue('');
    if (cdDisciplina) {
      this.api
        .api(
          HttpMethod.GET,
          `questao/disciplina/${cdDisciplina}/avaliacao/${this.cdAvaliacao}`
        )
        .then((res) => {
          this.questoes = res;
        });
    } else if (this.anular.controls.cdDisciplina.value == '') {
      this.api.api(HttpMethod.GET, `questao`).then((res) => {
        this.questoes = res;
      });
    }
  }

  private async chargeQuestoes(cdAvaliacao: number) {
    this.isLoading = true;
    this.cdAvaliacao = cdAvaliacao;
    await this.api
      .api(HttpMethod.GET, `avaliacao/${cdAvaliacao}`)
      .then((res) => {
        this.avaliacao = res;
      });

    await this.api
      .api(
        HttpMethod.GET,
        `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}/avaliacao/${cdAvaliacao}`
      )
      .then((res) => {
        this.disciplinas = res;
      });

    await this.api
      .api(
        HttpMethod.GET,
        `turma/avaliacaot/${cdAvaliacao}/empresa/${this.auth.currentUserValue.cdEmpresa}`
      )
      .then((res) => {
        this.turmas = res;
      });

    this.isLoading = false;
  }

  close() {
    this.bsModalRef.hide();
  }

  confirm() {
    if (this.questoesAdicionadas.length > 0) {
      this.anularQuestoes.cdAvaliacao = this.cdAvaliacao;
      this.anularQuestoes.cdEmpresa = this.auth.currentUserValue.cdEmpresa;
      this.anularQuestoes.cederPontos =
        this.anular.controls.cederOuRecalcular.value;
      this.anularQuestoes.questoes = this.questoesAdicionadas;
      for (let x of this.turmas) {
        if (this.anular.controls.cdTurma.value.find((y) => y == x.cdTurma)) {
          this.anularQuestoes.turmas.push(x);
        }
      }
      this.api
        .api(HttpMethod.POST, `avaliacao/anular`, this.anularQuestoes)
        .then(async (res) => {
          Swal.fire(
            'Anular Questões',
            'As anulações foram feitas com sucesso',
            'success'
          );
          this.close();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });

      toast.fire(
        'Validação!',
        'Selecione ao menos uma questão para anular',
        'warning'
      );
    }
  }

  remove(cdQuestao: number) {
    this.anular.controls.cdQuestao.setValue('');
    this.questoesAdicionadas.splice(
      this.questoesAdicionadas.findIndex((y) => y.cdQuestao == cdQuestao),
      1
    );
  }
}
