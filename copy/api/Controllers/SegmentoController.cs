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
    [RoutePrefix("api/segmento")]
    [ProfessorAutenticado]
    public class SegmentoController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("empresa/{cdEmpresa}")]
        public List<SegmentoModel> Get(int cdEmpresa)
        {
            List<SegmentoModel> segmentos = new List<SegmentoModel>();

            cSegmento segmento = new cSegmento();
            foreach (var x in segmento.ListarPorEmpresa(cdEmpresa))
            {
                segmentos.Add(new SegmentoModel()
                {
                    cdSegmento = x.cdSegmento,
                    nmSegmento = x.nmSegmento,
                    cdEmpresa = x.cdempresa
                });
            };

            return segmentos;
        }
    }
}