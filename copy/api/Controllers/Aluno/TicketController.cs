using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    public partial class TicketController : ApiController
    {
        [HttpGet]
        [Route("departamentos")]
        public List<DepartamentoModel> GetDepartamentos()
        {
            List<DepartamentoModel> departamentos = new cTicketDepartamento().Listar(" t.idativo= 1 ").Select(x => new DepartamentoModel(x)).ToList();
            return departamentos;
        }

        [HttpGet]
        [Route("abertos")]
        [Filters.Aluno]
        public List<TicketModel> GetTicketsAbertos()
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<TicketModel> tickets = new cTicket()
                .ListarTicketsChat($"T.IDATIVO = 1 AND T.STATUS = {(int)TicketStatus.ABERTO} AND T.CDALUNO = " + perfil.Aluno.cdAluno)
                .Select(x => new TicketModel(x)).ToList();
            return tickets;
        }

        [HttpGet]
        [Route("concluidos")]
        [Filters.Aluno]
        public List<TicketModel> GetTicketsConcluido()
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<TicketModel> tickets = new cTicket()
                .ListarTicketsChat($"T.IDATIVO = 1 AND T.STATUS = {(int)TicketStatus.CONCLUIDO} AND T.CDALUNO = " + perfil.Aluno.cdAluno)
                .Select(x => new TicketModel(x)).ToList();
            return tickets;
        }

        [HttpGet]
        [Route("mensagens/{cdTicket}")]
        [Filters.Aluno]
        public List<TicketMensagemAnexosModel> GetMensagensTicket(int cdTicket)
        {
            List<TicketMensagemAnexosModel> mensagens =
                new cTicketMensagem().Listar("T.IDATIVO = 1 AND T.CDTICKET = " + cdTicket).Select(x => new TicketMensagemAnexosModel(x)).ToList();
            int[] codigosMensagens = mensagens.Select(x => x.cdTicketMensagem).ToArray();

            List<TicketAnexoModel> anexos = new cTicketAnexo().ListarPorMensagensTicket(codigosMensagens).Select(x => new TicketAnexoModel(x)).ToList();

            foreach (var anexo in anexos) {
                TicketMensagemAnexosModel msg = mensagens.FirstOrDefault(x=> x.cdTicketMensagem == anexo.cdTicketMensagem);
                mensagens.Add(new TicketMensagemAnexosModel()
                {
                    cdTicketMensagem = msg.cdTicketMensagem,
                    cdPessoa = msg.cdPessoa,
                    cdUsuario = msg.cdUsuario,
                    nmUsuario = msg.nmUsuario,
                    cdTicket = msg.cdTicket,
                    dtHrMsg = msg.dtHrMsg,
                    nmPessoa = msg.nmPessoa,
                    origem = msg.origem,
                    texto = anexo.nmOriginal,
                    cdTicketAnexo = anexo.cdTicketAnexo,
                    linkAnexo = ConfigurationManager.AppSettings["linkAnexos"] + anexo.nmArquivo
                });
            }
            mensagens = mensagens.OrderBy(x=> x.dtHrMsg).ToList();
            return mensagens;
        }

        [HttpGet]
        [Route("serie")]
        [Filters.Aluno]
        public List<DisciplinaTicketModel> GetDisciplinaTicket()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAluno aluno = new cAluno().AbrirPorToken(perfil.Aluno.token);

            List<DisciplinaTicketModel> disciplinas = new List<DisciplinaTicketModel>();

            cDisciplina disciplina = new cDisciplina();
            foreach (var x in disciplina.ListarPorSerieTicket(aluno.cdSerie))
            {
                disciplinas.Add(new DisciplinaTicketModel()
                {
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina
                });
            };

            return disciplinas;
        }

        [HttpPost]
        [Route("iniciar")]
        [Filters.Aluno]
        public int CriarTicket([FromBody] PostTicketAlunoModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.cdTicketDepartamento == 3 && !(model.cdDisciplina >= 1))
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "É necessário selecionar uma disciplina!"));

                Perfil.TryGetPerfil(out Perfil perfil);
                int cdTicket = new cTicket().Salvar(0,
                    model.cdTicketDepartamento,
                    perfil.Aluno.cdAluno,
                    model.cdDisciplina,
                    DateTime.Now,
                    model.assunto,
                    (int)TicketStatus.ABERTO,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Aluno.cdempresa
                    );

                int cdTicketMensagem = new cTicketMensagem().Salvar(0,
                    cdTicket,
                    cTicketMensagem.OrigemAluno,
                    model.texto,
                    DateTime.Now,
                    perfil.Aluno.cdPessoa,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Aluno.cdempresa);


                if (model.anexos.Count > 0)
                {
                    foreach (Anexo arquivo in model.anexos)
                    {
                        string caminho = ConfigurationManager.AppSettings["strUploadAnexos"];
                        string extension = Path.GetExtension(arquivo.nome);
                        Arquivo file = new Arquivo(extension, Convert.FromBase64String(arquivo.base64));
                        // menor que 10 MB
                        if (file.Length <= 10485760)
                        {
                            string fileName;
                            do
                            {
                                fileName = Texto.GerarNomeAleatorio(20, cDados.Possibilidade.LetraMaiuscula, cDados.Possibilidade.LetraMinuscula, cDados.Possibilidade.Numeros) + extension;
                            } while (Directory.Exists(caminho + fileName));

                            file.Salvar(caminho, fileName);

                            new cTicketAnexo().Salvar(0,
                                cdTicketMensagem,
                                fileName,
                                arquivo.nome,
                                HttpContext.Current.Request.UserHostAddress,
                                -1,
                                perfil.Aluno.cdempresa);
                        }
                    }
                }

                return cdTicket;
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Requisição inválida."));
        }

        [HttpPost]
        [Route("enviarmensagem")]
        [Filters.Aluno]
        public void EnviarMensagem([FromBody] PostTicketMensagemModel model)
        {
            if (ModelState.IsValid)
            {
                Perfil.TryGetPerfil(out Perfil perfil);

                int cdTicketMensagem = new cTicketMensagem().Salvar(0,
                    model.cdTicket,
                    cTicketMensagem.OrigemAluno,
                    model.texto,
                    DateTime.Now,
                    perfil.Aluno.cdPessoa,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Aluno.cdempresa);


                if (model.anexos.Count > 0)
                {
                    foreach (Anexo arquivo in model.anexos)
                    {
                        string caminho = ConfigurationManager.AppSettings["strUploadAnexos"];
                        string extension = Path.GetExtension(arquivo.nome);
                        Arquivo file = new Arquivo(extension, Convert.FromBase64String(arquivo.base64));
                        // menor que 10 MB
                        if (file.Length <= 10485760)
                        {
                            string fileName;
                            do
                            {
                                fileName = Texto.GerarNomeAleatorio(20, cDados.Possibilidade.LetraMaiuscula, cDados.Possibilidade.LetraMinuscula, cDados.Possibilidade.Numeros) + extension;
                            } while (Directory.Exists(caminho + fileName));

                            file.Salvar(caminho, fileName);

                            new cTicketAnexo().Salvar(0,
                                cdTicketMensagem,
                                fileName,
                                arquivo.nome,
                                HttpContext.Current.Request.UserHostAddress,
                                -1,
                                perfil.Aluno.cdempresa);
                        }
                    }
                }

                return;
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Requisição inválida."));
        }

        [HttpGet]
        [Route("finalizar/{cdTicket}")]
        [Filters.Aluno]
        public void finalizarTicket(int cdTicket)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            
            new cTicketMensagem().Salvar(0,
                    cdTicket,
                    cTicketMensagem.OrigemAluno,
                    "TICKET FINALIZADO",
                    DateTime.Now,
                    perfil.Aluno.cdPessoa,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Aluno.cdempresa);

            new cTicket().Finalizar(cdTicket, perfil.Aluno.cdPessoa, HttpContext.Current.Request.UserHostAddress, -1, perfil.Aluno.cdempresa);
            return;
        }
    }
}