using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class FiltroTrilhaModel
    {
        public int cdPeriodoLetivo { get; set; }
        public int cdSerie { get; set; }
        public int cdSegmento { get; set; }
        public int cdAreaConhecimento { get; set; }
        public int cdDisciplina { get; set; }

        public string cdPesquisarEm { get; set; }
        public string txtPesquisa { get; set; }
    }
}