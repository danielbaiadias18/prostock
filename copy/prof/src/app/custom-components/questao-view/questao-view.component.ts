import { Input, EventEmitter, Output, OnInit, Component, AfterViewInit } from '@angular/core';
import { iQuestao, iQuestaoAlternativa } from 'src/app/models/Questao';
import { Variantes } from 'src/app/models/Variantes';

declare var com: any;
const alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

@Component({
  selector: 'app-questao-view',
  templateUrl: './questao-view.component.html',
  styleUrls: ['./questao-view.component.scss']
})
export class QuestaoViewComponent implements OnInit, AfterViewInit {

  selected: Map<number, number> = new Map();

  get icons() {
    return Variantes.icons;
  }

  private _vlQuestao: number;

  @Input() nrQuestao: number = 0;
  @Input() set vlQuestao(val: number) { this._vlQuestao = val; this.vlQuestaoChange.emit(val) };
  get vlQuestao() { return this._vlQuestao; }
  @Output() vlQuestaoChange: EventEmitter<number> = new EventEmitter();
  @Input() tipo: string = "";
  @Input() alternativas: iQuestaoAlternativa[];
  @Input() editavel: boolean;

  @Input() questao: iQuestao;

  constructor() {
  }

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }

  getAlternativa(index: number) {
    if (index > alfabeto.length) return '' + (index - alfabeto.length);
    return alfabeto[index];
  }

  select(index: number) {
    if (this.selected.has(index)) return this.selected.get(index);

    return index;
  }
}
