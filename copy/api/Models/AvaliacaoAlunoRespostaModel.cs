using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoAlunoRespostaModel
    {
        public int cdAvaliacaoAlunoResposta { get; set; }
        public int cdAvaliacaoAluno { get; set; }
        public int cdQuestao { get; set; }
        public int cdAlternativa { get; set; }
        public int cdAlternativaResposta { get; set; }
        public string dsResposta { get; set; }
        public bool verdadeiro { get; set; }
        public bool correto { get; set; }
        public decimal? pontuacao { get; set; }
        public string feedback { get; set; }
        public bool acertou { get; set; }
        public int cdEmpresa { get; set; }
        public DateTime dtIncReg { get; set; }
        public string referencia { get; set; }
    }
}