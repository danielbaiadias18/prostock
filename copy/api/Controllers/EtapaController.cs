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
    [RoutePrefix("api/etapa")]
    [ProfessorAutenticado]
    public class EtapaController : ApiController
    {
        cUsuarios cusu = new cUsuarios();
        [Route("empresa/{cdEmpresa}")]
        public List<EtapaModel> Get(int cdEmpresa)
        {
            List<EtapaModel> etapas = new List<EtapaModel>();

            cEtapa etapa = new cEtapa();
            foreach (var x in etapa.ListarPorEmpresa(cdEmpresa))
            {
                etapas.Add(new EtapaModel()
                {
                    cdEtapa = x.cdEtapa,
                    nmEtapa = x.nmEtapa,
                    cdEmpresa = x.cdempresa
                });
            };

            return etapas;
        }
    }
}