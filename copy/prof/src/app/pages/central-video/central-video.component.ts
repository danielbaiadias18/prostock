import { Component, OnInit, Renderer2 } from '@angular/core';
import { iVideo } from 'src/app/models/CentralVideo';
import { FormGroup, FormArray, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { iProfessor } from 'src/app/models/Professor';
import { iSerie } from 'src/app/models/Serie';
import { iAreaConhecimento } from 'src/app/models/AreaConhecimento';
import { iDisciplina } from 'src/app/models/Disciplina';
import { iTopico } from 'src/app/models/Topico';
import { iSubTopico } from 'src/app/models/SubTopico';
import { iOrigem } from 'src/app/models/Origem';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import Swal from 'sweetalert2';
import { Variantes } from 'src/app/models/Variantes';

@Component({
  selector: 'app-central-video',
  templateUrl: './central-video.component.html',
  styleUrls: ['./central-video.component.scss']
})
export class CentralVideoComponent implements OnInit {

  ready = true;
  public watchdog: any;
  isSaving: boolean = false;

  video: iVideo;

  titTela: string = 'Novo';

  cadastroVideo: FormGroup;

  professores: iProfessor[] = [];
  series: iSerie[] = [];
  areasConhecimento: iAreaConhecimento[] = [];
  disciplinas: iDisciplina[] = [];
  topicos: iTopico[] = [];
  subTopicos: iSubTopico[] = [];
  origens: iOrigem[] = [];
  link: string = "";

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder,
    private auth: AuthenticationService
  ) {
    this.montarFormulario();
  }


  private montarFormulario(video?: any | iVideo): () => void {
    if (!video) video = {};

    this.cadastroVideo = this.fb.group({
      cdVideo: [video.cdVideo ?? 0, Validators.required],
      cdSerie: [video.cdSerie ?? '', Validators.required],
      cdAreaConhecimento: [
        video.cdAreaConhecimento ?? '',
        Validators.compose([
          Validators.required,
          this.CustomRequired(
            () => this.areasConhecimento,
            (x) => x.cdAreaConhecimento
          ),
        ]),
      ],
      cdDisciplina: [
        video.cdDisciplina ?? '',
        Validators.compose([
          Validators.required,
          this.CustomRequired(
            () => this.disciplinas,
            (x) => x.cdDisciplina
          ),
        ]),
      ],
      cdProfessorResponsavel: [
        video.cdProfessorResponsavel ?? '',
        Validators.compose([
          Validators.required,
          this.CustomRequired(
            () => this.professores,
            (x) => x.cdProfessor
          ),
        ]),
      ],
      cdTopico: [
        video.cdTopico ?? '',
        Validators.compose([
          Validators.required,
          this.CustomRequired(
            () => this.topicos,
            (x) => x.cdTopico
          ),
        ]),
      ],
      cdSubTopico: [
        video.cdSubTopico ?? '',
        Validators.compose([
          Validators.required,
          this.CustomRequired(
            () => this.subTopicos,
            (x) => x.cdSubTopico
          ),
        ]),
      ],
      cdOrigem: [video.cdOrigem ?? 1, Validators.required],
      ano: [
        video.ano ?? '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      comentario: [
        video.comentario ?? '',
        Validators.compose([Validators.required, Validators.maxLength(300)]),
      ],
      cdEmpresa: [this.auth.currentUserValue.cdEmpresa],
      linkVideo: ['', Validators.compose([Validators.required])],
      titulo: ['', Validators.compose([Validators.required])]
    });

    let metodosCargas: () => void = () => {

      this.cadastroVideo.controls.cdSerie.valueChanges.subscribe((cdSerie) =>
        this.serieChange(cdSerie)
      );

      this.cadastroVideo.controls.cdAreaConhecimento.valueChanges.subscribe(
        (cdAreaConhecimento) => this.areaConhecimentoChange(cdAreaConhecimento)
      );

      this.cadastroVideo.controls.cdDisciplina.valueChanges.subscribe(
        (cdDisciplina) => this.disciplinaChange(cdDisciplina)
      );

      this.cadastroVideo.controls.cdTopico.valueChanges.subscribe(
        (cdTopico) => this.topicoChange(cdTopico)
      );


    };

    if (!video.cdVideo) metodosCargas();
    return metodosCargas;
  }


  async ngOnInit() {
   // console.log(this.auth.currentUserValue, 'this.auth.currentUserValue');
    this.renderer.addClass(document.body, 'sidebar-collapse');
    await this.api
      .api(
        HttpMethod.GET,
        `serie/empresa/${this.auth.currentUserValue.cdEmpresa}`
      )
      .then((res) => {
        this.series = res;
      });

    await this.api.api(HttpMethod.GET, 'questao/origem').then((res) => {
      this.origens = res;
    });

    this.upDateProfessor();

    this.route.paramMap.subscribe(async (param) => {
      if (!Number.isNaN(Number(param.get('cdVideo')))) {
        //#region Popular questão

        let cdVideo: number;

        this.titTela = 'Editar';
        cdVideo = Number(param.get('cdVideo'));

        let video: iVideo;

        await this.api
          .api(HttpMethod.GET, `video/${cdVideo}`)
          .then((res) => {
            video = res;
          });

        let cargas = this.montarFormulario(video);
        if (video.ano != null)
          this.cadastroVideo.controls.ano.setValue(video.ano);

        if (video.titulo != null)
        this.cadastroVideo.controls.titulo.setValue(video.titulo);

        if (video.linkVideo != null){
          this.cadastroVideo.controls.linkVideo.setValue(video.linkVideo);
          this.makeUrl();
        }


        if (
          video.cdOrigem == 0 ||
          this.origens.findIndex((x) => x.cdOrigem == video.cdOrigem) == -1
        )
          this.cadastroVideo.controls.cdOrigem.setValue('');
        else this.cadastroVideo.controls.cdOrigem.setValue(video.cdOrigem);

        this.cadastroVideo.controls.cdOrigem.setValue(video.cdOrigem);

        if (
          video.cdSerie == 0 ||
          this.series.findIndex((x) => x.cdSerie == video.cdSerie) == -1
        )
          this.cadastroVideo.controls.cdSerie.setValue('');
        else {
          await this.serieChange(video.cdSerie);
          this.cadastroVideo.controls.cdSerie.setValue(video.cdSerie);

          if (
            video.cdAreaConhecimento == 0 ||
            this.areasConhecimento.findIndex(
              (x) => x.cdAreaConhecimento == video.cdAreaConhecimento
            ) == -1
          )
            this.cadastroVideo.controls.cdAreaConhecimento.setValue('');
          else {
            await this.areaConhecimentoChange(video.cdAreaConhecimento);
            this.cadastroVideo.controls.cdAreaConhecimento.setValue(
              video.cdAreaConhecimento
            );

            if (
              video.cdDisciplina == 0 ||
              this.disciplinas.findIndex(
                (x) => x.cdDisciplina == video.cdDisciplina
              ) == -1
            )
              this.cadastroVideo.controls.cdDisciplina.setValue('');
            else {
              await this.disciplinaChange(video.cdDisciplina);
              this.cadastroVideo.controls.cdDisciplina.setValue(
                video.cdDisciplina
              );

              if (
                !video.cdTopico ||
                this.topicos.findIndex(
                  (x) => video.cdTopico.findIndex((y) => y == x.cdTopico) > -1
                ) == -1
              )
                this.cadastroVideo.controls.cdTopico.setValue('');
              else {
                await this.topicoChange(video.cdTopico);
                this.cadastroVideo.controls.cdTopico.setValue(
                  video.cdTopico
                );

                if (
                  !video.cdSubTopico ||
                  this.subTopicos.findIndex(
                    (x) =>
                      video.cdSubTopico.findIndex((y) => y == x.cdSubTopico) >
                      -1
                  ) == -1
                )
                  this.cadastroVideo.controls.cdSubTopico.setValue('');
                else {
                  this.cadastroVideo.controls.cdSubTopico.setValue(
                    video.cdSubTopico
                  );

                }
              }
            }
          }
        }

        await this.upDateProfessor();
        this.cadastroVideo.controls.cdProfessorResponsavel.setValue(
          video.cdProfessorResponsavel
        );

        if (
          video.cdProfessorResponsavel == 0 ||
          this.professores.findIndex(
            (x) => x.cdProfessor == video.cdProfessorResponsavel
          ) == -1
        )
          this.cadastroVideo.controls.cdProfessorResponsavel.setValue('');

        cargas();

        //#endregion
      }
    });
  }

  public makeUrl() {
    if (this.cadastroVideo.get('linkVideo').value != '') {
      this.link = this.cadastroVideo.get('linkVideo').value;
      this.link = this.link.replace('vimeo.com', 'player.vimeo.com/video');
    }

  }

  private CustomRequired<T>(array: () => T[], field: (T) => any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (
        array().findIndex(
          (x) =>
            field(x) == control.value ||
            (Array.isArray(control.value) &&
              control.value?.findIndex((y) => field(x) == y))
        ) === -1
      ) {
        let temp = {};
        temp['required'] = true;
        return temp;
      }
    };
  }

  async serieChange(cdSerie) {
    this.areasConhecimento = [];
    this.cadastroVideo.controls.cdAreaConhecimento.setValue('');

    if (cdSerie) {
      await this.api
        .api(
          HttpMethod.GET,
          `areaConhecimento/serie/${cdSerie}/${this.auth.currentUserValue.cdEmpresa}`
        )
        .then((res) => {
          this.areasConhecimento = res;
        });
    }
  }

  async areaConhecimentoChange(cdAreaConhecimento) {
    this.disciplinas = [];
    this.cadastroVideo.controls.cdDisciplina.setValue('');

    if (cdAreaConhecimento) {
      await this.api
        .api(
          HttpMethod.GET,
          `disciplina/areaconhecimento/${cdAreaConhecimento}/${this.cadastroVideo.controls.cdSerie.value}/${this.auth.currentUserValue.cdEmpresa}`
        )
        .then((res) => {
          this.disciplinas = res;
        });
    }
  }

  async disciplinaChange(cdDisciplina) {
    this.topicos = [];
    this.cadastroVideo.controls.cdTopico.setValue('');

    if (cdDisciplina) {
      await this.api
        .api(
          HttpMethod.GET,
          `topico/disciplina/${cdDisciplina}/${this.cadastroVideo.controls.cdAreaConhecimento.value}/${this.cadastroVideo.controls.cdSerie.value}/${this.auth.currentUserValue.cdEmpresa}`
        )
        .then((res) => {
          this.topicos = res;
        });
    }
  }

  async topicoChange(cdTopico) {
    this.subTopicos = [];
    this.cadastroVideo.controls.cdSubTopico.setValue('');

    if (cdTopico)
      await this.api
        .api(HttpMethod.GET, `subTopico/topico/${cdTopico}`)
        .then((res) => {
          this.subTopicos = res;
        });
  }

  async upDateProfessor() {

    let url = `professor/empresa/${this.auth.currentUserValue.cdEmpresa}`;

    await this.api.api(HttpMethod.GET, url).then((res) => {
      this.professores = res;
    });
  }

  Salvar(value: iVideo) {
    this.cadastroVideo.updateValueAndValidity();

    if (this.cadastroVideo.valid) {
      // this.cadastroVideo.controls.linkVideo.setValue(this.cadastroVideo.controls.linkVideo.value.replace('vimeo.com', 'player.vimeo.com/video'));

      this.isSaving = true;
      this.api
        .api(HttpMethod.POST, `video`, value)
        .then(async (res) => {
          if (!res){
            Swal.fire(
              'Cadastro de Vídeos',
              'Vídeo salvo com sucesso',
              'success'
            );
            this.router.navigate(['/video']);
          }
          else {
            Swal.fire('Cadastro de Vídeo', res, 'error');
          }
          this.isSaving = false;
        })
        .catch((err) => {
        //  console.log(err);
        });
    } else {
      Variantes.markFormGroupTouched(this.cadastroVideo);
      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });
      toast.fire(
        'Validação!',
        'Preencha ou corrija os campos em vermelho',
        'warning'
      );
    }
  }
}
