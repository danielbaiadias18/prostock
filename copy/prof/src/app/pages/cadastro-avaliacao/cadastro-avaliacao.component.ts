import { Component, OnInit, Renderer2, EventEmitter } from '@angular/core';
import { Variantes } from '../../models/Variantes';
import { iAvaliacaoTipo, iAvaliacao } from '../../models/Avaliacao';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, HttpMethod } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, ValidationErrors, FormControl, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { iSerie } from '../../models/Serie';
import { iAreaConhecimento } from '../../models/AreaConhecimento';
import { iEtapa } from '../../models/Etapa';
import { iSegmento } from '../../models/Segmento';
import { iTurma } from '../../models/Turma';
import { iTurmaAvaliacao } from '../../models/TurmaAvaliacao';
import { iDisciplina, iOrdemDisciplina } from '../../models/Disciplina';
import { trigger, transition, style, animate } from '@angular/animations';
import { iClassificacao } from '../../models/Classificacao';
import { iGrupo } from '../../models/Grupo';
import { DatePipe, formatCurrency } from '@angular/common';

import CKEditor from '../../models/CKEditor';

import Swal from 'sweetalert2'
import { iValidacaoAvaliacao } from 'src/app/models/ValidacaoAvaliacao';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';
import { Subscription } from 'rxjs';
import { iPeriodoLetivo } from 'src/app/models/PeriodoLetivo';

const tabs: iTab[] = [
  // { ds: 'Quando', tab: 1 },
  { ds: 'Execução da Prova', tab: 2 },
  { ds: 'Tempo', tab: 3 },
  { ds: 'Finalização da Prova', tab: 4 }
]

//#region Component

@Component({
  selector: 'app-cadastro-avaliacao',
  templateUrl: './cadastro-avaliacao.component.html',
  styleUrls: ['./cadastro-avaliacao.component.scss'],
  animations: [
    trigger('web', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('.600s', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
    ]),
    trigger('impressa', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('.600s', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
    ]),
    trigger('dropdown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0, maxHeight: 0 }),
        animate('.500s', style({ transform: 'translateY(0)', opacity: 1, maxHeight: '100%' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('.800s', style({ transform: 'translateY(-100%)', opacity: 0, maxHeight: 0 }))
      ])
    ])
  ]
})

//#endregion
export class CadastroAvaliacaoComponent implements OnInit {

  //#region Atributos

  public editor = CKEditor;

  get tabs() { return tabs; }


  public get stTrilha(): boolean {
    return this.cadastroAvaliacao.controls.stTrilha.value;
  }


  public set stTrilha(v: boolean) {
    this.cadastroAvaliacao.controls.stTrilha.patchValue(v);
  }



  currentTab: number = 2;

  editorConfig = Variantes.EditorConfig('200px');

  isSaving: boolean = false;

  emUso: boolean = false;

