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
    [RoutePrefix("api/topico")]
    [ProfessorAutenticado]
    public class TopicoController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("disciplina/{cdDisciplina}/{cdAreaConhecimento}/{cdEmpresa}")]
        public List<TopicoModel> Get(int cdDisciplina, int cdAreaConhecimento, int cdEmpresa)
        {
            List<TopicoModel> topicos = new List<TopicoModel>();

            cTopico topico = new cTopico();
            foreach (var x in topico.ListarPorDisciplina(cdDisciplina, cdAreaConhecimento, cdEmpresa))
            {
                topicos.Add(new TopicoModel()
                {
                    cdTopico = x.cdTopico,
                    nmTopico = x.nmTopico,
                    cdEmpresa = x.cdempresa
                });
            };

            return topicos;
        }

        [Route("disciplina/{cdDisciplina}/{cdAreaConhecimento}/{cdSerie}/{cdEmpresa}")]
        public List<TopicoModel> Get(int cdDisciplina, int cdAreaConhecimento, int cdSerie, int cdEmpresa)
        {
            List<TopicoModel> topicos = new List<TopicoModel>();

            cTopico topico = new cTopico();
            foreach (var x in topico.ListarPorDisciplina(cdDisciplina, cdAreaConhecimento, cdSerie, cdEmpresa))
            {
                topicos.Add(new TopicoModel()
                {
                    cdTopico = x.cdTopico,
                    nmTopico = x.nmTopico,
                    cdEmpresa = x.cdempresa
                });
            };

            return topicos;
        }

        [Route("disciplina/{cdDisciplina}/{cdEmpresa}")]
        public List<TopicoModel> Get(int cdDisciplina, int cdEmpresa)
        {
            List<TopicoModel> topicos = new List<TopicoModel>();

            cTopico topico = new cTopico();
            foreach (var x in topico.ListarPorDisciplina(cdDisciplina, 0, cdEmpresa))
            {
                topicos.Add(new TopicoModel()
                {
                    cdTopico = x.cdTopico,
                    nmTopico = x.nmTopico,
                    cdEmpresa = x.cdempresa
                });
            };

            return topicos;
        }
        
    }
}