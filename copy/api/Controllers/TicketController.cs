using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/ticket")]
    public partial class TicketController : ApiController
    {
        [HttpGet]
        [Route("departamento")]
        public List<DepartamentoModel> Get()
        {
            List<DepartamentoModel> departamentos = new List<DepartamentoModel>();

            cTicketDepartamento dep = new cTicketDepartamento();
            foreach (var x in dep.Listar("idativo = 1"))
            {
                departamentos.Add(new DepartamentoModel()
                {
                    cdTicketDepartamento = x.cdTicketDepartamento,
                    dsDepartamento = x.dsDepartamento,
                    texto = x.texto
                });
            };

            return departamentos;
        }

    }
}