  tipos: iAvaliacaoTipo[] = [];
  nmAvaliacao: string;
  valor: string;
  media: string;
  bsConfig = Object.assign({}, { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue', isAnimated: true });
  etapas: iEtapa[] = [];
  cdEtapa: number;
  areasConhecimento: iAreaConhecimento[] = [];
  cdAreaConhecimento: number;
  isLoading: boolean = false;
  segmentos: iSegmento[] = [];
  cdSegmento: number;
  series: iSerie[] = [];
  seriesAdicionadas: iSerie[] = [];
  disciplinas: iDisciplina[] = [];
  cdSerie: number;
  cdPeriodoLetivo: number;
  periodosLetivos: iPeriodoLetivo[];
  turmas: iTurma[] = [];
  menuLength: number = 10;
  turmaAvaliacao: iTurmaAvaliacao[] = [];
  ordemDisciplinas: iOrdemDisciplina[] = [];
  dtInicio: Date;
  dtFim: Date;
  hrIni: string;
  hrFim: string;
  eventStartTime: Date;
  eventEndTime: Date;
  duration: number;
  senhaAcesso: string;
  cdTurma: number;
  cdDiscplina: number;
  avaliacaoImpOuWeb: boolean = false;
  validacoes: iValidacaoAvaliacao[] = [];
  isDisabled: boolean = true;

  get turmasAvaliacao(): FormArray {
    return this.cadastroAvaliacao.get('Turmas') as FormArray;
  }
  get disciplinaAvaliacao(): FormArray {
    return this.cadastroAvaliacao.get('Disciplinas') as FormArray;
  }

  segmentoValueChangeComplete: EventEmitter<void> = new EventEmitter();
  serieValueChangeComplete: EventEmitter<void> = new EventEmitter();

  titTela: string = 'Novo';
  avaliacaoTipos: iAvaliacaoTipo[] = [];
  cdAvaliacaoTipo: number;
  criterios: any[] = [];
  cadastroAvaliacao: FormGroup;

  //#endregion

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private api: ApiService,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private vincular: VincularQuestaoService) {

  }

  //#region Métodos

  //#region Métodos de validações

  addControlsParaOnline() {
    let quando: FormGroup =
      this.fb.group({
        'stHabilitada': [false]
      });

    quando.controls.stHabilitada.disable();

    let executar: FormGroup =
      this.fb.group({
        'stEmbaralharQuestoes': [true],
        'stEmbaralharAlternativas': [true],
        'cdCriterio': [1, Validators.required]
      });
    let tempoTentativa: FormGroup =
      this.fb.group({
        'qtdMinutos': ['60', [Validators.required, Validators.min(1)]]
      });
    let finalizar: FormGroup =
      this.fb.group({
        'stExibirNota': [false],
        'stExibirGabarito': [false],
        'stDtExibir': [false],
        'cdTipoResultado': [1]
      })

    this.cadastroAvaliacao.addControl('Quando', quando)
    this.cadastroAvaliacao.addControl('Executar', executar);
    this.cadastroAvaliacao.addControl('TempoTentativa', tempoTentativa);
    this.cadastroAvaliacao.addControl('Finalizar', finalizar);

    finalizar.controls.stExibirGabarito.valueChanges.subscribe(stExibirGabarito => {
      if (!stExibirGabarito)
        finalizar.controls.stDtExibir.setValue(false);
    })

    finalizar.controls.stDtExibir.valueChanges.subscribe(stDtExibir => {
      if (stDtExibir) {
        finalizar.addControl('dtExibir', new FormControl('', Validators.required));
        finalizar.addControl('hrExibir', new FormControl('', Validators.required));
      } else {
        finalizar.removeControl('dtExibir');
        finalizar.removeControl('hrExibir');
      }
    })
  }

  removeControlsParaOnline() {
    this.cadastroAvaliacao.removeControl('Quando')
    this.cadastroAvaliacao.removeControl('Executar');
    this.cadastroAvaliacao.removeControl('TempoTentativa');
    this.cadastroAvaliacao.removeControl('Finalizar');

    this.currentTab = 2;
  }

  hasErrorOf(tab: number) {
    let formGroup: FormGroup;
    switch (tab) {
      case 1:
      default:
        formGroup = this.cadastroAvaliacao.get('Quando') as FormGroup;
        break;
      case 2:
        formGroup = this.cadastroAvaliacao.get('Executar') as FormGroup;
        break;
      case 3:
        formGroup = this.cadastroAvaliacao.get('TempoTentativa') as FormGroup;
        break;
      case 4:
        formGroup = this.cadastroAvaliacao.get('Finalizar') as FormGroup;
        break;
    }

    return formGroup.invalid && formGroup.touched && formGroup.dirty;
  }

  validarDuplicidade(): ValidatorFn {
    return (array: FormArray): ValidationErrors => {
      let cd: number[] = [];
      let formGroup: FormGroup;
      for (formGroup of (array.controls as any[])) {
        if (formGroup.controls.cdTurma.valid) {
          if (cd.indexOf(formGroup.controls.cdTurma.value) !== -1) {
            let erro: ValidationErrors = {};
            erro['duplicidade'] = true;
            formGroup.controls.cdTurma.setErrors(erro);

            return erro;
          }

          cd.push(formGroup.controls.cdTurma.value);
        }
      }
    }
  }

  private fieldToDate(date: string, time: string) {
    return new Date(`${this.datePipe.transform(date, 'yyyy-MM-dd')}T${time}:00`);
  }

  validarPeriodo(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      let valueOf: (field: string) => any = (args) => group.get(args).value;

      const hrIni = valueOf('hrIni');
      const dtIni = valueOf('dtIni');
      const hrFim = valueOf('hrFim');
      const dtFim = valueOf('dtFim');

      let erro: ValidationErrors = {};

      if (hrIni &&
        dtIni &&
        hrFim &&
        dtFim) {
        let dataIni: Date = this.fieldToDate(dtIni, hrIni);
        let dataFim: Date = this.fieldToDate(dtFim, hrFim);

        let perLet = this.periodosLetivos.find((x) => x.cdPeriodoLetivo == this.cadastroAvaliacao.controls.cdPeriodoLetivo.value);

        perLet.dtInicio = new Date(perLet.dtInicio);
        perLet.dtFim = new Date(perLet.dtFim);

        if (!dataIni) {

          erro["data"] = true;
          group.controls.dtIni.setErrors(erro);

        } else if (!dataFim) {

          erro["data"] = true;
          group.controls.dtFim.setErrors(erro);

        } else if (dataIni < perLet?.dtInicio) {

          erro["periodoLetivo"] = true;
          group.controls.dtIni.setErrors(erro);

        } else if (dataFim > perLet?.dtFim) {

          erro["periodoLetivo"] = true;
          group.controls.dtFim.setErrors(erro);

        } else if (dataIni > dataFim) {

          erro['periodo'] = true;
          group.controls.dtFim.setErrors(erro);

          return erro;
        }
      }
      else {
        if (!hrIni) {
          erro["hora"] = true;
          group.controls.hrIni.setErrors(erro);
        }
        if (!hrFim) {
          erro["hora"] = true;
          group.controls.hrFim.setErrors(erro);
        }
      }
    }
  }

