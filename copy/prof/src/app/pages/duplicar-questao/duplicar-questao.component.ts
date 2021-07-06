import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { iQuestaoTipo, iDificuldade, iQuestao, iQuestaoAlternativa } from '../../models/Questao';
import { ApiService, HttpMethod } from '../../services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { iSerie } from '../../models/Serie';
import { iAreaConhecimento } from '../../models/AreaConhecimento';
import { iDisciplina } from '../../models/Disciplina';
import { iTopico } from '../../models/Topico';
import { iSubTopico } from '../../models/SubTopico';
import { iHabilidade } from '../../models/Habilidades';
import { iProfessor } from '../../models/Professor';
import { Variantes } from '../../models/Variantes';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';

import CKEditor from '../../models/CKEditor'

const Context = CKEditor.Context;
const Editor = CKEditor.Editor;
import ContextWatchdog from '@ckeditor/ckeditor5-watchdog/src/contextwatchdog';

import Swal from 'sweetalert2'
import { iCompetencia } from '../../models/Competencia';
import { iOrigem } from '../../models/Origem';

//#region Componente

@Component({
  selector: 'app-duplicar-questao',
  templateUrl: './duplicar-questao.component.html',
  styleUrls: ['./duplicar-questao.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(300, animateChild()))
      ]),
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ])
  ]
})

//#endregion
export class DuplicarQuestaoComponent implements OnInit {
  ready = true;
  public editor = CKEditor
  public watchdog: any;
  isSaving: boolean = false;

  teste: string = "";

  questao: iQuestao;

  titTela: string = 'Novo';
  tiposQuestao: iQuestaoTipo[] = [];
  cdQuestaoTipo: number;

  cadastroQuestao: FormGroup;
  get Alternativas(): FormArray {
    return this.cadastroQuestao.get('Alternativas') as FormArray;
  }

