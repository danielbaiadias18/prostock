using api.Filters;
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

namespace api.Controllers.Professor
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/trilhamodulo")]
    public class TrilhaModuloController : ApiController
    {
        [HttpGet]
        public List<TrilhaModuloInputModel> Get()
        {
            List<TrilhaModuloInputModel> trilhaModulos = new List<TrilhaModuloInputModel>();

            foreach (var item in new cTrilhaModulo().Listar().Select(x => new TrilhaModuloModel(x)))
            {
                trilhaModulos.Add(new TrilhaModuloInputModel
                {

                    cdTrilhaModulo = item.cdTrilhaModulo,
                    nmModulo = item.nmModulo,
                    cdTrilha = item.cdTrilha,
                    ordem = item.ordem,
                    Itens = new cTrilhaModuloItem().Listar(" t.cdModulo = " + item.cdTrilhaModulo).Select(x => new TrilhaModuloItemModel(x)).ToList()

                });
            }

            return trilhaModulos;
        }


        [HttpGet]
        [Route("trilha/{cdTrilha}")]
        public List<TrilhaModuloInputModel> Get(int cdTrilha)
        {
            List<TrilhaModuloInputModel> trilhaModulos = new List<TrilhaModuloInputModel>();

            foreach (var item in new cTrilhaModulo().Listar(" t.idativo = 1 and t.cdTrilha = " + cdTrilha).Select(x => new TrilhaModuloModel(x)))
            {
                trilhaModulos.Add(new TrilhaModuloInputModel
                {

                    cdTrilhaModulo = item.cdTrilhaModulo,
                    nmModulo = item.nmModulo,
                    cdTrilha = item.cdTrilha,
                    ordem = item.ordem,
                    Itens = new cTrilhaModuloItem().Listar(" t.idativo = 1 and t.cdModulo = " + item.cdTrilhaModulo).Select(x => new TrilhaModuloItemModel(x)).ToList()

                });
            }

            return trilhaModulos;
        }

        [HttpGet]
        [Route("tipoItens")]
        public List<TrilhaModuloItemTipoModel> GetModuloItemTipos()
        {
            return new cTrilhaModuloItemTipo().Listar().Select(x => new TrilhaModuloItemTipoModel(x)).ToList();
        }

        [HttpPost]
        [Route("salvar/{cdTrilha}")]
        [Filters.Professor(Filters.Programa.trilha, Filters.TipoAcesso.Incluir)]
        public List<TrilhaModuloInputModel> SalvarModulos([FromBody] List<TrilhaModuloInputModel> trilhasModulosModel, int cdTrilha)
        {
            if (ModelState.IsValid)
            {

                Perfil.TryGetPerfil(out Perfil perfil);
                //using (TransactionScope scope = new TransactionScope())
                //{
                int counterModulo = 1;//variavel para definir a ordem do módulo
                foreach (var x in trilhasModulosModel)
                {
                    int cdTrilhaModulo = new cTrilhaModulo().Salvar(
                        x.cdTrilhaModulo,
                        x.nmModulo,
                        cdTrilha,
                        x.ordem = counterModulo,
                        HttpContext.Current.Request.UserHostAddress,
                        perfil.Professor.cdProfessor,
                        perfil.Professor.cdempresa);

                    x.cdTrilhaModulo = cdTrilhaModulo;
                    counterModulo++;
                    int counterModuloItem = 1;//variavel para definir a ordem do módulo do item
                    foreach (var y in x.Itens)
                    {
                        int cdTrilhaModuloItem = new cTrilhaModuloItem().Salvar(
                            y.cdItemModulo,
                            y.nmItemModulo,
                            cdTrilhaModulo,
                            y.cdAvaliacao,
                            y.cdVideo,
                            y.textVideo,
                            y.texto,
                            y.ordem = counterModuloItem,
                            y.cdTipo,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdProfessor,
                            perfil.Professor.cdempresa);

                        y.cdItemModulo = cdTrilhaModuloItem;
                        counterModuloItem++;
                    }

                    if (x.Itens.Count > 0)
                        new cTrilhaModuloItem().executaSQL(@" delete tmi from tbneg_trilhamoduloitem tmi 
                                                            inner join tbneg_trilhamodulo tm on tm.cdmodulo = tmi.cdmodulo
                                                            where tmi.cdItemModulo not in (" + string.Join(",", x.Itens.Select(j => j.cdItemModulo)) + ") and tmi.cdModulo = " + x.cdTrilhaModulo + " and tm.cdTrilha = " + cdTrilha);
                }

                if (trilhasModulosModel.Count > 0)
                {
                    new cTrilhaModuloItemVistoAluno().executaSQL(@" delete VA from tbNEG_TrilhaModuloItemVistoAluno VA 
                                                                    inner join tbneg_trilhamoduloitem MI on MI.cditemmodulo = VA.cditemmodulo
                                                                    inner join tbneg_trilhamodulo TM ON TM.cdmodulo = MI.cdmodulo
                                                                    where tm.cdModulo not in (" + string.Join(",", trilhasModulosModel.Select(x => x.cdTrilhaModulo)) + ") and tm.cdTrilha = " + cdTrilha);

                    new cTrilhaModuloItem().executaSQL(@" delete tmi from tbneg_trilhamoduloitem tmi 
                                                            inner join tbneg_trilhamodulo tm on tm.cdmodulo = tmi.cdmodulo
                                                            where tmi.cdModulo not in (" + string.Join(",", trilhasModulosModel.Select(x => x.cdTrilhaModulo)) + ") and tm.cdTrilha = " + cdTrilha);

                    new cTrilhaModulo().executaSQL(@" delete from tbneg_trilhamodulo where cdModulo not in (" + string.Join(",", trilhasModulosModel.Select(x => x.cdTrilhaModulo)) + ") and cdTrilha = " + cdTrilha);


                }
                else if (trilhasModulosModel.Count == 0)
                {
                    List<cTrilhaModulo> trilhaModulo = new cTrilhaModulo().Listar("T.CDTRILHA = " + cdTrilha);
                    if(trilhaModulo.Count > 0)
                    {
                        new cTrilhaModuloItemVistoAluno().executaSQL(@" delete VA from tbNEG_TrilhaModuloItemVistoAluno VA 
                                                                    inner join tbneg_trilhamoduloitem MI on MI.cditemmodulo = VA.cditemmodulo
                                                                    inner join tbneg_trilhamodulo TM ON TM.cdmodulo = MI.cdmodulo
                                                                    where tm.cdModulo in (" + string.Join(",", trilhaModulo.Select(x => x.cdTrilhaModulo)) + ") and tm.cdTrilha = " + cdTrilha);

                        new cTrilhaModuloItem().executaSQL(@" delete tmi from tbneg_trilhamoduloitem tmi 
                                                            inner join tbneg_trilhamodulo tm on tm.cdmodulo = tmi.cdmodulo
                                                            where tmi.cdModulo in (" + string.Join(",", trilhaModulo.Select(x => x.cdTrilhaModulo)) + ") and tm.cdTrilha = " + cdTrilha);

                        new cTrilhaModulo().executaSQL(@" delete from tbneg_trilhamodulo where cdModulo in (" + string.Join(",", trilhaModulo.Select(x => x.cdTrilhaModulo)) + ") and cdTrilha = " + cdTrilha);
                    }
                }

                return trilhasModulosModel;
                //}
            }
            else
            {
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }

        }
    }
}