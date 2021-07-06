using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers.Aluno
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/loginaluno")]
    public class LoginAlunoController : ApiController
    {
        // POST: api/LoginAluno
        public LoginAutenticadoAluno Post([FromBody] LoginAluno login)
        {
            cAluno aluno;
            if (ModelState.IsValid)
            {
                cMatriculaAtiva matricula = cMatriculaAtiva.LoginAluno(login.login, login.senha, login.cdEmpresa, login.cdTurma);
                if (matricula == null)
                    ModelState.AddModelError("login.senha", "Email ou senha inválidos");
                else
                {
                    aluno = new cAluno().Abrir(matricula.cdAluno);
                    aluno.token = gerarToken();

                    new cMatricula().SalvarToken(matricula.cdMatricula, 
                        aluno.token, 
                        HttpContext.Current.Request.UserHostAddress, 
                        -1, 
                        matricula.cdempresa);

                    aluno.cdempresa = login.cdEmpresa;
                    aluno.cdTurma = matricula.cdTurma;
                    aluno.cdMatricula = matricula.cdMatricula;
                    return new LoginAutenticadoAluno(aluno);
                }
            }

            throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));

        }

        [HttpPost]
        [Route("empresasaluno")]
        public EmpresaTurmaModel GetEmpresasAluno(StringGetter email)
        {
            List<cMatriculaAtiva> matriculasAtivas = cMatriculaAtiva.forEmail(email.email);
            List<EmpresaModel> empresas = new List<EmpresaModel>();
            EmpresaTurmaModel model = new EmpresaTurmaModel();
            model.Empresas = new List<EmpresaModel>();
            model.Turmas = new List<TurmaModel>();

            if (matriculasAtivas.Count > 0) {
                int cdAluno = matriculasAtivas.FirstOrDefault().cdAluno;

                model.Empresas = new cEmpresa().EmpresasAluno(cdAluno).Select((x)=> new EmpresaModel() { 
                    cdEmpresa = x.cdempresa,
                    nmEmpresa = x.nmEmpresa
                } ).ToList();

                model.Turmas = new cTurma().TurmasAluno(cdAluno).Select((x) => new TurmaModel() { 
                    cdTurma = x.cdTurma,
                    nmTurma = x.nmTurma,
                    cdEmpresa = x.cdempresa
                }).ToList();
            }

            if(model.Turmas?.Count == 0)
            {
                ModelState.AddModelError("login.noenterprises", "Este e-mail não possúi nenhum cadastro em nenhum período letivo válido em nenhuma instituição!");
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }

            return model;
        }

        [HttpPost]
        [Route("enviaemailaluno")]
        public void enviarEmail([FromBody] StringGetter alunoEmail)
        {
            cMatriculaAtiva matricula = cMatriculaAtiva.LoginAluno(alunoEmail.email, alunoEmail.cdEmpresa);
            cAluno aluno;

            if (matricula != null)
            {
                aluno = new cAluno().Abrir(matricula.cdAluno);

                Email mail = new Email();
                if (String.IsNullOrEmpty(matricula.token))
                {
                    aluno.token = gerarToken();
                    new cMatricula().SalvarToken(matricula.cdMatricula,
                        aluno.token,
                        HttpContext.Current.Request.UserHostAddress,
                        -1,
                        matricula.cdempresa);
                }

                string conteudo = $"Prezado(a) {aluno.nmPessoa} <br/>" +
                    $"Utilize do link abaixo para { (alunoEmail.primeiroAcesso ? "criar sua primeira" : "redefinir sua") } senha <br/>" +
                    $"<a href=\"{ConfigurationManager.AppSettings.Get("linkBase") + "senhaaluno/" + Uri.EscapeUriString(matricula.token)}\">{ConfigurationManager.AppSettings.Get("linkBase") + "senhaaluno/" + Uri.EscapeUriString(matricula.token)}<a/>" +
                    "<br/>";
                mail.Enviar(aluno.email, "Genoma - Troca de Senha", conteudo);
                return;
            }
            else
            {
                ModelState.AddModelError("esquecisenha.email", "Nenhum registro encontrado com este e-mail.");
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        [HttpPost]
        [Route("validar")]
        public bool Validar([FromBody] Token token)
        {
            cMatriculaAtiva matricula = cMatriculaAtiva.forToken(token.token);// passar apenas a string no body não funciona
            return matricula != null;
        }

        [HttpPost]
        [Route("trocarSenhaAluno")]
        public void TrocarSenha(TrocarSenha value)
        {
            if (ModelState.IsValid)
            {
                cMatriculaAtiva matricula = cMatriculaAtiva.forToken(value.token);
                cAluno aluno = new cAluno().Abrir(matricula.cdAluno);

                cPessoa pessoa = new cPessoa().Abrir(aluno.cdPessoa);
                if (pessoa != null)
                {
                    pessoa.Salvar(pessoa.cdPessoa,
                    ARWEB.Ferramentas.cCriptografia.Criptografar(value.senha),
                    HttpContext.Current.Request.UserHostAddress,
                    -1);
                    return;
                }
                else
                    ModelState.AddModelError("tokenInvalido", "O token da requisição é invalido.");
            }

            ModelState.AddModelError("SemStringOuToken", "Ocorreu um erro ao atualizar a senha.");
            throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
        }
        private string gerarToken()
        {
            string token;

            do
            {
                int start = 0;
                int implement = 5;

                token = Texto.GerarNomeAleatorio(20, cDados.Possibilidade.LetraCamelCase, cDados.Possibilidade.Numeros)
                    .Insert(start += implement++, "-")
                    .Insert(start += implement, "-")
                    .Insert(start += implement, "-");
            }
            while (new cDados.cProfessor().Listar("token", token).Count > 0);

            return token;
        }

        //Passar email através de GET não permite os pontos e pelo POST pegando uma var String gera erro
        public class StringGetter
        {
            public string email { get; set; }
            public int cdEmpresa { get; set; }
            public bool primeiroAcesso { get; set; }
        }
        public class Token
        {
            public string token { get; set; }
        }

    }
}