  competencias: iCompetencia[] = [];
  dificuldades: iDificuldade[] = [];
  professores: iProfessor[] = [];
  series: iSerie[] = [];
  areasConhecimento: iAreaConhecimento[] = [];
  disciplinas: iDisciplina[] = [];
  topicos: iTopico[] = [];
  subTopicos: iSubTopico[] = [];
  habilidades: iHabilidade[] = [];
  origens: iOrigem[] = [];

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder,
    private auth: AuthenticationService) {
    this.montarFormulario();
  }

  private CustomRequired<T>(array: () => T[], field: (T) => any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (array().findIndex(x => field(x) == control.value) === -1) {
        let temp = {};
        temp['required'] = true;
        return temp;
      }
    }
  }

  //#region Métodos

  //#region Cargas

  private montarFormulario(questao?: any | iQuestao): () => void {
    if (!questao) questao = {}

    this.cadastroQuestao = this.fb.group({
      'cdQuestao': [questao.cdQuestao ?? 0, Validators.required],
      'cdQuestaoTipo': [questao.cdQuestaoTipo ?? 1, Validators.required],
      'cdSerie': [questao.cdSerie ?? '', Validators.required],
      'cdDificuldade': [questao.cdSerie ?? 1, Validators.required],
      'cdCompetencia': [questao.cdCompetencia ?? 1, Validators.required],
      'cdAreaConhecimento': [questao.cdAreaConhecimento ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.areasConhecimento, (x) => x.cdAreaConhecimento)])],
      'cdDisciplina': [questao.cdDisciplina ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.disciplinas, (x) => x.cdDisciplina)])],
      'cdProfessorResponsavel': [questao.cdProfessorResponsavel ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.professores, (x) => x.cdProfessor)])],
      'cdTopico': [questao.cdTopico ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.topicos, (x) => x.cdTopico)])],
      'cdSubTopico': [questao.cdSubTopico ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.subTopicos, (x) => x.cdSubTopico)])],
      'cdHabilidade': [questao.cdHabilidade ?? '', Validators.compose([Validators.required, this.CustomRequired(() => this.habilidades, (x) => x.cdHabilidade)])],
      'dsComando': [questao.dsComando ?? '', Validators.required],
      'dsSuporte': [questao.dsSuporte ?? '', Validators.required],
      'cdOrigem': [questao.cdOrigem ?? 1, Validators.required],
      'ano': [questao.ano ?? '', Validators.required],
      'comentario': [questao.comentario ?? '', Validators.compose([Validators.required, Validators.maxLength(100)])],
      'stRedacao': [false],
      'cdEmpresa': [this.auth.currentUserValue.cdEmpresa]
    });

    let metodosCargas: () => void = () => {
      this.cadastroQuestao.controls.cdQuestaoTipo.valueChanges.subscribe(cdQuestaoTipo => this.setCdTipoQuestao(cdQuestaoTipo));

      this.cadastroQuestao.controls.cdSerie.valueChanges.subscribe(cdSerie => this.serieChange(cdSerie));

      this.cadastroQuestao.controls.cdAreaConhecimento.valueChanges.subscribe(cdAreaConhecimento => this.areaConhecimentoChange(cdAreaConhecimento));

      this.cadastroQuestao.controls.cdDisciplina.valueChanges.subscribe(cdDisciplina => this.disciplinaChange(cdDisciplina));

      this.cadastroQuestao.controls.cdTopico.valueChanges.subscribe(cdTopico => this.topicoChange(cdTopico));

      this.cadastroQuestao.controls.cdSubTopico.valueChanges.subscribe(cdSubTopico => this.subTopicoChange(cdSubTopico));
    }

    if (!questao.cdQuestao) metodosCargas();
    return metodosCargas;
  }

  async ngOnInit() {
    const contextConfig = {};

    this.watchdog = new ContextWatchdog(CKEditor);

    this.watchdog.create({}).then(() => {
      // Define a callback that will create an editor instance and return it.
      this.watchdog.setCreator((elementOrData, editorConfig) => {
        return this.editor
          .create(elementOrData, editorConfig)
          .then(editor => {
            // Do something with the new editor instance.
          });
      });
    })

    this.renderer.addClass(document.body, 'sidebar-collapse');

    await this.api.api(HttpMethod.GET, `serie/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.series = res;
      });

    await this.api.api(HttpMethod.GET, `competencia/empresa/${this.auth.currentUserValue.cdEmpresa}`)
      .then(res => {
        this.competencias = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/dificuldade')
      .then(res => {
        this.dificuldades = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/origem')
      .then(res => {
        this.origens = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/tipos/')
      .then(res => {
        this.tiposQuestao = res;

        if (this.tiposQuestao && this.tiposQuestao.length > 0) {
          this.tiposQuestao.push({ cdQuestaoTipo: 1, nmQuestaoTipo: "Redação", stRedacao: true });
          this.setTipoQuestao(this.tiposQuestao[0]);
        }
      });

    this.upDateProfessor();

    this.route.paramMap.subscribe(async param => {
      if (!Number.isNaN(Number(param.get('cdQuestao')))) {

        //#region Popular questão

        let cdQuestao: number;

        cdQuestao = Number(param.get('cdQuestao'));

        let questao: iQuestao;
        let alternativas: iQuestaoAlternativa[];
        await this.api.api(HttpMethod.GET, `questao/${cdQuestao}`)
          .then(res => {
            questao = res
          });

        let cargas = this.montarFormulario(questao);

        if (questao.ano != null)
          this.cadastroQuestao.controls.ano.setValue(questao.ano);

        if (questao.comentario != null)
          this.cadastroQuestao.controls.comentario.setValue(questao.comentario);

        if (questao.cdDificuldade == 0 || this.dificuldades.findIndex(x => x.cdDificuldade == questao.cdDificuldade) == -1)
          this.cadastroQuestao.controls.cdDificuldade.setValue('');
        else
          this.cadastroQuestao.controls.cdDificuldade.setValue(questao.cdDificuldade);

        if (questao.cdOrigem == 0 || this.origens.findIndex(x => x.cdOrigem == questao.cdOrigem) == -1)
          this.cadastroQuestao.controls.cdOrigem.setValue('');
        else
          this.cadastroQuestao.controls.cdOrigem.setValue(questao.cdOrigem);

        if (questao.cdCompetencia == 0 || this.competencias.findIndex(x => x.cdCompetencia == questao.cdCompetencia) == -1)
          this.cadastroQuestao.controls.cdCompetencia.setValue('');
        else
          this.cadastroQuestao.controls.cdOrigem.setValue(questao.cdOrigem);

        if (questao.cdSerie == 0 || this.series.findIndex(x => x.cdSerie == questao.cdSerie) == -1)
          this.cadastroQuestao.controls.cdSerie.setValue('');
        else {
          await this.serieChange(questao.cdSerie);
          this.cadastroQuestao.controls.cdSerie.setValue(questao.cdSerie);

          if (questao.cdAreaConhecimento == 0 || this.areasConhecimento.findIndex(x => x.cdAreaConhecimento == questao.cdAreaConhecimento) == -1)
            this.cadastroQuestao.controls.cdAreaConhecimento.setValue('');
          else {
            await this.areaConhecimentoChange(questao.cdAreaConhecimento);
            this.cadastroQuestao.controls.cdAreaConhecimento.setValue(questao.cdAreaConhecimento);

            if (questao.cdDisciplina == 0 || this.disciplinas.findIndex(x => x.cdDisciplina == questao.cdDisciplina) == -1)
              this.cadastroQuestao.controls.cdDisciplina.setValue('');
            else {
              await this.disciplinaChange(questao.cdDisciplina);
              this.cadastroQuestao.controls.cdDisciplina.setValue(questao.cdDisciplina);

              if (questao.cdTopico == 0 || this.topicos.findIndex(x => x.cdTopico == questao.cdTopico) == -1)
                this.cadastroQuestao.controls.cdTopico.setValue('');
              else {
                await this.topicoChange(questao.cdTopico);
                this.cadastroQuestao.controls.cdTopico.setValue(questao.cdTopico);

                if (questao.cdSubTopico == 0 || this.subTopicos.findIndex(x => x.cdSubTopico == questao.cdSubTopico) == -1)
                  this.cadastroQuestao.controls.cdSubTopico.setValue('');
                else {
                  await this.subTopicoChange(questao.cdSubTopico);
                  this.cadastroQuestao.controls.cdSubTopico.setValue(questao.cdSubTopico);

                  if (questao.cdHabilidade == 0 || this.habilidades.findIndex(x => x.cdHabilidade == questao.cdHabilidade) == -1)
                    this.cadastroQuestao.controls.cdHabilidade.setValue('');
                  else
                    this.cadastroQuestao.controls.cdHabilidade.setValue(questao.cdHabilidade);
                }
              }
            }
          }
        }

        await this.upDateProfessor();
        this.cadastroQuestao.controls.cdProfessorResponsavel.setValue(questao.cdProfessorResponsavel);

        if (questao.cdProfessorResponsavel == 0 || this.professores.findIndex(x => x.cdProfessor == questao.cdProfessorResponsavel) == -1)
          this.cadastroQuestao.controls.cdProfessorResponsavel.setValue('');

        cargas();

        this.setCdTipoQuestao(questao.cdQuestaoTipo);
        this.cadastroQuestao.controls.stRedacao.setValue(questao.stRedacao);

        //#region Alternativas

        if (questao.cdQuestaoTipo > 1) {
          if (questao.cdQuestaoTipo == 3) {
            this.Alternativas.setValidators(Validators.compose([this.validarCorreta()]));
            this.Alternativas.updateValueAndValidity();
          }
          await this.api.api(HttpMethod.GET, `alternativa/questao/${cdQuestao}`)
            .then(res => {
              alternativas = res;
            })

          if (alternativas && alternativas.length) {
            this.cadastroQuestao.removeControl('Alternativas');
            this.cadastroQuestao.addControl('Alternativas', new FormArray(
              [...alternativas.map(x => this.cdQuestaoTipo == 2 || this.cdQuestaoTipo == 3 ?
                this.fb.group({
                  'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
                  'cdQuestaoAlternativa': [x.cdQuestaoAlternativa],
                  'correta': [x.correta],
                  'dsAlternativa1': [x.dsAlternativa1, Validators.required],
                  'imgAlternativa1': [x.imgAlternativa1]
                })
                : this.fb.group({
                  'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
                  'cdQuestaoAlternativa': [x.cdQuestaoAlternativa],
                  'correta': [x.correta],
                  'dsAlternativa1': [x.dsAlternativa1, Validators.required],
                  'imgAlternativa1': [x.imgAlternativa1],
                  'dsAlternativa2': [x.dsAlternativa2, Validators.required],
                  'imgAlternativa2': [x.imgAlternativa2]
                })
              )]
            ));
          }

          if (this.cdQuestaoTipo == 2 || this.cdQuestaoTipo == 3) {
            this.Alternativas.push(this.fb.group({
              'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
              'cdQuestaoAlternativa': [0],
              'correta': [false],
              'dsAlternativa1': ['', !alternativas || alternativas.length == 0 ?
                Validators.required : Validators.compose([])],
              'imgAlternativa1': [false]
            }));
          }
          else {
            this.Alternativas.push(this.fb.group({
              'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
              'cdQuestaoAlternativa': [0],
              'correta': [false],
              'dsAlternativa1': ['', !alternativas || alternativas.length == 0 ?
                Validators.required : Validators.compose([])],
              'imgAlternativa1': [false],
              'dsAlternativa2': ['', !alternativas || alternativas.length == 0 ?
                Validators.required : Validators.compose([])],
              'imgAlternativa2': [false]
            }));
          }
        }

        questao.cdQuestao = 0;
        cdQuestao = 0;

        //#endregion
      } else if (('' + param.get("cdQuestao")).toLowerCase() != 'novo') {
        this.router.navigate(['/notfound']);
      }
    })
  }

  async serieChange(cdSerie) {
    this.areasConhecimento = [];
    this.cadastroQuestao.controls.cdAreaConhecimento.setValue('');

    this.upDateProfessor();

    if (cdSerie) {
      await this.api.api(HttpMethod.GET, `areaConhecimento/serie/${cdSerie}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.areasConhecimento = res;
        });
    }
  }

  async areaConhecimentoChange(cdAreaConhecimento) {

    this.disciplinas = [];
    this.cadastroQuestao.controls.cdDisciplina.setValue('');

    if (cdAreaConhecimento) {
      await this.api
        .api(HttpMethod.GET, `disciplina/areaconhecimento/${cdAreaConhecimento}/${this.cadastroQuestao.controls.cdSerie.value}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.disciplinas = res;
        });
    }
  }

  async disciplinaChange(cdDisciplina) {
    this.topicos = [];
    this.cadastroQuestao.controls.cdProfessorResponsavel.setValue('');
    this.cadastroQuestao.controls.cdTopico.setValue('');

    this.upDateProfessor();

    if (cdDisciplina) {
      await this.api
        .api(HttpMethod.GET,
          `topico/disciplina/${cdDisciplina}/${this.cadastroQuestao.controls.cdAreaConhecimento.value}/${this.cadastroQuestao.controls.cdSerie.value}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.topicos = res;
        })
    }
  }

  async topicoChange(cdTopico) {
    this.subTopicos = [];
    this.cadastroQuestao.controls.cdSubTopico.setValue('');

    if (cdTopico)
      await this.api
        .api(HttpMethod.GET,
          `subTopico/topico/${cdTopico}`)
        .then(res => {
          this.subTopicos = res;
        })
  }

  async subTopicoChange(cdSubTopico) {
    this.habilidades = [];
    this.cadastroQuestao.controls.cdHabilidade.setValue('');

    if (cdSubTopico)
      await this.api
        .api(HttpMethod.GET,
          `habilidade/subTopico/${cdSubTopico}/${this.auth.currentUserValue.cdEmpresa}`)
        .then(res => {
          this.habilidades = res;
        })
  }

  async upDateProfessor() {
    this.professores = [];
    this.cadastroQuestao.controls.cdProfessorResponsavel.setValue('');
    let url = `professor/empresa/${this.auth.currentUserValue.cdEmpresa}`;

    if (this.cadastroQuestao.controls.cdSerie.valid) {
      url += `/serie/${this.cadastroQuestao.controls.cdSerie.value}`;

      if (this.cadastroQuestao.controls.cdDisciplina.valid)
        url += `/disciplina/${this.cadastroQuestao.controls.cdDisciplina.value}`;
    }

    await this.api.api(HttpMethod.GET, url)
      .then(res => {
        this.professores = res;
      });
  }

  //#endregion

  //#region Alternativas

  setTipoQuestao(tipo: iQuestaoTipo) {
    this.cadastroQuestao.controls.cdQuestaoTipo.setValue(tipo.cdQuestaoTipo);
    this.cadastroQuestao.controls.stRedacao.setValue(tipo.stRedacao);
  }

  setCdTipoQuestao(cdQuestaoTipo: number) {
    if (cdQuestaoTipo != this.cdQuestaoTipo) {
      if (this.Alternativas) {
        this.Alternativas.setValidators(null);
        this.Alternativas.updateValueAndValidity();
      }

      switch (cdQuestaoTipo) {
        case 1:
        default:
          this.cadastroQuestao.controls.stRedacao.setValue(cdQuestaoTipo != 1)
          cdQuestaoTipo = 1;
          this.cadastroQuestao.removeControl('Alternativas');
          break;
        case 2: //V ou F
        case 3: //Múltipla escolha
          this.cadastroQuestao.controls.stRedacao.setValue(false);

          if (this.cdQuestaoTipo == 1 || this.cdQuestaoTipo == 4) {
            this.cadastroQuestao.removeControl('Alternativas');
            this.cadastroQuestao.addControl('Alternativas', new FormArray([]));

            let alternativa: FormGroup;

            this.Alternativas.push(alternativa = this.fb.group({
              'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
              'cdQuestaoAlternativa': [0],
              'correta': [false],
              'dsAlternativa1': ['', Validators.required],
              'imgAlternativa1': [false]
            }));
          }

          if (cdQuestaoTipo == 3) {
            this.Alternativas.setValidators(Validators.compose([this.validarCorreta()]));
            this.Alternativas.updateValueAndValidity();
          }
          break;
        case 4: //Associação
          this.cadastroQuestao.controls.stRedacao.setValue(false);

          this.cadastroQuestao.removeControl('Alternativas');

          this.cadastroQuestao.addControl('Alternativas', new FormArray([]));

          this.Alternativas.push(this.fb.group({
            'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
            'cdQuestaoAlternativa': [0],
            'correta': [false],
            'dsAlternativa1': ['', Validators.required],
            'imgAlternativa1': [false],
            'dsAlternativa2': ['', Validators.required],
            'imgAlternativa2': [false]
          }));
          break;
      }

      this.cdQuestaoTipo = cdQuestaoTipo;
    }
    if (cdQuestaoTipo == this.tiposQuestao.length + 1) {
      this.cadastroQuestao.controls.stRedacao.setValue(true);
    }
  }

  dsAlternativaChange(index: number) {
    let val: string;
    let alternativa: FormGroup;

    switch (this.cadastroQuestao.controls.cdQuestaoTipo.value) {
      case 2:
      case 3:
        val = '';
        alternativa = this.Alternativas.controls[index] as FormGroup;

        if (!val) val = alternativa.controls.dsAlternativa1.value;

        if (index == this.Alternativas.length - 1 && val) {
          alternativa.controls.dsAlternativa1.setValidators(Validators.required);
          this.cadastroQuestao.updateValueAndValidity();

          this.Alternativas.push(alternativa = this.fb.group({
            'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
            'cdQuestaoAlternativa': [0],
            'correta': [false],
            'dsAlternativa1': [''],
            'imgAlternativa1': [false]
          }));
        }
        else
          if (index == this.Alternativas.length - 2 && !val) {
            alternativa.controls.dsAlternativa1.clearValidators();
            alternativa.controls.dsAlternativa1.setErrors(null);

            this.Alternativas.removeAt(index + 1);
          }
        break;

      case 4:
        val = '';
        let val2: string = '';
        alternativa = this.Alternativas.controls[index] as FormGroup;

        if (!val) val = alternativa.controls.dsAlternativa1.value;
        if (!val2) val2 = alternativa.controls.dsAlternativa2.value;

        if (index == this.Alternativas.length - 1 && val && val2) {
          alternativa.controls.dsAlternativa1.setValidators(Validators.required);
          alternativa.controls.dsAlternativa2.setValidators(Validators.required);

          this.cadastroQuestao.updateValueAndValidity();

          this.Alternativas.push(alternativa = this.fb.group({
            'cdQuestao': [this.cadastroQuestao.controls.cdQuestao.value],
            'cdQuestaoAlternativa': [0],
            'correta': [false],
            'dsAlternativa1': [''],
            'imgAlternativa1': [false],
            'dsAlternativa2': [''],
            'imgAlternativa2': [false]
          }));
        }
        else
          if (index == this.Alternativas.length - 2 && (!val || !val2)) {
            if (index > 0 && !val && !val2) {
              alternativa.controls.dsAlternativa1.clearValidators();
              alternativa.controls.dsAlternativa1.setErrors(null);

              alternativa.controls.dsAlternativa2.clearValidators();
              alternativa.controls.dsAlternativa2.setErrors(null);
            }

            this.Alternativas.removeAt(index + 1);
          }
        break;
    }
  }

  changeEditorType(index: number) {
    let alternativa: FormGroup = this.Alternativas.controls[index] as FormGroup;

    if (alternativa.controls.imgAlternativa1.value) {
      alternativa.controls.dsAlternativa1.setValue('');
    }

    alternativa.controls.imgAlternativa1.setValue(!alternativa.controls.imgAlternativa1.value)


  }

  changeEditor2Type(index: number) {
    let alternativa: FormGroup = this.Alternativas.controls[index] as FormGroup;

    if (alternativa.controls.imgAlternativa2.value) {
      alternativa.controls.dsAlternativa2.setValue('');
    }

    alternativa.controls.imgAlternativa2.setValue(!alternativa.controls.imgAlternativa2.value)
  }

  changeQuestao(cdQuestaoTipo) {
    this.cadastroQuestao.controls.cdQuestaoTipo.setValue(cdQuestaoTipo)
    if (cdQuestaoTipo == this.tiposQuestao.length + 1)
      this.cadastroQuestao.controls.stRedacao.setValue(true)
    else
      this.cadastroQuestao.controls.stRedacao.setValue(false)

  }

  //#endregion

  Salvar(value: iQuestao) {
    this.cadastroQuestao.updateValueAndValidity();

    if (this.cadastroQuestao.valid) {
      if (value.Alternativas) {
        value.Alternativas.pop();
      }
      value.cdQuestao = 0;
      this.isSaving = true;
      this.api.api(HttpMethod.POST, `questao`, value)
        .then(async res => {
          if (!res)
            if (this.titTela == 'Novo') {
              if (!(await this.confirmacaoSalvar())) {
                this.router.navigate(['/questao']);
              } else {
                this.cadastroQuestao.controls.dsComando.reset();
                this.cadastroQuestao.controls.dsSuporte.reset();
                this.cadastroQuestao.controls.refSuporte.reset();
                this.cadastroQuestao.controls.refComando.reset();
                this.cadastroQuestao.removeControl('Alternativas');
                this.cadastroQuestao.addControl('Alternativas', new FormArray([]));
                this.cadastroQuestao.controls.cdQuestaoTipo.setValue(1);
              }
            } else {
              Swal.fire('Cadastro de Questão', 'Questão salva com sucesso', 'success');
              this.router.navigate(['/questao']);
            }
          else {
            Swal.fire('Cadastro de Questão', res, 'error');
          }
          this.isSaving = false;
        })
        .catch(err => {
         // console.log(err);
        })
    } else {
      Variantes.markFormGroupTouched(this.cadastroQuestao);
      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });
      toast.fire('Validação!', 'Preencha ou corrija os campos em vermelho', 'warning');
    }
  }

  async confirmacaoSalvar(): Promise<boolean> {
    let cdQuestaoNova = 0;
    await this.api.api(HttpMethod.GET,
      `questao/getLastId`)
      .then(res => {
        cdQuestaoNova = res;
      })
    return new Promise((ok) => {
      Swal.fire({
        title: 'Questão ' + cdQuestaoNova + ' salva com sucesso!',
        text: "Deseja cadastrar nova questão?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then(result => {
        if (result.value) { ok(true); } else { ok(false); }
      })
    });
  }
  //#endregion


  validarCorreta(): ValidatorFn {
    return (array: FormArray): ValidationErrors => {
      let erro: ValidationErrors = {};
      let formGroup: FormGroup;
      if (this.cdQuestaoTipo == 3) {
        for (formGroup of (array.controls as any)) {
          const alternativa = formGroup.controls.correta.value;
          // let alternativa = formGroup.controls.cd.value;

          if (alternativa)
            return;
        }
        erro['correta'] = true;
        array.setErrors(erro);

        return erro;
      }
    }
  }

}
