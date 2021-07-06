using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoAlunoModel
    {
        #region Campos
        public List<AvaliacaoAlunos> alunos { get; set; }
        public int cdAvaliacao { get; set; }
        public int cdEmpresa { get; set; }
        public string matricula { get; set; }
        public int cdTurma { get; set; }
        public string nome { get; set; }
        public string nmTurma { get; set; }
        public bool notasPorDisciplina { get; set; }

        #endregion
    }

    public class AvaliacaoAlunos
    {
        #region Campos
        public int cdMatricula { get; set; }
        public int cdAluno { get; set; }
        public string nome { get; set; }
        public int cdTurma { get; set; }
        public string nmTurma { get; set; }
        public int cdAvaliacaoAluno { get; set; }
        public int cdAvaliacao { get; set; }
        public DateTime? dtInicioAvaliacao { get; set; }
        public decimal notaObtida { get; set; }
        public bool notasPorDisciplina { get; set; }
        public DateTime? dtFimAvaliacao { get; set; }
        public bool corrigida { get; set; }
        #endregion
    }

    public class AvaliacaoAlunoNotasDisciplina
    {
        public int cdAvaliacaoAlunoNotaDisciplina { get; set; }
        public int cdAvaliacaoAluno { get; set; }
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }
        public decimal notaObtida { get; set; }
    }
}