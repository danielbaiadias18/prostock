export interface iQuestao {
  cdAreaConhecimento: number;
  cdTopico: any;
  cdDificuldade: number;
  cdDisciplina: number;
  cdEmpresa: number;
  cdHabilidade: number;
  cdCompetencia: number;
  cdProfessorResponsavel: number;
  cdQuestao: number;
  cdQuestaoTipo: number;
  cdSerie: number;
  cdSubTopico: any;
  cdUsuarioInc: number;
  dsComando: string;
  dsSuporte: string;
  refComando: string;
  refSuporte: string;
  idAtivo: boolean;
  imgComando: boolean;
  imgSuporte: boolean;
  nmAreaConhecimento: string;
  nmDificuldade: string;
  nmDisciplina: string;
  nmSerie: string;
  nmQuestaoTipo: string;
  nuComputador: string;
  stRedacao: boolean;
  Alternativas?: Array<iQuestaoAlternativa>;
  pontuacao: number;
  feedback: string;
  dsResposta: string;
  comentario: string;
  ano: string;
  cdOrigem: number;
}

export interface iQuestaoAlternativa {
  cdQuestao: number;
  cdQuestaoAlternativa: number;
  correta: boolean;
  dsAlternativa1: string;
  dsAlternativa2: string;
  imgAlternativa1: boolean;
  imgAlternativa2: boolean;
  verdadeiro: boolean;
  acertou: boolean;
  indice1: string;
  indice2: string;
  indiceCorreta: string;
  stJust: boolean;
  justificativa: string;
}

export interface iQuestaoTipo {
  cdQuestaoTipo: number;
  nmQuestaoTipo: string;
  stRedacao: boolean;
}

export interface iDificuldade {
  cdDificuldade: number;
  nmDificuldade: string;
}
