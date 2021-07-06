using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    public partial class TrilhaController : ApiController
    {
        [Route("trilhasAluno")]
        [HttpGet]
        [Filters.Aluno]
        public List<TrilhaPorTurmaModel> GetForAlunos()
        {
            Perfil aluno = Thread.CurrentPrincipal.Identity as Perfil;

            List<TrilhaPorTurmaModel> trilhas = new cTrilha().ListarPorTurma(aluno.Aluno.cdTurma, aluno.Aluno.cdAluno).Select(x => new TrilhaPorTurmaModel(x)).ToList();
            int[] cds = trilhas.Select(x => x.cdTrilha).ToArray();
            List<cTrilhaEstatisticaTotal> estatisticas = new cTrilhaEstatisticaTotal().Listar($"CDTRILHA IN ({ String.Join(", ", cds) }) AND CDMATRICULA =" + aluno.Aluno.cdMatricula).ToList();

            foreach (var trilha in trilhas)
                trilha.porcentagem = estatisticas.FirstOrDefault(x => x.cdTrilha == trilha.cdTrilha)?.porcentagem ?? 0;

            return trilhas;
        }

        [Route("comecou/{cdTrilha}")]
        [HttpGet]
        [Filters.Aluno]
        public int Comecou(int cdTrilha)
        {
            Perfil aluno = Thread.CurrentPrincipal.Identity as Perfil;
            int cdTrilhaAluno = new cTrilhaAluno().Abrir(cdTrilha, aluno.Aluno.cdAluno)?.cdTrilhaAluno ?? 0;

            if (cdTrilhaAluno == 0)
                cdTrilhaAluno = new cTrilhaAluno().Salvar(0, cdTrilha, aluno.Aluno.cdAluno, HttpContext.Current.Request.UserHostAddress, -1, aluno.Aluno.cdempresa);

            return cdTrilhaAluno;
        }

        [HttpGet]
        [Route("trilhamodulosAluno/{cdTrilha}")]
        [Filters.Aluno]
        public TrilhaModel GetWithModulesAluno(int cdTrilha)
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            cTrilha trilha = new cTrilha().Abrir(cdTrilha);

            TrilhaTimeLineModel model = new TrilhaTimeLineModel();

            TrilhaModel.PopulateTrilhaModel(trilha, model);

            List<TrilhaModuloInputModel> modulos = new cTrilhaModulo().ListarMod(" T.CDTRILHA = " + cdTrilha + " AND T.IDATIVO = 1 AND VTE.CDMATRICULA = " + perfil.Aluno.cdMatricula)
                .Select(x => new TrilhaModuloInputModel(x)).ToList();

            List<TrilhaModuloItemModel> itens;

            foreach (TrilhaModuloInputModel modulo in modulos)
            {
                itens = new cTrilhaModuloItem().ListarPorModuloAluno(modulo.cdTrilhaModulo, perfil.Aluno.cdMatricula).Select(x => new TrilhaModuloItemModel(x)).ToList();
                modulo.Itens = itens;
            }

            model.Modulos = modulos;

            return model;
        }

        [HttpGet]
        [Route("visto/{cdItemModulo}")]
        [Filters.Aluno]
        public void ChangeStVisto(int cdItemModulo)
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            cTrilhaModuloItemVistoAluno visto = new cTrilhaModuloItemVistoAluno().Abrir(cdItemModulo, perfil.Aluno.cdMatricula);
            if (visto == null)
                new cTrilhaModuloItemVistoAluno().Salvar(
                    0,
                    perfil.Aluno.cdMatricula,
                    cdItemModulo,
                    true,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Aluno.cdempresa);

            // true estático pois um aluno não pode "desvisualizar" algo;
        }

    }
}
