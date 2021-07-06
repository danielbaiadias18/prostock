import { iTopico } from './Topico';
import { iSubTopico } from './SubTopico';

export interface iVideo{
    cdVideo: number;
    cdSerie: number;
    cdOrigem: number;
    ano: string;
    cdAreaConhecimento: number;
    cdDisciplina: number;
    cdProfessorResponsavel: number;
    comentario: string;
    titulo: string;
    linkVideo: string;
    topicos: iTopico[];
    subTopicos: iSubTopico[];
    idAtivo: boolean;
    cdTopico: any;
    cdSubTopico: any;
}