using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class QuestaoStatusHistorico : NovoQuestaoStatusHistorico
    {
        public int cdQuestaoStatusHistorico { get; set; }
        public string dsQuestaoStatus { get; set; }
        public int cdProfessor { get; set; }
        public string nmProfessor { get; set; }
        public DateTime dtIncReg { get; set; }
        public string dissertacao { get; set; }

        public QuestaoStatusHistorico(cQuestaoStatusHistorico historico)
        {
            foreach (var prop in typeof(QuestaoStatusHistorico).GetProperties())
                prop.SetValue(this, historico.GetType().GetProperty(prop.Name).GetValue(historico));
        }
    }

    public class NovoQuestaoStatusHistorico
    {
        [Range(1, int.MaxValue)]
        public int cdQuestao { get; set; }
        [Range(1, 5)]
        public int cdQuestaoStatus { get; set; }
        public string dissertacao { get; set; }
    }
}