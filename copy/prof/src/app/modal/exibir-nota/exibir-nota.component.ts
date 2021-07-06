import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpMethod, ApiService } from 'src/app/services/api.service';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iAlunoAvaliacaoNotaDisciplina } from 'src/app/models/AlunoAvaliacao';

@Component({
  selector: 'app-exibir-nota',
  templateUrl: './exibir-nota.component.html',
  styleUrls: ['./exibir-nota.component.scss']
})
export class ExibirNotaComponent implements OnInit {
  

  constructor( private bsModalRef: BsModalRef, private api: ApiService,) {
    this.carregarNotas.subscribe(cdAvaliacaoAluno => this.chargeNotas(cdAvaliacaoAluno));
   }

  carregarNotas: EventEmitter<number> = new EventEmitter<number>();
  notas: iAlunoAvaliacaoNotaDisciplina;

  ngOnInit(): void {
  }

  chargeNotas(cdAvaliacaoAluno: number){
    this.api.api(HttpMethod.GET, `avaliacao/avaliacaoalunosnotadisciplina/avaliacaoaluno/${cdAvaliacaoAluno}`)
    .then(res => {
      this.notas = res;
    });
  }

  close() {
    this.bsModalRef.hide();
  }
}
