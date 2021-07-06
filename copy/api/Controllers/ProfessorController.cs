using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/professor")]
    [ProfessorAutenticado]
    public class ProfessorController : ApiController
    {
        [Route("empresa/{cdEmpresa}")]
        public List<ProfessorModel> Get(int cdEmpresa)
        {
            List<ProfessorModel> professores = new List<ProfessorModel>();

            
            cDados.cProfessor prof = new cDados.cProfessor();
            foreach (var x in prof.Listar(cdEmpresa))
            {
                professores.Add(new ProfessorModel()
                {
                    cdProfessor = x.cdProfessor,
                    nmProfessor = x.nmPessoa,
                    cdEmpresa = x.cdempresa
                });
            };

            return professores;
        }

        [Route("empresa/{cdEmpresa}/serie/{cdSerie}")]
        public List<ProfessorModel> Get(int cdEmpresa, int cdSerie)
        {
            List<ProfessorModel> professores = new List<ProfessorModel>();

            cDados.cProfessor prof = new cDados.cProfessor();
            foreach (var x in prof.Listar(cdEmpresa, cdSerie))
            {
                professores.Add(new ProfessorModel()
                {
                    cdProfessor = x.cdProfessor,
                    nmProfessor = x.nmPessoa,
                    cdEmpresa = x.cdempresa
                });
            };

            return professores;
        }

        [Route("empresa/{cdEmpresa}/serie/{cdSerie}/disciplina/{cdDisciplina}")]
        public List<ProfessorModel> Get(int cdEmpresa, int cdSerie, int cdDisciplina)
        {
            List<ProfessorModel> professores = new List<ProfessorModel>();

            cDados.cProfessor prof = new cDados.cProfessor();
            foreach (var x in prof.Listar(cdEmpresa, cdSerie, cdDisciplina))
            {
                professores.Add(new ProfessorModel()
                {
                    cdProfessor = x.cdProfessor,
                    nmProfessor = x.nmPessoa,
                    cdEmpresa = x.cdempresa
                });
            };

            return professores;
        }
    }
}