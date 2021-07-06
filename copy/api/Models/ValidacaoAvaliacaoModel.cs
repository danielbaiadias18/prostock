using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class ValidacaoAvaliacaoModel
    {
        public int cdAvaliacaoValidacao { get; set; }
        public string nmUsuario { get; set; }
        public int? cdAvaliacao { get; set; }
        public string nucomputador { get; set; }
        public DateTime dtIncReg { get; set; }
    }
}