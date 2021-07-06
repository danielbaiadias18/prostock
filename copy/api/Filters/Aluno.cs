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
    public class Aluno : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization != null)
            {
                var authToken = actionContext.Request.Headers.Authorization.Parameter;
                cMatriculaAtiva aluno = cMatriculaAtiva.forToken(authToken);
                if (aluno != null)
                {
                    Thread.CurrentPrincipal = new GenericPrincipal(new _Perfil(aluno), new string[] { "aluno" });
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
            public _Perfil(cMatriculaAtiva Aluno)
            {
                Name = Aluno.Aluno.nmPessoa;
                IsAuthenticated = true;
                tipo = "aluno";
                this.Aluno = Aluno;
            }
        }
    }
}