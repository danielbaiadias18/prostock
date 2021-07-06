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
    [RoutePrefix("api/habilidade")]
    //[ProfessorAutenticado]
    public class HabilidadeController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("subTopico/{cdSubTopico}/{cdEmpresa}")]
        public List<HabilidadeModel> Get(string cdSubTopico, int cdEmpresa)
        {
            List<HabilidadeModel> habilidades = new List<HabilidadeModel>();

            cHabilidade habilidade = new cHabilidade();
            foreach (var x in habilidade.ListarPorEmpresaSubtopico(cdEmpresa, cdSubTopico.Split(',').Select(x => Convert.ToInt32(x)).ToArray()))
            {
                habilidades.Add(new HabilidadeModel()
                {
                    cdHabilidade = x.cdHabilidade,
                    nmHabilidade = x.nmHabilidade,
                    cdEmpresa = x.cdempresa
                });
            };

            return habilidades;
        }

        [Route("{cdEmpresa}")]
        public List<HabilidadeModel> GetHab(int cdEmpresa)
        {
            List<HabilidadeModel> habilidades = new List<HabilidadeModel>();

            cHabilidade habilidade = new cHabilidade();
            foreach (var x in habilidade.Listar(" T.CDEMPRESA = " + cdEmpresa))
            {
                habilidades.Add(new HabilidadeModel()
                {
                    cdHabilidade = x.cdHabilidade,
                    nmHabilidade = x.sgHabilidade + " - " + x.nmHabilidade,
                    cdEmpresa = x.cdempresa
                });
            };

            return habilidades;
        }

        [Route("topico/{cdTopico}/{cdEmpresa}")]
        public List<HabilidadeModel> GetTopico(int cdTopico, int cdEmpresa)
        {
            List<HabilidadeModel> habilidades = new List<HabilidadeModel>();

            cHabilidade habilidade = new cHabilidade();
            foreach (var x in habilidade.ListarPorTopico(cdTopico, cdEmpresa))
            {
                habilidades.Add(new HabilidadeModel()
                {
                    cdHabilidade = x.cdHabilidade,
                    nmHabilidade = x.nmHabilidade,
                    cdEmpresa = x.cdempresa
                });
            };

            return habilidades;
        }
    }
}