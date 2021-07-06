using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TicketModel
    {
        public int cdTicket { get; set; }
        public int cdTicketDepartamento { get; set; }
        public int cdAluno { get; set; }
        public int? cdDisciplina { get; set; }
        public int? cdPessoaFinalizacao { get; set; }
        public int status { get; set; }
        public DateTime dtHrInicio { get; set; }
        public DateTime? dtHrFim { get; set; }
        public string assunto { get; set; }
        public string dsDepartamento { get; set; }
        public string nmPessoa { get; set; }
        public string dsStatus { get; set; }
        public string nmDisciplina { get; set; }
        public DateTime dtUltMensagem { get; set; }
        public TicketModel(){}

        public TicketModel(cTicket ticket)
        {
            foreach (var prop in new TicketModel().GetType().GetProperties())
                prop.SetValue(this, ticket.GetType().GetProperty(prop.Name).GetValue(ticket));
        }
    }

    public class PostTicketAlunoModel
    {
        [Required]
        public int cdTicketDepartamento { get; set; }
        public int? cdDisciplina { get; set; }
        [Required]
        public string assunto { get; set; }
        [Required]
        public string texto { get; set; }
        public List<Anexo> anexos { get; set; }
    }

    public class PostTicketMensagemModel
    {
        [Required]
        public int cdTicket { get; set; }
        public string texto { get; set; }
        public List<Anexo> anexos { get; set; }
    }

    public class Anexo
    {
        public string nome { get; set; }
        public string base64 { get; set; }
    }
}