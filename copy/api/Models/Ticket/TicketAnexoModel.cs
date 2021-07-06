using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TicketAnexoModel
    {
        public int cdTicketAnexo { get; set; }
        public int cdTicketMensagem { get; set; }
        public string nmArquivo { get; set; }
        public string nmOriginal { get; set; }

        public TicketAnexoModel(){}
        public TicketAnexoModel(cTicketAnexo ticketAnexo)
        {
            foreach (var prop in new TicketAnexoModel().GetType().GetProperties())
                prop.SetValue(this, ticketAnexo.GetType().GetProperty(prop.Name).GetValue(ticketAnexo));
        }
    }
}