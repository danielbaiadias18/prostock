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
    public class ProfessorAutenticado : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization != null)
            {
                var authToken = actionContext.Request.Headers.Authorization.Parameter;
                cDados.cProfessor professor = new cDados.cProfessor().AbrirUser(authToken, HttpContext.Current.Request.UserHostAddress);
                if (professor != null)
                {
                    Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(professor), new string[] { "professor" });
                    return;
                }
            }

            Unauthorize(actionContext);
        }

        private void Unauthorize(HttpActionContext context)
        {
            context.Response = context.Request.CreateResponse(HttpStatusCode.Unauthorized);
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

    public class Perfil : IIdentity
    {
        public string Name { get; protected set; }
        public string AuthenticationType { get; protected set; }
        public bool IsAuthenticated { get; protected set; }
        /// <summary>
        /// "professor" ou "aluno"
        /// </summary>
        public string tipo { get; protected set; }
        public cDados.cProfessor Professor { get; protected set; }
        public cMatriculaAtiva Aluno { get; protected set; }
        public static bool TryGetPerfil(out Perfil perfil)
        {
            perfil = null;
            try
            {
                perfil = Thread.CurrentPrincipal.Identity as Perfil;
                return perfil != null;
            }
            catch
            {
                return false;
            }
        }

        protected Perfil() { }
    }
}