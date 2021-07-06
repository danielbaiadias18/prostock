using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class DisciplinaModel
    {
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }
        public decimal valor { get; set; }
        public int cdEmpresa { get; set; }
    }
    public class DisciplinaTicketModel
    {
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }
    }
    public class DisciplinaValorModel : DisciplinaModel
    {
        public decimal valor { get; set; }
        public decimal media { get; set; }
    }
}