using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class DepartamentoModel
    {
        public int cdTicketDepartamento { get; set; }
        public string dsDepartamento { get; set; }
        public string texto { get; set; }
        public string nmUsuarioAlt { get; set; }
        public string nmUsuarioInc { get; set; }
        public DepartamentoModel()
        {
        }
        public DepartamentoModel(cTicketDepartamento ticketDepartamento)
        {
            foreach (var prop in new DepartamentoModel().GetType().GetProperties())
            {
                prop.SetValue(this, ticketDepartamento.GetType().GetProperty(prop.Name).GetValue(ticketDepartamento), null);
            }
        }
    }
}