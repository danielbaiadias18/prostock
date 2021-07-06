using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoCriterioModel
    {
        public int cdCriterio { get; set; }
        public string dsCriterio { get; set; }

        public AvaliacaoCriterioModel() { }
        public AvaliacaoCriterioModel(cAvaliacaoCriterio avaliacaoCriterio)
        {
            cdCriterio = avaliacaoCriterio.cdCriterio;
            dsCriterio = TextoModel.Capitalizar(avaliacaoCriterio.dsCriterio);
        }
    }
}