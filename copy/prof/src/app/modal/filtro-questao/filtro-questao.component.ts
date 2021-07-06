import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iFiltro } from 'src/app/pages/questao/questao.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { iUsuario } from 'src/app/models/User';
import { iProfessor } from 'src/app/models/Professor';
import { iQuestaoTipo, iDificuldade } from 'src/app/models/Questao';
import { iSerie } from 'src/app/models/Serie';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { iAreaConhecimento } from 'src/app/models/AreaConhecimento';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iTopico } from 'src/app/models/Topico';
import { iSubTopico } from 'src/app/models/SubTopico';
import { iHabilidade } from 'src/app/models/Habilidades';

@Component({
  selector: 'app-filtro-questao',
  templateUrl: './filtro-questao.component.html',
  styleUrls: ['./filtro-questao.component.scss'],
  providers: [CapitalizarPipe]
})
export class FiltroQuestaoComponent implements OnInit {

  //#region Atributos

  isLoading: boolean = true;
  addFiltroEmitter: EventEmitter<iFiltro[]>;
  filtro: FormGroup;

  professores: iProfessor[] = [];
  tipos: iQuestaoTipo[] = [];
  dificuldades: iDificuldade[] = [];
  series: iSerie[] = [];
  areasConhecimento: iAreaConhecimento[] = [];
  disciplinas: iDisciplina[] = [];
  topicos: iTopico[] = [];
  subTopicos: iSubTopico[] = [];
  habilidades: iHabilidade[] = [];

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
      'cdQuestaoTipo': [''],
      'cdDificuldade': [''],
      'cdSerie': [''],
      'cdDisciplina': [''],
      'cdTopico': [''],
      'cdHabilidade': ['']
    });

    this.filtro.controls.cdSerie.valueChanges.subscribe(cdSerie => this.serieChange(cdSerie));

    this.filtro.controls.cdDisciplina.valueChanges.subscribe(cdDisciplina => this.disciplinaChange(cdDisciplina));
    this.filtro.controls.cdTopico.disable();

    this.filtro.controls.cdTopico.valueChanges.subscribe(cdTopico => this.topicoChange(cdTopico));

    this.filtro.controls.cdHabilidade.disable();
  }

  //#region Métodos

  //#region Cargas

  async ngOnInit(): Promise<void> {

    await this.api.api(HttpMethod.GET, `professor/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.professores = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/tipos/')
      .then(res => {
        this.tipos = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/dificuldade')
      .then(res => {
        this.dificuldades = res;
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

  topicoChange(cdTopico) {
    this.habilidades = [];
    this.filtro.controls.cdHabilidade.setValue('');
    this.filtro.controls.cdHabilidade.disable();

    if (cdTopico)
      this.api
        .api(HttpMethod.GET,
          `habilidade/topico/${cdTopico}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.habilidades = res;
          if (this.habilidades.length > 0)
            this.filtro.controls.cdHabilidade.enable();
        })
  }

  //#endregion

  //#region Aplicar filtros

  confirm(value: iFormFiltro) {

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

    if (value.cdDificuldade) {
      retorno.push({
        text: this.capitalizar.transform(
          this.dificuldades.find(x => x.cdDificuldade == value.cdDificuldade).nmDificuldade
        ),
        value: '' + value.cdDificuldade,
        tipo: 5,
        label: 'Dificuldade'
      })
    }

    if (value.cdDisciplina) {
      retorno.push({
        text: this.capitalizar.transform(
          this.disciplinas.find(x => x.cdDisciplina == value.cdDisciplina).nmDisciplina
        ),
        value: '' + value.cdDisciplina,
        tipo: 6,
        label: 'Disciplina'
      })
    }

    if (value.cdHabilidade) {
      retorno.push({
        text: this.capitalizar.transform(
          this.habilidades.find(x => x.cdHabilidade == value.cdHabilidade).nmHabilidade
        ),
        value: '' + value.cdHabilidade,
        tipo: 7,
        label: 'Habilidade'
      })
    }

    if (value.cdProfessor) {
      retorno.push({
        text: this.capitalizar.transform(this.professores.find(x => x.cdProfessor == +value.cdProfessor).nmProfessor),
        value: '' + value.cdProfessor,
        tipo: 8,
        label: 'Professor'
      })
    }

    if (value.cdQuestaoTipo) {
      retorno.push({
        text: this.capitalizar.transform(this.tipos.find(x => x.cdQuestaoTipo == +value.cdQuestaoTipo).nmQuestaoTipo),
        value: '' + value.cdQuestaoTipo,
        tipo: 9,
        label: 'Tipo'
      })
    }

    if (value.cdSerie) {
      retorno.push({
        text: this.capitalizar.transform(
          this.series.find(x => x.cdSerie == value.cdSerie).nmSerie
        ),
        value: '' + value.cdSerie,
        tipo: 10,
        label: 'Série'
      })
    }

    if (value.cdSubTopico) {
      retorno.push({
        text: this.capitalizar.transform(
          this.subTopicos.find(x => x.cdSubTopico == value.cdSubTopico).nmSubTopico
        ),
        value: '' + value.cdSubTopico,
        tipo: 11,
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

interface iFormFiltro {
  cdProfessor: number,
  cdQuestaoTipo: number,
  cdDificuldade: number,
  cdSerie: number,
  cdDisciplina: number,
  cdTopico: number,
  cdSubTopico: number,
  cdHabilidade: number
}
