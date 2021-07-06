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

namespace api.Controllers
{
    public partial class TicketController : ApiController
    {
        [HttpGet]
        [Route("profAbertos")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Consultar)]
        public List<TicketModel> GetTicketsAbertosProf()
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<TicketModel> tickets = new cTicket()
                .ListarTicketsProfessorChat($"T.CDTICKETDEPARTAMENTO = 3 AND DP.CDPESSOA = " + perfil.Professor.cdPessoa + $" AND T.IDATIVO = 1 AND T.STATUS = {(int)TicketStatus.ABERTO} ")
                .Select(x => new TicketModel(x)).ToList();
            return tickets;
        }

        [HttpGet]
        [Route("profConcluidos")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Consultar)]
        public List<TicketModel> GetTicketsConcluidoProf()
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<TicketModel> tickets = new cTicket()
                .ListarTicketsProfessorChat($"T.IDATIVO = 1 AND T.STATUS = {(int)TicketStatus.CONCLUIDO} AND T.CDTICKETDEPARTAMENTO = 3 AND DP.CDPESSOA = " + perfil.Professor.cdPessoa)
                .Select(x => new TicketModel(x)).ToList();
            return tickets;
        }

        [HttpGet]
        [Route("profMensagens/{cdTicket}")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Consultar)]
        public List<TicketMensagemAnexosModel> GetMensagensTicketProf(int cdTicket)
        {
            List<TicketMensagemAnexosModel> mensagens =
                new cTicketMensagem().Listar("T.IDATIVO = 1 AND T.CDTICKET = " + cdTicket).Select(x => new TicketMensagemAnexosModel(x)).ToList();
            int[] codigosMensagens = mensagens.Select(x => x.cdTicketMensagem).ToArray();

            List<TicketAnexoModel> anexos = new cTicketAnexo().ListarPorMensagensTicket(codigosMensagens).Select(x => new TicketAnexoModel(x)).ToList();
            TicketMensagemAnexosModel mol = mensagens.FirstOrDefault(x => x.cdPessoa != null);
            int cdMat = 0;

            if (mol != null)
            {
                cdMat = cMatriculaAtiva.forPessoa(mensagens.FirstOrDefault(x => x.cdPessoa != null)?.cdPessoa ?? 0)?.cdMatricula ?? 0;
            }

            foreach (var anexo in anexos)
            {
                TicketMensagemAnexosModel msg = mensagens.FirstOrDefault(x => x.cdTicketMensagem == anexo.cdTicketMensagem);
                mensagens.Add(new TicketMensagemAnexosModel()
                {
                    cdTicketMensagem = msg.cdTicketMensagem,
                    cdPessoa = msg.cdPessoa,
                    cdUsuario = msg.cdUsuario,
                    cdTicket = msg.cdTicket,
                    dtHrMsg = msg.dtHrMsg,
                    nmPessoa = msg.nmPessoa,
                    origem = msg.origem,
                    texto = anexo.nmOriginal,
                    cdTicketAnexo = anexo.cdTicketAnexo,
                    linkAnexo = ConfigurationManager.AppSettings["linkAnexos"] + anexo.nmArquivo
                });
            }
            mensagens.ForEach(x => x.cdMatricula = cdMat);
            mensagens = mensagens.OrderBy(x => x.dtHrMsg).ToList();

            return mensagens;
        }

        [HttpPost]
        [Route("profEnviarMensagem")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Incluir)]
        public void EnviarMensagemProf([FromBody] PostTicketMensagemModel model)
        {
            if (ModelState.IsValid)
            {
                Perfil.TryGetPerfil(out Perfil perfil);

                int cdTicketMensagem = new cTicketMensagem().Salvar(0,
                    model.cdTicket,
                    cTicketMensagem.OrigemDestinatario,
                    model.texto,
                    DateTime.Now,
                    perfil.Professor.cdPessoa,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Professor.cdempresa);


                if (model.anexos.Count > 0)
                {
                    string caminho = ConfigurationManager.AppSettings["strUploadAnexos"];
                    foreach (Anexo arquivo in model.anexos)
                    {
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
                                perfil.Professor.cdempresa);
                        }
                    }
                }

                return;
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Requisição inválida."));
        }

        [HttpGet]
        [Route("profPegarArquivo/{cdTicketAnexo}")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Consultar)]
        public HttpResponseMessage GetFileProf(int cdTicketAnexo)
        {
            cTicketAnexo ticketAnexo = new cTicketAnexo().Abrir(cdTicketAnexo);
            string caminho = HttpContext.Current.Server.MapPath("~/Anexos/");

            byte[] fileBytes = File.ReadAllBytes(caminho + ticketAnexo.nmArquivo);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(fileBytes)
            };

            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = ticketAnexo.nmOriginal
                };

            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");

            return result;
        }

        [HttpGet]
        [Route("finalizarProf/{cdTicket}")]
        [Filters.Professor(Filters.Programa.ticket, TipoAcesso.Editar)]
        public void finalizarTicketProf(int cdTicket)
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            new cTicketMensagem().Salvar(0,
                    cdTicket,
                    cTicketMensagem.OrigemDestinatario,
                    "TICKET FINALIZADO",
                    DateTime.Now,
                    perfil.Professor.cdPessoa,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    perfil.Professor.cdempresa);

            new cTicket().Finalizar(cdTicket, perfil.Professor.cdPessoa, HttpContext.Current.Request.UserHostAddress, -1, perfil.Professor.cdempresa);
            return;
        }
    }
}