  validarDuplicidadeDisciplina(): ValidatorFn {
    return (array: FormArray): ValidationErrors => {
      let erro: ValidationErrors = {};
      let cdDisciplina: Map<number, FormGroup> = new Map();
      let nrOrdem: Map<number, FormGroup> = new Map();
      let formGroup: FormGroup;

      for (formGroup of (array.controls as any)) {
        const valueDisciplina = formGroup.controls.cdDisciplina.value;
        const valueOrdem = formGroup.controls.nrOrdem.value;

        //#region cdDisciplina


        if (valueDisciplina && cdDisciplina.has(valueDisciplina)) {
          if (!erro['duplicidade'])
            erro['duplicidade'] = true;

          formGroup.controls.cdDisciplina.setErrors(erro);
        } else if (valueDisciplina)
          formGroup.controls.cdDisciplina.setErrors(null);

        cdDisciplina.set(valueDisciplina, formGroup);

        //#endregion

        //#region nrOrdem

        if (valueOrdem && nrOrdem.has(valueOrdem)) {
          if (!erro['duplicidade'])
            erro['duplicidade'] = true;

          formGroup.controls.nrOrdem.setErrors(erro);
        } else if (valueOrdem)
          formGroup.controls.nrOrdem.setErrors(null);

        nrOrdem.set(valueOrdem, formGroup);

        //#endregion
      }

      return erro;
    }
  }

  //#endregion

  //#region Métodos de cargas

  disciplinasSubscription: Subscription;

