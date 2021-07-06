import { Component, OnInit, Renderer2, EventEmitter } from '@angular/core';
import { Variantes } from '../../models/Variantes';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, HttpMethod } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { iSerie } from '../../models/Serie';
import { iAreaConhecimento } from '../../models/AreaConhecimento';
import { iSegmento } from '../../models/Segmento';
import { iTurma } from '../../models/Turma';
import { iTurmaAvaliacao } from '../../models/TurmaAvaliacao';
import { iDisciplina, iOrdemDisciplina } from '../../models/Disciplina';
import { trigger, transition, style, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';

import CKEditor from '../../models/CKEditor';

import Swal from 'sweetalert2'
import { iValidacaoAvaliacao } from 'src/app/models/ValidacaoAvaliacao';
import { VincularQuestaoService } from 'src/app/services/vincular-questao.service';
import { Subscription } from 'rxjs';
import { iPeriodoLetivo } from 'src/app/models/PeriodoLetivo';
import { iTrilha } from 'src/app/models/Trilha';
import { iTrilhaModulo, iTrilhaModuloItem } from 'src/app/models/TrilhaModulo';
import { CadastroModuloItemComponent } from 'src/app/modal/cadastro-modulo-item/cadastro-modulo-item.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iQuestao } from 'src/app/models/Questao';
import { iAvaliacao } from 'src/app/models/Avaliacao';

const tabs: iTab[] = [
  // { ds: 'Quando', tab: 1 },
  { ds: 'Execução da Prova', tab: 2 },
  { ds: 'Tempo e Tentativas', tab: 3 },
  { ds: 'Finalização da Prova', tab: 4 }
]

//#region Component

@Component({
  selector: 'app-cadastro-trilha',
  templateUrl: './cadastro-trilha.component.html',
  styleUrls: ['./cadastro-trilha.component.scss'],
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
export class CadastroTrilhaComponent implements OnInit {

  //#region Atributos

  public editor = CKEditor;

  get tabs() { return tabs; }

  currentTab: number = 2;
  cdsAvaliacao: number[] = [];

  editorConfig = Variantes.EditorConfig('200px');

  isSaving: boolean = false;

  avaliacoes: Array<iAvaliacao> = [];

  emUso: boolean = false;

  nmTrilha: string;
  valor: string;
  media: string;
  bsConfig = Object.assign({}, { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-blue', isAnimated: true });
 // etapas: iEtapa[] = [];
  //cdEtapa: number;
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

  get turmasAvaliacao(): FormArray {
    return this.cadastroTrilha.get('Turmas') as FormArray;
  }
  get disciplinaAvaliacao(): FormArray {
    return this.cadastroTrilha.get('Disciplinas') as FormArray;
  }

  segmentoValueChangeComplete: EventEmitter<void> = new EventEmitter();
  serieValueChangeComplete: EventEmitter<void> = new EventEmitter();

  titTela: string = 'Novo';
  cdTrilha: number = 0;

  criterios: any[] = [];
  cadastroTrilha: FormGroup;

  Modulos: FormArray;

  //#endregion

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private api: ApiService,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private vincular: VincularQuestaoService,
    private bsModalService: BsModalService) {

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

    this.cadastroTrilha.addControl('Quando', quando);
    this.cadastroTrilha.addControl('Executar', executar);
    this.cadastroTrilha.addControl('TempoTentativa', tempoTentativa);
    this.cadastroTrilha.addControl('Finalizar', finalizar);

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
    this.cadastroTrilha.removeControl('Quando')
    this.cadastroTrilha.removeControl('Executar');
    this.cadastroTrilha.removeControl('TempoTentativa');
    this.cadastroTrilha.removeControl('Finalizar');

    this.currentTab = 2;
  }

  removeItem(x: FormGroup, j: number) {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja remover o item?',
      text: '',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim'
    }).then((res) => {
      if (res.isConfirmed)
        ((x?.controls['Itens']) as FormArray)?.controls?.splice(j, 1);

      (x?.controls['Itens'] as FormArray).controls.forEach(z => {
        z.updateValueAndValidity();
      });
    });

  }

  removeModulo(i: number) {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja remover o módulo?',
      text: '',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim'
    }).then((res) => {
      if (res.isConfirmed)
        this.Modulos.controls?.splice(i, 1);
      this.Modulos.controls.forEach(z => {
        z.updateValueAndValidity();
      });
    });
  }

  hasErrorOf(tab: number) {
    let formGroup: FormGroup;
    switch (tab) {
      case 1:
      default:
        formGroup = this.cadastroTrilha.get('Quando') as FormGroup;
        break;
      case 2:
        formGroup = this.cadastroTrilha.get('Executar') as FormGroup;
        break;
      case 3:
        formGroup = this.cadastroTrilha.get('TempoTentativa') as FormGroup;
        break;
      case 4:
        formGroup = this.cadastroTrilha.get('Finalizar') as FormGroup;
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

        let perLet = this.periodosLetivos.find((x) => x.cdPeriodoLetivo == this.cadastroTrilha.controls.cdPeriodoLetivo.value);

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
      //let nrOrdem: Map<number, FormGroup> = new Map();
      let formGroup: FormGroup;

      for (formGroup of (array.controls as any)) {
        const valueDisciplina = formGroup.controls.cdDisciplina.value;
        //const valueOrdem = formGroup.controls.nrOrdem.value;

        //#region cdDisciplina


        if (valueDisciplina && cdDisciplina.has(valueDisciplina)) {
          if (!erro['duplicidade'])
            erro['duplicidade'] = true;

          formGroup.controls.cdDisciplina.setErrors(erro);
        } else if (valueDisciplina)
          formGroup.controls.cdDisciplina.setErrors(null);

        cdDisciplina.set(valueDisciplina, formGroup);

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

    this.cadastroTrilha = this.fb.group({
      'cdTrilha': [0, Validators.required],
      // 'cdAvaliacaoTipo': ['', Validators.required],
      'nmTrilha': ['', Validators.required],
      'media': [null, Validators.required],
      'valor': [null, Validators.compose([Validators.required, Validators.min(0.01)])],
      //'cdEtapa': ['', Validators.required],
      'cdAreaConhecimento': ['', Validators.required],
      'cdSegmento': ['', Validators.required],
      'cdTurma': [null],
      'cdSerie': [null, Validators.required],
      'cdPeriodoLetivo': [null, Validators.required],
      'notasPorDisciplina': [true],
      'avaliacaoImpOuWeb': [true],
      'dsRegras': [''],
      'Disciplinas': new FormArray([], Validators.compose([this.validarDuplicidadeDisciplina()])),
      'cdEmpresa': [this.auth.currentUserValue.cdEmpresa],
      'cdStatus': [1],
    });

    this.cadastroTrilha.controls.notasPorDisciplina.valueChanges.subscribe(x => {
      this.disciplinasSubscription.unsubscribe();
    })

    this.cadastroTrilha.controls.valor.disable();
    this.cadastroTrilha.controls.media.disable();

    let addControl: (args: boolean) => void = x => {

      if (x) {

        this.avaliacaoImpOuWeb = x; this.cadastroTrilha.removeControl('Turmas');
        this.cadastroTrilha.addControl('Turmas',
          new FormArray(
            [],
            Validators.compose([this.validarDuplicidade()])));

        this.turmaAvaliacaoAdd();

        this.cadastroTrilha.controls.cdTurma.setValidators([]);

        this.cadastroTrilha.controls.cdTurma.updateValueAndValidity();
      } else {
        this.removeControlsParaOnline();

        this.avaliacaoImpOuWeb = x;

        this.cadastroTrilha.removeControl('Turmas');

        this.cadastroTrilha.controls.cdTurma.setValidators([Validators.required]);

        this.cadastroTrilha.controls.cdTurma.updateValueAndValidity();
      }
    }

    this.cadastroTrilha.controls.cdSegmento.valueChanges.subscribe(cdSegmento => { this.segmentoChange(cdSegmento); addControl(this.cadastroTrilha.controls.avaliacaoImpOuWeb.value); });

    this.cadastroTrilha.controls.cdAreaConhecimento.valueChanges.subscribe(cdAreaConhecimento => { this.areaConhecimentoChange(cdAreaConhecimento); addControl(this.cadastroTrilha.controls.avaliacaoImpOuWeb.value) });

    this.cadastroTrilha.controls.cdSerie.valueChanges.subscribe(cdSerie => { this.serieChange(cdSerie); addControl(this.cadastroTrilha.controls.avaliacaoImpOuWeb.value) });

    this.cadastroTrilha.controls.cdPeriodoLetivo.valueChanges.subscribe(cdPeriodoLetivo => { this.periodoLetivoChange(cdPeriodoLetivo); addControl(this.cadastroTrilha.controls.avaliacaoImpOuWeb.value) });

    this.cadastroTrilha.controls.avaliacaoImpOuWeb.valueChanges.subscribe(x => addControl(x));

    this.disciplinaAvaliacaoAdd();
    addControl(true);

    //#endregion

    //#region Cargas

    // await this.api.api(HttpMethod.GET, `etapa/empresa/${this.auth.currentUserValue.cdEmpresa}`)
    //   .then(res => {
    //     this.etapas = res;
    //   });

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

    await this.api.api(HttpMethod.GET, `avaliacaocriterio`)
      .then(res => {
        this.criterios = res;
      });

    //#endregion

    //#region Editar ou Novo

    this.route.paramMap.subscribe(async param => {
      if (!Number.isNaN(Number(param.get('cdTrilha')))) {
        let cdTrilha: number = +param.get('cdTrilha');
        let trilha: iTrilha;
        this.cdTrilha = cdTrilha;
        this.titTela = "Editar";

        this.api.api(HttpMethod.GET, `trilha/${cdTrilha}`)
          .then(async (res) => {
            trilha = res;
            let segmento = this.segmentoValueChangeComplete.subscribe(() => {
              segmento.unsubscribe();
              this.api.api(HttpMethod.GET, `serie/trilha/${cdTrilha}`)
                .then((res: iSerie) => {
                  this.cadastroTrilha.controls.cdSerie.setValue(res.cdSerie);
                })
            });

            let serie = this.serieValueChangeComplete.subscribe(() => {
              serie.unsubscribe();
              this.api.api(HttpMethod.GET, `turma/trilha/${cdTrilha}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
                .then((res: iTurmaOutput[]) => {
                  this.cadastroTrilha.removeControl('Turmas');
                  this.cadastroTrilha.addControl('Turmas', new FormArray([
                    ...res
                      .filter(x => this.turmas.findIndex(y => y.cdTurma == x.cdTurma) > -1)
                      .map(x =>
                        this.fb.group({
                          'cdTurma': [x.cdTurma, Validators.required],
                        })
                      )
                  ], Validators.compose([this.validarDuplicidade()])));

                })
            })

            this.cadastroTrilha.controls.cdTrilha.setValue(cdTrilha);
            this.cadastroTrilha.controls.nmTrilha.setValue(trilha.nmTrilha);

            //this.cadastroTrilha.controls.cdEtapa.setValue(trilha.cdEtapa);
            this.cadastroTrilha.controls.cdAreaConhecimento.setValue(trilha.cdAreaConhecimento);
            this.cadastroTrilha.controls.cdSegmento.setValue(trilha.cdSegmento);
            this.cadastroTrilha.controls.cdPeriodoLetivo.setValue(trilha.cdPeriodoLetivo);

            await this.api.api(HttpMethod.GET, `disciplina/trilha/${cdTrilha}`)
              .then((res: iDisciplinaOutput[]) => {
                this.cadastroTrilha.removeControl('Disciplinas');
                this.cadastroTrilha.addControl('Disciplinas', new FormArray([
                  ...res.map(x => this.fb.group({
                    'cdDisciplina': [x.cdDisciplina, Validators.required],
                  }))
                ], Validators.compose([this.validarDuplicidadeDisciplina()]))
                );

                this.disciplinaAvaliacaoAdd();
              });
          })

      } else if (('' + param.get("cdTrilha")).toLowerCase() != 'novo') {
        this.router.navigate(['/notfound']);
      }
    });

    //#endregion
    this.route.paramMap.subscribe(async param => {
      if (!Number.isNaN(Number(param.get('cdTrilha')))) {
        this.cdTrilha = +param.get('cdTrilha');

        if (this.cdTrilha != 0) {

          this.api.api(HttpMethod.GET, `trilhamodulo/trilha/${this.cdTrilha}`)
            .then(async (res: iTrilhaModulo[]) => {

              for (let i = 0; i < res.length; i++) {
                for (let j = 0; j < res[i].Itens.length; j++) {
                  this.cdsAvaliacao.push(res[i].Itens[j].cdAvaliacao ?? 0)
                }
              }
             // console.log(this.cdsAvaliacao, "this.cdsAvaliacao");
              if (this.cdsAvaliacao.length > 0)
                await this.api.api(HttpMethod.POST, `avaliacao/trilha`, this.cdsAvaliacao)
                  .then((res: iAvaliacao[]) => {
                    this.avaliacoes = res;
                  });

              this.Modulos = await this.fb.array([...res
                .map(x => this.toFormGroup(x)
                )]);

            });
        }
      }
    });


    //#region TimeLine
    this.Modulos = new FormArray([]);
  }

  filterDisciplinas(res) {
    this.disciplinas = res;
    this.disciplinaAvaliacao.controls = this.disciplinaAvaliacao.controls.filter(x =>
      this.disciplinas.findIndex(y => (x.get('cdDisciplina').value == y.cdDisciplina)) != -1
    );
    let control = this.cadastroTrilha.get('Disciplinas');
    this.cadastroTrilha.removeControl('Disciplinas');
    this.cadastroTrilha.addControl('Disciplinas', control);
    this.disciplinaAvaliacaoAdd();
  }

  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  textAreaAdjust($element) {
    $element.style.height = "1px";
    $element.style.height = (20 + $element.scrollHeight) + "px";
  }

  toFormGroup(obj: iTrilhaModulo) {

    return this.fb.group({
      'cdTrilhaModulo': [obj.cdTrilhaModulo],
      'nmModulo': [obj.nmModulo, Validators.required],
      'cdTrilha': [obj.cdTrilha, Validators.required],
      'Itens': this.fb.array([...obj.Itens
        .map(x => this.toItemFormGroup(x))], Validators.minLength(1))
    });
  }

  toItemFormGroup(obj: iTrilhaModuloItem) {
    return this.fb.group({
      'cdItemModulo': [obj.cdItemModulo],
      'nmItemModulo': [obj.nmItemModulo, Validators.required],
      'cdModulo': [obj.cdModulo],
      'cdAvaliacao': [obj.cdAvaliacao],
      'cdVideo': [obj.cdVideo],
      'textVideo': [obj.textVideo],
      'texto': [obj.texto],
      'link': [obj.link],
      'cdTipo': [obj.cdTipo, Validators.required],
    });
  }

  openModuloItemModal(val: FormGroup, cdTipo: number) {

    let disc: number[] = this.cadastroTrilha.get('Disciplinas').value.map((x) => x.cdDisciplina).filter(x => x > 0);
    const state = {
      cdTipo: cdTipo, //Para testar. Aleterar depois, coloque o cd do tipo aqui
      trilhaModulo: val,
      cdAreaConhecimento: this.cadastroTrilha.get('cdAreaConhecimento').value,
      cdSerie: this.cadastroTrilha.get('cdSerie').value,
      disciplinas: disc
    }
    let modalRef = this.bsModalService.show(CadastroModuloItemComponent, { initialState: state, class: 'modal-xl', backdrop: false });

    modalRef.content.VideoAvaliacao.subscribe((res) => {
      if (state.cdTipo == 2) {
        (val.get('Itens') as FormArray).push(
          this.fb.group({
            cdItemModulo: [0],
            nmItemModulo: [res.titulo, Validators.required],
            cdModulo: [val.get('cdTrilhaModulo')?.value ?? 0],
            cdAvaliacao: [null],
            cdVideo: [res.cdVideo, Validators.required],
            textVideo: [res.textVideo],
            texto: [''],
            link: [res.linkVideo],
            cdTipo: [2, Validators.required],
          })
        );

      }
      else if (state.cdTipo == 3) {
        this.avaliacoes.push(res);

        (val.get('Itens') as FormArray).push(
          this.fb.group({
            cdItemModulo: [0],
            nmItemModulo: ['', Validators.required],
            cdModulo: [val.get('cdTrilhaModulo')?.value ?? 0],
            cdAvaliacao: [res.cdAvaliacao, Validators.required],
            cdVideo: [null],
            textVideo: [null],
            texto: [''],
            link: [''],
            cdTipo: [3, Validators.required],
          })
        );
      }
    })
  }

  getAvaliacao(cdAvaliacao: number) {
    if (this.avaliacoes.length > 0)
      return this.avaliacoes.find(x => x.cdAvaliacao == cdAvaliacao);
  }

  openModuloItem(val: FormGroup) {
    if (val != null) {
      (val.get('Itens') as FormArray).push(
        this.fb.group({
          cdItemModulo: [0],
          nmItemModulo: ['', Validators.required],
          cdModulo: [val?.get('cdTrilhaModulo')?.value ?? 0],
          cdAvaliacao: [null],
          cdVideo: [null],
          textVideo: [''],
          texto: ['', Validators.required],
          link: [''],
          cdTipo: [1, Validators.required],
        })
      );
    }
  }

  provaEmUso() {
    this.emUso = true;
    // this.cadastroTrilha.disable();
    this.cadastroTrilha.controls.cdAvaliacaoTipo.disable();
    this.cadastroTrilha.controls.nmAvaliacao.disable();
    //this.cadastroTrilha.controls.cdEtapa.disable();
    this.cadastroTrilha.controls.cdAreaConhecimento.disable();
    this.cadastroTrilha.controls.cdSegmento.disable();
    this.cadastroTrilha.controls.cdSerie.disable();
    this.cadastroTrilha.controls.cdPeriodoLetivo.disable();

    this.cadastroTrilha.controls.dsRegras.enable();
  }

  async segmentoChange(cdSegmento) {
    this.series = [];
    this.cadastroTrilha.controls.cdSerie.setValue('');
    if (cdSegmento) {
      try {
        await this.api.api(HttpMethod.GET, `serie/segmento/${cdSegmento}`)
          .then(res => {
            this.series = res;
          });
        await this.api.api(HttpMethod.GET, `disciplina/areaconhecimento/${this.cadastroTrilha.get('cdAreaConhecimento').value}/segmento/${cdSegmento}/${this.auth.currentUserValue.cdEmpresa}`)
          .then((res) => {
            this.filterDisciplinas(res);
          })
      } finally {
        this.segmentoValueChangeComplete.emit();
      }
    }
  }

  areaConhecimentoChange(cod: number) {
    if (this.cadastroTrilha.get('cdSegmento').value != '') {
      this.api.api(HttpMethod.GET, `disciplina/areaconhecimento/${cod}/segmento/${this.cadastroTrilha.get('cdSegmento').value}/${this.auth.currentUserValue.cdEmpresa}`)
        .then((res) => {
          this.filterDisciplinas(res);
        });
    }
    else {
      this.api.api(
        HttpMethod.GET,
        `disciplina/areaconhecimento/${cod}/empresa/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.filterDisciplinas(res);
        })
    }
  }

  serieChange(cdSerie) {
    if (cdSerie == "" || this.cadastroTrilha.get('cdPeriodoLetivo').value == undefined) {
      this.turmas = [];
      this.cadastroTrilha.controls.cdTurma.setValue([]);
    } else {
      this.api.api(HttpMethod.GET, `turma/serie/${cdSerie}/${this.auth.currentUserValue.cdEmpresa}/${this.cadastroTrilha.get('cdPeriodoLetivo').value}`)
        .then(res => {
          this.turmas = res;
          this.serieValueChangeComplete.emit();
        });
    }
  }

  periodoLetivoChange(cdPeriodoLetivo) {
    if (cdPeriodoLetivo == "" || (this.cadastroTrilha.get('cdSerie').value == undefined || this.cadastroTrilha.get('cdSerie').value == "")) {
      this.turmas = [];
      this.cadastroTrilha.controls.cdTurma.setValue([]);
    }
    else {
      this.api.api(HttpMethod.GET, `turma/serie/${this.cadastroTrilha.get('cdSerie').value}/${this.auth.currentUserValue.cdEmpresa}/${cdPeriodoLetivo}`)
        .then(res => {
          this.turmas = res;
          this.cadastroTrilha.controls.cdTurma.setValue([]);
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
      }));
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
        }));
      else
        this.disciplinaAvaliacao.push(turmAval = this.fb.group({
          'cdDisciplina': [''],
        }));

      if (!this.cadastroTrilha.controls.notasPorDisciplina.value)
        turmAval.controls.valor.disable();

      let temp = turmAval.valueChanges.subscribe(() => {
        if (this.disciplinaAvaliacao.length <= 20) {
          turmAval.controls.cdDisciplina.setValidators(Validators.required);

          this.disciplinaAvaliacaoAdd();
          temp.unsubscribe();
          for (let control in turmAval.controls)
            turmAval.get(control).updateValueAndValidity({ onlySelf: true });

        }
      });

    } else
      Variantes.markFormGroupTouched(formGroup);
  }

  disciplinaAvaliacaoRemove(index: number) {
    this.disciplinaAvaliacao.removeAt(index);
  }

  getDisciplina(cdDisciplina: number) {
    return this.disciplinas.find(x => x.cdDisciplina == cdDisciplina).nmDisciplina;
  }

  ordemDisciplinaAdd() {
    let ordemDisciplina: iOrdemDisciplina;
    ordemDisciplina.cdDisciplina = this.cadastroTrilha.controls.cdDisciplina.value;
    ordemDisciplina.nmDisciplina = this.disciplinas.find(x => x.cdDisciplina == this.cadastroTrilha.controls.cdDisciplina.value).nmDisciplina;
    ordemDisciplina.cdOrdem = this.cadastroTrilha.controls.cdOrdem.value;

    this.ordemDisciplinas.push(ordemDisciplina);
  }

  //#endregion

  //#region Salvar e Enviar

  async Salvar(trilha) {
    if (this.cadastroTrilha.valid) {
      this.isSaving = true;

      //Remove a última disciplina
      trilha.Disciplinas.pop();

      await this.api.api(HttpMethod.POST, `trilha`, trilha)
        .then((res) => {


          if (this.vincular.isVinculando) {
            this.vincular.reload();
          }

          if (this.cdTrilha == 0) {
            this.router.navigate(['trilha/' + res]);
          }

        });

      if (this.cdTrilha != 0 && this.Modulos.valid) {
        this.api.api(HttpMethod.POST, `trilhamodulo/salvar/${this.cdTrilha}`, this.Modulos.getRawValue()).then(res => {
          if (res != null) {
            this.router.navigate(['trilha']);
            Swal.fire('Cadastro de Trilhas',
              'Salva com sucesso!',
              'success');
          }
        });
      }

      if (this.cdTrilha != 0 && !this.Modulos.valid) {
        const toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
          position: 'top-end',
          timer: 5000,
        });

        toast.fire('Validação!', 'Preencha ou corrija os campos em vermelho', 'warning');
      }

      if (!this.Modulos.valid) {
        // console.log(index + "modulos", (this.Modulos as FormArray).controls as FormGroup);

        Variantes.markFormArrayTouched(this.Modulos as FormArray);
      }

      this.isSaving = false;
    } else {
      Variantes.markFormGroupTouched(this.cadastroTrilha);

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
  //#region TIMELINE

  newModulo() {
    this.Modulos.push(
      this.fb.group({
        cdModulo: [0],
        nmModulo: [null, Validators.required],
        cdTrilha: [this.cdTrilha],
        Itens: this.fb.array([], Validators.minLength(1))
      })
    );
  }

  //#endregion
}

export interface iTab {
  tab: number;
  ds: string;
}

export interface iTurmaOutput {
  cdTurma: number;
}

export interface iDisciplinaOutput {
  cdDisciplina: number;
  nmDisciplina?: string;
}
