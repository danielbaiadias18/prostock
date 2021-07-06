import { Injectable, EventEmitter } from '@angular/core';
import { iAvaliacao } from '../models/Avaliacao';
import { iQuestao } from '../models/Questao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VincularQuestaoService {
  private _isVinculando: boolean;
  get isVinculando() { return this._isVinculando; }

  avaliacaoEmitter: EventEmitter<iAvaliacao> = new EventEmitter()
  questaoAddEmitter: EventEmitter<iQuestao> = new EventEmitter();
  reloader: EventEmitter<void> = new EventEmitter();

  setAvaliacao(avaliacao: iAvaliacao) {
    this.avaliacaoEmitter.emit(avaliacao);
    this._isVinculando = true;
  }
  addQuestao(questao: iQuestao) {
    this.questaoAddEmitter.emit(questao);
  }

  registerCanIShowActionButton(verifier: (questao: iQuestao) => boolean) {
    this.CanIShowActionButton = (questao) => verifier(questao);
  }
  registerHasAdd(verifier: (questao: iQuestao) => boolean) {
    this.hasAdd = (questao) => verifier(questao);
  }
  CanIShowActionButton: (questao: iQuestao) => boolean;
  hasAdd: (questao: iQuestao) => boolean;

  cancelarVinculacao() {
    this._isVinculando = false;
    this.avaliacaoEmitter.emit();
  }

  reload() {
    this.reloader.emit();
  }

  constructor() { }
}