  async ngOnInit() {
    this.renderer.addClass(document.body, 'sidebar-collapse');

    //#region Formulário

    this.cadastroAvaliacao = this.fb.group({
      'cdAvaliacao': [0, Validators.required],
      'cdAvaliacaoTipo': ['', Validators.required],
      'nmAvaliacao': ['', Validators.required],
      'media': [null, Validators.required],
      'valor': [null, Validators.compose([Validators.required, Validators.min(0.01)])],
      'cdEtapa': ['', Validators.required],
      'cdAreaConhecimento': ['', Validators.required],
      'cdSegmento': ['', Validators.required],
      'cdTurma': [null],
      'cdSerie': [null, Validators.required],
      'cdPeriodoLetivo': [null, Validators.required],
      'notasPorDisciplina': [true],
      'avaliacaoImpOuWeb': [true],
      'stTrilha': [false],
      'dsRegras': [''],
      'Disciplinas': new FormArray([], Validators.compose([this.validarDuplicidadeDisciplina()])),
      'cdEmpresa': [this.auth.currentUserValue.cdEmpresa],
      'cdStatus': [1]
    });

    this.cadastroAvaliacao.controls.notasPorDisciplina.valueChanges.subscribe(x => {
      this.disciplinasSubscription.unsubscribe();
      if (x) {
        for (let f of this.disciplinaAvaliacao.controls) {
          (f as FormGroup).controls.valor.enable({ emitEvent: false });
          (f as FormGroup).controls.media.enable({ emitEvent: false });

          if (this.disciplinaAvaliacao.controls.indexOf(f) + 1 < this.disciplinaAvaliacao.controls.length) {
            (f as FormGroup).controls.valor.setValidators(Validators.compose([Validators.required, Validators.min(0.01)]));
            (f as FormGroup).controls.media.setValidators(Validators.compose([Validators.required, Validators.min(0.01)]));

            for (let control in (f as FormGroup).controls)
              (f as FormGroup).get(control).updateValueAndValidity({ onlySelf: true });
          }
        }

        this.cadastroAvaliacao.controls.valor.disable();
        this.disciplinasSubscription = this.disciplinaAvaliacao.valueChanges.subscribe(valores => {
          let valor: number = 0;
          let media: number = 0;

          for (let val of valores) {
            if (val.valor && Number(val.valor)) valor += +val.valor;
            if (val.media && Number(val.media)) media += +val.media;
          }

          this.cadastroAvaliacao.controls.valor.setValue(valor);
          this.cadastroAvaliacao.controls.media.setValue(media);
        })
      } else {
        for (let f of this.disciplinaAvaliacao.controls) {
          (f as FormGroup).controls.valor.disable({ emitEvent: false });
          (f as FormGroup).controls.media.disable({ emitEvent: false });

          if (this.disciplinaAvaliacao.controls.indexOf(f) + 1 < this.disciplinaAvaliacao.controls.length) {
            (f as FormGroup).controls.valor.setValue('', { emitEvent: false });
            (f as FormGroup).controls.media.setValue('', { emitEvent: false });
          }

          (f as FormGroup).controls.valor.setValidators(null);
          (f as FormGroup).controls.media.setValidators(null);

          if (this.disciplinaAvaliacao.controls.indexOf(f) + 1 < this.disciplinaAvaliacao.controls.length)
            for (let control in (f as FormGroup).controls)
              (f as FormGroup).get(control).updateValueAndValidity({ onlySelf: true });
        }

        this.cadastroAvaliacao.controls.valor.enable();
      }
    })

    this.cadastroAvaliacao.controls.valor.disable();
    this.cadastroAvaliacao.controls.media.disable();
    // this.cadastroAvaliacao.controls.cdClassificacao.disable();
    // this.cadastroAvaliacao.controls.Grupos.disable();

    this.disciplinasSubscription = this.disciplinaAvaliacao.valueChanges.subscribe(valores => {
      let valor: number = 0;
      let media: number = 0;

      for (let val of valores) {
        if (val.valor && Number(val.valor)) valor += +val.valor;
        if (val.media && Number(val.media)) media += +val.media;
      }

      this.cadastroAvaliacao.controls.valor.setValue(valor);
      this.cadastroAvaliacao.controls.media.setValue(media);
    })

    this.cadastroAvaliacao.controls.cdSegmento.valueChanges.subscribe(cdSegmento => { this.segmentoChange(cdSegmento); this.addControl(this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.value); });

    this.cadastroAvaliacao.controls.cdSerie.valueChanges.subscribe(cdSerie => { this.serieChange(cdSerie); this.addControl(this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.value) });

    this.cadastroAvaliacao.controls.cdPeriodoLetivo.valueChanges.subscribe(cdPeriodoLetivo => { this.periodoLetivoChange(cdPeriodoLetivo); this.addControl(this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.value) });

    this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.valueChanges.subscribe(x => this.addControl(x));

    this.cadastroAvaliacao.controls.stTrilha.valueChanges.subscribe(isTrilha => {
      if (isTrilha == true) {
        this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.patchValue(isTrilha);
        this.cadastroAvaliacao.removeControl('Turmas');
      }
      else {
        this.addControl(true);
      }
    });

    this.disciplinaAvaliacaoAdd();
    this.addControl(true);

    //#endregion

    //#region Cargas
    await this.api.api(HttpMethod.GET, `avaliacao/tipos`)
      .then(res => {
        this.avaliacaoTipos = res;
      });

    await this.api.api(HttpMethod.GET, `etapa/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.etapas = res;
      });

    await this.api.api(HttpMethod.GET, `areaconhecimento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.areasConhecimento = res;
      });

