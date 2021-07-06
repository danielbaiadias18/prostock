import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iFiltro } from 'src/app/pages/avaliacao/avaliacao.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { iSegmento } from 'src/app/models/Segmento';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { iAreaConhecimento } from 'src/app/models/AreaConhecimento';
// import { iEtapa } from 'src/app/models/Etapa';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iSerie } from 'src/app/models/Serie';
import { iPeriodoLetivo } from 'src/app/models/PeriodoLetivo';

@Component({
  selector: 'app-filtro-trilha',
  templateUrl: './filtro-trilha.component.html',
  styleUrls: ['./filtro-trilha.component.scss'],
  providers: [CapitalizarPipe]
})
export class FiltroTrilhaComponent implements OnInit {

  //#region Atributos

  addFiltroEmitter: EventEmitter<iFiltro[]>;
  filtro: FormGroup;

  series: iSerie[] = [];
  disciplinas: iDisciplina[] = [];
  //etapas: iEtapa[] = [];
  segmentos: iSegmento[] = [];
  areasConhecimento: iAreaConhecimento[] = [];
  periodosLetivos: iPeriodoLetivo[] = [];

  //#endregion

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private capitalizar: CapitalizarPipe
  ) {
    this.filtro = this.fb.group({
      'cdAreaConhecimento': [''],
      'cdDisciplina': [''],
      // 'cdEtapa': [''],
      'cdSegmento': [''],
      'cdPeriodoLetivo': [''],
      'cdSerie': ['']
    });

    this.filtro.controls.cdAreaConhecimento.valueChanges.subscribe(cdAreaConhecimento => this.areaConhecimentoChange(cdAreaConhecimento));
    this.filtro.controls.cdSerie.valueChanges.subscribe(cdSerie => this.serieChange(cdSerie));

  }

  //#region Métodos

  //#region Cargas

  ngOnInit(): void {
    this.api.api(HttpMethod.GET, `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.disciplinas = res;
      });

    this.api.api(HttpMethod.GET, `turma/periodoletivo/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.periodosLetivos = res;
      });

    this.api.api(HttpMethod.GET, `serie/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.series = res;
      });

    // this.api.api(HttpMethod.GET, `etapa/empresa/${this.auth.currentUserValue.cdEmpresa}`)
    //   .then(res => {
    //     this.etapas = res;
    //   });

    this.api.api(HttpMethod.GET, `areaConhecimento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.areasConhecimento = res;
      });

    this.api.api(HttpMethod.GET, `segmento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.segmentos = res;
      });
  }

  areaConhecimentoChange(cdAreaConhecimento) {
    if (cdAreaConhecimento) {
      this.carregaDisciplina();
    }
  }

  serieChange(cdSerie){
    if (cdSerie) {
      this.carregaDisciplina();
    }
  }

  carregaDisciplina(){
    this.disciplinas = [];
    this.filtro.controls.cdDisciplina.setValue('');
    this.filtro.controls.cdDisciplina.disable();

    let cdAreaConhec = this.filtro.controls.cdAreaConhecimento.value;
    let cdSer = this.filtro.controls.cdSerie.value;

    //console.log(cdAreaConhec, cdSer, "cdAreaConhec", "cdSer");

    if(cdAreaConhec != "" && cdSer != ""){
     // console.log("cdArea e cdSer");
      this.api.api(HttpMethod.GET, `disciplina/areaconhecimento/${cdAreaConhec}/${cdSer}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
          if (this.disciplinas.length > 0)
            this.filtro.controls.cdDisciplina.enable();
        });
    }else{
      if(cdAreaConhec != ""){
      //  console.log("cdArea");
        this.api.api(HttpMethod.GET, `disciplina/areaconhecimento/${cdAreaConhec}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
          if (this.disciplinas.length > 0)
            this.filtro.controls.cdDisciplina.enable();
        });
      }else if(cdSer != ""){
       // console.log("cdSer");
        this.api.api(HttpMethod.GET, `disciplina/serie/${cdSer}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
          if (this.disciplinas.length > 0)
            this.filtro.controls.cdDisciplina.enable();
        });
      }
    }

  }
  //#endregion

  //#region Aplicar filtros

  confirm(value: iFormFiltro) {

    let retorno: iFiltro[] = [];
    //console.log(value, "value")
    //#region Popular filtros
    if (value.cdDisciplina) {
      retorno.push({
        text: this.capitalizar
          .transform(this.disciplinas
            .find(x => x.cdDisciplina == value.cdDisciplina).nmDisciplina
          ),
        value: '' + value.cdDisciplina,
        tipo: 4,
        label: "Disciplina"
      })
    }

    if (value.cdAreaConhecimento) {
      retorno.push({
        text: this.capitalizar
          .transform(this.areasConhecimento
            .find(x => x.cdAreaConhecimento == value.cdAreaConhecimento).nmAreaConhecimento
          ),
        value: '' + value.cdAreaConhecimento,
        tipo: 5,
        label: "Área de Conhecimento"
      })
    }

    // if (value.cdEtapa) {
    //   retorno.push({
    //     text: this.capitalizar.transform(
    //       this.etapas.find(x => x.cdEtapa == value.cdEtapa).nmEtapa
    //     ),
    //     value: '' + value.cdEtapa,
    //     tipo: 6,
    //     label: 'Etapa'
    //   })
    // }

    if (value.cdSegmento) {
      retorno.push({
        text: this.capitalizar.transform(
          this.segmentos.find(x => x.cdSegmento == value.cdSegmento).nmSegmento
        ),
        value: '' + value.cdSegmento,
        tipo: 7,
        label: 'Segmento'
      })
    }

    if (value.cdPeriodoLetivo) {
      retorno.push({
        text: this.capitalizar.transform(
          this.periodosLetivos.find(x => x.cdPeriodoLetivo == value.cdPeriodoLetivo).nmPeriodoLetivo
        ),
        value: '' + value.cdPeriodoLetivo,
        tipo: 8,
        label: 'Período Letivo'
      })
    }

    if (value.cdSerie) {
      retorno.push({
        text: this.capitalizar.transform(
          this.series.find(x => x.cdSerie == value.cdSerie).nmSerie
        ),
        value: '' + value.cdSerie,
        tipo: 9,
        label: 'Série'
      })
    }



    //#endregion
  //  console.log(retorno, "retorno");

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
  cdAreaConhecimento: number,
  cdDisciplina: number,
  // cdEtapa: number,
  cdSegmento: number,
  cdPeriodoLetivo: number,
  cdSerie: number
}
