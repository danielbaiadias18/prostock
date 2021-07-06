using cDados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using api.Models;
using System.Web;
using System.Web.Http.Cors;
using api.Filters;
using System.Transactions;
using System.Text.RegularExpressions;
using System.IO;
using System.Configuration;

namespace api.Controllers
{
    public partial class AvaliacaoController : ApiController
    {
        public List<AvaliacaoModel> Get()
        {
            List<AvaliacaoModel> avaliacoes = new List<AvaliacaoModel>();

            cAvaliacao aval = new cAvaliacao();
            foreach (var x in aval.ListarDetalhado())
            {
                avaliacoes.Add(new AvaliacaoModel()
                {

                    cdAvaliacao = x.cdAvaliacao,
                    cdAvaliacaoTipo = x.cdAvaliacaoTipo,
                    nmAvaliacaoTipo = x.nmAvaliacaoTipo,
                    cdAvaliacaoSubTipo = x.cdAvaliacaoSubTipo,
                    nmAvaliacao = x.nmAvaliacao,
                    cdStatus = x.cdStatus,
                    dtAplicacao = x.dtAplicacao,
                    valor = x.valor,
                    media = x.media,
                    cdEtapa = x.cdEtapa,
                    nmEtapa = x.nmEtapa,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSegmento = x.cdSegmento,
                    nmSegmento = x.nmSegmento,
                    qtdeValidacoes = x.qtdeValidacoes,
                    modoAplicacao = x.modoAplicacao,
                    resultado = x.resultado,
                    dtInicioAvaliacao = x.dtInicioAvaliacao,
                    dtFimAvaliacao = x.dtFimAvaliacao,
                    tempoAvaliacao = x.tempoAvaliacao,
                    exibirNota = x.exibirNota,
                    exibirRespostasEsperadas = x.exibirRespostasEsperadas,
                    senhaAcesso = x.senhaAcesso,
                    cdCriterio = x.cdCriterio,
                    regras = x.regras,
                    cdClassificacaoInformacao = x.cdClassificacaoInformacao,
                    disponibilizada = x.disponibilizada,
                    idAtivo = x.idAtivo,
                    verificaUso = x.verifUso,
                    nmStatus = x.nmStatus,
                    stTrilha = x.stTrilha
                });
            };

            return avaliacoes;
        }
        [HttpGet]
        [Route("{cdAvaliacao}")]
        public AvaliacaoModel Get(int cdAvaliacao)
        {
            cAvaliacao avaliacao = new cAvaliacao();
            cQuestao questao = new cQuestao();
            avaliacao.AbrirDetalhado(cdAvaliacao);
            AvaliacaoModel avaliacaoModel = new AvaliacaoModel
            {
                cdAvaliacao = avaliacao.cdAvaliacao,
                cdAvaliacaoTipo = avaliacao.cdAvaliacaoTipo,
                nmAvaliacaoTipo = avaliacao.nmAvaliacaoTipo,
                cdAvaliacaoSubTipo = avaliacao.cdAvaliacaoSubTipo,
                cdPeriodoLetivo = avaliacao.cdPeriodoLetivo,
                nmAvaliacao = avaliacao.nmAvaliacao,
                cdStatus = avaliacao.cdStatus,
                dtAplicacao = avaliacao.dtAplicacao,
                valor = avaliacao.valor,
                media = avaliacao.media,
                cdEtapa = avaliacao.cdEtapa,
                nmEtapa = avaliacao.nmEtapa,
                cdSerie = avaliacao.cdSerie,
                nmSerie = avaliacao.nmSerie,
                cdAreaConhecimento = avaliacao.cdAreaConhecimento,
                nmAreaConhecimento = avaliacao.nmAreaConhecimento,
                cdSegmento = avaliacao.cdSegmento,
                nmSegmento = avaliacao.nmSegmento,
                qtdeValidacoes = avaliacao.qtdeValidacoes,
                modoAplicacao = avaliacao.modoAplicacao,
                resultado = avaliacao.resultado,
                dtInicioAvaliacao = avaliacao.dtInicioAvaliacao,
                dtFimAvaliacao = avaliacao.dtFimAvaliacao == DateTime.MinValue ? DateTime.Now : avaliacao.dtFimAvaliacao,
                tempoAvaliacao = avaliacao.tempoAvaliacao,
                exibirNota = avaliacao.exibirNota,
                exibirRespostasEsperadas = avaliacao.exibirRespostasEsperadas,
                exibirRespostasAposFechamento = avaliacao.exibirRespostasAposFechamento,
                dtExibicaoRespostas = avaliacao.dtExibicaoRespostas,
                senhaAcesso = avaliacao.senhaAcesso,
                cdCriterio = avaliacao.cdCriterio,
                regras = avaliacao.regras,
                cdClassificacaoInformacao = avaliacao.cdClassificacaoInformacao,
                disponibilizada = avaliacao.disponibilizada,
                dsCriterio = avaliacao.dsCriterio,
                idAtivo = avaliacao.idAtivo,
                notasPorDisciplina = avaliacao.notasPorDisciplina,
                randomizarAlternativas = avaliacao.randomizarAlternativas,
                randomizarQuestoes = avaliacao.randomizarQuestoes,
                verificaUso = avaliacao.verificaUso(cdAvaliacao),
                stTrilha = avaliacao.stTrilha
            };

            cAvaliacaoDisciplina disciplina = new cAvaliacaoDisciplina();
            List<cAvaliacaoDisciplina> disciplinas = new List<cAvaliacaoDisciplina>();
            disciplinas = disciplina.ListarPorAvaliacao(cdAvaliacao);
            for (int i = 0; i < disciplinas.Count; i++)
            {
                avaliacaoModel.disciplinas += disciplinas[i].nmDisciplina;
                if (i != (disciplinas.Count - 1))
                    avaliacaoModel.disciplinas += ", ";
            }

            avaliacaoModel.AvaliacaoQuestaoModel = new List<AvaliacaoQuestaoModel>();

            cQuestaoAlternativa alternativa = new cQuestaoAlternativa();
            List<cQuestaoAlternativa> alternativas = new List<cQuestaoAlternativa>();
            alternativas = alternativa.ListarPorAvaliacao(cdAvaliacao);


            foreach (var x in questao.ListarPorAvaliacao(cdAvaliacao))
            {
                AvaliacaoQuestaoModel avQuestaoModel = new AvaliacaoQuestaoModel();
                avQuestaoModel.QuestaoModel = new QuestaoModel();

                avQuestaoModel.cdAvaliacaoQuestao = x.cdAvaliacaoQuestao;
                avQuestaoModel.ordem = x.ordem;
                avQuestaoModel.ordemDisciplina = x.ordemDisciplina;
                avQuestaoModel.valor = x.valor;

                avQuestaoModel.QuestaoModel.cdQuestao = x.cdQuestao;
                avQuestaoModel.QuestaoModel.cdQuestaoTipo = x.cdQuestaoTipo;
                avQuestaoModel.QuestaoModel.nmTipo = x.nmTipo;
                avQuestaoModel.QuestaoModel.cdAreaConhecimento = x.cdAreaConhecimento;
                avQuestaoModel.QuestaoModel.cdSerie = x.cdSerie;
                avQuestaoModel.QuestaoModel.cdDisciplina = x.cdDisciplina;
                avQuestaoModel.QuestaoModel.nmDisciplina = x.nmDisciplina;
                avQuestaoModel.QuestaoModel.cdHabilidade = x.cdHabilidade;
                avQuestaoModel.QuestaoModel.cdDificuldade = x.cdDificuldade;
                avQuestaoModel.QuestaoModel.dsComando = x.dsComando;
                avQuestaoModel.QuestaoModel.imgComando = x.imgComando;
                avQuestaoModel.QuestaoModel.dsSuporte = x.dsSuporte;
                avQuestaoModel.QuestaoModel.imgSuporte = x.imgSuporte;
                avQuestaoModel.QuestaoModel.cdUsuarioInc = x.cdUsuarioInc;
                avQuestaoModel.QuestaoModel.cdProfessorResponsavel = x.cdProfessorResponsavel;
                avQuestaoModel.QuestaoModel.idAtivo = x.idativo;

                if (alternativas != null)
                {
                    avQuestaoModel.QuestaoModel.Alternativas = alternativas.Select(y => new AlternativaModel()
                    {
                        cdQuestao = y.cdQuestao,
                        cdQuestaoAlternativa = y.cdQuestaoAlternativa,
                        correta = y.correta,
                        dsAlternativa1 = y.dsAlternativa1,
                        dsAlternativa2 = y.dsAlternativa2,
                        imgAlternativa1 = y.imgAlternativa1,
                        imgAlternativa2 = y.imgAlternativa2,
                        ordem = y.ordem

                    }).Where(y => y.cdQuestao == x.cdQuestao).ToList();

                    avQuestaoModel.QuestaoModel.Alternativas = avaliacao.randomizarAlternativas == true ? avQuestaoModel.QuestaoModel.Alternativas.OrderBy(item => new Random().Next()).ToList() : avQuestaoModel.QuestaoModel.Alternativas;
                }
                avaliacaoModel.AvaliacaoQuestaoModel.Add(avQuestaoModel);
            }

            return avaliacaoModel;
        }


