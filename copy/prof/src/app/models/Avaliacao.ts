import { iQuestao, iQuestaoAlternativa } from './Questao';
import { iTurma } from './Turma';
import { iSerie } from './Serie';
import { iDisciplina, iDisciplinaValor } from './Disciplina';

export interface iAvaliacao {
    cdAvaliacao: number;
    cdAvaliacaoTipo: number;
    cdAvaliacaoSubTipo: number;
    nmAvaliacaoSubTipo: string;
    cdPeriodoLetivo: string;
    nmAvaliacao: string;
    nmAvaliacaoTipo: string;
    cdStatus: number;
    valor: number;
    media: number;
    cdEtapa: number;
    cdAreaConhecimento: number;
    cdSegmento: number;
    nmEtapa: string;
    nmAreaConhecimento: string;
    nmSegmento: string;
    qtdeValidacoes: number;
    modoAplicacao: number;
    resultado: number;
    tempoAvaliacao: number;
    nuTentativas: number;
    exibirNota: boolean;
    exibirRespostasEsperadas: boolean;
    cdCriterio: number;
    dsCriterio: string;
    regras: string;
    cdClassificacaoInformacao: number;
    disponibilizada: boolean;
    randomizarQuestoes: boolean;
    randomizarAlternativas: boolean;
    exibirRespostasAposFechamento: boolean;
    dtExibicaoRespostas: Date;
    dtFimAvaliacao: Date;
    notasPorDisciplina: boolean;
    stTrilha: boolean;
    nuComputador: string;
    cdUsuario: number;
    cdEmpresa: number;
    disciplinas: string;
    AvaliacaoQuestaoModel: Array<iAvaliacaoQuestao>;
    verificaUso: boolean;
    idAtivo: boolean;
    nmStatus: string;
    Disciplinas: Array<iDisciplinaValor>;
}

export interface iAvaliacaoQuestao {
    cdAvaliacaoQuestao: number;
    ordem: number;
    ordemDisciplina?: number;
    valor?: number;
    QuestaoModel: iQuestao;
}

export interface iAvaliacaoTipo {
    cdAvaliacaoTipo: number;
    nmTipo: string;
}

export interface iAvaliacaoSubTipo {
    cdAvaliacaoSubTipo: number;
    nmSubTipo: string;
}

export interface iAvaliacaoCorrecao{
    Series: iSerie[];
    Disciplinas: iDisciplina[];
}
