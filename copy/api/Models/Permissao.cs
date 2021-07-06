using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class Permissao
    {
        public int idPrograma { get; set; }
        public string nmProgramaMan { get; set; }
        public bool idIncluir { get; set; }
        public bool idAlterar { get; set; }
        public bool idExcluir { get; set; }
        public bool idConsultar { get; set; }

        public Permissao(cProfessor.cProgramas programa)
        {
            foreach (var prop in typeof(Permissao).GetProperties())
                prop.SetValue(this, programa.GetType().GetProperty(prop.Name).GetValue(programa));
        }
    }
}