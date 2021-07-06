import { iAluno } from './Aluno';

export interface iTurmaAvaliacao {
    cdTurma: string;
    dtInicio: Date;
    dtFim: Date;
    senhaAcesso: string;
    nmTurma: string;
    cdEmpresa: number;
}