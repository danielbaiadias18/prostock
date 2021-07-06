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
    [RoutePrefix("api/subTopico")]
    [ProfessorAutenticado]
    public class SubTopicoController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("topico/{cdTopico}")]
        public List<SubTopicoModel> Get(string cdTopico)
        {
            List<SubTopicoModel> subTopicos = new List<SubTopicoModel>();

            cSubTopico subTopico = new cSubTopico();
            foreach (var x in subTopico.ListarPorTopico(cdTopico.Split(',').Select(x => Convert.ToInt32(x)).ToArray()))
            {
                subTopicos.Add(new SubTopicoModel()
                {
                    cdSubTopico = x.cdSubTopico,
                    nmSubTopico= x.nmSubTopico,
                    cdEmpresa = x.cdempresa
                });
            };

            return subTopicos;
        }
    }
}