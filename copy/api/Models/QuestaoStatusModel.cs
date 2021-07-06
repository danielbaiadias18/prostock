using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class QuestaoStatusModel
    {
        public int cdQuestaoStatus { get; set; }
        public string dsQuestaoStatus { get; set; }
        public bool stDissertar { get; set; }

        public QuestaoStatusModel() { }
        public QuestaoStatusModel(cQuestaoStatus status)
        {
            foreach (var prop in typeof(QuestaoStatusModel).GetProperties())
                prop.SetValue(this, status.GetType().GetProperty(prop.Name).GetValue(status));
        }
    }
}