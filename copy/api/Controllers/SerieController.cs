using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/serie")]
    [ProfessorAutenticado]
    public class SerieController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("empresa/{cdEmpresa}")]
        public List<SerieModel> Get(int cdEmpresa)
        {
            List<SerieModel> series = new List<SerieModel>();

            cSerie serie = new cSerie();
            foreach (var x in serie.ListarPorEmpresa(cdEmpresa))
            {
                series.Add(new SerieModel()
                {
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdEmpresa = x.cdempresa
                });
            };

            return series;
        }

        [HttpGet]
        [Route("segmento/{cdSegmento}")]
        public List<SerieModel> ListarPorSegmento(int cdSegmento)
        {
            List<SerieModel> series = new List<SerieModel>();

            cSerie serie = new cSerie();
            foreach (var x in serie.ListarPorSegmento(cdSegmento))
            {
                series.Add(new SerieModel()
                {
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdEmpresa = x.cdempresa
                });
            };

            return series;
        }

        [HttpGet]
        [Route("avaliacao/{cdAvaliacao}")]
        public List<SerieModel> ListarPorAvaliacao(int cdAvaliacao)
        {
            List<SerieModel> series = new List<SerieModel>();

            cSerie serie = new cSerie();
            foreach (var x in serie.ListarPorAvaliacao(cdAvaliacao))
            {
                series.Add(new SerieModel()
                {
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdEmpresa = x.cdempresa
                });
            };

            return series;
        }

        [HttpGet]
        [Route("trilha/{cdTrilha}")]
        public SerieModel ObterPorTrilha(int cdTrilha)
        {
            cSerie serie = new cSerie().GetPorTrilha(cdTrilha);
            SerieModel model = null;
            if (serie != null)
            {
                model = new SerieModel()
                {
                    cdSerie = serie.cdSerie,
                    nmSerie = serie.nmSerie,
                    cdEmpresa = serie.cdempresa
                };
            };

            return model;

        }
    }
}