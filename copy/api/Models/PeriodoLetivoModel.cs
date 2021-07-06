using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class PeriodoLetivoModel
    {
        public int cdPeriodoLetivo { get; set; }
        public string nmPeriodoLetivo { get; set; }
        public DateTime dtInicio { get; set; }
        public DateTime dtFim { get; set; }

        public PeriodoLetivoModel() { }
        public PeriodoLetivoModel(cPeriodoLetivo periodoLetivo)
        {
            cdPeriodoLetivo = periodoLetivo.cdPeriodoLetivo;
            nmPeriodoLetivo = periodoLetivo.nmPeriodoLetivo;
            dtInicio = periodoLetivo.dtInicio;
            dtFim = periodoLetivo.dtFim;
        }
    }
}