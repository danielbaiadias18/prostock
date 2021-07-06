import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoadingService } from '../../helpers/loading-screen/loading-screen.service';
import { ApiService, HttpMethod } from '../../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { iTurmaAvaliacao } from '../../models/TurmaAvaliacao';
import { iAluno } from '../../models/Aluno';
import { iTurmasAvaliacoes } from '../../models/TurmasAvaliacoes';
import { iAvaliacao } from '../../models/Avaliacao';
import Swal from 'sweetalert2';
import { iAlunoAvaliacao, iAlunoAvaliacao2 } from '../../models/AlunoAvaliacao';

@Component({
  selector: 'app-vincular-alunos-avaliacao',
  templateUrl: './vincular-alunos-avaliacao.component.html',
  styleUrls: ['./vincular-alunos-avaliacao.component.scss']
})
export class VincularAlunosAvaliacaoComponent implements OnInit {

  vincularAlunosEmitter: EventEmitter<number> = new EventEmitter<number>();
  vincular: FormGroup;
  isLoading: boolean = false;
  turmas: iTurmaAvaliacao[];
  cdTurma: number = 2;
  cdAvaliacao: number = 0;
  alunos: iAluno[];
  alunoAval: iAlunoAvaliacao = { alunos: [], cdAvaliacao: 0, cdEmpresa: 0 };
  alunosAdicionados: iAlunoAvaliacao2[] = [];
  avaliacao: iAvaliacao;
  cdsTurma: number[] = [];
  turmaAlunos: iTurmasAvaliacoes = { cdsTurma: [], cdAvaliacao: 0 };
  cdsTurmasSelecionadas: number[] = [];

  constructor(private bsModalRef: BsModalRef, private loading: LoadingService, private fb: FormBuilder, private api: ApiService, private auth: AuthenticationService) {
    this.vincularAlunosEmitter.subscribe(cdAvaliacao => this.chargeTurmas(cdAvaliacao));

    this.vincular = this.fb.group({
      'cdsTurma': [[]],
      'cdTurma': [0]
    });
  }

  ngOnInit(): void {

  }

  private async chargeTurmas(cdAvaliacao: number) {
    this.cdAvaliacao = cdAvaliacao;
    this.isLoading = true;
    this.loading.load(async () => {
      await this.api.api(HttpMethod.GET, `turma/avaliacao/${cdAvaliacao}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.turmas = res.turmas;
          this.alunos = res.alunos;
          this.vincular.controls.cdTurma.setValue(this.turmas[0].cdTurma);
        });
      await this.api.api(HttpMethod.GET, `avaliacao/${cdAvaliacao}`)
        .then(res => {
          this.avaliacao = res
        });
      await this.api.api(HttpMethod.GET, `avaliacao/alunos/avaliacao/${this.cdAvaliacao}`)
        .then(res => {
          this.alunosAdicionados = res
        });
      this.listarAlunosAdicionados();
    })
    this.isLoading = false;
  }

  async confirm() {
    if (this.alunosAdicionados.length > 0) {

      this.isLoading = true;

      this.alunoAval.alunos = this.alunosAdicionados;
      this.alunoAval.cdAvaliacao = this.cdAvaliacao;
      this.alunoAval.cdEmpresa = this.auth.currentUserValue.cdEmpresa;

      await this.api.api(HttpMethod.POST, `avaliacao/vincular/alunos`, this.alunoAval)
        .then(async res => {
          Swal.fire('Vincular Alunos', 'A vinculação foi feita com sucesso', 'success');
          this.close();
        }).catch(err => {
        });

      this.isLoading = false;
    } else {
      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });

      toast.fire('Validação!', 'Selecione ao menos um aluno para a vinculação', 'warning');
    }
  }

  addAluno(index, row) {
    if (row.classList.contains("selected")) {
      row.classList.remove("selected");
      this.alunosAdicionados.splice(this.alunosAdicionados.findIndex(element => element.cdMatricula == this.alunos[index].cdMatricula), 1);
    } else {
      row.classList.add("selected");
      this.alunosAdicionados.push({
        cdAluno:this.alunos[index].cdAluno,
        cdMatricula: this.alunos[index].cdMatricula,
        cdAvaliacaoAluno: 0,
        cdTurma: this.alunos[index].cdTurma,
        corrigida: false,
        dtFimAvaliacao: undefined,
        dtInicioAvaliacao: undefined,
        dtNascimento: this.alunos[index].dtNascimento,
        email: this.alunos[index].email,
        matricula: this.alunos[index].matricula,
        nmTurma: "",
        nome: this.alunos[index].nome,
        notaObtida: undefined,
        notasPorDisciplina: undefined
      });
    }
  }

  selectAllAlunos(cdTurma = this.vincular.controls.cdTurma.value) {
    if (this.cdsTurmasSelecionadas.find(x => x == cdTurma)) {
      var j;
      for (j = 0; j < ((document.getElementById("tableAlunos") as HTMLTableElement).rows).length; j++) {
        if (this.alunos[j].cdTurma == cdTurma) {
          (document.getElementById("tableAlunos") as HTMLTableElement).rows[j].classList.remove("selected");
          this.alunosAdicionados.splice(this.alunosAdicionados.findIndex(element => element.cdMatricula == this.alunos[j].cdMatricula), 1);
        }
      }
      this.cdsTurmasSelecionadas.splice(this.cdsTurmasSelecionadas.findIndex(y => y == cdTurma), 1);
    } else {
      var i;
      for (i = 0; i < ((document.getElementById("tableAlunos") as HTMLTableElement).rows).length; i++) {
        if (this.alunos[i].cdTurma == cdTurma && !this.alunosAdicionados.find(x => x.cdMatricula == this.alunos[i].cdMatricula)) {
          (document.getElementById("tableAlunos") as HTMLTableElement).rows[i].classList.add("selected");
          this.alunosAdicionados.push({
            cdMatricula: this.alunos[i].cdMatricula,
            cdAluno: this.alunos[i].cdAluno,
            cdAvaliacaoAluno: 0,
            cdTurma: this.alunos[i].cdTurma,
            corrigida: false,
            dtFimAvaliacao: undefined,
            dtInicioAvaliacao: undefined,
            dtNascimento: this.alunos[i].dtNascimento,
            email: this.alunos[i].email,
            matricula: this.alunos[i].matricula,
            nmTurma: "",
            nome: this.alunos[i].nome,
            notaObtida: undefined,
            notasPorDisciplina: undefined
          });
        }
      }
      this.cdsTurmasSelecionadas.push(cdTurma);
    }
    // .classList.add("selected")
  }

  listarAlunosAdicionados() {
    var i;
    for (i = 0; i < ((document.getElementById("tableAlunos") as HTMLTableElement).rows).length; i++) {
      if (this.alunosAdicionados.find(x => x.cdMatricula == this.alunos[i].cdMatricula)) {
        (document.getElementById("tableAlunos") as HTMLTableElement).rows[i].classList.add("selected");
      }
    }
  }

  comecouAFazer(aluno: iAluno) {
    let a = this.alunosAdicionados.find(x => x.cdMatricula == aluno.cdMatricula);
    if (!a || !a.dtInicioAvaliacao) return 'Não';

    return 'Sim'
  }

  close() {
    this.bsModalRef.hide();
  }

}
