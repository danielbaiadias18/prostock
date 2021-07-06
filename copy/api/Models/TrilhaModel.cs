using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TrilhaModel
    {
        public int cdTrilha { get; set; }
        public string nmTrilha { get; set; }
        public int cdPeriodoLetivo { get; set; }
        public string nmPeriodoLetivo { get; set; }
        public int cdAreaConhecimento { get; set; }
        public string nmAreaConhecimento { get; set; }
        public int cdSegmento { get; set; }
        public string nmSegmento { get; set; }
        public int cdSerie { get; set; }
        public string nmSerie { get; set; }
        public bool idAtivo { get; set; }
        public int cdTrilhaAluno { get; set; }

        public TrilhaModel() { }
        public TrilhaModel(cTrilha trilha)
        {
            foreach (var prop in new TrilhaModel().GetType().GetProperties())
                prop.SetValue(this, trilha.GetType().GetProperty(prop.Name).GetValue(trilha), null);

        }

        public static void PopulateTrilhaModel<T>(cTrilha trilha, T model)
        {
            foreach (var prop in new TrilhaModel().GetType().GetProperties())
                prop.SetValue(model, trilha.GetType().GetProperty(prop.Name).GetValue(trilha), null);
        }
    }

    public class TrilhaInputModel : TrilhaModel
    {
        public List<TurmaModel> Turmas { get; set; }
        public List<DisciplinaModel> Disciplinas { get; set; }
        public int cdEmpresa { get; set; }
    }

    public class TrilhaPorTurmaModel : TrilhaModel
    {
        public int cdTurma { get; set; }
        public string nmTurma { get; set; }
        public decimal porcentagem { get; set; }

        public TrilhaPorTurmaModel() { }
        public TrilhaPorTurmaModel(cTrilha trilha)
        {
            foreach (var prop in new TrilhaPorTurmaModel().GetType().GetProperties())
                prop.SetValue(this, trilha.GetType().GetProperty(prop.Name).GetValue(trilha), null);
        }
    }

    public class TrilhaTimeLineModel : TrilhaModel
    {
        public List<TrilhaModuloInputModel> Modulos { get; set; }
    }
}