using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace api.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class Professor : AuthorizationFilterAttribute
    {
        private string Programa;
        private TipoAcesso Acesso;
        private cProfessor.cSeguranca seguranca = new cProfessor.cSeguranca();
        public Professor(string Programa, TipoAcesso Acesso)
        {
            this.Programa = Programa;
            this.Acesso = Acesso;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var needLogin = true;
            if (actionContext.Request.Headers.Authorization != null)
            {
                var authToken = actionContext.Request.Headers.Authorization.Parameter;
                cDados.cProfessor professor = new cDados.cProfessor().AbrirUser(authToken, HttpContext.Current.Request.UserHostAddress);
                if (professor != null)
                {
                    needLogin = false;
                    seguranca.Abrir(professor.cdProfessor, Programa);

                    if (Acesso.HasFlag(TipoAcesso.Consultar) && seguranca.id_Consultar)
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(professor), new string[] { "professor" });
                        return;
                    }
                    if (Acesso.HasFlag(TipoAcesso.Incluir) && seguranca.id_Consultar && seguranca.id_Incluir)
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(professor), new string[] { "professor" });
                        return;
                    }
                    if (Acesso.HasFlag(TipoAcesso.Editar) && seguranca.id_Consultar && seguranca.id_Alterar)
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(professor), new string[] { "professor" });
                        return;
                    }
                    if (Acesso.HasFlag(TipoAcesso.Excluir) && seguranca.id_Consultar && seguranca.id_Excluir)
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(professor), new string[] { "professor" });
                        return;
                    }
                }
            }

            Unauthorize(actionContext, needLogin);
        }

        private void Unauthorize(HttpActionContext context, bool needLogin = true)
        {
            var obj = new Unauthorized(needLogin);
            context.Response = context.Request.CreateResponse(HttpStatusCode.Unauthorized, obj);
        }

        private class _Perfil : Perfil
        {
            public _Perfil(cDados.cProfessor Professor)
            {
                Name = Professor.nmPessoa;
                IsAuthenticated = true;
                tipo = "professor";
                this.Professor = Professor;
            }
        }
    }

    public class Unauthorized
    {
        public Unauthorized(bool needLogin)
        {
            this.needLogin = needLogin;
        }

        public bool needLogin { get; set; }
    }

    public static class Programa
    {
        public const string questao = "/questao";
        public const string video = "/video";
        public const string avaliacao = "/avaliacao";
        public const string trilha = "/trilha";
        public const string ticket = "/chatticket";
    }

    public enum TipoAcesso
    {
        Consultar = 1,
        Incluir = 2,
        Editar = 4,
        Excluir = 8
    }
}