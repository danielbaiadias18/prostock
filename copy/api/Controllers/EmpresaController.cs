using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/empresa")]
    public class EmpresaController : ApiController
    {
        cUsuarios cusu = new cUsuarios();

        public List<EmpresaModel> Get()
        {
            List<EmpresaModel> empresas = new List<EmpresaModel>();

            cEmpresa emp = new cEmpresa();
            foreach (var x in emp.Listar("idativo = 1"))
            {
                empresas.Add(new EmpresaModel()
                {
                    cdEmpresa = x.cdempresa,
                    nmEmpresa = x.nmEmpresa
                });
            };

            return empresas;
        }
    }
}