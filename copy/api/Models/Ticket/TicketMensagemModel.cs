using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TicketMensagemModel
    {
        public int cdTicketMensagem { get; set; }
        public int cdTicket { get; set; }
        public string origem { get; set; }
        public string texto { get; set; }
        public string nmPessoa { get; set; }
        public DateTime dtHrMsg { get; set; }
        public int? cdPessoa { get; set; }
        public int? cdUsuario { get; set; }
        public string nmUsuario { get; set; }
        public int cdMatricula { get; set; }

        public TicketMensagemModel(){}
        public TicketMensagemModel(cTicketMensagem ticketMensagem)
        {
            foreach (var prop in new TicketMensagemModel().GetType().GetProperties())
            {
                prop.SetValue(this, ticketMensagem.GetType().GetProperty(prop.Name).GetValue(ticketMensagem));
            }
        }
    }

    public class TicketMensagemAnexosModel : TicketMensagemModel
    {
        public List<TicketAnexoModel> Anexos { get; set; }
        public int cdTicketAnexo { get; set; }
        public string linkAnexo { get; set; }

        public TicketMensagemAnexosModel(){}
        public TicketMensagemAnexosModel(cTicketMensagem ticketMensagem) : base(ticketMensagem)
        {
        }
    }
}