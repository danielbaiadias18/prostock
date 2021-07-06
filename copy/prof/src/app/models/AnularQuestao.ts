import { iQuestao } from './Questao';
import { iTurma } from './Turma';

export interface iAnularQuestoes {
    cdAvaliacao: number;
    cdEmpresa: number;
    cederPontos: boolean;
    questoes: iQuestao[];
    turmas: iTurma[];
}