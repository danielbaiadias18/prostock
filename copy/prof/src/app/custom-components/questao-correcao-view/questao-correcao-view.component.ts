import {
  Input,
  EventEmitter,
  Output,
  OnInit,
  Component,
  AfterViewInit,
} from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from 'src/app/models/Questao';
import { Variantes } from 'src/app/models/Variantes';
import { ApiService, HttpMethod } from '../../services/api.service';
import { iAvaliacaoAlunoResposta } from 'src/app/models/AlunoAvaliacao';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { iAvaliacaoQuestao } from 'src/app/models/Avaliacao';

declare var com: any;
const alfabeto = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

@Component({
  selector: 'app-questao-correcao-view',
  templateUrl: './questao-correcao-view.component.html',
  styleUrls: ['./questao-correcao-view.component.scss'],
})
export class QuestaoCorrecaoViewComponent implements OnInit, AfterViewInit {
  selected: Map<number, number> = new Map();

  get icons() {
    return Variantes.icons;
  }

  private _vlQuestao: number;

  @Input() nrQuestao: number = 0;
  @Input() set vlQuestao(val: number) {
    this._vlQuestao = val;
    this.vlQuestaoChange.emit(val);
  }
  get vlQuestao() {
    return this._vlQuestao;
  }
  @Output() vlQuestaoChange: EventEmitter<number> = new EventEmitter();
  @Input() tipo: string = '';
  @Input() alternativas: iQuestaoAlternativa[];
  @Input() editavel: boolean;

  @Input() questao: iQuestao;
  @Input() cdAvaliacaoAluno: number;

  avaliacaoAlunoResposta: iAvaliacaoAlunoResposta;
  @Input() set resposta(res: any) {
    if (this.avaliacaoAlunoResposta != res) {
      this.avaliacaoAlunoResposta = res;
      this.feedBack = res.feedback;
      this.nota = res.pontuacao;
      this.pontuado = res.acertou;
      this.dtFeedBack = res.dtIncReg;
      this.referencia = res.referencia;
      if (this.feedBack != null) this.feedbackPreenchido = true;
    }
  }
  notas: iAvaliacaoAlunoResposta[] = [];

  //#region FEEDBACK

  feedBack: string;
  cdQuestao: number;
  valor: number;
  nota: number;
  pontuado: boolean;
  referencia: string = '';
  dtFeedBack: Date;
  dsResposta: string;
  feedbackPreenchido: boolean = false;

  //#endregion

