using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoCorrecaoModel
    {
        #region Campos
        public List<SerieModel> Series { get; set; }
        public List<DisciplinaModel> Disciplinas { get; set; }
        public List<PeriodoLetivoModel> PeriodoLetivos { get; set; }
        public AvaliacaoCorrecaoModel(List<SerieModel> series, List<DisciplinaModel> disciplinas, List<PeriodoLetivoModel> periodoLetivos)
        {
            this.Series = series;
            this.Disciplinas = disciplinas;
            this.PeriodoLetivos = periodoLetivos;
        }

        #endregion
    }

}