import { Component, OnInit, EventEmitter } from '@angular/core';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { iAvaliacao } from 'src/app/models/Avaliacao';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Variantes } from 'src/app/models/Variantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-duplicar-avaliacao',
  templateUrl: './duplicar-avaliacao.component.html',
  styleUrls: ['./duplicar-avaliacao.component.scss']
})
export class DuplicarAvaliacaoComponent implements OnInit {

  avaliacao: iAvaliacao;
  dupAvaliacao: EventEmitter<number> = new EventEmitter<number>();
  addDuplicarEmitter: EventEmitter<boolean>;
  isLoading: boolean = false;
  duplicar: FormGroup;

  constructor(private api: ApiService, private bsModalRef: BsModalRef, private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
    this.dupAvaliacao.subscribe(cdAvaliacao => this.chargeAvaliacao(cdAvaliacao));
    this.duplicar = this.fb.group({
      'cdAvaliacao': [''],
      'nmAvalNova': ['', Validators.required],
      'randomizarQuestoes': [false],
      'randomizarAlternativas': [false]
    });

  }

  ngOnInit(): void {

  }

  private async chargeAvaliacao(cdAvaliacao: number) {
    this.isLoading = true;

    await this.api.api(HttpMethod.GET, `avaliacao/${cdAvaliacao}`)
      .then(res => {
        this.avaliacao = res;
      });

    this.duplicar.controls.cdAvaliacao.setValue(this.avaliacao.cdAvaliacao);

    this.isLoading = false;
  }

  async confirm(value: iDuplicarAvaliacao) {
    let retorno: boolean = false;
    // this.duplicar.updateValueAndValidity();

    if (this.duplicar.valid) {
      //   this.isSaving = true;
      this.isLoading = true;

      await this.api.api(HttpMethod.POST, `avaliacao/duplicar/empresa/${this.auth.currentUserValue.cdEmpresa}`, value)
        .then(res => {
          if (res) {
            Swal.fire('Duplicar Avaliação', 'Avaliação duplicada com sucesso', 'success');
            if (this.addDuplicarEmitter) this.addDuplicarEmitter.emit(true);
            this.close();
          } else {
            Swal.fire('Duplicar Avaliação', 'Não foi possível duplicar a Avaliação', 'warning');
          }
        })
        .catch(err => {
        })

      this.isLoading = false;


    } else {
      Variantes.markFormGroupTouched(this.duplicar);

      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });

      toast.fire('Validação!', 'Preencha ou corrija os campos em vermelho', 'warning');
    }

    if (retorno) {
      this.dupAvaliacao.emit(retorno ? 1 : 0);
    }

  }

  close() {
    this.bsModalRef.hide();
  }

}

interface iDuplicarAvaliacao {
  cdAvaliacao: number,
  nmAvalNova: string,
  randomizarQuestoes: boolean,
  randomizarAlternativas: boolean
}
