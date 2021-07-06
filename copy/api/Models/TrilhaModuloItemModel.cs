using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TrilhaModuloItemModel
    {
        public int cdItemModulo { get; set; }
        public string nmItemModulo { get; set; }
        public int cdModulo { get; set; }
        public int? cdAvaliacao { get; set; }
        public int? cdVideo { get; set; }
        public string texto { get; set; }
        public int ordem { get; set; }
        public int cdTipo { get; set; }
        public string link { get; set; }
        public string textVideo { get; set; }
        public bool stVisto { get; set; }
        public TrilhaModuloItemModel() { }
        public TrilhaModuloItemModel(cTrilhaModuloItem trilhaModuloItem)
        {
            foreach (var prop in new TrilhaModuloItemModel().GetType().GetProperties())
                prop.SetValue(this, trilhaModuloItem.GetType().GetProperty(prop.Name).GetValue(trilhaModuloItem), null);
        }
    }

    public class TrilhaModuloItemTipoModel
    {
        public int cdTipo { get; set; }
        public string nmTipo { get; set; }

        public TrilhaModuloItemTipoModel() { }

        public TrilhaModuloItemTipoModel(cTrilhaModuloItemTipo tipo)
        {
            cdTipo = tipo.cdTipo;
            nmTipo = tipo.nmTipo;
        }

    }
    public class GetByTrilhaModel // para filtragem nos modulos de videos e questões
    {
        public int cdAreaConhecimento { get; set; }
        public int cdSerie { get; set; }
        public List<int> disciplinas { get; set; }
    }
}