    await this.api.api(HttpMethod.GET, `segmento/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.segmentos = res;
      });

    await this.api.api(HttpMethod.GET, `disciplina/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.disciplinas = res;
      });

    await this.api.api(HttpMethod.GET, `turma/periodoLetivo/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.periodosLetivos = res;
      });

    // await this.api.api(HttpMethod.GET, `classificacao/empresa/${this.auth.currentUserValue.cdEmpresa}`)
    //   .then(res => {
    //     this.classificacoes = res;
    //   })

    await this.api.api(HttpMethod.GET, `avaliacaocriterio`)
      .then(res => {
        this.criterios = res;
      });
    //#endregion

    //#region Editar ou Novo

    this.route.paramMap.subscribe(async param => {
      if (!Number.isNaN(Number(param.get('cdAvaliacao')))) {
        let cdAvaliacao: number = +param.get('cdAvaliacao');
        let avaliacao: iAvaliacao;
        this.titTela = "Editar";

        this.api.api(HttpMethod.GET, `avaliacao/${cdAvaliacao}`)
          .then(async (res) => {
            avaliacao = res;
            let segmento = this.segmentoValueChangeComplete.subscribe(() => {
              segmento.unsubscribe();
              this.api.api(HttpMethod.GET, `serie/avaliacao/${cdAvaliacao}`)
                .then((res: iSerie[]) => {
                  this.cadastroAvaliacao.controls.cdSerie.setValue(res
                    .filter(x => this.series.findIndex(y => y.cdSerie == x.cdSerie) > -1)
                    .map(x => x.cdSerie));
                })
            });

            let serie = this.serieValueChangeComplete.subscribe(() => {
              serie.unsubscribe();
              this.api.api(HttpMethod.GET, `turma/avaliacao/${cdAvaliacao}`)
                .then((res: iTurmaOutput[]) => {
                  if (avaliacao.modoAplicacao !== 1) {
                    this.cadastroAvaliacao.controls.cdTurma.setValue(res
                      .filter(x => this.turmas.findIndex(y => y.cdTurma == x.cdTurma) > -1)
                      .map(x => x.cdTurma))
                  } else {
                    this.cadastroAvaliacao.removeControl('Turmas');
                    this.cadastroAvaliacao.addControl('Turmas', new FormArray([
                      ...res
                        .filter(x => this.turmas.findIndex(y => y.cdTurma == x.cdTurma) > -1)
                        .map(x =>
                          this.fb.group({
                            'cdTurma': [x.cdTurma, Validators.required],
                            'dtIni': [new Date(x.dtIni)],
                            'hrIni': [x.hrIni],
                            'dtFim': [new Date(x.dtFim)],
                            'hrFim': [x.hrFim],
                            'senhaAcesso': [x.senhaAcesso, Validators.required]
                          }, { validator: Validators.compose([this.validarPeriodo()]) })
                        )
                    ], Validators.compose([this.validarDuplicidade()])));
                  }
                })
            })

            this.cadastroAvaliacao.controls.cdAvaliacao.setValue(cdAvaliacao);
            this.cadastroAvaliacao.controls.cdAvaliacaoTipo.setValue(avaliacao.cdAvaliacaoTipo);
            this.cadastroAvaliacao.controls.nmAvaliacao.setValue(avaliacao.nmAvaliacao);
            this.cadastroAvaliacao.controls.media.setValue(avaliacao.media);
            this.cadastroAvaliacao.controls.valor.setValue(avaliacao.valor);
            this.cadastroAvaliacao.controls.cdEtapa.setValue(avaliacao.cdEtapa);
            this.cadastroAvaliacao.controls.cdAreaConhecimento.setValue(avaliacao.cdAreaConhecimento);
            this.cadastroAvaliacao.controls.cdSegmento.setValue(avaliacao.cdSegmento);
            this.cadastroAvaliacao.controls.cdPeriodoLetivo.setValue(avaliacao.cdPeriodoLetivo);

            if (avaliacao.modoAplicacao !== 1)
              this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.setValue(false);

            this.cadastroAvaliacao.controls.dsRegras.setValue(avaliacao.regras);
            // this.cadastroAvaliacao.controls.cdClassificacao.setValue(avaliacao.cdClassificacaoInformacao);
            this.cadastroAvaliacao.controls.cdStatus.setValue(avaliacao.cdStatus);

            if (avaliacao.modoAplicacao === 1) {
              let formGroup: FormGroup;
              formGroup = this.cadastroAvaliacao.controls.Quando as FormGroup;

              formGroup.controls.stHabilitada.setValue(avaliacao.disponibilizada);

              formGroup = this.cadastroAvaliacao.controls.Executar as FormGroup;

              formGroup.controls.stEmbaralharQuestoes.setValue(avaliacao.randomizarQuestoes);
              formGroup.controls.stEmbaralharAlternativas.setValue(avaliacao.randomizarAlternativas);
              formGroup.controls.cdCriterio.setValue(avaliacao.cdCriterio);

              formGroup = this.cadastroAvaliacao.controls.TempoTentativa as FormGroup;

              formGroup.controls.qtdMinutos.setValue(avaliacao.tempoAvaliacao);

              formGroup = this.cadastroAvaliacao.controls.Finalizar as FormGroup;

              formGroup.controls.stExibirNota.setValue(avaliacao.exibirNota);
              formGroup.controls.stExibirGabarito.setValue(avaliacao.exibirRespostasEsperadas);
              formGroup.controls.cdTipoResultado.setValue(avaliacao.resultado);
              formGroup.controls.stDtExibir.setValue(avaliacao.exibirRespostasAposFechamento);
              if (!avaliacao.exibirRespostasEsperadas && avaliacao.exibirRespostasAposFechamento) {
                formGroup.controls.dtExibir.setValue(new Date(avaliacao.dtExibicaoRespostas));
                formGroup.controls.hrExibir.setValue(this.datePipe.transform(avaliacao.dtExibicaoRespostas, 'HH:mm'));
              }
            }

            await this.api.api(HttpMethod.GET, `disciplina/avaliacao/${cdAvaliacao}`)
              .then((res: iDisciplinaOutput[]) => {
                this.cadastroAvaliacao.removeControl('Disciplinas');
                this.cadastroAvaliacao.addControl('Disciplinas', new FormArray([
                  ...res.map(x => this.fb.group({
                    'cdDisciplina': [x.cdDisciplina, Validators.required],
                    'nrOrdem': [x.nrOrdem, Validators.compose([
                      Validators.required,
                      Validators.min(1),
                      Validators.max(20)
                    ])],
                    'valor': [x.valor, this.cadastroAvaliacao.controls.notasPorDisciplina.value ? Validators.compose([Validators.required, Validators.min(0.01)]) : null],
                    'media': [x.media, this.cadastroAvaliacao.controls.notasPorDisciplina.value ? Validators.compose([Validators.required, Validators.min(0.01)]) : null],
                  }))
                ], Validators.compose([this.validarDuplicidadeDisciplina()]))
                );

                if (!this.cadastroAvaliacao.controls.notasPorDisciplina.value) {
                  for (let f of this.disciplinaAvaliacao.controls) {
                    (f as FormGroup).controls.valor.disable();
                    (f as FormGroup).controls.media.disable();

                    (f as FormGroup).controls.valor.setValidators(null);
                    (f as FormGroup).controls.media.setValidators(null);
                  }
                }

                this.disciplinaAvaliacaoAdd();

                this.disciplinasSubscription = this.disciplinaAvaliacao.valueChanges.subscribe(valores => {
                  let valor: number = 0;
                  let media: number = 0;

                  for (let val of valores) {
                    if (val.valor && Number(val.valor)) valor += +val.valor;
                    if (val.media && Number(val.media)) media += +val.media;
                  }

                  this.cadastroAvaliacao.controls.valor.setValue(valor);
                  this.cadastroAvaliacao.controls.media.setValue(media);
                })
              });

            this.cadastroAvaliacao.controls.notasPorDisciplina.setValue(avaliacao.notasPorDisciplina);
            this.cadastroAvaliacao.controls.stTrilha.setValue(avaliacao.stTrilha);

            this.api.api(HttpMethod.GET, `avaliacao/validacoes/${cdAvaliacao}`)
              .then((res) => {
                this.validacoes = res;
              });

            if (avaliacao.verificaUso)
              this.provaEmUso();
          })

      } else if (('' + param.get("cdAvaliacao")).toLowerCase() != 'novo') {
        this.router.navigate(['/notfound']);
      }
    });

    //#endregion

  }

  addControl(args: boolean) {
    //debugger

    if (args) {
      this.addControlsParaOnline();

      this.avaliacaoImpOuWeb = args; this.cadastroAvaliacao.removeControl('Turmas');
      if (this.cadastroAvaliacao.controls.stTrilha.value == false)
        this.cadastroAvaliacao.addControl('Turmas',
          new FormArray(
            [],
            Validators.compose([this.validarDuplicidade()])));

      this.turmaAvaliacaoAdd();

      this.cadastroAvaliacao.controls.cdTurma.setValidators([]);
      this.cadastroAvaliacao.controls.cdTurma.updateValueAndValidity();
    } else {
      this.removeControlsParaOnline();

      this.avaliacaoImpOuWeb = args;

      this.cadastroAvaliacao.removeControl('Turmas');

      this.cadastroAvaliacao.controls.cdTurma.setValidators([Validators.required]);

      this.cadastroAvaliacao.controls.cdTurma.updateValueAndValidity();
    }
  }

  provaEmUso() {
    this.emUso = true;
    // this.cadastroAvaliacao.disable();
    this.cadastroAvaliacao.controls.cdAvaliacaoTipo.disable();
    this.cadastroAvaliacao.controls.nmAvaliacao.disable();
    this.cadastroAvaliacao.controls.cdEtapa.disable();
    this.cadastroAvaliacao.controls.cdAreaConhecimento.disable();
    this.cadastroAvaliacao.controls.cdSegmento.disable();
    this.cadastroAvaliacao.controls.cdSerie.disable();
    this.cadastroAvaliacao.controls.cdPeriodoLetivo.disable();
    this.cadastroAvaliacao.controls.notasPorDisciplina.disable();
    this.cadastroAvaliacao.controls.avaliacaoImpOuWeb.disable();
    this.cadastroAvaliacao.controls.stTrilha.disable();

    this.cadastroAvaliacao.controls.dsRegras.enable();
  }

  calculaTempoResponder() {

    var eventStartTime = new Date(this.turmasAvaliacao[0].dtInicio);
    var eventEndTime = new Date(this.turmasAvaliacao[0].dtFim);
    var duration = eventEndTime.valueOf() - eventStartTime.valueOf();
    let diffMins = Math.round(((duration % 86400000) % 3600000) / 60000);


  }

  // montarGrupos(grupos?: iGrupo[]) {
  //   if (!grupos) grupos = [];

  //   if (this.gruposArray.length > 0) {
  //     this.cadastroAvaliacao.removeControl('Grupos');
  //     this.cadastroAvaliacao.addControl('Grupos', new FormArray([
  //       ...this.gruposArray.map((x) => this.fb.group({
  //         'cdGrupo': [x.cdGrupo],
  //         'selected': [grupos.findIndex(y => y.cdGrupo == x.cdGrupo) > -1 || (this.avaliacaoImpOuWeb && grupos.length === 0)]
  //       }))
  //     ]));

  //     if (this.avaliacaoImpOuWeb) {
  //       this.grupos.controls
  //         .forEach(control => {
  //           control.disable();
  //         })
  //     }
  //   }
  // }

  setCdAvaliacaoTipo(cdAvaliacaoTipo: number) {
    this.cdAvaliacaoTipo = cdAvaliacaoTipo;
  }

  async segmentoChange(cdSegmento) {
    this.series = [];
    this.cadastroAvaliacao.controls.cdSerie.setValue('');
    if (cdSegmento) {
      try {
        await this.api.api(HttpMethod.GET, `serie/segmento/${cdSegmento}`)
          .then(res => {
            this.series = res;
          });
      } finally {
        this.segmentoValueChangeComplete.emit();
      }
    }
  }

  serieChange(cdSerie) {
    if (cdSerie == "" || this.cadastroAvaliacao.get('cdPeriodoLetivo').value == undefined) {
      this.turmas = [];
      this.cadastroAvaliacao.controls.cdTurma.setValue([]);
    } else {
      this.api.api(HttpMethod.GET, `turma/serie/${cdSerie}/${this.auth.currentUserValue.cdEmpresa}/${this.cadastroAvaliacao.get('cdPeriodoLetivo').value}`)
        .then(res => {
          this.turmas = res;
          this.serieValueChangeComplete.emit();
        });
    }
  }

  periodoLetivoChange(cdPeriodoLetivo) {
    if (cdPeriodoLetivo == "" || (this.cadastroAvaliacao.get('cdSerie').value == undefined || this.cadastroAvaliacao.get('cdSerie').value == "")) {
      this.turmas = [];
      this.cadastroAvaliacao.controls.cdTurma.setValue([]);
    }
    else {
      this.api.api(HttpMethod.GET, `turma/serie/${this.cadastroAvaliacao.get('cdSerie').value}/${this.auth.currentUserValue.cdEmpresa}/${cdPeriodoLetivo}`)
        .then(res => {
          this.turmas = res;
          // if(this.turmas?.length > 0)
          //   this.cadastroAvaliacao.controls.cdTurma.setValue(this.turmas[0].cdTurma);
          this.cadastroAvaliacao.controls.cdTurma.setValue([]);

        });
    }
  }

  //#endregion

  //#region Turma Array

  turmaAvaliacaoAdd(formGroup?: FormGroup) {
    if (!formGroup || formGroup.valid) {
      let form: FormGroup;

      this.turmasAvaliacao.push(form = this.fb.group({
        'cdTurma': ['', Validators.required],
        'dtIni': [''],
        'hrIni': [''],
        'dtFim': [''],
        'hrFim': [''],
        'senhaAcesso': ['', Validators.required]
      }, { validator: Validators.compose([this.validarPeriodo()]) }));

      if (this.turmasAvaliacao.length == 1) {
        form.valueChanges.subscribe(x => {
          if (x.dtIni && x.hrIni.length == 5) {
            this.eventStartTime = new Date(this.datePipe.transform(x.dtIni, "yyyy-MM-dd") + "T" + x.hrIni + ":00");
          }
          if (x.dtFim && x.hrFim.length == 5) {
            this.eventEndTime = new Date(this.datePipe.transform(x.dtFim, "yyyy-MM-dd") + "T" + x.hrFim + ":00");
          }
          if (this.eventStartTime != null && this.eventEndTime != null) {
            this.duration = this.eventEndTime.valueOf() - this.eventStartTime.valueOf();
            let diffMins = Math.round(this.duration / 60000);
            this.cadastroAvaliacao.controls.TempoTentativa.patchValue({ qtdMinutos: diffMins });
          }

        });
      }
    } else
      Variantes.markFormGroupTouched(formGroup);

  }

  //#endregion

  //#region Disciplina Array

  disciplinaAvaliacaoAdd(formGroup?: FormGroup) {
    if (!formGroup || formGroup.valid) {
      let turmAval: FormGroup;
      if (this.disciplinaAvaliacao.length === 0)
        this.disciplinaAvaliacao.push(turmAval = this.fb.group({
          'cdDisciplina': ['', Validators.required],
          'nrOrdem': [this.disciplinaAvaliacao.length + 1, Validators.compose([
            Validators.required,
            Validators.min(1),
            Validators.max(20)
          ])],
          'valor': ['', this.cadastroAvaliacao.controls.notasPorDisciplina.value ? Validators.compose([Validators.required, Validators.min(0.01)]) : null],
          'media': ['', this.cadastroAvaliacao.controls.notasPorDisciplina.value ? Validators.compose([Validators.required, Validators.min(0.01)]) : null],
        }));
      else
        this.disciplinaAvaliacao.push(turmAval = this.fb.group({
          'cdDisciplina': [''],
          'nrOrdem': [this.disciplinaAvaliacao.length + 1],
          'valor': [''],
          'media': [''],
        }));

      if (!this.cadastroAvaliacao.controls.notasPorDisciplina.value)
        turmAval.controls.valor.disable();

      let temp = turmAval.valueChanges.subscribe(() => {
        if (this.disciplinaAvaliacao.length <= 20) {
          turmAval.controls.cdDisciplina.setValidators(Validators.required);
          turmAval.controls.nrOrdem.setValidators(
            [
              Validators.required,
              Validators.min(1),
              Validators.max(20)
            ]
          );

          if (this.cadastroAvaliacao.controls.notasPorDisciplina.value) {
            turmAval.controls.valor.setValidators([Validators.required, Validators.min(0.01)]);
            turmAval.controls.media.setValidators([Validators.required, Validators.min(0.01)]);
          }

          this.disciplinaAvaliacaoAdd();
          temp.unsubscribe();
          for (let control in turmAval.controls)
            turmAval.get(control).updateValueAndValidity({ onlySelf: true });

        }
      });

    } else
      Variantes.markFormGroupTouched(formGroup);
  }

  async valorBlur(index: number) {
    const formGroup: FormGroup = this.disciplinaAvaliacao.controls[index] as FormGroup;
    const val = formGroup.controls.valor.value;
    let valor: number = Number(val);
    if (valor) {
      formGroup.controls.media.disable();
      await this.api.api(HttpMethod.POST, `avaliacao/valor`, { cdEmpresa: this.auth.currentUserValue.cdEmpresa, valor: valor })
        .then(res => {
          formGroup.controls.media.setValue(res.valor);
        });
      formGroup.controls.media.enable();
    }
  }

  async valorTotalBlur() {
    const val = this.cadastroAvaliacao.controls.valor.value;
    let valor: number = Number(val);
    if (valor) {
      this.cadastroAvaliacao.controls.media.disable();
      await this.api.api(HttpMethod.POST, `avaliacao/valor`, { cdEmpresa: this.auth.currentUserValue.cdEmpresa, valor: valor })
        .then(res => {
          this.cadastroAvaliacao.controls.media.setValue(res.valor);
        });
      this.cadastroAvaliacao.controls.media.enable();
    }
  }

  disciplinaAvaliacaoRemove(index: number) {
    this.disciplinaAvaliacao.removeAt(index);
  }

  getDisciplina(cdDisciplina: number) {
    return this.disciplinas.find(x => x.cdDisciplina == cdDisciplina).nmDisciplina;
  }

  ordemDisciplinaAdd() {
    let ordemDisciplina: iOrdemDisciplina;
    ordemDisciplina.cdDisciplina = this.cadastroAvaliacao.controls.cdDisciplina.value;
    ordemDisciplina.nmDisciplina = this.disciplinas.find(x => x.cdDisciplina == this.cadastroAvaliacao.controls.cdDisciplina.value).nmDisciplina;
    ordemDisciplina.cdOrdem = this.cadastroAvaliacao.controls.cdOrdem.value;

    this.ordemDisciplinas.push(ordemDisciplina);
  }

  //#endregion

  //#region Salvar e Enviar

  Enviar() {
    this.api.api(HttpMethod.GET, `avaliacao/${this.cadastroAvaliacao.controls.cdAvaliacao.value}/enviar`)
      .then(res => {
        if (!res) {
          Swal.fire('Cadastro de Avaliações',
            'Avaliação enviada para validação!',
            'success');

          this.cadastroAvaliacao.controls.cdStatus.setValue(2);
        }
      })
  }

  async Salvar(avaliacao) {
   // console.log(this.cadastroAvaliacao);
    if (this.cadastroAvaliacao.valid) {
      this.isSaving = true;

      //Remove a última disciplina
      avaliacao.Disciplinas.pop();

      await this.api.api(HttpMethod.POST, `avaliacao`, avaliacao)
        .then(() => {
          Swal.fire('Cadastro de Avaliações',
            'Salva com sucesso!',
            'success');

          if (this.vincular.isVinculando) {
            this.vincular.reload();
          }

          this.router.navigate(['avaliacao']);
        });

      this.isSaving = false;
    } else {
      Variantes.markFormGroupTouched(this.cadastroAvaliacao);

      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });

      toast.fire('Validação!', 'Preencha ou corrija os campos em vermelho', 'warning');
    }
  }

  //#endregion

  //#endregion
}

export interface iTab {
  tab: number;
  ds: string;
}

export interface iTurmaOutput {
  cdTurma: number;
  dtIni?: Date;
  hrIni?: string;
  dtFim?: Date;
  hrFim?: string;
  senhaAcesso?: string;
}

export interface iDisciplinaOutput {
  cdDisciplina: number;
  nmDisciplina?: string;
  media: number;
  nrOrdem: number;
  valor: number;
}
