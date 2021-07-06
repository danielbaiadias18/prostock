import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iFiltro } from 'src/app/pages/avaliacao/avaliacao.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { iAvaliacaoTipo } from 'src/app/models/Avaliacao';
import { iAvaliacaoSubTipo } from 'src/app/models/Avaliacao';
import { iSegmento } from 'src/app/models/Segmento';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { iAreaConhecimento } from 'src/app/models/AreaConhecimento';
import { iEtapa } from 'src/app/models/Etapa';

@Component({
  selector: 'app-filtro-avaliacao',
  templateUrl: './filtro-avaliacao.component.html',
  styleUrls: ['./filtro-avaliacao.component.scss'],
  providers: [CapitalizarPipe]
})
export class FiltroAvaliacaoComponent implements OnInit {

  //#region Atributos

  addFiltroEmitter: EventEmitter<iFiltro[]>;
  filtro: FormGroup;

  tipos: iAvaliacaoTipo[] = [];
  subTipos: iAvaliacaoSubTipo[] = [];
  etapas: iEtapa[] = [];
  segmentos: iSegmento[] = [];
  areasConhecimento: iAreaConhecimento[] = [];

  //#endregion

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private capitalizar: CapitalizarPipe
  ) {
    this.filtro = this.fb.group({
      'cdAvaliacaoTipo': [''],
      'cdAvaliacaoSubTipo': [''],
      'cdEtapa': [''],
      'cdSegmento': [''],
      'cdAreaConhecimento': [''],
    });

    this.filtro.controls.cdAvaliacaoTipo.valueChanges.subscribe(cdAvaliacaoTipo => this.tipoChange(cdAvaliacaoTipo));
    this.filtro.controls.cdAvaliacaoSubTipo.disable();

  }

  //#region Métodos

  //#region Cargas

  ngOnInit(): void {
    this.api.api(HttpMethod.GET, `avaliacao/tipos`)
      .then(res => {
        this.tipos = res;
      });

    this.api.api(HttpMethod.GET, `etapa/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.etapas = res;
      });

    this.api.api(HttpMethod.GET, `areaConhecimento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.areasConhecimento = res;
      });

    this.api.api(HttpMethod.GET, `segmento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.segmentos = res;
      });
  }

  tipoChange(cdAvaliacaoTipo) {
    this.subTipos = [];
    this.filtro.controls.cdAvaliacaoSubTipo.setValue('');
    this.filtro.controls.cdAvaliacaoSubTipo.disable();

    if (cdAvaliacaoTipo) {
      this.api.api(HttpMethod.GET, `avaliacao/subtipos/${cdAvaliacaoTipo}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.subTipos = res;
          if (this.subTipos.length > 0)
            this.filtro.controls.cdAvaliacaoSubTipo.enable();
        });
    }
  }

  //#endregion

  //#region Aplicar filtros

  confirm(value: iFormFiltro) {

    let retorno: iFiltro[] = [];

    //#region Popular filtros

    if (value.cdAvaliacaoTipo) {
      retorno.push({
        text: this.capitalizar.transform(this.tipos.find(x => x.cdAvaliacaoTipo == +value.cdAvaliacaoTipo).nmTipo),
        value: '' + value.cdAvaliacaoTipo,
        tipo: 8,
        label: 'Tipo'
      })
    }

    if (value.cdAvaliacaoSubTipo) {
      retorno.push({
        text: this.capitalizar.transform(this.subTipos.find(x => x.cdAvaliacaoSubTipo == +value.cdAvaliacaoSubTipo).nmSubTipo),
        value: '' + value.cdAvaliacaoSubTipo,
        tipo: 9,
        label: 'SubTipo'
      })
    }

    if (value.cdEtapa) {
      retorno.push({
        text: this.capitalizar.transform(
          this.etapas.find(x => x.cdEtapa == value.cdEtapa).nmEtapa
        ),
        value: '' + value.cdEtapa,
        tipo: 10,
        label: 'Etapa'
      })
    }

    if (value.cdSegmento) {
      retorno.push({
        text: this.capitalizar.transform(
          this.segmentos.find(x => x.cdSegmento == value.cdSegmento).nmSegmento
        ),
        value: '' + value.cdSegmento,
        tipo: 11,
        label: 'Segmento'
      })
    }

    if (value.cdAreaConhecimento) {
      retorno.push({
        text: this.capitalizar
          .transform(this.areasConhecimento
            .find(x => x.cdAreaConhecimento = value.cdAreaConhecimento).nmAreaConhecimento
          ),
        value: '' + value.cdAreaConhecimento,
        tipo: 12,
        label: "Área de Conhecimento"
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

interface iFormFiltro {
  cdAvaliacaoTipo: number,
  cdAvaliacaoSubTipo: number,
  cdAreaConhecimento: number,
  cdSegmento: number,
  cdEtapa: number
}