  constructor(private api: ApiService, private auth: AuthenticationService) {}

  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.cdQuestao = this.questao.cdQuestao;
    this.dsResposta = this.questao?.dsResposta;
    //this.carregarFeedBack();
  }

  pontuar() {
    const toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      position: 'top-end',
      timer: 5000,
    });
    if (this.nota == null) {
      toast.fire(
        'Correção!',
        'Você deve inserir uma nota para corrigir!',
        'warning'
      );
    } else {
      if (
        this.nota == 0 &&
        this.questao.cdQuestaoTipo == 1 &&
        !this.feedbackPreenchido
      ) {
        toast.fire(
          'Correção!',
          'É necessário salvar o feedback para notas 0 em discursivas!',
          'warning'
        );
        $('#b' + this.questao.cdQuestao).addClass('invalid');
      } else {
        this.pontuado = true;
        this.avaliacaoAlunoResposta.cdQuestao = this.cdQuestao;
        this.avaliacaoAlunoResposta.cdAvaliacaoAluno = this.cdAvaliacaoAluno;
        this.avaliacaoAlunoResposta.acertou = this.pontuado;
        this.avaliacaoAlunoResposta.pontuacao = this.nota;
        this.avaliacaoAlunoResposta.cdEmpresa =
          this.auth.currentUserValue.cdEmpresa;
        this.api
          .api(
            HttpMethod.POST,
            `avaliacao/salvarnota`,
            this.avaliacaoAlunoResposta
          )
          .then((res) => {
            if (!res) {
              toast.fire(
                'Correção!',
                'Questão pontuada com sucesso!',
                'success'
              );
              this.verificaAvaliacaoCorrigida();
            } else
              toast.fire(
                'Correção!',
                'Não foi possível pontuar a questão!',
                'warning'
              );
          });
      }
    }
  }

  changeNota() {
    this.pontuado = false;
    if (this.nota > this.vlQuestao) {
      this.nota = this.vlQuestao;
      const toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
      });

      toast.fire(
        'Validação!',
        'A nota não pode possuir mais valor que a questão!',
        'warning'
      );
    }
  }

  salvarFeedback() {
    const toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      position: 'top-end',
      timer: 5000,
    });
    if (this.nota == null) {
      toast.fire(
        'Correção!',
        'Você deve inserir uma nota para corrigir!',
        'warning'
      );
    } else {
      //console.log(this.feedBack);
      if (
        this.nota == 0 &&
        this.questao.cdQuestaoTipo == 1 &&
        this.feedBack == null
      ) {
        toast.fire(
          'Correção!',
          'É necessário inserir um feedback para discursivas zeradas !',
          'warning'
        );
        $('#b' + this.questao.cdQuestao).addClass('invalid');
      } else {
        this.avaliacaoAlunoResposta.cdQuestao = this.cdQuestao;
        this.avaliacaoAlunoResposta.cdAvaliacaoAluno = this.cdAvaliacaoAluno;
        this.avaliacaoAlunoResposta.acertou = this.pontuado;
        this.avaliacaoAlunoResposta.feedback = this.feedBack;
        this.avaliacaoAlunoResposta.cdEmpresa = this.auth.currentUserValue.cdEmpresa;
        this.feedbackPreenchido = true;

        this.api
          .api(
            HttpMethod.POST,
            `avaliacao/salvarfeedback`,
            this.avaliacaoAlunoResposta
          )
          .then((res) => {
            if (!res) {
              toast.fire('Correção!', 'Feedback salvo com sucesso!', 'success');
              $('#b' + this.questao.cdQuestao).removeClass('invalid');
            } else
              toast.fire(
                'Correção!',
                'Não foi possível salvar o feedback a questão!',
                'warning'
              );
          });
        this.salvarReferencia();
      }
    }
  }

  salvarReferencia() {
    this.api
      .api(
        HttpMethod.PUT,
        `questao/salvarreferencia`,{cdQuestao: this.cdQuestao, referencia: this.referencia}
      )
      .then((res) => {
        if (!res)
          console.log('Correção!', 'Referencia salva com sucesso!', 'success');
        else
          console.log(
            'Correção!',
            'Não foi possível salvar a referencia!',
            'warning'
          );
      });
  }

  carregarFeedBack() {
    this.api
      .api(
        HttpMethod.GET,
        `avaliacao/carregarfeedback/avaliacaoaluno/${this.cdAvaliacaoAluno}/questao/${this.cdQuestao}`
      )
      .then((res) => {
        this.avaliacaoAlunoResposta = res;
        this.feedBack = res.feedback;
        this.nota = res.pontuacao;
        this.pontuado = res.acertou;
        this.dtFeedBack = res.dtIncReg;
        this.referencia = res.referencia;
        if (this.feedBack != null) this.feedbackPreenchido = true;
      });
  }

  getAlternativa(index: number) {
    if (index > alfabeto.length) return '' + (index - alfabeto.length);
    return alfabeto[index];
  }

  verificaAvaliacaoCorrigida() {
    this.api
      .api(
        HttpMethod.GET,
        `avaliacao/avaliacaoalunoresposta/avaliacaoaluno/${this.cdAvaliacaoAluno}`
      )
      .then((res) => {
        this.notas = res;
        var i;
        for (i = 0; i < this.notas.length; i++) {
          if (this.notas[i].pontuacao != null) {
          } else {
            return false;
          }
        }
        const toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
          position: 'top-end',
          timer: 5000,
        });
        this.api
          .api(
            HttpMethod.GET,
            `avaliacao/corrigiravaliacao/avaliacaoaluno/${this.cdAvaliacaoAluno}/empresa/${this.auth.currentUserValue.cdEmpresa}`
          )
          .then((res) => {
            toast.fire(
              'Correção!',
              'Questão pontuada com sucesso, sua avaliação foi corrigida!',
              'success'
            );
          });
      });
  }
}
