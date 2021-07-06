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
    [RoutePrefix("api/areaConhecimento")]
    [ProfessorAutenticado]
    public class AreaConhecimentoController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("serie/{cdSerie}/{cdEmpresa}")]
        public List<AreaConhecimentoModel> Get(int cdSerie, int cdEmpresa)
        {
            List<AreaConhecimentoModel> areasConhecimento = new List<AreaConhecimentoModel>();

            cAreaConhecimento areaConhecimento = new cAreaConhecimento();
            foreach (var x in areaConhecimento.ListarPorSerie(cdSerie, cdEmpresa))
            {
                areasConhecimento.Add(new AreaConhecimentoModel()
                {
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdEmpresa = x.cdempresa
                });
            };

            return areasConhecimento;
        }

        [Route("empresa/{cdEmpresa}")]
        public List<AreaConhecimentoModel> Get(int cdEmpresa)
        {
            List<AreaConhecimentoModel> areasConhecimento = new List<AreaConhecimentoModel>();

            cAreaConhecimento areaConhecimento = new cAreaConhecimento();
            foreach (var x in areaConhecimento.ListarPorEmpresa(cdEmpresa))
            {
                areasConhecimento.Add(new AreaConhecimentoModel()
                {
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdEmpresa = x.cdempresa
                });
            };

            return areasConhecimento;
        }
    }
}