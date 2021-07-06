using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class PesquisaAvaliacaoModel
    {
        public int cdAvaliacao { get; set; }
        public string nmAvaliacao { get; set; }
        public int cdSerie { get; set; }
        public string nmSerie { get; set; }
        public int cdAvaliacaoTipo { get; set; }
        public string nmAvaliacaoTipo { get; set; }
        public int cdEtapa { get; set; }
        public string nmEtapa { get; set; }
        public int cdAreaConhecimento { get; set; }
        public string nmAreaConhecimento { get; set; }
        public int cdSegmento { get; set; }
        public string nmSegmento { get; set; }
        public bool idAtivo { get; set; }
        public DateTime? dtInicioAvaliacao { get; set; }
        public DateTime? dtFimAvaliacao { get; set; }
        public int cdStatus { get; set; }
        public string nmStatus { get; set; }
        public bool verificaUso { get; set; }
        public int tempoAvaliacao { get; set; }
        public DateTime? dtAplicacao { get; set; }
        public decimal valor { get; set; }
        public bool disponibilizada { get; set; }
        public bool notasPorDisciplina { get; set; }
        public bool? stTrilha { get; set; }
        public int modoAplicacao { get; set; }
        public List<DisciplinaModel> disciplinas { get; set; }
        public bool comecar { get; set; }
        public int? cdEmpresa { get; set; }

        public decimal notaObtida { get; set; }
        public bool corrigida { get; set; }
        public bool exibirNota { get; set; }
    }

    public class PesquisaAvaliacaoRealizadaModel
    {
        public int cdAvaliacaoAluno { get; set; }
        public int cdAvaliacao { get; set; }
        public string nmAvaliacao { get; set; }
        public string nmAvaliacaoTipo { get; set; }
        public string nmEtapa { get; set; }
        public string nmAreaConhecimento { get; set; }
        public string nmSegmento { get; set; }
        public int tempoAvaliacao { get; set; }
        public DateTime? dtAplicacao { get; set; }
        public decimal valor { get; set; }
        public DateTime? dtInicioAvaliacao { get; set; }
        public DateTime? dtFimAvaliacao { get; set; }
        public bool disponibilizada { get; set; }
        public DateTime? dtFinalizouAvaliacao { get; set; }
        public decimal notaObtida { get; set; }
        public string dsCriterio { get; set; }
        public bool exibirRespostaPosFechamento { get; set; }
        public DateTime? dtExibicaoResposta { get; set; }
        public bool notasPorDisciplina { get; set; }
        public bool exibirRespostasEsperadas { get; set; }
        public bool exibirNota { get; set; }
        public bool corrigida { get; set; }
        public bool verProva { get; set; }
        public int modoAplicacao { get; set; }
        public bool? stTrilha { get; set; }
        public List<DisciplinaModel> disciplinas { get; set; }
    }
}