using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/trilha")]
    public partial class TrilhaController : ApiController
    {
        [HttpGet]
        public List<TrilhaModel> Get()
        {
            return new cTrilha().ListarDetalhado().Select(x=> new TrilhaModel(x)).ToList();
        }

        [HttpPost]
        public int Post([FromBody] TrilhaInputModel model)
        {
            //using(TransactionScope scope = new TransactionScope())
            //{
                int cd = new cTrilha().Salvar(model.cdTrilha,
                    model.nmTrilha,
                    model.cdPeriodoLetivo,
                    model.cdAreaConhecimento,
                    model.cdSegmento,
                    model.cdSerie,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    model.cdEmpresa);

                new cTrilhaTurma().Salvar(cd,
                    model.Turmas.Select(x => new cTrilhaTurma()
                    {
                        cdTrilha = cd,
                        cdTurma = x.cdTurma
                    }).ToList(),
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    model.cdEmpresa);

                new cTrilhaDisciplina().Salvar(cd,
                    model.Disciplinas.Select(x => new cTrilhaDisciplina()
                    {
                        cdTrilha = cd,
                        cdDisciplina = x.cdDisciplina
                    }).ToList(),
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    model.cdEmpresa
                    );
            //    scope.Complete();
            //}

            return cd;

        }

        [HttpPost]
        [Route("filtroTrilha")]
        public List<TrilhaModel> Filters([FromBody] FiltroTrilhaModel filtroTrilhaModel)
        {
            cTrilha trilha = new cTrilha();

            string where = " 1 = 1 ";

            if (filtroTrilhaModel.cdPeriodoLetivo > 0)
                where += " AND T.CDPERIODOLETIVO = " + filtroTrilhaModel.cdPeriodoLetivo;

            if (filtroTrilhaModel.cdSerie > 0)
                where += " AND T.CDSERIE = " + filtroTrilhaModel.cdSerie;

            if (filtroTrilhaModel.cdSegmento > 0)
                where += " AND T.CDSEGMENTO = " + filtroTrilhaModel.cdSegmento;

            if (filtroTrilhaModel.cdAreaConhecimento > 0)
                where += " AND T.CDAREACONHECIMENTO = " + filtroTrilhaModel.cdAreaConhecimento;

            if (filtroTrilhaModel.cdDisciplina > 0)
                where += " AND TD.CDDISCIPLINA = " + filtroTrilhaModel.cdDisciplina;

            switch (Convert.ToInt32(filtroTrilhaModel.cdPesquisarEm))
            {
                case 1:
                    filtroTrilhaModel.cdPesquisarEm = "T.CDTRILHA";
                    break;
                case 2:
                    filtroTrilhaModel.cdPesquisarEm = "T.NMTRILHA";
                    break;
            }

            if (!string.IsNullOrWhiteSpace(filtroTrilhaModel.cdPesquisarEm) && !string.IsNullOrWhiteSpace(filtroTrilhaModel.txtPesquisa))
                where += " AND " + filtroTrilhaModel.cdPesquisarEm + " LIKE '%" + filtroTrilhaModel.txtPesquisa + "%' ";

            List<cTrilha> trilhas = trilha.ListarDetalhado(where);

            return trilhas.Select(x=> new TrilhaModel(x)).ToList();
        }

        [HttpDelete]
        [Route("{cdTrilha}")]
        public void Inativar(int cdTrilha)
        {
            cTrilha trilha = new cTrilha().Abrir(cdTrilha);
            trilha.trocaidativo(cdTrilha, !trilha.idativo, HttpContext.Current.Request.UserHostAddress, -1);
        }

    }
}
