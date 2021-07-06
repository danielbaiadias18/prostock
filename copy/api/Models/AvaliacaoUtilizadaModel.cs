using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoUtilizadaModel
    {
        public DateTime? dtAplicacao { get; set; }
        public int cdAvaliacao { get; set; }
        public string nmAvaliacao { get; set; }
        public int cdSerie { get; set; }
        public string nmSerie { get; set; }
        public int cdTurma { get; set; }
        public string nmTurma { get; set; }

    }
}