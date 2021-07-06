export interface iDisciplina {
    cdDisciplina: number;
    nmDisciplina: string;
    cdEmpresa: number;
}

export interface iDisciplinaValor extends iDisciplina {
    media: number;
    valor: number;
}

export interface iOrdemDisciplina {
    cdDisciplina: number;
    nmDisciplina: string;
    cdOrdem: number;
}