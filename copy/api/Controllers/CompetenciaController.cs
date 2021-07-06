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
    [RoutePrefix("api/competencia")]
    [ProfessorAutenticado]
    public class CompetenciaController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("empresa/{cdEmpresa}")]
        public List<CompetenciaModel> Get(int cdEmpresa)
        {
            List<CompetenciaModel> competencias = new List<CompetenciaModel>();

            cCompetencia competencia= new cCompetencia();
            foreach (var x in competencia.ListarPorEmpresa(cdEmpresa))
            {
                competencias.Add(new CompetenciaModel()
                {
                    cdCompetencia = x.cdCompetencia,
                    nmCompetencia = x.nmCompetencia,
                    cdEmpresa = x.cdempresa
                });
            };

            return competencias;
        }
    }
}