using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class FiltroAvaliacao
    {
        public int cdAvaliacaoTipo { get; set; }
        public int cdAvaliacaoSubTipo { get; set; }
        public int cdEtapa { get; set; }
        public int cdSegmento { get; set; }
        public int cdAreaConhecimento { get; set; }

        public string cdPesquisarEm { get; set; }
        public int cdTipoPesquisa { get; set; }
        public string txtPesquisa { get; set; }

    }
}