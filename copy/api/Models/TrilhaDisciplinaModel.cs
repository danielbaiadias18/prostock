using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TrilhaDisciplinaModel
    {
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }

        public TrilhaDisciplinaModel() { }
        public TrilhaDisciplinaModel(cTrilhaDisciplina trilhaDisciplina)
        {
            cdDisciplina = trilhaDisciplina.cdDisciplina;
            nmDisciplina = trilhaDisciplina.nmDisciplina;
        }

    }
}