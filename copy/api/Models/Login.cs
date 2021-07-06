using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class Login
    {
        [Required]
        public string login { get; set; }
        [Required]
        public string senha { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int cdEmpresa { get; set; }
    }

    public class LoginAluno: Login
    {
        [Required]
        public int cdTurma { get; set; }
    }

    public class TrocarSenha
    {
        [Required]
        public string token { get; set; }
        [Required]
        public string senha { get; set; }
    }

    public class LoginAutenticado
    {
        public string emailProfessor { get; set; }
        public int cdProfessor { get; set; }
        public int cdPessoa { get; set; }
        public string token { get; set; }
        public int cdEmpresa { get; set; }
        public string nmPessoa { get; set; }
        public int cdUsuarioVinculado { get; set; }

        public LoginAutenticado(cDados.cProfessor professor)
        {
            foreach (var prop in typeof(LoginAutenticado).GetProperties())
                prop.SetValue(this, professor.GetType().GetProperty(prop.Name).GetValue(professor));
        }
    }

    public class LoginAutenticadoAluno
    {
        public string email { get; set; }
        public int cdAluno { get; set; }
        public int cdPessoa { get; set; }
        public string token { get; set; }
        public int cdempresa { get; set; }
        public string nmPessoa { get; set; }
        public int cdTurma { get; set; }
        public int cdMatricula { get; set; }

        public LoginAutenticadoAluno(cAluno aluno)
        {
            foreach (var prop in typeof(LoginAutenticadoAluno).GetProperties())
                prop.SetValue(this, aluno.GetType().GetProperty(prop.Name).GetValue(aluno));
        }
    }
}