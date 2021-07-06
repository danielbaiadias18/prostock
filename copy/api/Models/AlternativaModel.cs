using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AlternativaModel
    {
        public int cdQuestaoAlternativa { get; set; }
        public int? cdQuestaoAlternativa2 { get; set; }
        public int cdQuestao { get; set; }
        public bool correta { get; set; }
        public string indice1 { get; set; }
        public string dsAlternativa1 { get; set; }
        public bool imgAlternativa1 { get; set; }
        public string indice2 { get; set; }
        public string indiceCorreta { get; set; }
        public string dsAlternativa2 { get; set; }
        public bool imgAlternativa2 { get; set; }
        public int ordem { get; set; }
        public bool acertou { get; set; }
        public bool? verdadeiro { get; set; }
        public string justificativa { get; set; }

        public int cdAvaliacaoAlunoResposta { get; set; }
        public string dsResposta { get; set; }
        public decimal pontuacao { get; set; }
    }
}