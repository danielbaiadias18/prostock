using api.Filters;
using api.Models;
using ARWEB.DataBase;
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
    [RoutePrefix("api/disciplina")]
    [ProfessorAutenticado]
    public class DisciplinaController : ApiController
    {
        [HttpGet]
        [Route("serie/{cdSerie}/empresa/{cdEmpresa}")]
        public List<DisciplinaModel> Get(int cdSerie, int cdEmpresa)
        {
            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorSerie(cdSerie, cdEmpresa))
            {
                disciplinas.Add(new DisciplinaModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa
                });
            };

            return disciplinas;
        }

        [HttpGet]
        [Route("areaconhecimento/{cdAreaConhecimento}/empresa/{cdEmpresa}")]
        public List<DisciplinaModel> GetDisciplinasPorAreaConhecimento(int cdAreaConhecimento, int cdEmpresa)
        {
            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarSoPorAreaConhecimento(cdAreaConhecimento, cdEmpresa))
            {
                disciplinas.Add(new DisciplinaModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa
                });
            };

            return disciplinas;
        }

        [HttpGet]
        [Route("empresa/{cdEmpresa}")]
        public List<DisciplinaModel> Get(int cdEmpresa)
        {
            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorEmpresa(cdEmpresa))
            {
                disciplinas.Add(new DisciplinaModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa
                });
            };

            return disciplinas;
        }

        [HttpGet]
        [Route("empresa/{cdEmpresa}/avaliacao/{cdAvaliacao}")]
        public List<DisciplinaValorModel> GetPorAvaliacao(int cdEmpresa, int cdAvaliacao)
        {
            List<DisciplinaValorModel> disciplinas = new List<DisciplinaValorModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorAvaliacao(cdEmpresa, cdAvaliacao))
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

        [Route("areaconhecimento/{cdAreaConhecimento}/{cdSerie}/{cdEmpresa}")]
        public List<DisciplinaModel> Get(int cdAreaConhecimento, int cdSerie, int cdEmpresa)
        {
            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorAreaConhecimento(cdSerie, cdAreaConhecimento, cdEmpresa))
            {
                disciplinas.Add(new DisciplinaModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa
                });
            };

            return disciplinas;
        }

        [Route("areaconhecimento/{cdAreaConhecimento}/segmento/{cdSegmento}/{cdEmpresa}")]
        public List<DisciplinaModel> GetByAreaConhecimentoSegmento(int cdAreaConhecimento, int cdSegmento, int cdEmpresa)
        {
            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorAreaConhecimentoSegmento(cdSegmento, cdAreaConhecimento, cdEmpresa))
            {
                disciplinas.Add(new DisciplinaModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdEmpresa = x.cdempresa
                });
            };

            return disciplinas;
        }

        [HttpGet]
        [Route("valor/avaliacao/{cdAvaliacao}")]
        public IEnumerable<DisciplinaValorModel> valor(int cdAvaliacao)
        {
            List<DisciplinaValorModel> disciplinas = new List<DisciplinaValorModel>();
            var objDb = new cComum().ExecuteReader(@"select Res.cdDisciplina, d.nmDisciplina, 
                                                         Res.valor, cast(a.media / a.valor * Res.valor as decimal(18,2)) as media
                                                          from 
                                                           (select ad.cdDisciplina, sum(isnull(aq.valor, 0)) as valor	
                                                            from tbneg_avaliacaoDisciplina ad
                                                           left join tbneg_avaliacaoQuestao aq on aq.cdAvaliacao = ad.cdAvaliacao
                                                           inner join tbneg_questao q on (q.cdQuestao = aq.cdQuestao or aq.cdQuestao is null) and ad.cdDisciplina = q.cdDisciplina
                                                           where ad.cdAvaliacao = " + cdAvaliacao + @"
                                                           group by ad.cdDisciplina) as Res
                                                        inner join tbneg_disciplina d on d.cdDisciplina = res.cdDisciplina
                                                        inner join tbneg_avaliacao a on a.cdAvaliacao = " + cdAvaliacao);

            while (objDb.Read())
            {
                int i = -1;
                var item = new DisciplinaValorModel();

                if (!objDb.IsDBNull(++i)) item.cdDisciplina = objDb.GetInt32(i);
                if (!objDb.IsDBNull(++i)) item.nmDisciplina = objDb.GetString(i);
                if (!objDb.IsDBNull(++i)) item.valor = objDb.GetDecimal(i);
                if (!objDb.IsDBNull(++i)) item.media = objDb.GetDecimal(i);

                disciplinas.Add(item);
            }

            return disciplinas;
        }


        //Pendente MODEL E CLASSE  AVALIACAODISCIPLINA

        [HttpGet]
        [Route("avaliacao/{cdAvaliacao}")]
        public IEnumerable<AvaliacaoDisciplinaInputModel> getAvaliacao(int cdAvaliacao)
        {
            var temp = new cAvaliacaoDisciplina().getLista(cdAvaliacao);
            return temp.Select(x => new AvaliacaoDisciplinaInputModel(x));
        }

        [HttpGet]
        [Route("trilha/{cdTrilha}")]
        public IEnumerable<TrilhaDisciplinaModel> getTrilha(int cdTrilha)
        {
            var temp = new cTrilhaDisciplina().getTrilha(cdTrilha);
            return temp.Select(x => new TrilhaDisciplinaModel(x));
        }
        
    }
}