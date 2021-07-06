using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/menu")]
    public class MenuController : ApiController
    {
        [HttpGet]
        [ProfessorAutenticado]
        public IEnumerable<Models.Programa> Get()
        {
            cDados.cProfessor prof;
            Perfil.TryGetPerfil(out Perfil perfil);
            prof = perfil.Professor;

            var programas = new cProfessor.cProgramas().ListarPermisaoUsuario(prof.cdProfessor);

            return programas.Select(x => new Models.Programa(x));
        }

        [HttpPost]
        [ProfessorAutenticado]
        [Route("permissao/{formType}")]
        public PermissaoList permissao(int formType, [FromBody] PermissaoInput caminho)
        {
            cDados.cProfessor prof;
            Perfil.TryGetPerfil(out Perfil perfil);
            prof = perfil.Professor;

            cProfessor.cSeguranca seg = new cProfessor.cSeguranca();
            seg.Abrir(prof.cdProfessor, caminho.caminho);

            PermissaoList permissoes = new PermissaoList() { 
                incluir = seg.id_Incluir,    //formtype 1
                alterar = seg.id_Alterar,    //formtype 2
                consultar = seg.id_Consultar,//formtype 3
                excluir = seg.id_Excluir     //formtype 4
            };
            return permissoes;
        }
    }

    public class PermissaoInput
    {
        public string caminho { get; set; }
    }

    public class PermissaoList {
        public bool incluir { get; set; }
        public bool alterar { get; set; }
        public bool consultar { get; set; }
        public bool excluir { get; set; }
    }

}