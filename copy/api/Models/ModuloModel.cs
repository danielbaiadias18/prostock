using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TrilhaModuloModel
    {
        public int cdTrilhaModulo { get; set; }
        public string nmModulo { get; set; }
        public string link { get; set; }
        public int cdTrilha { get; set; }
        public int ordem { get; set; }
        public int visto { get; set; }
        public int total { get; set; }
        public TrilhaModuloModel() { }
        public TrilhaModuloModel(cTrilhaModulo trilhaModulo)
        {
            foreach (var prop in new TrilhaModuloModel().GetType().GetProperties())
            {
                prop.SetValue(this, trilhaModulo.GetType().GetProperty(prop.Name).GetValue(trilhaModulo), null);
            }
        }
        public static void PopulateTrilhaModuloModel<T>(cTrilhaModulo trilhaModulo, T model)
        {
            foreach (var prop in new TrilhaModuloModel().GetType().GetProperties())
            {
                prop.SetValue(model, trilhaModulo.GetType().GetProperty(prop.Name).GetValue(trilhaModulo), null);
            }
        }
    }

    public class TrilhaModuloInputModel : TrilhaModuloModel
    {
        public List<TrilhaModuloItemModel> Itens { get; set; }
       
        public TrilhaModuloInputModel() { }
        public TrilhaModuloInputModel(cTrilhaModulo trilhaModulo)
        {
            PopulateTrilhaModuloModel(trilhaModulo, this);
        }
    }
}