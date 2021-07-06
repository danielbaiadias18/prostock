using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace api.Controllers
{
    public partial class TrilhaController : ApiController
    {
        [HttpGet]
        [Route("{cdTrilha}")]
        public TrilhaModel Get(int cdTrilha)
        {
            cTrilha trilha = new cTrilha().Abrir(cdTrilha);

            TrilhaModel model = new TrilhaModel(trilha);

            return model;
        }

        [HttpGet]
        [Route("trilhamodulos/{cdTrilha}")]
        public TrilhaModel GetWithModules(int cdTrilha)
        {
            cTrilha trilha = new cTrilha().Abrir(cdTrilha);

            TrilhaTimeLineModel model = new TrilhaTimeLineModel();
            
            TrilhaModel.PopulateTrilhaModel(trilha, model);

            List<TrilhaModuloInputModel> modulos = new cTrilhaModulo().Listar(" T.CDTRILHA = " + cdTrilha + " AND T.IDATIVO = 1")
                .Select(x=> new TrilhaModuloInputModel(x)).ToList();

            List<TrilhaModuloItemModel> itens;
            
            foreach(TrilhaModuloInputModel modulo in modulos)
            {
                itens = new cTrilhaModuloItem().Listar(" T.CDMODULO = " + modulo.cdTrilhaModulo + " AND T.IDATIVO = 1").Select(x=> new TrilhaModuloItemModel(x)).ToList();
                modulo.Itens = itens;
            }

            model.Modulos = modulos;

            return model;
        }
    }
}