        [HttpDelete]
        [Route("{cdAvaliacao}")]
        public void Delete(int cdAvaliacao)
        {
            cAvaliacao avaliacao = new cAvaliacao().AbrirAvaliacao(cdAvaliacao);
            if (avaliacao == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            string Erro_Banco_Ativar = avaliacao.trocaidativo(cdAvaliacao, !avaliacao.idAtivo, HttpContext.Current.Request.UserHostAddress, -1);
            if (!string.IsNullOrWhiteSpace(Erro_Banco_Ativar))
                throw new Exception(Erro_Banco_Ativar);
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
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Incluir | TipoAcesso.Editar)]
        public void Post([FromBody] AvaliacaoInputModel avaliacao)
        {
            if (ModelState.IsValid)
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    EnumModoAplicacao modoAplicacao = (EnumModoAplicacao)Convert.ToInt32(avaliacao.cdAvaliacaoTipo);

                    string erro_mensagem =
                           new cAvaliacao().Salvar(avaliacao.cdAvaliacao > 0 ? avaliacao.cdAvaliacao.ToString() : null,
                           avaliacao.cdAvaliacaoTipo.ToString(),
                           null,
                           avaliacao.cdPeriodoLetivo,
                           avaliacao.nmAvaliacao,
                           avaliacao.cdStatus.ToString(),
                           avaliacao.valor,
                           avaliacao.media,
                           avaliacao.cdEtapa.ToString(),
                           avaliacao.cdAreaConhecimento.ToString(),
                           avaliacao.cdSegmento.ToString(),
                           "1",
                           avaliacao.avaliacaoImpOuWeb ? 1 : 2,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Finalizar.cdTipoResultado : (int?)null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.TempoTentativa.qtdMinutos.ToString() : null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Finalizar.stExibirNota.ToString() : null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Finalizar.stExibirGabarito.ToString() : null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Executar.cdCriterio.ToString() : "3",
                           UploadAllBase64(avaliacao.dsRegras),
                           avaliacao.cdClassificacao.HasValue ? avaliacao.cdClassificacao.ToString() : "2",
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Quando.stHabilitada : false,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Executar.stEmbaralharQuestoes.ToString() : null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Executar.stEmbaralharAlternativas.ToString() : null,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.Finalizar.stDtExibir : false,
                           avaliacao.avaliacaoImpOuWeb && avaliacao.Finalizar.dtExibir.HasValue && DateTime.TryParse($"{ avaliacao.Finalizar.dtExibir.Value.ToString("dd/MM/yyyy") } { avaliacao.Finalizar.hrExibir }", out DateTime dtExibicao) ?
                                dtExibicao.ToString("yyyy-MM-dd HH:mm:ss") : null,
                           avaliacao.notasPorDisciplina,
                           avaliacao.avaliacaoImpOuWeb ? avaliacao.stTrilha : null,
                           HttpContext.Current.Request.UserHostAddress,
                           Usuario.cdProfessor,
                           avaliacao.cdEmpresa);

                    if (erro_mensagem == null)
                    {
                        #region Adicionar

                        if (avaliacao.cdAvaliacao == 0) //FormType = 1
                        {
                            int cdAvaliacao = Convert.ToInt32(new ARWEB.DataBase.cComum().getLastID("tbNEG_avaliacao", "cdAvaliacao", "cdusuarioalt = " + Usuario.cdProfessor).ToString());

                            //Nasce como Validada
                            new cAvaliacao().SalvarStatus(cdAvaliacao, 3);

                            #region Séries

                            erro_mensagem = new cAvaliacaoSerie().adicionar(cdAvaliacao,
                                avaliacao.cdSerie,
                                HttpContext.Current.Request.UserHostAddress,
                                Usuario.cdProfessor,
                                avaliacao.cdEmpresa);

                            #endregion

                            if (erro_mensagem == null)
                            {
                                #region Turmas

                                if (!(avaliacao.stTrilha ?? false))
                                {
                                    if (!avaliacao.avaliacaoImpOuWeb)
                                    {
                                        erro_mensagem = new cAvaliacaoTurma().adicionar(
                                            cdAvaliacao,
                                            avaliacao.cdTurma,
                                            HttpContext.Current.Request.UserHostAddress,
                                            Usuario.cdProfessor,
                                            avaliacao.cdEmpresa);
                                    }
                                    else
                                    {
                                        erro_mensagem = new cAvaliacaoTurma().adicionar(
                                            cdAvaliacao,
                                            AvaliacaoTurmaInputModel.fromModel(avaliacao.Turmas),
                                            HttpContext.Current.Request.UserHostAddress,
                                            Usuario.cdProfessor,
                                            avaliacao.cdEmpresa);
                                    }
                                }

                                #endregion

                                if (erro_mensagem == null)
                                {
                                    #region Disciplinas
                                    if (avaliacao.Disciplinas != null)
                                    {
                                        erro_mensagem = new cAvaliacaoDisciplina().adicionar(
                                            cdAvaliacao,
                                            AvaliacaoDisciplinaInputModel.fromModel(avaliacao.Disciplinas),
                                            HttpContext.Current.Request.UserHostAddress,
                                            Usuario.cdProfessor,
                                            avaliacao.cdEmpresa);
                                    }
                                    #endregion

                                }
                                else throw new Exception(erro_mensagem);
                            }
                            else throw new Exception(erro_mensagem);
                        }

                        #endregion

                        #region Atualizar

                        else //Editar
                        {
                            int cdAvaliacao = avaliacao.cdAvaliacao;

                            #region Série

                            erro_mensagem = new cAvaliacaoSerie().atualiza(
                                cdAvaliacao,
                                avaliacao.cdSerie,
                                HttpContext.Current.Request.UserHostAddress,
                                Usuario.cdProfessor,
                                avaliacao.cdEmpresa);

                            #endregion

                            if (erro_mensagem == null)
                            {
                                #region Turma

                                if (!avaliacao.avaliacaoImpOuWeb)
                                {
                                    erro_mensagem = new cAvaliacaoTurma().atualiza(
                                        cdAvaliacao,
                                        avaliacao.cdTurma,
                                        HttpContext.Current.Request.UserHostAddress,
                                        Usuario.cdProfessor,
                                        avaliacao.cdEmpresa);
                                }
                                else
                                {
                                    if (!(avaliacao.stTrilha ?? false))
                                    {
                                        erro_mensagem = new cAvaliacaoTurma().atualiza(
                                            cdAvaliacao,
                                            AvaliacaoTurmaInputModel.fromModel(avaliacao.Turmas),
                                            HttpContext.Current.Request.UserHostAddress,
                                            Usuario.cdProfessor,
                                            avaliacao.cdEmpresa);
                                    }
                                    else
                                    {
                                        erro_mensagem = new cAvaliacaoTurma().atualiza(
                                            cdAvaliacao,
                                            new dtsAvaliacao.dtTurmaDataTable(),
                                            HttpContext.Current.Request.UserHostAddress,
                                            Usuario.cdProfessor,
                                            avaliacao.cdEmpresa);
                                    }
                                }

                                #endregion

                                if (erro_mensagem == null)
                                {
                                    #region Disciplinas

                                    erro_mensagem = new cAvaliacaoDisciplina().atualiza(
                                        cdAvaliacao,
                                        AvaliacaoDisciplinaInputModel.fromModel(avaliacao.Disciplinas),
                                        HttpContext.Current.Request.UserHostAddress,
                                        Usuario.cdProfessor,
                                        avaliacao.cdEmpresa);

                                    #endregion

                                }
                                else
                                    throw new Exception(erro_mensagem);
                            }
                            else
                                throw new Exception(erro_mensagem);
                        }

                        #endregion
                    }
                    else
                        throw new Exception(erro_mensagem);

                    scope.Complete();
                }

            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
        }

    }

}