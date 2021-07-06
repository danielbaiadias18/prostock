using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [ProfessorAutenticado]
    [RoutePrefix("api/permisssao")]
    public class PermissaoController : ApiController
    {
        private cDados.cProfessor _usuario = null;
        public cDados.cProfessor Usuario
        {
            get
            {
                if (_usuario == null && ((Perfil)Thread.CurrentPrincipal.Identity).Professor.cdProfessor > 0)
                {
                    _usuario = new cDados.cProfessor();
                    _usuario = _usuario.Abrir(((Perfil)Thread.CurrentPrincipal.Identity).Professor.cdProfessor);
                }

                return _usuario;
            }
        }
        public int cdUsuario { get => Usuario != null ? Usuario.cdProfessor : 0; }
        cUsuarios cusu = new cUsuarios();

        public IEnumerable<Permissao> Get()
        {
            var programas = new cProfessor.cProgramas().Listar(null);
            programas = programas.Where(x => x.stAtivo).ToList();

            var grupos = new cProfessor.cGrupo().ListarPermissaoProfessor(null, Usuario.cdProfessor);
            var permissao = new cProfessor.cProgramas().ListarPermissao(null, Usuario.cdProfessor);

            foreach (var programa in programas)
            {
                var grupo = grupos.FirstOrDefault(x => x.idPrograma == programa.idPrograma);
                if (grupo != null)
                {
                    programa.idConsultar = grupo.idConsultar;
                    programa.idAlterar = grupo.idAlterar;
                    programa.idExcluir = grupo.idExcluir;
                    programa.idIncluir = grupo.idIncluir;
                }

                var usuario = permissao.FirstOrDefault(x => x.idPrograma == programa.idPrograma);
                if (usuario != null)
                {
                    programa.idConsultar = usuario.idConsultar;
                    programa.idAlterar = usuario.idAlterar;
                    programa.idExcluir = usuario.idExcluir;
                    programa.idIncluir = usuario.idIncluir;
                }
            }

            return programas.Select(x => new Permissao(x));
        }
    }
}