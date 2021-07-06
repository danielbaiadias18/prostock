using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using api.Models;
using cDados;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/login")]
    public class LoginController : ApiController
    {
        // GET: api/Login
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Login/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Login
        [Route("professor")]
        [HttpPost]
        public LoginAutenticado Post([FromBody] Login login)
        {
            cDados.cProfessor professor;
            if (ModelState.IsValid)
            {
                professor = new cDados.cProfessor().Abrir(login.login, login.senha, login.cdEmpresa);
                if (professor == null)
                    ModelState.AddModelError("login.senha", "Email ou senha inválidos");
                else
                {
                    professor.token = gerarToken();
                    new cDados.cProfessor().Salvar(professor.cdProfessor,
                        professor.token,
                        HttpContext.Current.Request.UserHostAddress,
                        -1,
                        1);

                    professor.cdEmpresa = login.cdEmpresa;
                    return new LoginAutenticado(professor);
                }
            }

            throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));

        }

        [HttpPost]
        [Route("esquecisenhaprofessor")]
        public void enviarEmail([FromBody] EsqueciSenha profEmail)
        {
            cDados.cProfessor professor = new cDados.cProfessor().AbrirEmail(profEmail.email, profEmail.cdEmpresa);

            if (professor != null)
            {
                Email mail = new Email();
                if (String.IsNullOrEmpty(professor.token))
                {
                    professor.token = gerarToken();
                    new cDados.cProfessor().Salvar(professor.cdProfessor,
                        professor.token,
                        HttpContext.Current.Request.UserHostAddress,
                        -1,
                        professor.cdempresa);
                }

                string conteudo = $"Prezado {professor.nmPessoa} <br/>" +
                    "Utilize do link abaixo para redefinir sua senha <br/>" +
                    $"<a href=\"{ConfigurationManager.AppSettings.Get("linkBase") + "esquecisenhatrocar/" + Uri.EscapeUriString(professor.token)}\">{ConfigurationManager.AppSettings.Get("linkBase") + "esquecisenhatrocar/" + Uri.EscapeUriString(professor.token)}<a/>" +
                    "<br/>";
                mail.Enviar(professor.emailProfessor, "Genoma - Recuperação de Senha", conteudo);
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
        public bool Validar([FromBody] TokenGetter token)
        {
            cDados.cProfessor professor = new cDados.cProfessor().AbrirToken(token.token);
            return professor != null;
        }

        [HttpPost]
        [Route("trocarSenhaProfessor")]
        public void TrocarSenha(TrocarSenha value)
        {
            if (ModelState.IsValid)
            {
                cDados.cProfessor prof = new cDados.cProfessor().AbrirToken(value.token);

                cDados.cPessoa pessoa = new cPessoa().Abrir(prof.cdPessoa);
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

        // PUT: api/Login/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Login/5
        public void Delete(int id)
        {
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

        //Em todos esses anos nessa industria vital, isto é a primeira vez que me acontece :/
        public class TokenGetter
        {
            [Required]
            public string token { get; set; }
        }

        public class EsqueciSenha
        {
            [Required]
            public string email { get; set; }
            [Required, Range(1, int.MaxValue)]
            public int cdEmpresa { get; set; }
        }

    }
}
