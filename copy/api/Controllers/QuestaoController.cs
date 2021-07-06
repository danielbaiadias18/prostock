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
using System.Text.RegularExpressions;
using System.Threading;
using System.Transactions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/questao")]
    public class QuestaoController : ApiController
    {
        private cDados.cProfessor _usuario = null;
        public cDados.cProfessor Usuario
        {
            get
            {
                if (_usuario == null && ((api.Filters.Perfil)Thread.CurrentPrincipal.Identity).Professor.cdProfessor > 0)
                {
                    _usuario = new cDados.cProfessor();
                    _usuario = _usuario.Abrir(((api.Filters.Perfil)Thread.CurrentPrincipal.Identity).Professor.cdProfessor);
                }

                return _usuario;
            }
        }
        public int cdUsuario { get => Usuario != null ? Usuario.cdProfessor : 0; }

        cUsuarios cusu = new cUsuarios();

        private readonly Regex tagImg = new Regex("<img.*?src=\"(.*?)\"[^\\>]+>");

        [HttpGet]
        [Route("{cdQuestao}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public QuestaoModel Get(int cdQuestao)
        {
            cQuestao questao = new cQuestao().Abrir(cdQuestao);
            List<cQuestaoTopico> topicos = new cQuestaoTopico().Listar("cdQuestao", cdQuestao);
            List<cQuestaoSubTopico> subTopicos = new cQuestaoSubTopico().Listar("cdQuestao", cdQuestao);

            if (questao == null) throw new HttpResponseException(HttpStatusCode.NotFound);

            return new QuestaoModel()
            {
                cdQuestao = questao.cdQuestao,
                cdQuestaoTipo = questao.cdQuestaoTipo,
                nmQuestaoTipo = questao.nmQuestaoTipo,
                cdAreaConhecimento = questao.cdAreaConhecimento,
                nmAreaConhecimento = questao.nmAreaConhecimento,
                cdSerie = questao.cdSerie,
                nmSerie = questao.nmSerie,
                cdDisciplina = questao.cdDisciplina,
                nmDisciplina = questao.nmDisciplina,
                cdHabilidade = questao.cdHabilidade,
                cdCompetencia = questao.cdCompetencia,
                nmCompetencia = questao.nmCompetencia,
                cdDificuldade = questao.cdDificuldade,
                nmDificuldade = questao.nmDificuldade,
                cdTopico = topicos.Select(x => x.cdTopico),
                dsComando = questao.dsComando,
                dsSuporte = questao.dsSuporte,
                imgComando = questao.imgComando,
                imgSuporte = questao.imgSuporte,
                cdSubTopico = subTopicos.Select(x => x.cdSubTopico),
                cdUsuarioInc = questao.cdUsuarioInc,
                cdProfessorResponsavel = questao.cdProfessorResponsavel,
                idAtivo = questao.idativo,
                cdOrigem = questao.cdOrigem,
                ano = questao.ano,
                comentario = questao.comentario,
                refComando = questao.refComando,
                refSuporte = questao.refSuporte
            };
        }

        public string RemoverTagsHtml(string text)
        {
            return tagImg.Replace(text, string.Empty);
        }

        [HttpGet]
        [Route("detalhado/{cdQuestao}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public QuestaoModel GetDetalhado(int cdQuestao)
        {
            cQuestao questao = new cQuestao().AbrirDetalhado(cdQuestao);
            List<cQuestaoTopico> topicos = new cQuestaoTopico().Listar("cdQuestao", cdQuestao);
            List<cQuestaoSubTopico> subTopicos = new cQuestaoSubTopico().Listar("cdQuestao", cdQuestao);

            if (questao == null) throw new HttpResponseException(HttpStatusCode.NotFound);

            return new QuestaoModel()
            {
                cdQuestao = questao.cdQuestao,
                cdQuestaoTipo = questao.cdQuestaoTipo,
                nmQuestaoTipo = questao.nmQuestaoTipo,
                cdAreaConhecimento = questao.cdAreaConhecimento,
                nmAreaConhecimento = questao.nmAreaConhecimento,
                cdSerie = questao.cdSerie,
                nmSerie = questao.nmSerie,
                cdDisciplina = questao.cdDisciplina,
                nmDisciplina = questao.nmDisciplina,
                cdHabilidade = questao.cdHabilidade,
                cdDificuldade = questao.cdDificuldade,
                nmDificuldade = questao.nmDificuldade,
                cdTopico = topicos.Select(x => x.cdTopico),
                dsComando = questao.dsComando,
                dsSuporte = questao.dsSuporte,
                imgComando = questao.imgComando,
                imgSuporte = questao.imgSuporte,
                cdSubTopico = subTopicos.Select(x => x.cdSubTopico),
                cdUsuarioInc = questao.cdUsuarioInc,
                cdProfessorResponsavel = questao.cdProfessorResponsavel,
                idAtivo = questao.idativo
            };
        }


        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<QuestaoModel> Get()
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();

            string dump;
            cQuestao quest = new cQuestao();
            foreach (var x in quest.Listar())
            {
                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    nmDificuldade = x.nmDificuldade,
                    //cdTopico = x.cdTopico,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = tagImg.IsMatch(x.dsComando.ToLower()),
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = tagImg.IsMatch(x.dsSuporte.ToLower()),
                    status = string.IsNullOrEmpty(x.status) ? "Não Validada" : x.status,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo,
                    cdQuestaoStatus = x.cdQuestaoStatus
                });

            };


            return questoes;
        }

        [HttpPost]
        [Route("portrilha")]
        public List<QuestaoModel> GetByTrilha([FromBody] GetByTrilhaModel model)
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();

            string dump;
            cQuestao quest = new cQuestao();
            string sql = " Q.CDDISCIPLINA IN ("+ string.Join(" ,", model.disciplinas.ConvertAll(x=> x.ToString())) + ") " +
                    "AND Q.CDSERIE = " + model.cdSerie + " AND T.CDAREACONHECIMENTO = " + model.cdAreaConhecimento + " AND T.IDATIVO = 1";

            foreach (var x in quest.ListarAprovados(sql))
            {
                var lista = new cQuestaoAlternativa().getLista(x.cdQuestao);

                var alternativas = lista.Select(y => new AlternativaModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoAlternativa = y.cdQuestaoAlternativa,
                    correta = y.IscorretaNull() ? false : y.correta,
                    dsAlternativa1 = y.IsdsAlternativa1Null() ? null : y.dsAlternativa1,
                    dsAlternativa2 = y.IsdsAlternativa2Null() ? null : y.dsAlternativa2,
                    imgAlternativa1 = y.IsimgAlternativa1Null() ? false : y.imgAlternativa1,
                    imgAlternativa2 = y.IsimgAlternativa2Null() ? false : y.imgAlternativa2,
                    justificativa = y.IsjustificativaNull() ? null : y.justificativa
                }).ToList();

                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                    cdDisciplina = x.cdDisciplina,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    nmSerie = x.nmSerie,
                    nmDisciplina = x.nmDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    nmDificuldade = x.nmDificuldade,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = tagImg.IsMatch(x.dsComando.ToLower()),
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = tagImg.IsMatch(x.dsSuporte.ToLower()),
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    Alternativas = alternativas,
                    idAtivo = x.idativo,
                });
                
            };


            return questoes;
        }

        [HttpGet]
        [Route("aprovados")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<QuestaoModel> GetQuestoesAprovadas()
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();

            string dump;
            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarAprovados())
            {
                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    nmDificuldade = x.nmDificuldade,
                    //cdTopico = x.cdTopico,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = tagImg.IsMatch(x.dsComando.ToLower()),
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = tagImg.IsMatch(x.dsSuporte.ToLower()),
                    //cdSubTopico = x.cdSubTopico,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo,
                });

            };


            return questoes;
        }

        private string UploadAllBase64(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return input;

            var imgs = new Regex("<img.*?>").Matches(input);
            Regex srcRegex = new Regex("src=\"(.*?)\"");

            foreach (Match mat in imgs)
            {
                string src = srcRegex.Match(mat.Value).Value.Replace("src=", null);
                if (src.ToLower().Contains("base64"))
                {
                    string[] param = src.Replace("\"", "").Split(',', ';');
                    for (int i = 0; i < param.Length; i++)
                        param[i] = param[i].Trim();

                    string nomeArquivo = TextoModel.GerarNomeAleatorio(8, Models.Possibilidade.LetraCamelCase, Models.Possibilidade.Numeros) + ".png";
                    while (File.Exists(ConfigurationManager.AppSettings["uploadFisico"] + nomeArquivo)) nomeArquivo = TextoModel.GerarNomeAleatorio(8, Models.Possibilidade.LetraCamelCase, Models.Possibilidade.Numeros) + ".png";

                    File.WriteAllBytes(ConfigurationManager.AppSettings["uploadFisico"] + nomeArquivo, Convert.FromBase64String(param[param.Length - 1]));
                    input = input.Replace(mat.Value, string.Format("<img src=\"{0}\" />", ConfigurationManager.AppSettings["uploadVirtual"] + nomeArquivo));
                }
            }

            return input;
        }

        [HttpPost]
        [Route("filtroQuestao")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<QuestaoModel> FiltroQuestao(FiltroQuestao filtroQuestaoModel)
        {
            cQuestao questao = new cQuestao();
            List<cQuestao.Join> joins = new List<cQuestao.Join>();

            string where = " where 1 = 1 ";

            if (filtroQuestaoModel.cdQuestaoTipo > 0)
                where += " and qt.cdQuestaoTipo = " + filtroQuestaoModel.cdQuestaoTipo;

            if (filtroQuestaoModel.cdSerie > 0)
                where += " and ser.cdSerie = " + filtroQuestaoModel.cdSerie;

            if (filtroQuestaoModel.cdAreaConhecimento > 0)
                where += " and t.cdAreaConhecimento = " + filtroQuestaoModel.cdAreaConhecimento;

            if (filtroQuestaoModel.cdDisciplina > 0)
                where += " and dis.cdDisciplina = " + filtroQuestaoModel.cdDisciplina;

            if (filtroQuestaoModel.cdTopico > 0)
            {
                joins.Add(new cQuestao.Join(cQuestao.TipoJoin.Inner, "qc", "tbNEG_QuestaoTopico", "qc.cdQuestao = q.cdQuestao"));
                joins.Add(new cQuestao.Join(cQuestao.TipoJoin.Inner, "c", "tbNEG_Topico", "qc.cdTopico = c.cdTopico"));
                where += " and c.cdTopico = " + filtroQuestaoModel.cdTopico;
            }

            if (filtroQuestaoModel.cdHabilidade > 0)
            {
                joins.Add(new cQuestao.Join(cQuestao.TipoJoin.Inner, "h", "tbNeg_Habilidade", "q.cdHabilidade = h.cdHabilidade"));
                where += " and h.cdHabilidade = " + filtroQuestaoModel.cdHabilidade;
            }

            if (filtroQuestaoModel.cdSubTopico > 0)
            {
                joins.Add(new cQuestao.Join(cQuestao.TipoJoin.Inner, "qsc", "tbNEG_QuestaoSubTopico", "qsc.cdQuestao = q.cdQuestao"));
                joins.Add(new cQuestao.Join(cQuestao.TipoJoin.Inner, "sc", "tbNEG_SubTopico", "qsc.cdSubTopico = sc.cdSubTopico"));
                where += " and sc.cdSubTopico = " + filtroQuestaoModel.cdSubTopico;
            }

            if (filtroQuestaoModel.cdDificuldade > 0)
                where += " and dif.cdDificuldade = " + filtroQuestaoModel.cdDificuldade;

            if (filtroQuestaoModel.cdUsuario > 0)
                where += " and q.cdUsuarioInc = " + filtroQuestaoModel.cdUsuario;

            if (filtroQuestaoModel.cdProfessor > 0)
                where += " and q.cdProfessorResponsavel = " + filtroQuestaoModel.cdProfessor;

            if (filtroQuestaoModel.cdPesquisarEm > 0 && !string.IsNullOrWhiteSpace(filtroQuestaoModel.txtPesquisa))
                where += " and " + (filtroQuestaoModel.cdPesquisarEm == 1 ? "q.cdQuestao" : "q.dsSuporte") + " like '%" + filtroQuestaoModel.txtPesquisa + "%' ";

            where += " and Q.CDQUESTAOSTATUS = 5 ";

            List<cQuestao> questoes = questao.ListarPorPesquisa(joins, where);

            string dump;
            return questoes.Select(x => new QuestaoModel()
            {
                cdQuestao = x.cdQuestao,
                nmQuestaoTipo = x.nmQuestaoTipo,
                nmAreaConhecimento = x.nmAreaConhecimento,
                nmSerie = x.nmSerie,
                cdDisciplina = x.cdDisciplina,
                nmDisciplina = x.nmDisciplina,
                cdDificuldade = x.cdDificuldade,
                nmDificuldade = x.nmDificuldade,
                dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                imgComando = tagImg.IsMatch(x.dsComando.ToLower()),
                dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                imgSuporte = tagImg.IsMatch(x.dsSuporte.ToLower()),
                idAtivo = x.idAtivo,
            }).ToList();
        }

        [HttpGet]
        [Route("tipos")]
        [ProfessorAutenticado]
        public List<QuestaoTipoModel> QuestaoTipos()
        {
            List<QuestaoTipoModel> tipos = new List<QuestaoTipoModel>();

            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarQuestaoTipo())
            {
                tipos.Add(new QuestaoTipoModel()
                {
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                });
            };

            return tipos;
        }

        [HttpGet]
        [Route("dificuldade")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<DificuldadeModel> Dificuldades()
        {
            List<DificuldadeModel> dificuldades = new List<DificuldadeModel>();

            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarDificuldades())
            {
                dificuldades.Add(new DificuldadeModel()
                {
                    cdDificuldade = x.cdDificuldade,
                    nmDificuldade = x.nmDificuldade
                });
            };

            return dificuldades;
        }

        [HttpGet]
        [Route("origem")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<OrigemModel> Origens()
        {
            List<OrigemModel> origens = new List<OrigemModel>();

            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarOrigens())
            {
                origens.Add(new OrigemModel()
                {
                    cdOrigem = x.cdOrigem,
                    nmOrigem = x.nmOrigem
                });
            };

            return origens;
        }

        [HttpPut]
        [Route("salvarreferencia")]
        public string SalvarReferenciaQuestao([FromBody]Models.Referencia referencia)
        {
            string erro_banco = new cQuestao().SalvarReferencia(referencia.cdQuestao, referencia.referencia);
            return erro_banco;
        }

        [HttpDelete]
        [Route("{cdQuestao}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Excluir)]
        public void Delete(int cdQuestao)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cQuestao questao = new cQuestao().Abrir(cdQuestao);
            if (questao == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            string Erro_Banco_Ativar = questao.trocaidativo(cdQuestao, !questao.idAtivo, perfil.Professor.nucomputador, perfil.Professor.cdProfessor);
            if (!string.IsNullOrWhiteSpace(Erro_Banco_Ativar))
                throw new Exception(Erro_Banco_Ativar);
        }

        [HttpGet]
        [Route("getLastId")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public int GetLastId()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            int cd = Convert.ToInt32(new cQuestao().getLastID("tbNEG_Questao", "cdQuestao", "cdUsuarioInc = " + perfil.Professor.cdProfessor));
            return cd;
        }


        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Incluir | TipoAcesso.Editar)]
        public string Post(QuestaoModel questao)
        {
            if (ModelState.IsValid)
            {
                Perfil.TryGetPerfil(out Perfil perfil);

                cQuestao quest = new cQuestao()
                {
                    cdQuestao = questao.cdQuestao,
                    cdQuestaoTipo = questao.cdQuestaoTipo,
                    cdAreaConhecimento = questao.cdAreaConhecimento,
                    cdSerie = questao.cdSerie,
                    cdDisciplina = questao.cdDisciplina,
                    cdHabilidade = questao.cdHabilidade,
                    cdCompetencia = questao.cdCompetencia,
                    cdDificuldade = questao.cdDificuldade,
                    cdTopico = questao.cdTopico.First(),
                    cdSubTopico = questao.cdSubTopico.First(),
                    cdProfessorResponsavel = questao.cdProfessorResponsavel,
                    dsComando = questao.dsComando,
                    dsSuporte = questao.dsSuporte,
                    imgComando = questao.imgComando,
                    imgSuporte = questao.imgSuporte,
                    ano = questao.ano,
                    comentario = questao.comentario,
                    cdOrigem = questao.cdOrigem,
                    refSuporte = questao.refSuporte,
                    refComando = questao.refComando,
                    cdempresa = questao.cdEmpresa
                };

                string res = quest.Salvar(
                    quest.cdQuestao > 0 ? quest.cdQuestao.ToString() : null,
                    quest.cdQuestaoTipo.ToString(),
                    quest.cdAreaConhecimento.ToString(),
                    quest.cdSerie.ToString(),
                    quest.cdDisciplina.ToString(),
                    quest.cdHabilidade.ToString(),
                    quest.cdCompetencia.ToString(),
                    quest.cdDificuldade == 0 ? null : questao.cdDificuldade.ToString(),
                    quest.cdTopico.ToString(),
                    quest.cdSubTopico > 0 ? quest.cdSubTopico.ToString() : null,
                    quest.cdProfessorResponsavel == 0 ? null : quest.cdProfessorResponsavel.ToString(),
                    quest.dsComando,
                    quest.dsSuporte,
                    quest.imgComando,
                    quest.imgSuporte,
                    quest.ano,
                    quest.comentario,
                    quest.cdOrigem,
                    quest.refSuporte,
                    quest.refComando,
                    HttpContext.Current.Request.UserHostAddress,
                    perfil.Professor.cdProfessor,
                    quest.cdempresa,
                    perfil.Professor.cdProfessor.ToString()
                   );

                List<cQuestaoTopico> topicos;
                List<cQuestaoSubTopico> subTopicos;

                //FormType 1
                if (questao.Alternativas != null && questao.Alternativas.Count > 0)
                    if (res == null && quest.cdQuestao <= 0)
                    {
                        quest.cdQuestao = Convert.ToInt32(quest.getLastID("tbNEG_Questao", "cdQuestao", "cdUsuarioAlt = " + perfil.Professor.cdProfessor));

                        dtsQuestao.dtQuestaoAlternativaDataTable qadt = cQuestaoAlternativa.ToDataSet(questao.Alternativas.Select(x => new cQuestaoAlternativa()
                        {
                            cdQuestaoAlternativa = x.cdQuestaoAlternativa,
                            correta = x.correta,
                            dsAlternativa1 = UploadAllBase64(x.dsAlternativa1),
                            dsAlternativa2 = UploadAllBase64(x.dsAlternativa2),
                            imgAlternativa1 = x.imgAlternativa1,
                            imgAlternativa2 = x.imgAlternativa2,
                            justificativa = x.justificativa ?? ""
                        }).ToList());

                        res = new cQuestaoAlternativa().adicionar(
                            quest.cdQuestao,
                            qadt,
                            perfil.Professor.nucomputador,
                            perfil.Professor.cdProfessor,
                            questao.cdEmpresa);

                        new cQuestaoTopico().Salvar("cdQuestao",
                           quest.cdQuestao,
                           questao.cdTopico.Select(x => new cQuestaoTopico() { cdTopico = x }).ToList(),
                           HttpContext.Current.Request.UserHostAddress,
                           perfil.Professor.cdUsuarioVinculado,
                           questao.cdEmpresa);

                        new cQuestaoSubTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            questao.cdSubTopico.Select(x => new cQuestaoSubTopico() { cdSubTopico = x }).ToList(),
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);
                    }
                    else
                    {
                        //quest.cdQuestao = Convert.ToInt32(quest.getLastID("tbNEG_Questao", "cdQuestao", "cdUsuarioAlt = " + perfil.Professor.cdProfessor));

                        topicos = new cQuestaoTopico().Listar("cdQuestao", questao.cdQuestao);
                        subTopicos = new cQuestaoSubTopico().Listar("cdQuestao", questao.cdQuestao);

                        dtsQuestao.dtQuestaoAlternativaDataTable qadt = cQuestaoAlternativa.ToDataSet(questao.Alternativas.Select(x => new cQuestaoAlternativa()
                        {
                            cdQuestao = x.cdQuestao,
                            cdQuestaoAlternativa = x.cdQuestaoAlternativa,
                            correta = x.correta,
                            dsAlternativa1 = UploadAllBase64(x.dsAlternativa1),
                            dsAlternativa2 = UploadAllBase64(x.dsAlternativa2),
                            imgAlternativa1 = x.imgAlternativa1,
                            imgAlternativa2 = x.imgAlternativa2,
                            justificativa = x.justificativa ?? ""
                        }).ToList());

                        res = new cQuestaoAlternativa().atualiza(
                            quest.cdQuestao,
                            qadt,
                            perfil.Professor.nucomputador,
                            perfil.Professor.cdProfessor,
                            perfil.Professor.cdempresa);

                        var excecoes = questao.cdTopico.Except(topicos.Select(x => x.cdTopico));
                        topicos.AddRange(excecoes.Select(x => new cQuestaoTopico() { cdTopico = x }));
                        topicos.RemoveAll(x => !questao.cdTopico.Any(y => y == x.cdTopico));
                        new cQuestaoTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            topicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);

                        excecoes = questao.cdSubTopico.Except(subTopicos.Select(x => x.cdSubTopico));
                        subTopicos.AddRange(excecoes.Select(x => new cQuestaoSubTopico() { cdSubTopico = x }));
                        subTopicos.RemoveAll(x => !questao.cdSubTopico.Any(y => y == x.cdSubTopico));
                        new cQuestaoSubTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            subTopicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);
                    }
                else
                {
                    if (res == null && quest.cdQuestao <= 0)
                    {
                        quest.cdQuestao = Convert.ToInt32(quest.getLastID("tbNEG_Questao", "cdQuestao", "cdUsuarioAlt = " + perfil.Professor.cdProfessor));

                        new cQuestaoTopico().Salvar("cdQuestao",
                           quest.cdQuestao,
                           questao.cdTopico.Select(x => new cQuestaoTopico() { cdTopico = x }).ToList(),
                           HttpContext.Current.Request.UserHostAddress,
                           perfil.Professor.cdUsuarioVinculado,
                           questao.cdEmpresa);

                        new cQuestaoSubTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            questao.cdSubTopico.Select(x => new cQuestaoSubTopico() { cdSubTopico = x }).ToList(),
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);
                    }
                    else
                    {
                        topicos = new cQuestaoTopico().Listar("cdQuestao", questao.cdQuestao);
                        subTopicos = new cQuestaoSubTopico().Listar("cdQuestao", questao.cdQuestao);

                        var excecoes = questao.cdTopico.Except(topicos.Select(x => x.cdTopico));
                        topicos.AddRange(excecoes.Select(x => new cQuestaoTopico() { cdTopico = x }));
                        topicos.RemoveAll(x => !questao.cdTopico.Any(y => y == x.cdTopico));
                        new cQuestaoTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            topicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);

                        excecoes = questao.cdSubTopico.Except(subTopicos.Select(x => x.cdSubTopico));
                        subTopicos.AddRange(excecoes.Select(x => new cQuestaoSubTopico() { cdSubTopico = x }));
                        subTopicos.RemoveAll(x => !questao.cdSubTopico.Any(y => y == x.cdSubTopico));
                        new cQuestaoSubTopico().Salvar("cdQuestao",
                            quest.cdQuestao,
                            subTopicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            questao.cdEmpresa);

                    }
                }
                return res;
            }
            else
            {
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        [HttpGet]
        [Route("disciplina/{cdDisciplina}/avaliacao/{cdAvaliacao}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<QuestaoModel> QuestoesPorDisciplina(int cdDisciplina, int cdAvaliacao)
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();
            string dump;
            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarPorDisciplina(cdDisciplina, cdAvaliacao))
            {
                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    cdSerie = x.cdSerie,
                    cdDisciplina = x.cdDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    //cdTopico = x.cdTopico,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = x.imgComando,
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = x.imgSuporte,
                    //cdSubTopico = x.cdSubTopico,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    nmSerie = x.nmSerie,
                    nmDisciplina = x.nmDisciplina,
                    nmDificuldade = x.nmDificuldade
                });
            };

            return questoes;
        }

        [HttpGet]
        [Route("avaliacao/{cdAvaliacao}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<QuestaoModel> QuestoesPorAvaliacao(int cdAvaliacao)
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();
            string dump;

            cQuestao quest = new cQuestao();
            foreach (var x in quest.ListarPorAvaliacao(cdAvaliacao))
            {
                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    cdSerie = x.cdSerie,
                    cdDisciplina = x.cdDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    //cdTopico = x.cdTopico,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = x.imgComando,
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = x.imgSuporte,
                    //cdSubTopico = x.cdSubTopico,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo
                });
            };

            return questoes;
        }

        [HttpGet]
        [Route("avaliacaoUtilizada/{cdQuestao}/agrupar/{agrupar}")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public List<cDados.AvaliacaoUtilizadaModel> AvaliacoesUtilizadas(int cdQuestao, bool agrupar)
        {
            List<cDados.AvaliacaoUtilizadaModel> avaliacoesUtilizadas = new cQuestao().ListarAvaliacoesUtilizadas(cdQuestao, agrupar);
            return avaliacoesUtilizadas;
        }


        private Dictionary<int, int[]> perfis = new Dictionary<int, int[]>() {
                { 1, new int[] { 1,2,3,4,5 } }, //revisor e coordenador
                { 2, new int[] { 1,2,3 } }, //Revisor
                { 3, new int[] { 1,5,4 } },  //Coordenador
                { 4, new int[] { 1 } }  //Professor
            };

        [HttpGet]
        [Route("{cdQuestao}/status")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public object status(int cdQuestao)
        {
            cQuestao questao = new cQuestao().Abrir(cdQuestao);
            bool tramitar = false;

            switch (questao.cdQuestaoStatus)
            {
                default:
                case 1:
                    tramitar = Usuario.stRevisor;
                    break;
                case 2:
                    tramitar = Usuario.stCoordenador;
                    break;
                case 3:
                    tramitar = true;
                    break;
                case 4:
                    tramitar = true;
                    break;

            }

            var status = new cQuestaoStatus().Listar("idAtivo = 1");
            int cdPerfil = 0;

            if (Usuario.stRevisor && Usuario.stCoordenador)
            {
                cdPerfil = 1;
            }
            else if (Usuario.stRevisor)
            {
                cdPerfil = 2;
            }
            else if (Usuario.stCoordenador)
            {
                cdPerfil = 3;
            }
            else
            {
                cdPerfil = 4;
            }

            return new
            {
                tramitar,
                status = perfis[cdPerfil].Select(x => new QuestaoStatusModel(status.FirstOrDefault(y => y.cdQuestaoStatus == x)))
            };
        }

        [HttpGet]
        [Route("{cdQuestao}/tramitacoes")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Consultar)]
        public IEnumerable<QuestaoStatusHistorico> tramitacoes(int cdQuestao)
        {
            return new cQuestaoStatusHistorico().Listar($"T.cdQuestao = { cdQuestao } and T.idAtivo = 1 order by T.cdQuestaoStatusHistorico desc").Select(x => new QuestaoStatusHistorico(x));
        }

        [HttpPut]
        [Route("{cdQuestao}/tramitar")]
        [Filters.Professor(Filters.Programa.questao, TipoAcesso.Editar)]
        public IEnumerable<QuestaoStatusHistorico> tramitar(int cdQuestao, [FromBody] NovoQuestaoStatusHistorico historico)
        {
            if (ModelState.IsValid)
            {
                cQuestao questao = new cQuestao().Abrir(cdQuestao);
                bool tramitar;

                int cdPerfil;

                if (Usuario.stRevisor && Usuario.stCoordenador)
                {
                    cdPerfil = 1;
                }
                else if (Usuario.stRevisor)
                {
                    cdPerfil = 2;
                }
                else if (Usuario.stCoordenador)
                {
                    cdPerfil = 3;
                }
                else
                {
                    cdPerfil = 4;
                }

                switch (cdPerfil)
                {
                    default:
                    case 1:
                        tramitar = true;
                        break;
                    case 2:
                        tramitar = questao.cdQuestaoStatus == 1 || questao.cdQuestaoStatus == 2 || questao.cdQuestaoStatus == 3;
                        break;
                    case 3:
                        tramitar = questao.cdQuestaoStatus == 1 || questao.cdQuestaoStatus == 5 || questao.cdQuestaoStatus == 4;
                        break;
                    case 4:
                        tramitar = questao.cdQuestaoStatus == 1;
                        break;
                }

                if (!tramitar)
                    throw new HttpResponseException(ActionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, new Unauthorized(false)));

                if (!perfis[cdPerfil].Contains(historico.cdQuestaoStatus))
                    ModelState.AddModelError("historico.cdQuestaoStatus", "Você não tem permissão para alterar esta questão para o status solicitado.");
                else
                {
                    cQuestaoStatusHistorico inserido = new cQuestaoStatusHistorico();

                    using (TransactionScope scope = new TransactionScope())
                    {
                        inserido.cdQuestaoStatusHistorico =
                            inserido.Salvar(0,
                                inserido.cdQuestao = cdQuestao,
                                inserido.cdQuestaoStatus = historico.cdQuestaoStatus,
                                inserido.cdProfessor = Usuario.cdProfessor,
                                inserido.dissertacao = historico.dissertacao,
                                HttpContext.Current.Request.UserHostAddress,
                                Usuario.cdusuarioalt,
                                questao.cdempresa);

                        new cQuestao().MudarStatus(cdQuestao.ToString(),
                            inserido.cdQuestaoStatus,
                            HttpContext.Current.Request.UserHostAddress,
                            Usuario.cdProfessor,
                            questao.cdempresa,
                            Usuario.cdProfessor.ToString());

                        scope.Complete();
                    }

                    return tramitacoes(cdQuestao);
                }
            }

            throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
        }

        [HttpPost]
        [Route("trilha")]
        [Filters.Professor(Filters.Programa.trilha, TipoAcesso.Consultar)]
        public List<QuestaoModel> PostTrilha([FromBody]int[] cdsQuestao)
        {
            List<QuestaoModel> questoes = new List<QuestaoModel>();

            string dump;
            cQuestao quest = new cQuestao();

            if(cdsQuestao.Length > 0)
            foreach (var x in quest.Listar(" q.cdQuestao in (" + string.Join(",",cdsQuestao) + ")"))
            {
                questoes.Add(new QuestaoModel()
                {
                    cdQuestao = x.cdQuestao,
                    cdQuestaoTipo = x.cdQuestaoTipo,
                    nmQuestaoTipo = x.nmQuestaoTipo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    cdHabilidade = x.cdHabilidade,
                    cdDificuldade = x.cdDificuldade,
                    nmDificuldade = x.nmDificuldade,
                    //cdTopico = x.cdTopico,
                    dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgComando = tagImg.IsMatch(x.dsComando.ToLower()),
                    dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 101 ? dump.Substring(0, 100) : dump,
                    imgSuporte = tagImg.IsMatch(x.dsSuporte.ToLower()),
                    status = x.status,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo,
                    cdQuestaoStatus = x.cdQuestaoStatus
                });

            };


            return questoes;
        }

    }
}