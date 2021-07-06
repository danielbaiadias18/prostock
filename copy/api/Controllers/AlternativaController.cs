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
    [RoutePrefix("api/alternativa")]
    public class AlternativaController : ApiController
    {
        [HttpGet]
        [Route("questao/{cdQuestao}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<AlternativaModel> Get(int cdQuestao)
        {
            var lista = new cQuestaoAlternativa().getLista(cdQuestao);

            return lista.Select(x => new AlternativaModel()
            {
                cdQuestao = x.cdQuestao,
                cdQuestaoAlternativa = x.cdQuestaoAlternativa,
                correta = x.IscorretaNull() ? false : x.correta,
                dsAlternativa1 = x.IsdsAlternativa1Null() ? null : x.dsAlternativa1,
                dsAlternativa2 = x.IsdsAlternativa2Null() ? null : x.dsAlternativa2,
                imgAlternativa1 = x.IsimgAlternativa1Null() ? false : x.imgAlternativa1,
                imgAlternativa2 = x.IsimgAlternativa2Null() ? false : x.imgAlternativa2,
                justificativa = x.IsjustificativaNull() ? null : x.justificativa
            }).ToList();
        }
    }
}