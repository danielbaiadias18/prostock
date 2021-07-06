using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AlunoTurmaModel
    {
        public int[] cdsTurma { get; set; }
        public int cdAvaliacao { get; set; }
    }

    public class AlunoModel
    {
        public int cdMatricula { get; set; }
        public string nome { get; set; }
        public string matricula { get; set; }
        public int cdTurma { get; set; }
        public string nmTurma { get; set; }

    }

    public class AlunoAuth
    {
        public string matricula { get; set; }
        public int cdMatricula { get; set; }
        public int cdAluno { get; set; }
        public int cdPessoa { get; set; }
        public int cdEmpresa { get; set; }
        public int cdTurma { get; set; }
        public int cdSerie { get; set; }
        public int cdSegmento { get; set; }
        public string token { get; set; }
        public string email { get; set; }
        public string nmTurma { get; set; }
        public string nmSerie { get; set; }
        public string nmSegmento { get; set; }
        public string nmPessoa { get; set; }

        public AlunoAuth() { }
        public AlunoAuth(cAluno aluno)
        {
            this.matricula = aluno.matricula;
            this.cdMatricula = aluno.cdMatricula;
            this.cdAluno = aluno.cdAluno;
            this.cdPessoa = aluno.cdPessoa;
            this.cdEmpresa = aluno.cdEmpresa;
            this.cdTurma = aluno.cdTurma;
            this.cdSerie = aluno.cdSerie;
            this.cdSegmento = aluno.cdSegmento;
            this.token = aluno.token;
            this.email = aluno.email;
            this.nmTurma = aluno.nmTurma;
            this.nmSerie = aluno.nmSerie;
            this.nmSegmento = aluno.nmSegmento;
            this.nmPessoa = aluno.nmPessoa;
        }
    }

    public class AlunoValidaModel
    {
        public string email { get; set; }
        public bool valida { get; set; }
    }

    public class AlunoTrocarSenhaModel
    {
        [Required]
        public string senha { get; set; }
        [Required]
        public string senhaAtual { get; set; }
        [Required]
        public string token { get; set; }
    }


}