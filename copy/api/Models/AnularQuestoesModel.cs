using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AnularQuestoesModel
    {
        public List<QuestaoModel> questoes { get; set; }
        public List<TurmaModel> turmas { get; set; }
        public bool cederPontos { get; set; }
        public int cdEmpresa { get; set; }
        public int cdAvaliacao { get; set; }
    }
}