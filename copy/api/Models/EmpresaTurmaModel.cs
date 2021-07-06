using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class EmpresaTurmaModel
    {
        public List<EmpresaModel> Empresas { get; set; }
        public List<TurmaModel> Turmas { get; set; }
    }
}