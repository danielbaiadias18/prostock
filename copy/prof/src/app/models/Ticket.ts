export interface iTicket{
  cdTicket: number;
  cdTicketDepartamento: number;
  cdAluno: number;
  cdDisciplina: number;
  cdPessoaFinalizacao: number;
  status: number;
  dtHrInicio: Date;
  dtHrFim: Date;
  assunto: string;
  dsDepartamento: string;
  nmPessoa: string;
  dsStatus: string;
  nmDisciplina: string;
  dtUltMensagem: Date;
  selected: boolean;
}
