import { iDisciplina } from './Disciplina';
import { iTurma } from './Turma';

export interface iTrilha {
    cdTrilha: number;
    nmTrilha: string;
    cdPeriodoLetivo: number;
    // cdEtapa: number;
    cdAreaConhecimento: number;
    cdSegmento: number;
    cdSerie: number;
    idAtivo: boolean;
    Disciplinas: Array<iDisciplina>;
    Turmas: Array<iTurma>;
}
