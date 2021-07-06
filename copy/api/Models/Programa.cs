using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class Programa
    {
        public int idPrograma { get; set; }
        public string dsPrograma { get; set; }
        public string nmProgramaCad { get; set; }
        public string nmProgramaMan { get; set; }
        public string dsHint { get; set; }
        public bool stMenu { get; set; }
        public bool stAtivo { get; set; }

        public Programa()
        {

        }

        public Programa(cProfessor.cProgramas programa)
        {
            foreach (var prop in typeof(Programa).GetProperties())
                prop.SetValue(this, programa.GetType().GetProperty(prop.Name).GetValue(programa));
        }
    }
}