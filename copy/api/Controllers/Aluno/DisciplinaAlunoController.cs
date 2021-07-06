using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers.Aluno
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/disciplinaaluno")]
    public class DisciplinaAlunoController : ApiController
    {
        [HttpGet]
        [Route("{cdAvaliacao}/aluno")]
        [Filters.Aluno]
        public List<DisciplinaValorModel> GetPorAvaliacao(int cdAvaliacao)
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<DisciplinaValorModel> disciplinas = new List<DisciplinaValorModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorAvaliacao(perfil.Aluno.cdempresa, cdAvaliacao))
            {
                disciplinas.Add(new DisciplinaValorModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa,
                    valor = x.valor,
                    media = x.media

                });
            };

            return disciplinas;
        }
    }
}