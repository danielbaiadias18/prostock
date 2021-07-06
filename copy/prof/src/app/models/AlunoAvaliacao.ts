import { iAluno } from './Aluno';

export interface iAlunoAvaliacao {
    alunos: iAluno[];
    cdAvaliacao: number;
    cdEmpresa: number;

}

export interface iAlunoAvaliacao2 extends iAluno {
    cdAvaliacaoAluno: number;
    cdMatricula: number;
    nome: string;
    matricula: string;
    dtInicioAvaliacao: Date;
    notaObtida: number;
    cdTurma: number;
    nmTurma: string;
    notasPorDisciplina: number;
    dtFimAvaliacao: Date;
    corrigida: boolean;
}

export interface iAlunoAvaliacaoNotaDisciplina {

    cdAvaliacaoAlunoNotaDisciplina: number;
    cdAvaliacaoAluno: number;
    cdDisciplina: number;
    nmDisciplina: string;
    notaObtida: number;
}

export interface iAvaliacaoAlunoResposta {
    cdAvaliacaoAlunoResposta: number;
    cdAvaliacaoAluno: number;
    cdQuestao: number;
    cdAlternativa: number;
    cdEmpresa: number;
    cdAlternativaResposta: number;
    dsResposta: string;
    verdadeiro: boolean;
    acertou: boolean;
    pontuacao: number;
    feedback: string;
}
