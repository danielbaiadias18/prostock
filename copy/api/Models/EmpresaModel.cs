using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class EmpresaModel
    {
        public int cdEmpresa { get; set; }
        public string nmEmpresa { get; set; }
        public List<TurmaModel> Turmas { get; set; }
    }
}