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
    [RoutePrefix("api/avaliacaoCriterio")]
    [ProfessorAutenticado]
    public class AvaliacaoCriterioController : ApiController
    {
        public IEnumerable<AvaliacaoCriterioModel> Get()
        {
            var temp = new cAvaliacaoCriterio().Listar();
            return temp.Select(x => new AvaliacaoCriterioModel(x));
        }
    }
}