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
    [RoutePrefix("api/turma")]
    [ProfessorAutenticado]
    public class TurmaController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        [Route("serie/{cdsSerie}/{cdEmpresa}")]
        public List<TurmaModel> Get(string cdsSerie, int cdEmpresa)
        {
            List<TurmaModel> turmas = new List<TurmaModel>();

            cTurma turma = new cTurma();
            foreach (var x in turma.ListarPorSerie(cdsSerie, cdEmpresa))
            {
                turmas.Add(new TurmaModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdEmpresa = x.cdempresa
                });
            };

            return turmas;
        }

        [HttpGet]
        [Route("serie/{cdsSerie}/{cdEmpresa}/{cdPeriodoLetivo}")]
        public List<TurmaModel> Get(string cdsSerie, int cdEmpresa, int cdPeriodoLetivo)
        {
            List<TurmaModel> turmas = new List<TurmaModel>();

            cTurma turma = new cTurma();
            foreach (var x in turma.ListarPorSeriePeriodoLetivo(cdsSerie, cdEmpresa, cdPeriodoLetivo))
            {
                turmas.Add(new TurmaModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdEmpresa = x.cdempresa
                });
            };

            return turmas;
        }

        [Route("avaliacaot/{cdAvaliacao}/empresa/{cdEmpresa}")]
        public List<TurmaModel> GetTurmasPorAvaliacao(int cdAvaliacao, int cdEmpresa)
        {
            List<TurmaModel> turmas = new List<TurmaModel>();
            List<int> cds = new List<int>();
            cTurma turma = new cTurma();
            foreach (var x in turma.ListarPorAvaliacao(cdAvaliacao, cdEmpresa))
            {
                turmas.Add(new TurmaModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdEmpresa = x.cdempresa
                });
            };

            return turmas;
        }

        [HttpGet]
        [Route("periodoLetivo/empresa/{cdEmpresa}")]
        public List<PeriodoLetivoModel> GetPeriodosLetivos(int cdEmpresa)
        {
            cPeriodoLetivo periodoLetivo = new cPeriodoLetivo();
            List<PeriodoLetivoModel> periodos = periodoLetivo.Listar(" T.IDATIVO = 1 AND T.CDEMPRESA = " + cdEmpresa)
                .Select(x=> new PeriodoLetivoModel(x)).ToList();
            return periodos;
        }

        [Route("avaliacao/{cdAvaliacao}/empresa/{cdEmpresa}")]
        public TurmasModel GetPorAvaliacao(int cdAvaliacao, int cdEmpresa)
        {
            List<TurmaModel> turmas = new List<TurmaModel>();
            List<int> cds = new List<int>();
            cTurma turma = new cTurma();
            cAvaliacao avaliacao = new cAvaliacao().Abrir(cdAvaliacao);

            foreach (var x in turma.ListarPorAvaliacao(cdAvaliacao, cdEmpresa))
            {
                turmas.Add(new TurmaModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdEmpresa = x.cdempresa
                });
            };

            List<AlunoModel> alunos = new List<AlunoModel>();
            foreach (var x in turmas)
            {
                cds.Add(x.cdTurma);
            }

            List<cAluno> alunos2 = new cTurma().ListarAlunosPorTurmaPeriodoLetivoAtual(cdAvaliacao, string.Join(",", cds), avaliacao.cdPeriodoLetivo);

            foreach (var x in alunos2)
            {
                alunos.Add(new AlunoModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdMatricula = x.cdMatricula,
                    matricula = x.cdMatricula.ToString(),
                    nome = x.nmPessoa
                });
            };

            TurmasModel turmasModel = new TurmasModel();
            turmasModel.turmas = turmas;
            turmasModel.alunos = alunos.OrderBy(x => x.nome).ToList();

            return turmasModel;
        }

        [Route("trilha/{cdTrilha}/empresa/{cdEmpresa}")]
        public List<TurmaModel> GetPorTrilha(int cdTrilha, int cdEmpresa)
        {
            List<TurmaModel> turmas = new List<TurmaModel>();
            List<int> cds = new List<int>();
            cTurma turma = new cTurma();
            cTrilha trilha = new cTrilha().Abrir(cdTrilha);

            foreach (var x in turma.ListarPorTrilha(cdTrilha, cdEmpresa))
            {
                turmas.Add(new TurmaModel()
                {
                    cdTurma = x.cdTurma,
                    nmTurma = TextoModel.Capitalizar(x.nmTurma),
                    cdEmpresa = x.cdempresa
                });
            };

            return turmas;
        }

        [HttpGet]
        [Route("avaliacao/{cdAvaliacao}")]
        public IEnumerable<AvaliacaoTurmaInputModel> getAvaliacao(int cdAvaliacao)
        {
            var temp = new cAvaliacaoTurma().getLista(cdAvaliacao);
            return temp.Select(x => new AvaliacaoTurmaInputModel(x));
        }

        //public List<AlunoModel> GetAlunosPorTurma(AlunoTurmaModel alunoTurma)
        //{
        //    List<AlunoModel> alunos = new List<AlunoModel>();

        //    List<cAluno> alunos2 = new cTurma().ListarAlunosPorTurma(alunoTurma.cdAvaliacao, string.Join(",", alunoTurma.cdsTurma));
        //    foreach (var x in alunos2)
        //    {
        //        alunos.Add(new AlunoModel()
        //        {
        //            cdTurma = x.cdTurma,
        //            nmTurma = TextoModel.Capitalizar(x.nmTurma),
        //            cdAluno = x.cdAluno,
        //            matricula = x.matricula,
        //            nome = x.nome
        //        });
        //    };

        //    return alunos;
        //}

        public class TurmasModel
        {
            public List<TurmaModel> turmas { get; set; }
           
            public List<AlunoModel> alunos { get; set; }
        }
    }
}