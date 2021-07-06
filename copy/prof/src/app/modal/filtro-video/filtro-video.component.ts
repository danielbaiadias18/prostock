import { Component, OnInit, EventEmitter } from '@angular/core';
import { iFiltro } from 'src/app/pages/questao/questao.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { iProfessor } from 'src/app/models/Professor';
import { iSerie } from 'src/app/models/Serie';
import { iAreaConhecimento } from 'src/app/models/AreaConhecimento';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iTopico } from 'src/app/models/Topico';
import { iSubTopico } from 'src/app/models/SubTopico';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';

@Component({
  selector: 'app-filtro-video',
  templateUrl: './filtro-video.component.html',
  styleUrls: ['./filtro-video.component.scss'],
  providers: [CapitalizarPipe]
})
export class FiltroVideoComponent implements OnInit {

  isLoading: boolean = true;
  addFiltroEmitter: EventEmitter<iFiltro[]>;
  filtro: FormGroup;

  professores: iProfessor[] = [];
  series: iSerie[] = [];
  areasConhecimento: iAreaConhecimento[] = [];
  disciplinas: iDisciplina[] = [];
  topicos: iTopico[] = [];
  subTopicos: iSubTopico[] = [];

  //#endregion

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private capitalizar: CapitalizarPipe
  ) {
    this.filtro = this.fb.group({
      'cdProfessor': [''],
      'cdSerie': [''],
      'cdDisciplina': [''],
      'cdTopico': ['']
    });

    this.filtro.controls.cdSerie.valueChanges.subscribe(cdSerie => this.serieChange(cdSerie));
    this.filtro.controls.cdDisciplina.valueChanges.subscribe(cdDisciplina => this.disciplinaChange(cdDisciplina));
    this.filtro.controls.cdTopico.disable();
  }

  //#region Métodos

  //#region Cargas

  async ngOnInit(): Promise<void> {

    await this.api.api(HttpMethod.GET, `professor/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.professores = res;
      });

    await this.api.api(HttpMethod.GET, `serie/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.series = res;
      });

    await this.api.api(HttpMethod.GET, `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.disciplinas = res;
      });

    this.isLoading = false;
  }

  serieChange(cdSerie) {
    this.disciplinas = [];
    this.filtro.controls.cdDisciplina.setValue('');

    if (cdSerie) {
      this.api
        .api(HttpMethod.GET, `disciplina/serie/${cdSerie}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
        });
    } else if (this.filtro.controls.cdSerie.value == '') {
      this.api.api(HttpMethod.GET, `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
        });
    }
  }

  disciplinaChange(cdDisciplina) {
    this.topicos = [];
    this.filtro.controls.cdTopico.setValue('');
    this.filtro.controls.cdTopico.disable();

    if (cdDisciplina) {
      this.api
        .api(HttpMethod.GET,
          `topico/disciplina/${cdDisciplina}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.topicos = res;
          if (this.topicos.length > 0)
            this.filtro.controls.cdTopico.enable();
        })
    }
  }
  //#endregion

  //#region Aplicar filtros

  confirm(value: iFormVideoFiltro) {

    let retorno: iFiltro[] = [];

    //#region Popular filtros

    if (value.cdTopico) {
      retorno.push({
        text: this.capitalizar.transform(
          this.topicos.find(x => x.cdTopico == value.cdTopico).nmTopico
        ),
        value: '' + value.cdTopico,
        tipo: 4,
        label: 'Tópico'
      })
    }

    if (value.cdDisciplina) {
      retorno.push({
        text: this.capitalizar.transform(
          this.disciplinas.find(x => x.cdDisciplina == value.cdDisciplina).nmDisciplina
        ),
        value: '' + value.cdDisciplina,
        tipo: 5,
        label: 'Disciplina'
      })
    }

    if (value.cdProfessor) {
      retorno.push({
        text: this.capitalizar.transform(this.professores.find(x => x.cdProfessor == +value.cdProfessor).nmProfessor),
        value: '' + value.cdProfessor,
        tipo: 6,
        label: 'Professor'
      })
    }

    if (value.cdSerie) {
      retorno.push({
        text: this.capitalizar.transform(
          this.series.find(x => x.cdSerie == value.cdSerie).nmSerie
        ),
        value: '' + value.cdSerie,
        tipo: 7,
        label: 'Série'
      })
    }

    if (value.cdSubTopico) {
      retorno.push({
        text: this.capitalizar.transform(
          this.subTopicos.find(x => x.cdSubTopico == value.cdSubTopico).nmSubTopico
        ),
        value: '' + value.cdSubTopico,
        tipo: 8,
        label: 'Sub-Tópico'
      })
    }

    //#endregion

    if (retorno.length > 0)
      this.addFiltroEmitter.emit(retorno);

    this.close();
  }

  close() {
    this.bsModalRef.hide();
  }

  //#endregion

  //#endregion


}

interface iFormVideoFiltro {
  cdProfessor: number,
  cdSerie: number,
  cdDisciplina: number,
  cdTopico: number,
  cdSubTopico: number
}