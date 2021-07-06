using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoModel
    {
        #region Campos
        #region Atributos
        int _cdAvaliacao;
        int _cdAvaliacaoTipo;
        string _nmAvaliacaoTipo;
        int? _cdAvaliacaoSubTipo;
        string _nmAvaliacao;
        int _cdStatus;
        DateTime? _dtAplicacao;
        decimal _valor;
        decimal _media;
        int _cdEtapa;
        string _nmEtapa;
        int _cdSerie;
        string _nmSerie;
        int _cdAreaConhecimento;
        string _nmAreaConhecimento;
        int _cdSegmento;
        string _nmSegmento;
        int _qtdeValidacoes;
        int _modoAplicacao;
        int? _resultado;
        DateTime? _dtInicioAvaliacao;
        DateTime? _dtFimAvaliacao;
        int? _tempoAvaliacao;
        bool? _exibirNota;
        bool? _exibirRespostasEsperadas;
        string _senhaAcesso;
        int? _cdCriterio;
        string _regras;
        int _cdClassificacaoInformacao;
        bool? _disponibilizada;
        bool? _randomizarQuestoes;
        bool? _randomizarAlternativas;
        bool? _exibirRespostasAposFechamento;
        DateTime? _dtExibicaoRespostas;
        bool? _notasPorDisciplina;
        bool? _stTrilha;
        bool _idAtivo;
        #endregion

        #region Propriedades
        public int cdAvaliacao
        {
            get { return _cdAvaliacao; }
            set { _cdAvaliacao = value; }
        }
        public int cdAvaliacaoTipo
        {
            get { return _cdAvaliacaoTipo; }
            set { _cdAvaliacaoTipo = value; }
        }
        public string nmAvaliacaoTipo
        {
            get { return _nmAvaliacaoTipo; }
            set { _nmAvaliacaoTipo = value; }
        }
        public int? cdAvaliacaoSubTipo
        {
            get { return _cdAvaliacaoSubTipo; }
            set { _cdAvaliacaoSubTipo = value; }
        }
        public int? cdPeriodoLetivo { get; set; }
        public string nmAvaliacao
        {
            get { return _nmAvaliacao; }
            set { _nmAvaliacao = value; }
        }
        public int cdStatus
        {
            get { return _cdStatus; }
            set { _cdStatus = value; }
        }
        public DateTime? dtAplicacao
        {
            get { return _dtAplicacao; }
            set { _dtAplicacao = value; }
        }
        public decimal valor
        {
            get { return _valor; }
            set { _valor = value; }
        }
        public decimal media
        {
            get { return _media; }
            set { _media = value; }
        }
        public int cdEtapa
        {
            get { return _cdEtapa; }
            set { _cdEtapa = value; }
        }
        public string nmEtapa
        {
            get { return _nmEtapa; }
            set { _nmEtapa = value; }
        }
        public int cdSerie
        {
            get { return _cdSerie; }
            set { _cdSerie = value; }
        }
        public string nmSerie
        {
            get { return _nmSerie; }
            set { _nmSerie = value; }
        }
        public int cdAreaConhecimento
        {
            get { return _cdAreaConhecimento; }
            set { _cdAreaConhecimento = value; }
        }
        public string nmAreaConhecimento
        {
            get { return _nmAreaConhecimento; }
            set { _nmAreaConhecimento = value; }
        }
        public int cdSegmento
        {
            get { return _cdSegmento; }
            set { _cdSegmento = value; }
        }
        public string nmSegmento
        {
            get { return _nmSegmento; }
            set { _nmSegmento = value; }
        }
        public int qtdeValidacoes
        {
            get { return _qtdeValidacoes; }
            set { _qtdeValidacoes = value; }
        }
        public int modoAplicacao
        {
            get { return _modoAplicacao; }
            set { _modoAplicacao = value; }
        }
        public int? resultado
        {
            get { return _resultado; }
            set { _resultado = value; }
        }
        public DateTime? dtInicioAvaliacao
        {
            get { return _dtInicioAvaliacao; }
            set { _dtInicioAvaliacao = value; }
        }
        public DateTime? dtFimAvaliacao
        {
            get { return _dtFimAvaliacao; }
            set { _dtFimAvaliacao = value; }
        }
        public int? tempoAvaliacao
        {
            get { return _tempoAvaliacao; }
            set { _tempoAvaliacao = value; }
        }
        
        public bool? exibirNota
        {
            get { return _exibirNota; }
            set { _exibirNota = value; }
        }
        public bool? exibirRespostasEsperadas
        {
            get { return _exibirRespostasEsperadas; }
            set { _exibirRespostasEsperadas = value; }
        }
        public string senhaAcesso
        {
            get { return _senhaAcesso; }
            set { _senhaAcesso = value; }
        }
        public int? cdCriterio
        {
            get { return _cdCriterio; }
            set { _cdCriterio = value; }
        }
        public string regras
        {
            get { return _regras; }
            set { _regras = value; }
        }
        public int cdClassificacaoInformacao
        {
            get { return _cdClassificacaoInformacao; }
            set { _cdClassificacaoInformacao = value; }
        }
        public bool? disponibilizada
        {
            get { return _disponibilizada; }
            set { _disponibilizada = value; }
        }
        public bool? randomizarQuestoes
        {
            get { return _randomizarQuestoes; }
            set { _randomizarQuestoes = value; }
        }
        public bool? randomizarAlternativas
        {
            get { return _randomizarAlternativas; }
            set { _randomizarAlternativas = value; }
        }
        public bool? exibirRespostasAposFechamento
        {
            get { return _exibirRespostasAposFechamento; }
            set { _exibirRespostasAposFechamento = value; }
        }
        public DateTime? dtExibicaoRespostas
        {
            get { return _dtExibicaoRespostas; }
            set { _dtExibicaoRespostas = value; }
        }
        public bool? notasPorDisciplina
        {
            get { return _notasPorDisciplina; }
            set { _notasPorDisciplina = value; }
        }
        public bool? stTrilha
        {
            get { return _stTrilha; }
            set { _stTrilha = value; }
        }
        public bool idAtivo
        {
            get { return _idAtivo; }
            set { _idAtivo = value; }
        }

        public string dsCriterio { get; set; }
        public string disciplinas { get; set; }
        public bool verificaUso { get; set; }
        public string nmStatus { get; set; }

        #endregion

        public List<AvaliacaoQuestaoModel> AvaliacaoQuestaoModel;
        #endregion
    }
    public class AvaliacaoInputModel
    {
        [Required]
        public List<AvaliacaoDisciplinaInputModel> Disciplinas { get; set; }
        public AvaliacaoExecutarInputModel Executar { get; set; }
        public AvaliacaoFinalizarInputModel Finalizar { get; set; }
        //[Required]
        //public List<AvaliacaoGrupoInputModel> Grupos { get; set; }
        public AvaliacaoQuandoInputModel Quando { get; set; }
        public AvaliacaoTempoTentativaModel TempoTentativa { get; set; }
        public List<AvaliacaoTurmaInputModel> Turmas { get; set; }
        public bool avaliacaoImpOuWeb { get; set; }
        [Range(1, int.MaxValue)]
        public int cdAreaConhecimento { get; set; }
        public int cdAvaliacao { get; set; }
        [Range(1, int.MaxValue)]
        public int cdAvaliacaoTipo { get; set; }
        public int? cdClassificacao { get; set; }
        [Range(1, int.MaxValue)]
        public int cdEtapa { get; set; }
        [Range(1, int.MaxValue)]
        public int cdSegmento { get; set; }
        [Required]
        public int[] cdSerie { get; set; }
        public int[] cdTurma { get; set; }
        public string dsRegras { get; set; }
        [Required]
        public string nmAvaliacao { get; set; }
        public int cdPeriodoLetivo { get; set; }
        public bool notasPorDisciplina { get; set; }
        public bool? stTrilha { get; set; }
        [Range(0.01, (double)decimal.MaxValue)]
        public decimal valor { get; set; }
        [Range(0.01, (double)decimal.MaxValue)]
        public decimal media { get; set; }
        [Range(1, int.MaxValue)]
        public int cdEmpresa { get; set; }
        [Range(1, int.MaxValue)]
        public int cdStatus { get; set; }
    }
    public class AvaliacaoExecutarInputModel
    {
        [Range(1, int.MaxValue)]
        public int cdCriterio { get; set; }
        public bool stEmbaralharAlternativas { get; set; }
        public bool stEmbaralharQuestoes { get; set; }
    }
    public class AvaliacaoFinalizarInputModel
    {
        [Range(1, int.MaxValue)]
        public int cdTipoResultado { get; set; }
        public bool stDtExibir { get; set; }
        public bool stExibirGabarito { get; set; }
        public DateTime? dtExibir { get; set; }
        public string hrExibir { get; set; }
        public bool stExibirNota { get; set; }
    }
    public class AvaliacaoQuandoInputModel
    {
        public bool stHabilitada { get; set; }
    }
    public class AvaliacaoGrupoInputModel
    {
        [Range(1, int.MaxValue)]
        public int cdGrupo { get; set; }
        public bool selected { get; set; }
    }
    public class AvaliacaoTempoTentativaModel
    {
        [Range(1, int.MaxValue)]
        public int qtdMinutos { get; set; }

    }
    public class AvaliacaoDisciplinaInputModel
    {
        [Range(1, int.MaxValue)]
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }
        [Range(0, (double)decimal.MaxValue)]
        public decimal? media { get; set; }
        public int nrOrdem { get; set; }
        [Range(0, (double)decimal.MaxValue)]
        public decimal? valor { get; set; }

        public AvaliacaoDisciplinaInputModel() { }
        public AvaliacaoDisciplinaInputModel(dtsAvaliacao.dtDisciplinaRow row) : this()
        {
            cdDisciplina = row.cdDisciplina;
            nmDisciplina =
                row.IsnmDisciplinaNull() ? null : row.nmDisciplina;
            media =
               row.IsmediaNull() ? 0 : row.media;
            valor =
                row.IsvalorNull() ? 0 : row.valor;
            nrOrdem =
                row.IsordemNull() ? 0 : row.ordem;
        }

        public static dtsAvaliacao.dtDisciplinaDataTable fromModel(IEnumerable<AvaliacaoDisciplinaInputModel> Disciplinas)
        {
            if (Disciplinas == null) return null;
            dtsAvaliacao.dtDisciplinaDataTable dt = new dtsAvaliacao.dtDisciplinaDataTable();

            foreach (AvaliacaoDisciplinaInputModel d in Disciplinas)
            {
                dtsAvaliacao.dtDisciplinaRow row = (dtsAvaliacao.dtDisciplinaRow)dt.NewRow();

                row.cdDisciplina = d.cdDisciplina;
                row.ordem = d.nrOrdem;
                row.valor = d.valor ?? 0;
                row.media = d.media ?? 0;

                dt.AdddtDisciplinaRow(row);
            }

            return dt;
        }
    }
    public class AvaliacaoTurmaInputModel
    {
        [Range(1, int.MaxValue)]
        public int cdTurma { get; set; }
        public DateTime? dtFim { get; set; }
        public DateTime? dtIni { get; set; }
        public string hrFim { get; set; }
        public string hrIni { get; set; }
        public string senhaAcesso { get; set; }

        public AvaliacaoTurmaInputModel() { }
        public AvaliacaoTurmaInputModel(dtsAvaliacao.dtTurmaRow row) : this()
        {
            cdTurma = row.cdTurma;
            dtFim = row.IsdtFimAvaliacaoNull() ? null : (DateTime?)row.dtFimAvaliacao;
            dtIni = row.IsdtInicioAvaliacaoNull() ? null : (DateTime?)row.dtInicioAvaliacao;
            hrFim = row.IsdtFimAvaliacaoNull() ? null : row.dtFimAvaliacao.ToString("HH:mm");
            hrIni = row.IsdtInicioAvaliacaoNull() ? null : row.dtInicioAvaliacao.ToString("HH:mm");
            senhaAcesso = row.IssenhaAcessoNull() ? null : row.senhaAcesso;
        }

        public static dtsAvaliacao.dtTurmaDataTable fromModel(IEnumerable<AvaliacaoTurmaInputModel> Turmas)
        {
            if (Turmas == null) return null;
            dtsAvaliacao.dtTurmaDataTable dt = new dtsAvaliacao.dtTurmaDataTable();

            foreach (AvaliacaoTurmaInputModel turma in Turmas)
            {
                dtsAvaliacao.dtTurmaRow row = (dtsAvaliacao.dtTurmaRow)dt.NewRow();
                row.cdTurma = turma.cdTurma;
                row.senhaAcesso = turma.senhaAcesso;

                if (turma.dtIni.HasValue && !string.IsNullOrWhiteSpace(turma.hrIni))
                    row.dtInicioAvaliacao = Convert.ToDateTime($"{ turma.dtIni.Value.ToString("dd/MM/yyyy") } {turma.hrIni}");

                if (turma.dtFim.HasValue && !string.IsNullOrWhiteSpace(turma.hrFim))
                    row.dtFimAvaliacao = Convert.ToDateTime($"{ turma.dtFim.Value.ToString("dd/MM/yyyy") } {turma.hrFim}");

                dt.AdddtTurmaRow(row);
            }

            return dt;
        }
    }

    public class AvaliacaoDuplicar
    {
        public int cdAvaliacao { get; set; }
        public string nmAvalNova { get; set; }
        public bool randomizarQuestoes { get; set; }
        public bool randomizarAlternativas { get; set; }
    }
}