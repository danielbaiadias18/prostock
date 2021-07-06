using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class FiltroQuestao
    {
        public int cdUsuario { get; set; }
        public int cdProfessor { get; set; }
        public int cdQuestaoTipo { get; set; }
        public int cdSerie { get; set; }
        public int cdAreaConhecimento { get; set; }
        public int cdDisciplina { get; set; }
        public int cdTopico { get; set; }
        public int cdHabilidade { get; set; }
        public int cdSubTopico { get; set; }
        public int cdDificuldade { get; set; }
        public int cdPesquisarEm { get; set; }
        public int cdTipoPesquisa { get; set; }
        public string txtPesquisa { get; set; }

        // retorno da listagem de questões com pesquisa
    }
}