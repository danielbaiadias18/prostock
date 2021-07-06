using cDados;
using System;
using System.Collections.Generic;
using System.Data;
//using System.Data.Linq;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using api.Models;
using System.Web;
//using loginAdmGeral;
using System.Web.Http.Cors;
using api.Filters;
using System.Transactions;
using System.Threading;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/avaliacao")]
    public partial class AvaliacaoController : ApiController
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

        [HttpGet]
        [Route("tipos")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoTipoModel> TipoAvaliacao()
        {
            List<AvaliacaoTipoModel> tipos = new List<AvaliacaoTipoModel>();

            cAvaliacaoTipo tipo = new cAvaliacaoTipo();
            foreach (var x in tipo.Listar("idAtivo = 1"))
            {
                tipos.Add(new AvaliacaoTipoModel()
                {
                    cdAvaliacaoTipo = x.cdAvaliacaoTipo,
                    nmTipo = x.dsTipo

                });
            };

            return tipos;
        }

        [HttpGet]
        [Route("subtipos/{cdAvaliacaoTipo}/{cdEmpresa}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoSubTipoModel> SubTipoAvaliacao(int cdAvaliacaoTipo, int cdEmpresa)
        {
            List<AvaliacaoSubTipoModel> subTipos = new List<AvaliacaoSubTipoModel>();

            cAvaliacaoSubTipo subTipo = new cAvaliacaoSubTipo();
            foreach (var x in subTipo.ListarPorAvaliacaoTipo(cdAvaliacaoTipo, cdEmpresa))
            {
                subTipos.Add(new AvaliacaoSubTipoModel()
                {
                    cdAvaliacaoSubTipo = x.cdAvaliacaoSubTipo,
                    nmSubTipo = x.dsSubTipo,
                    cdEmpresa = x.cdempresa

                });
            };

            return subTipos;
        }

        [HttpPost]
        [Route("filtroAvaliacao")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<PesquisaAvaliacaoModel> FiltroAvaliacao(FiltroAvaliacao filtroAvaliacaoModel)
        {
            cAvaliacao avaliacao = new cAvaliacao();

            string where = " where 1 = 1 ";

            if (filtroAvaliacaoModel.cdAvaliacaoTipo > 0)
                where += " and a.cdAvaliacaoTipo = " + filtroAvaliacaoModel.cdAvaliacaoTipo;

            if (filtroAvaliacaoModel.cdAvaliacaoSubTipo > 0)
                where += " and a.cdAvaliacaoSubTipo = " + filtroAvaliacaoModel.cdAvaliacaoSubTipo;

            if (filtroAvaliacaoModel.cdAreaConhecimento > 0)
                where += " and a.cdAreaConhecimento = " + filtroAvaliacaoModel.cdAreaConhecimento;

            if (filtroAvaliacaoModel.cdEtapa > 0)
                where += " and a.cdEtapa = " + filtroAvaliacaoModel.cdEtapa;

            if (filtroAvaliacaoModel.cdSegmento > 0)
                where += " and a.cdSegmento = " + filtroAvaliacaoModel.cdSegmento;

            switch (Convert.ToInt32(filtroAvaliacaoModel.cdPesquisarEm))
            {
                case 1:
                    filtroAvaliacaoModel.cdPesquisarEm = "a.cdAvaliacao";
                    break;
                case 2:
                    filtroAvaliacaoModel.cdPesquisarEm = "a.nmAvaliacao";
                    break;
                case 3:
                    filtroAvaliacaoModel.cdPesquisarEm = "a.valor";
                    break;
                case 4:
                    filtroAvaliacaoModel.cdPesquisarEm = "avs.nmStatus";
                    break;
                case 5:
                    filtroAvaliacaoModel.cdPesquisarEm = "d.nmDisciplina";
                    break;
                case 6:
                    filtroAvaliacaoModel.cdPesquisarEm = "ac.nmAreaConhecimento";
                    break;
                case 7:
                    filtroAvaliacaoModel.cdPesquisarEm = "s.NmSerie";
                    break;
            }

            if (!string.IsNullOrWhiteSpace(filtroAvaliacaoModel.cdPesquisarEm) && !string.IsNullOrWhiteSpace(filtroAvaliacaoModel.txtPesquisa))
                where += " and " + filtroAvaliacaoModel.cdPesquisarEm + " like '%" + filtroAvaliacaoModel.txtPesquisa + "%' ";


            List<cAvaliacao> avaliacoes = avaliacao.ListarPorPesquisa(where);

            return avaliacoes.Select(x => new PesquisaAvaliacaoModel()
            {
                cdAvaliacao = x.cdAvaliacao,
                nmAvaliacao = x.nmAvaliacao,
                cdSerie = x.cdSerie,
                nmSerie = x.nmSerie,
                cdAvaliacaoTipo = x.cdAvaliacaoTipo,
                nmAvaliacaoTipo = x.nmAvaliacaoTipo,
                cdEtapa = x.cdEtapa,
                nmEtapa = x.nmEtapa,
                cdAreaConhecimento = x.cdAreaConhecimento,
                nmAreaConhecimento = x.nmAreaConhecimento,
                cdSegmento = x.cdSegmento,
                nmSegmento = x.nmSegmento,
                idAtivo = x.idAtivo,
                dtInicioAvaliacao = x.dtInicioAvaliacao,
                cdStatus = x.cdStatus,
                nmStatus = x.nmStatus,
                verificaUso = x.verifUso,
                stTrilha = x.stTrilha ?? false

            }).ToList();
        }

        dtsAvaliacao.dtQuestaoSelecionadaDataTable dtQuestoes;
        dtsAvaliacao.dtAlternativasDataTable dtAlternativas;
        cAvaliacaoDisciplina avaliacaoDisciplina = new cAvaliacaoDisciplina();
        cAvaliacaoSerie avaliacaoSerie = new cAvaliacaoSerie();
        cAvaliacaoTurma avaliacaoTurma = new cAvaliacaoTurma();
        cAvaliacaoTurmaDisciplina avaliacaoTurmaDisciplina = new cAvaliacaoTurmaDisciplina();
        cAvaliacaoQuestao avaliacaoQuestao = new cAvaliacaoQuestao();
        cAvaliacaoQuestaoAlternativa avaliacaoQuestaoAlternativa = new cAvaliacaoQuestaoAlternativa();
        cAvaliacaoGabarito avaliacaoGabarito = new cAvaliacaoGabarito();
        dtsAvaliacao.dtGabaritoDataTable dtGabarito = new dtsAvaliacao.dtGabaritoDataTable();

        [HttpGet]
        [Route("duplicar/{cdAvaliacao}/avaliacaoNome/{nmAvaliacao}/randomizar/{randomizar2}/empresa/{cdEmpresa}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Incluir)]
        public bool duplicarAvaliacao(int cdAvaliacao, string nmAvaliacao, int randomizar2, int cdEmpresa)
        {
            cAvaliacao avaliacao = new cAvaliacao().Abrir(cdAvaliacao);
            if (avaliacao == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            bool randomizar = randomizar2 == 1 ? true : false;
            #region SALVA AVALIAÇÃO

            avaliacao.Abrir(cdAvaliacao);
            string ErroBanco = avaliacao.Salvar(
                null,
                avaliacao.cdAvaliacaoTipo.ToString(),
                null,
                avaliacao.cdPeriodoLetivo,
                nmAvaliacao.ToUpper(),
                "3", //VALIDADA
                 avaliacao.valor,
                avaliacao.media,
                avaliacao.cdEtapa.ToString(),
                avaliacao.cdAreaConhecimento.ToString(),
                avaliacao.cdSegmento.ToString(),
                "1", //VALIDAÇOES
                avaliacao.modoAplicacao,
                avaliacao.resultado,
                avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.tempoAvaliacao.ToString() : null,
                avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.exibirNota.ToString() : null,
                avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.exibirRespostasEsperadas.ToString() : null,
                avaliacao.cdCriterio != 0 ? avaliacao.cdCriterio.ToString() : null,
                avaliacao.regras,
                avaliacao.cdClassificacaoInformacao != 0 ? avaliacao.cdClassificacaoInformacao.ToString() : null,
                true,
                (bool)avaliacao.randomizarQuestoes ? "true" : "false",
                (bool)avaliacao.randomizarAlternativas ? "true" : "false",
                avaliacao.exibirRespostasAposFechamento,
                (bool)avaliacao.exibirRespostasAposFechamento ? avaliacao.dtExibicaoRespostas?.ToShortDateString() : null,
                avaliacao.notasPorDisciplina,
                avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.stTrilha : null,
                 HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);

            #endregion

            if (ErroBanco == null)
            {
                int cdAvaliacaoNova = Convert.ToInt32(avaliacao.getLastID("avaliacao", "cdAvaliacao", "cdusuarioalt = " + cdUsuario).ToString());

                #region SALVA DISCIPLINAS

                dtsAvaliacao.dtDisciplinaDataTable dtDisciplinas = avaliacaoDisciplina.getLista(cdAvaliacao);
                ErroBanco = avaliacaoDisciplina.adicionar(
                    cdAvaliacaoNova,
                    dtDisciplinas,
                     HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);

                #endregion

                #region SALVA SERIES

                if (ErroBanco == null)
                {
                    dtsAvaliacao.dtSerieDataTable dtSeries = avaliacaoSerie.getLista(cdAvaliacao);
                    ErroBanco = avaliacaoSerie.adicionar(
                        cdAvaliacaoNova,
                        dtSeries,
                         HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);
                }

                #endregion

                #region SALVA TURMAS

                if (ErroBanco == null)
                {
                    dtsAvaliacao.dtTurmaDataTable dtTurmas = avaliacaoTurma.getLista(cdAvaliacao);
                    ErroBanco = avaliacaoTurma.adicionar(
                        cdAvaliacaoNova,
                        dtTurmas,
                         HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);
                }

                #endregion

                #region SALVA TURMAS/DISCIPLINAS

                if (ErroBanco == null)
                {
                    dtsAvaliacao.dtAvaliacaoTurmaDisciplinaDataTable dtTurmaDisciplina = avaliacaoTurmaDisciplina.getLista(cdAvaliacao);
                    ErroBanco = avaliacaoTurmaDisciplina.adicionar(
                        cdAvaliacaoNova,
                        dtTurmaDisciplina,
                         HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);
                }

                #endregion

                //#region SALVA GRUPOS DE ACESSO

                //if (ErroBanco == null)
                //{
                //    dtsAvaliacao.dtGrupoDataTable dtGrupos = avaliacaoGrupo.getLista(cdAvaliacao);
                //    ErroBanco = avaliacaoGrupo.adicionar(
                //        cdAvaliacaoNova,
                //        dtGrupos,
                //         HttpContext.Current.Request.UserHostAddress,
                //                                cdUsuario,
                //                                cdEmpresa);
                //}

                //#endregion

                #region SALVA QUESTÕES

                if (ErroBanco == null)
                {
                    dtQuestoes = avaliacaoQuestao.getLista(cdAvaliacao);
                    dtAlternativas = avaliacaoQuestaoAlternativa.getListaPorAvaliacao(cdAvaliacao);

                    foreach (dtsAvaliacao.dtQuestaoSelecionadaRow rowQuestao in dtQuestoes)
                    {
                        if (ErroBanco == null)
                        {
                            avaliacaoQuestao.Salvar(
                               0,
                               cdAvaliacaoNova,
                               rowQuestao.cdQuestao,
                               rowQuestao.valor,
                               rowQuestao.ordem,
                               null,
                               null,
                               null,
                               HttpContext.Current.Request.UserHostAddress,
                                               cdUsuario,
                                               cdEmpresa);

                            if (ErroBanco == null)
                            {
                                int cdAvaliacaoQuestao = Convert.ToInt32(avaliacao.getLastID("avaliacaoQuestao", "cdAvaliacaoQuestao", "cdusuarioalt = " + cdUsuario).ToString());

                                dtsAvaliacao.dtAlternativasRow alternativaOrdemNull = dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao && x.IsordemNull()).FirstOrDefault();

                                if (alternativaOrdemNull != null)
                                {
                                    int i = 0;
                                    foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao))
                                        rowAlternativa.ordem = ++i;
                                }

                                if (randomizar)
                                {
                                    int i = 0;
                                    foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao).OrderBy(x => x.ordemRandom))
                                    {
                                        if (ErroBanco == null)
                                            avaliacaoQuestaoAlternativa.Salvar(
                                                0,
                                                cdAvaliacaoQuestao,
                                                rowAlternativa.cdQuestaoAlternativa,
                                                ++i,
                                                 HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);
                                        else
                                            break;
                                    }
                                }
                                else
                                {
                                    foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao))
                                    {
                                        if (ErroBanco == null)
                                            avaliacaoQuestaoAlternativa.Salvar(
                                               0,
                                               cdAvaliacaoQuestao,
                                               rowAlternativa.cdQuestaoAlternativa,
                                               rowAlternativa.ordem,
                                                HttpContext.Current.Request.UserHostAddress,
                                               cdUsuario,
                                               cdEmpresa);
                                        else
                                            break;
                                    }
                                }
                            }
                            else
                                break;
                        }
                        else
                            break;
                    }
                }

                #endregion

                if (avaliacao.modoAplicacao == (int)EnumModoAplicacao.Impressa)
                {
                    #region SALVA GABARITO

                    if (ErroBanco == null)
                    {
                        dtsAvaliacao.dtAlternativasDataTable dtAlternativas = avaliacaoQuestaoAlternativa.getListaPorAvaliacao(cdAvaliacao);

                        //VERIFICA SE TODAS AS QUESTÕES SÃO DO TIPO MULTIPLA ESCOLHA
                        //CASO SEJA VERDADE CRIA O GABARITO DE QUESTÕES
                        if (dtQuestoes.AsEnumerable().Count(x => x.cdQuestaoTipo == 3 /* 3 = MULTIPLA ESCOLHA */) == dtQuestoes.AsEnumerable().Count())
                        {
                            foreach (dtsAvaliacao.dtQuestaoSelecionadaRow rowQuestao in dtQuestoes.OrderBy(x => x.ordemDisciplina).ThenBy(x => x.ordem))
                            {
                                dtsAvaliacao.dtAlternativasRow[] alternativasQuestao = (dtsAvaliacao.dtAlternativasRow[])dtAlternativas.Select("cdQuestao = " + rowQuestao.cdQuestao);
                                dtsAvaliacao.dtAlternativasRow[] alternativasCorretas = dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao && x.correta).ToArray();

                                //SE NAS ALTERNATIVAS TIVER ALGUMA RESPOSTA CORRETA SALVA NO GABARITO
                                string resposta = "";
                                if (alternativasCorretas.Length > 0)
                                {
                                    foreach (dtsAvaliacao.dtAlternativasRow rowAlternativaCorreta in alternativasCorretas)
                                    {
                                        int indiceRespostaCorreta = Array.IndexOf(alternativasQuestao, rowAlternativaCorreta);

                                        if (resposta == "")
                                            resposta += retornaLetraAlfabeto(indiceRespostaCorreta);
                                        else
                                            resposta += ("*" + retornaLetraAlfabeto(indiceRespostaCorreta));
                                    }

                                    dtsAvaliacao.dtGabaritoRow rowGabarito = dtGabarito.NewdtGabaritoRow();
                                    rowGabarito.cdAvaliacao = cdAvaliacaoNova;
                                    rowGabarito.cdQuestao = rowQuestao.cdQuestao;
                                    rowGabarito.alternativa = resposta;
                                    dtGabarito.AdddtGabaritoRow(rowGabarito);
                                }
                            }
                        }

                        string Erro_Banco = avaliacaoGabarito.atualiza(
                                cdAvaliacaoNova,
                                dtGabarito,
                                HttpContext.Current.Request.UserHostAddress,
                                                cdUsuario,
                                                cdEmpresa);
                    }

                    #endregion
                }
            }

            if (ErroBanco == null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpPost]
        [Route("duplicar/empresa/{cdEmpresa}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Incluir)]
        public bool duplicarAvaliacao(int cdEmpresa, [FromBody] AvaliacaoDuplicar avalD)
        {
            cAvaliacao avaliacao = new cAvaliacao().Abrir(avalD.cdAvaliacao);
            if (avaliacao == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            //bool randomizar = randomizar2 == 1 ? true : false;
            using (TransactionScope scope = new TransactionScope())
            {
                #region SALVA AVALIAÇÃO

                avaliacao.Abrir(avalD.cdAvaliacao);
                string ErroBanco = avaliacao.Salvar(
                    null,
                    avaliacao.cdAvaliacaoTipo.ToString(),
                    null,
                    avaliacao.cdPeriodoLetivo,
                    avalD.nmAvalNova.ToUpper(),
                    "3", //VALIDADA
                     avaliacao.valor,
                    avaliacao.media,
                    avaliacao.cdEtapa.ToString(),
                    avaliacao.cdAreaConhecimento.ToString(),
                    avaliacao.cdSegmento.ToString(),
                    "1", //VALIDAÇOES
                    avaliacao.modoAplicacao,
                    avaliacao.resultado,
                    avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.tempoAvaliacao.ToString() : null,
                    avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.exibirNota.ToString() : null,
                    avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.exibirRespostasEsperadas.ToString() : null,
                    avaliacao.cdCriterio != 0 ? avaliacao.cdCriterio.ToString() : null,
                    avaliacao.regras,
                    avaliacao.cdClassificacaoInformacao != 0 ? avaliacao.cdClassificacaoInformacao.ToString() : null,
                    true,
                    avalD.randomizarQuestoes ? "true" : "false",
                    avalD.randomizarAlternativas ? "true" : "false",
                    avaliacao.exibirRespostasAposFechamento,
                    avaliacao.exibirRespostasAposFechamento == true ? ((DateTime)avaliacao.dtExibicaoRespostas).ToShortDateString() : null,
                    avaliacao.notasPorDisciplina,
                    avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web ? avaliacao.stTrilha : null,
                     HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);

                #endregion

                if (ErroBanco == null)
                {
                    int cdAvaliacaoNova = Convert.ToInt32(avaliacao.getLastID("tbNEG_avaliacao", "cdAvaliacao", "cdusuarioalt = " + cdUsuario).ToString());

                    #region SALVA DISCIPLINAS

                    dtsAvaliacao.dtDisciplinaDataTable dtDisciplinas = avaliacaoDisciplina.getLista(avalD.cdAvaliacao);
                    ErroBanco = avaliacaoDisciplina.adicionar(
                        cdAvaliacaoNova,
                        dtDisciplinas,
                         HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);

                    #endregion

                    #region SALVA SERIES

                    if (ErroBanco == null)
                    {
                        dtsAvaliacao.dtSerieDataTable dtSeries = avaliacaoSerie.getLista(avalD.cdAvaliacao);
                        ErroBanco = avaliacaoSerie.adicionar(
                            cdAvaliacaoNova,
                            dtSeries,
                             HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                    }

                    #endregion

                    #region SALVA TURMAS

                    if (ErroBanco == null)
                    {
                        dtsAvaliacao.dtTurmaDataTable dtTurmas = avaliacaoTurma.getLista(avalD.cdAvaliacao);
                        ErroBanco = avaliacaoTurma.adicionar(
                            cdAvaliacaoNova,
                            dtTurmas,
                             HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                    }

                    #endregion

                    #region SALVA TURMAS/DISCIPLINAS

                    if (ErroBanco == null)
                    {
                        dtsAvaliacao.dtAvaliacaoTurmaDisciplinaDataTable dtTurmaDisciplina = avaliacaoTurmaDisciplina.getLista(avalD.cdAvaliacao);
                        ErroBanco = avaliacaoTurmaDisciplina.adicionar(
                            cdAvaliacaoNova,
                            dtTurmaDisciplina,
                             HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                    }

                    #endregion

                    #region SALVA QUESTÕES

                    if (ErroBanco == null)
                    {
                        dtQuestoes = avaliacaoQuestao.getLista(avalD.cdAvaliacao);
                        dtAlternativas = avaliacaoQuestaoAlternativa.getListaPorAvaliacao(avalD.cdAvaliacao);

                        foreach (dtsAvaliacao.dtQuestaoSelecionadaRow rowQuestao in dtQuestoes)
                        {
                            if (ErroBanco == null)
                            {
                                avaliacaoQuestao.Salvar(
                                    0,
                                    cdAvaliacaoNova,
                                    rowQuestao.cdQuestao,
                                    rowQuestao.valor,
                                    rowQuestao.ordem,
                                    null,
                                    null,
                                    null,
                                    HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);

                                if (ErroBanco == null)
                                {
                                    int cdAvaliacaoQuestao = Convert.ToInt32(avaliacao.getLastID("tbNEG_avaliacaoQuestao", "cdAvaliacaoQuestao", "cdusuarioalt = " + cdUsuario).ToString());

                                    dtsAvaliacao.dtAlternativasRow alternativaOrdemNull = dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao && x.IsordemNull()).FirstOrDefault();

                                    if (alternativaOrdemNull != null)
                                    {
                                        int i = 0;
                                        foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao))
                                            rowAlternativa.ordem = ++i;
                                    }

                                    if (avalD.randomizarAlternativas)
                                    {
                                        int i = 0;
                                        foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao).OrderBy(x => x.ordemRandom))
                                        {
                                            if (ErroBanco == null)
                                                avaliacaoQuestaoAlternativa.Salvar(
                                                    0,
                                                    cdAvaliacaoQuestao,
                                                    rowAlternativa.cdQuestaoAlternativa,
                                                    ++i,
                                                     HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                                            else
                                                break;
                                        }
                                    }
                                    else
                                    {
                                        foreach (dtsAvaliacao.dtAlternativasRow rowAlternativa in dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao))
                                        {
                                            if (ErroBanco == null)
                                                avaliacaoQuestaoAlternativa.Salvar(
                                                    0,
                                                    cdAvaliacaoQuestao,
                                                    rowAlternativa.cdQuestaoAlternativa,
                                                    rowAlternativa.ordem,
                                                     HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                                            else
                                                break;
                                        }
                                    }
                                }
                                else
                                    break;
                            }
                            else
                                break;
                        }
                    }

                    #endregion

                    if (avaliacao.modoAplicacao == (int)EnumModoAplicacao.Impressa)
                    {
                        #region SALVA GABARITO

                        if (ErroBanco == null)
                        {
                            dtsAvaliacao.dtAlternativasDataTable dtAlternativas = avaliacaoQuestaoAlternativa.getListaPorAvaliacao(avalD.cdAvaliacao);

                            //VERIFICA SE TODAS AS QUESTÕES SÃO DO TIPO MULTIPLA ESCOLHA
                            //CASO SEJA VERDADE CRIA O GABARITO DE QUESTÕES
                            if (dtQuestoes.AsEnumerable().Count(x => x.cdQuestaoTipo == 3 /* 3 = MULTIPLA ESCOLHA */) == dtQuestoes.AsEnumerable().Count())
                            {
                                foreach (dtsAvaliacao.dtQuestaoSelecionadaRow rowQuestao in dtQuestoes.OrderBy(x => x.ordemDisciplina).ThenBy(x => x.ordem))
                                {
                                    dtsAvaliacao.dtAlternativasRow[] alternativasQuestao = (dtsAvaliacao.dtAlternativasRow[])dtAlternativas.Select("cdQuestao = " + rowQuestao.cdQuestao);
                                    dtsAvaliacao.dtAlternativasRow[] alternativasCorretas = dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao && x.correta).ToArray();

                                    //SE NAS ALTERNATIVAS TIVER ALGUMA RESPOSTA CORRETA SALVA NO GABARITO
                                    string resposta = "";
                                    if (alternativasCorretas.Length > 0)
                                    {
                                        foreach (dtsAvaliacao.dtAlternativasRow rowAlternativaCorreta in alternativasCorretas)
                                        {
                                            int indiceRespostaCorreta = Array.IndexOf(alternativasQuestao, rowAlternativaCorreta);

                                            if (resposta == "")
                                                resposta += retornaLetraAlfabeto(indiceRespostaCorreta);
                                            else
                                                resposta += ("*" + retornaLetraAlfabeto(indiceRespostaCorreta));
                                        }

                                        dtsAvaliacao.dtGabaritoRow rowGabarito = dtGabarito.NewdtGabaritoRow();
                                        rowGabarito.cdAvaliacao = cdAvaliacaoNova;
                                        rowGabarito.cdQuestao = rowQuestao.cdQuestao;
                                        rowGabarito.alternativa = resposta;
                                        dtGabarito.AdddtGabaritoRow(rowGabarito);
                                    }
                                }
                            }

                            string Erro_Banco = avaliacaoGabarito.atualiza(
                                    cdAvaliacaoNova,
                                    dtGabarito,
                                    HttpContext.Current.Request.UserHostAddress,
                                                    cdUsuario,
                                                    cdEmpresa);
                        }

                        #endregion
                    }
                }

                if (ErroBanco == null)
                {
                    scope.Complete();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        private string retornaLetraAlfabeto(int index)
        {
            if (index >= 0 && index < 24)
            {
                string Alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXZ";
                return Alfabeto[index].ToString();
            }
            return "";
        }

        [HttpPost]
        [Route("valor")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public ValorProvaModel CalculaValorMedia(ValorProvaModel valorProva)
        {
            cConfig config = new cConfig();
            if (config.ExisteChave("MEDIA_ESCOLAR"))
            {
                config.Abrir("MEDIA_ESCOLAR", valorProva.cdEmpresa);

                decimal mediaEscolar = Convert.ToDecimal(config.Valor);

                decimal media = Convert.ToInt32(mediaEscolar) * valorProva.valor / 100;

                return new ValorProvaModel() { valor = media, cdEmpresa = valorProva.cdEmpresa };
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Média escolar não cadastrada para a Escola."));
        }

        public class ValorProvaModel
        {
            public int cdEmpresa { get; set; }
            public decimal valor { get; set; }
        }

        [HttpPost]
        [Route("vincular/alunos")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string AdicionaAlunos(AvaliacaoAlunoModel avaliacaoAluno)
        {
            List<cAvaliacaoAluno> avalAlunos = new cAvaliacaoAluno().ListarPorAvaliacao(avaliacaoAluno.cdAvaliacao);
            cAvaliacaoAluno avalAlunoDel = new cAvaliacaoAluno();
            foreach (var x in avalAlunos)
            {
                if (avaliacaoAluno.alunos.FirstOrDefault(y => y.cdMatricula == x.cdMatricula) == null)
                {
                    avalAlunoDel.Delete("tbNEG_avaliacaoAluno", "cdAvaliacaoAluno = " + x.cdAvaliacaoAluno);
                }
            }

            if (avaliacaoAluno.alunos.Count > 0)
            {
                foreach (var x in avaliacaoAluno?.alunos)
                {
                    cAvaliacaoAluno avalAluno = new cAvaliacaoAluno().Abrir(x.cdMatricula, avaliacaoAluno.cdAvaliacao);
                    cAvaliacaoAluno avalAlun = new cAvaliacaoAluno();
                    if (avalAluno == null)
                    {
                        string erro = avalAlun.Salvar(
                            null,
                            x.cdMatricula,
                            avaliacaoAluno.cdAvaliacao,
                            null,
                            null,
                            HttpContext.Current.Request.UserHostAddress,
                            cdUsuario,
                            avaliacaoAluno.cdEmpresa
                            );
                    }
                }
                return "Alunos adicionados com sucesso!";
            }
            else
            {
                return "Não foi possível vincular os alunos!";
            }
        }

        [HttpGet]
        [Route("alunos/avaliacao/{cdAvaliacao}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoAlunos> ListarAlunosPorAvaliacao(int cdAvaliacao)
        {
            List<cAvaliacaoAluno> avaliacaoAluno = new cAvaliacaoAluno().ListarPorAvaliacao(cdAvaliacao);
            List<AvaliacaoAlunos> avalAlunos = new List<AvaliacaoAlunos>();
            foreach (var y in avaliacaoAluno)
            {
                AvaliacaoAlunos avalAluno = new AvaliacaoAlunos();
                avalAluno.cdAvaliacaoAluno = y.cdAvaliacaoAluno;
                avalAluno.cdMatricula = y.cdMatricula;
                avalAluno.cdAluno = y.cdAluno;
                avalAluno.nome = y.nome;
                avalAluno.cdAvaliacao = y.cdAvaliacao;
                avalAluno.dtInicioAvaliacao = y.dtInicioAvaliacaoNovo;
                avalAluno.notaObtida = y.notaObtida;
                avalAluno.cdTurma = y.cdTurma;
                avalAluno.nmTurma = y.nmTurma;
                avalAluno.notasPorDisciplina = y.notasPorDisciplina;
                avalAluno.dtFimAvaliacao = y.dtFimAvaliacaoNovo;
                avalAluno.corrigida = y.corrigida;
                avalAlunos.Add(avalAluno);
            }

            return avalAlunos;
        }

        [HttpGet]
        [Route("{cdAvaliacao}/enviar")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string enviar(int cdAvaliacao)
        {
            return new cAvaliacao().mudaStatus(cdAvaliacao, 2);
        }

        [HttpGet]
        [Route("validar/avaliacao/{cdAvaliacao}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string ValidarAvaliacao(int cdAvaliacao)
        {
            cAvaliacaoValidacao avaliacaoValidacao = new cAvaliacaoValidacao();
            cAvaliacao avaliacao = new cAvaliacao().AbrirAvaliacao(cdAvaliacao);
            int cd = 0;
            cd = avaliacaoValidacao.Salvar(
            0,
            cdAvaliacao,
            HttpContext.Current.Request.UserHostAddress,
            cdUsuario,
            avaliacao.cdempresa);

            string Erro_Banco = "";

            if (cd == 0)
            {
                Erro_Banco = avaliacao.mudaStatus(cdAvaliacao, 3);
            }

            return Erro_Banco;
        }

        [HttpPost]
        [Route("anular")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string AnularQuestoes(AnularQuestoesModel anularQuestoes)
        {
            int cdAvaliacao = anularQuestoes.cdAvaliacao;

            string Erro_Banco = null;

            cAvaliacao avaliacao = new cAvaliacao().Abrir(cdAvaliacao);

            dtsAvaliacao.dtQuestaoSelecionadaDataTable dtAvaliacaoQuestao = avaliacaoQuestao.getLista(cdAvaliacao);
            dtsAvaliacao.dtDisciplinaDataTable dtDisciplina = avaliacaoDisciplina.getLista(cdAvaliacao);
            cAvaliacaoAlunoGabarito avaliacaoAlunoGabarito = new cAvaliacaoAlunoGabarito();
            cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno();
            cAvaliacaoAlunoResposta avaliacaoAlunoResposta = new cAvaliacaoAlunoResposta();
            cAvaliacaoAlunoNotaDisciplina avaliacaoAlunoNotaDisciplina = new cAvaliacaoAlunoNotaDisciplina();


            List<int> listaQuestoesAnular = new List<int>();
            List<int> listaTurmasAnular = new List<int>();

            foreach (var x in anularQuestoes.questoes)
            {
                listaQuestoesAnular.Add(x.cdQuestao);
            }

            foreach (var x in anularQuestoes.turmas)
            {
                listaTurmasAnular.Add(x.cdTurma);
            }

            #region GANHO DE PONTOS NA QUESTÃO
            if (anularQuestoes.cederPontos)
            {
                #region MODO AVALIAÇÃO WEB
                if (avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web)
                {
                    foreach (int cdTurma in listaTurmasAnular)
                    {
                        dtsAvaliacao.dtAvaliacaoAlunoDataTable dtAvaliacaoAluno = avaliacaoAluno.getAlunos(cdTurma, cdAvaliacao);

                        foreach (dtsAvaliacao.dtAvaliacaoAlunoRow rowAluno in dtAvaliacaoAluno)
                        {
                            if (!rowAluno.IscorrigidaNull() && rowAluno.corrigida)
                            {
                                dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable dtRespostasAluno = avaliacaoAlunoResposta.getLista(rowAluno.cdAvaliacaoAluno);

                                foreach (int cdQuestao in listaQuestoesAnular)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoRespostaRow[] respostasQuestao = dtRespostasAluno.Where(x => x.cdQuestao == cdQuestao).ToArray();

                                    foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in respostasQuestao)
                                    {
                                        row.anulada = true;
                                        row.acertou = true;
                                        row.pontuacao = row.valor;
                                        row.feedback = "QUESTÃO ANULADA - O VALOR DOS PONTOS DESTA QUESTÃO FOI SOMADO A SUA PONTUAÇÃO NA AVALIAÇÃO!";
                                    }
                                }

                                #region SALVA NOTAS POR DISCIPLINA

                                dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dtNotaDisciplina = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();

                                foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in dtRespostasAluno)
                                    if (row.IspontuacaoNull())
                                        row.pontuacao = 0;

                                foreach (dtsAvaliacao.dtDisciplinaRow row in dtDisciplina)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow rowNotaDisciplina = dtNotaDisciplina.NewdtAvaliacaoAlunoNotaDisciplinaRow();
                                    rowNotaDisciplina.cdDisciplina = row.cdDisciplina;
                                    rowNotaDisciplina.notaObtida = (from x in dtRespostasAluno
                                                                    join y in dtAvaliacaoQuestao on x.cdQuestao equals y.cdQuestao
                                                                    where y.cdDisciplina == row.cdDisciplina
                                                                    select new
                                                                    {
                                                                        cdQuestao = x.cdQuestao,
                                                                        pontuacao = x.pontuacao,
                                                                        cdDisciplina = y.cdDisciplina
                                                                    }).Distinct().Sum(x => x.pontuacao);

                                    dtNotaDisciplina.AdddtAvaliacaoAlunoNotaDisciplinaRow(rowNotaDisciplina);
                                }

                                string ErroOperacao = avaliacaoAlunoNotaDisciplina.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtNotaDisciplina,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);

                                #endregion

                                Erro_Banco = avaliacaoAluno.AtualizaNotaAluno(
                                       rowAluno.cdAvaliacaoAluno.ToString(),
                                       //retornaPontuacaoAvaliacaoWeb(dtRespostasAluno),
                                       dtNotaDisciplina.Sum(x => x.notaObtida),
                                       true,
                                       HttpContext.Current.Request.UserHostAddress,
                                       cdUsuario,
                                       anularQuestoes.cdEmpresa);

                                if (Erro_Banco == null)
                                    Erro_Banco = avaliacaoAlunoResposta.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtRespostasAluno,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);
                            }
                        }
                    }
                }

                #endregion

                #region MODO AVALIAÇÃO IMPRESSA
                else
                {
                    foreach (int cdTurma in listaTurmasAnular)
                    {
                        dtsAvaliacao.dtAvaliacaoAlunoDataTable dtAvaliacaoAluno = avaliacaoAluno.getAlunos(cdTurma, cdAvaliacao);

                        foreach (dtsAvaliacao.dtAvaliacaoAlunoRow rowAluno in dtAvaliacaoAluno)
                        {
                            if (!rowAluno.IscorrigidaNull() && rowAluno.corrigida)
                            {
                                dtsAvaliacao.dtAvaliacaoAlunoGabaritoDataTable dtGabaritoAluno = avaliacaoAlunoGabarito.getLista(rowAluno.cdAvaliacaoAluno);

                                foreach (int cdQuestao in listaQuestoesAnular)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoGabaritoRow[] respostasQuestao = dtGabaritoAluno.Where(x => x.cdQuestao == cdQuestao).ToArray();

                                    foreach (dtsAvaliacao.dtAvaliacaoAlunoGabaritoRow row in respostasQuestao)
                                    {
                                        row.anulada = true;
                                        row.acertou = true;
                                    }
                                }

                                #region SALVA NOTAS POR DISCIPLINA

                                dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dtNotaDisciplina = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();

                                foreach (dtsAvaliacao.dtDisciplinaRow row in dtDisciplina)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow rowNotaDisciplina = dtNotaDisciplina.NewdtAvaliacaoAlunoNotaDisciplinaRow();
                                    rowNotaDisciplina.cdDisciplina = row.cdDisciplina;
                                    rowNotaDisciplina.notaObtida = (from x in dtGabaritoAluno
                                                                    join y in dtAvaliacaoQuestao on x.cdQuestao equals y.cdQuestao
                                                                    where x.acertou && y.cdDisciplina == row.cdDisciplina
                                                                    select new
                                                                    {
                                                                        cdQuestao = x.cdQuestao,
                                                                        valor = x.valor,
                                                                        cdDisciplina = y.cdDisciplina
                                                                    }).Distinct().Sum(x => x.valor);

                                    dtNotaDisciplina.AdddtAvaliacaoAlunoNotaDisciplinaRow(rowNotaDisciplina);
                                }

                                string ErroOperacao = avaliacaoAlunoNotaDisciplina.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtNotaDisciplina,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);

                                #endregion

                                Erro_Banco = avaliacaoAluno.AtualizaNotaAluno(
                                       rowAluno.cdAvaliacaoAluno.ToString(),
                                       //retornaPontuacaoAvaliacaoImpressa(dtGabaritoAluno),
                                       dtNotaDisciplina.Sum(x => x.notaObtida),
                                       true,
                                       HttpContext.Current.Request.UserHostAddress,
                                       cdUsuario,
                                       anularQuestoes.cdEmpresa);

                                if (Erro_Banco == null)
                                    Erro_Banco = avaliacaoAlunoGabarito.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtGabaritoAluno,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);
                            }
                        }
                    }
                }
                #endregion
            }
            #endregion

            #region RECALCULAR PONTOS DA AVALIAÇÃO
            else
            {
                #region MODO AVALIAÇÃO WEB
                if (avaliacao.modoAplicacao == (int)EnumModoAplicacao.Web)
                {
                    foreach (int cdTurma in listaTurmasAnular)
                    {
                        dtsAvaliacao.dtAvaliacaoAlunoDataTable dtAvaliacaoAluno = avaliacaoAluno.getAlunos(cdTurma, cdAvaliacao);

                        foreach (dtsAvaliacao.dtAvaliacaoAlunoRow rowAluno in dtAvaliacaoAluno)
                        {
                            if (!rowAluno.IscorrigidaNull() && rowAluno.corrigida)
                            {
                                dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable dtRespostasAluno = avaliacaoAlunoResposta.getLista(rowAluno.cdAvaliacaoAluno);
                                foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in dtRespostasAluno)
                                    if (row.IsanuladaNull()) row.anulada = false;

                                decimal valorSomaQuestoesAnular = (from x in dtRespostasAluno
                                                                   where listaQuestoesAnular.Contains(x.cdQuestao) &&
                                                                   x.anulada == false
                                                                   select new
                                                                   {
                                                                       cdQuestao = x.cdQuestao,
                                                                       valor = x.valor
                                                                   }).Distinct().Sum(x => x.valor);

                                foreach (int cdQuestao in listaQuestoesAnular)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoRespostaRow[] respostasQuestao = dtRespostasAluno.Where(x => x.cdQuestao == cdQuestao).ToArray();

                                    foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in respostasQuestao)
                                    {
                                        row.anulada = true;
                                        if (anularQuestoes.cederPontos)
                                            row.feedback = "QUESTÃO ANULADA - O VALOR DOS PONTOS DESTA QUESTÃO FOI SOMADO A SUA PONTUAÇÃO NA AVALIAÇÃO!";
                                        else
                                            row.feedback = "QUESTÃO ANULADA - O VALOR DOS PONTOS DESTA QUESTÃO FOI DISTRIBUIDO ENTRE AS QUESTÕES DA AVALIAÇÃO!";
                                    }
                                }

                                foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in dtRespostasAluno)
                                {
                                    if (!row.anulada)
                                    {
                                        //PORCENTAGEM DE ACERTO NA QUESTÃO
                                        decimal percPontuacao = row.pontuacao / row.valor;

                                        //NOVO VALOR DA QUESTÃO
                                        decimal percValorQuestao = row.valor / (avaliacao.valor - valorSomaQuestoesAnular);
                                        row.valor = row.valor + (percValorQuestao * valorSomaQuestoesAnular);

                                        //ATUALIZA PONTUAÇÃO COM BASE NA PORCENTAGEM TIRADA
                                        row.pontuacao = row.valor * percPontuacao;
                                    }
                                }


                                #region SALVA NOTAS POR DISCIPLINA

                                dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dtNotaDisciplina = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();

                                foreach (dtsAvaliacao.dtAvaliacaoAlunoRespostaRow row in dtRespostasAluno)
                                    if (row.IspontuacaoNull())
                                        row.pontuacao = 0;

                                foreach (dtsAvaliacao.dtDisciplinaRow row in dtDisciplina)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow rowNotaDisciplina = dtNotaDisciplina.NewdtAvaliacaoAlunoNotaDisciplinaRow();
                                    rowNotaDisciplina.cdDisciplina = row.cdDisciplina;
                                    rowNotaDisciplina.notaObtida = (from x in dtRespostasAluno
                                                                    join y in dtAvaliacaoQuestao on x.cdQuestao equals y.cdQuestao
                                                                    where !x.anulada && x.acertou && y.cdDisciplina == row.cdDisciplina
                                                                    select new
                                                                    {
                                                                        cdQuestao = x.cdQuestao,
                                                                        pontuacao = x.pontuacao,
                                                                        cdDisciplina = y.cdDisciplina
                                                                    }).Distinct().Sum(x => x.pontuacao);

                                    dtNotaDisciplina.AdddtAvaliacaoAlunoNotaDisciplinaRow(rowNotaDisciplina);
                                }

                                string ErroOperacao = avaliacaoAlunoNotaDisciplina.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtNotaDisciplina,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);

                                #endregion

                                decimal pontuacaoAvaliacao = 0;

                                if (!rowAluno.IscorrigidaNull() && rowAluno.corrigida)
                                {
                                    pontuacaoAvaliacao = (from x in dtRespostasAluno
                                                          where !x.anulada
                                                          select new
                                                          {
                                                              cdQuestao = x.cdQuestao,
                                                              valor = x.pontuacao
                                                          }).Distinct().Sum(x => x.valor);
                                }

                                Erro_Banco = avaliacaoAluno.AtualizaNotaAluno(
                                       rowAluno.cdAvaliacaoAluno.ToString(),
                                       //pontuacaoAvaliacao,
                                       dtNotaDisciplina.Sum(x => x.notaObtida),
                                       rowAluno.IscorrigidaNull() ? false : rowAluno.corrigida,
                                       HttpContext.Current.Request.UserHostAddress,
                                       cdUsuario,
                                       anularQuestoes.cdEmpresa);

                                if (Erro_Banco == null)
                                    Erro_Banco = avaliacaoAlunoResposta.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtRespostasAluno,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);

                            }
                        }
                    }
                }
                #endregion

                #region MODO AVALIAÇÃO IMPRESSA
                else
                {
                    foreach (int cdTurma in listaTurmasAnular)
                    {
                        dtsAvaliacao.dtAvaliacaoAlunoDataTable dtAvaliacaoAluno = avaliacaoAluno.getAlunos(cdTurma, cdAvaliacao);

                        foreach (dtsAvaliacao.dtAvaliacaoAlunoRow rowAluno in dtAvaliacaoAluno)
                        {
                            if (!rowAluno.IscorrigidaNull() && rowAluno.corrigida)
                            {
                                dtsAvaliacao.dtAvaliacaoAlunoGabaritoDataTable dtGabaritoAluno = avaliacaoAlunoGabarito.getLista(rowAluno.cdAvaliacaoAluno);

                                decimal valorSomaQuestoesAnular = dtGabaritoAluno.Where(x => listaQuestoesAnular.Contains(x.cdQuestao)).Sum(x => x.valor);

                                foreach (dtsAvaliacao.dtAvaliacaoAlunoGabaritoRow row in dtGabaritoAluno)
                                {
                                    if (listaQuestoesAnular.Contains(row.cdQuestao))
                                        row.anulada = true;
                                    else
                                    {
                                        //NOVO VALOR DA QUESTÃO
                                        decimal percValorQuestao = row.valor / (avaliacao.valor - valorSomaQuestoesAnular);
                                        row.valor = row.valor + (percValorQuestao * valorSomaQuestoesAnular);
                                    }
                                }

                                decimal pontuacaoAvaliacao = (from x in dtGabaritoAluno
                                                              where !x.anulada && x.acertou
                                                              select x.valor).Sum();

                                #region SALVA NOTAS POR DISCIPLINA

                                dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dtNotaDisciplina = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();

                                foreach (dtsAvaliacao.dtDisciplinaRow row in dtDisciplina)
                                {
                                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow rowNotaDisciplina = dtNotaDisciplina.NewdtAvaliacaoAlunoNotaDisciplinaRow();
                                    rowNotaDisciplina.cdDisciplina = row.cdDisciplina;
                                    rowNotaDisciplina.notaObtida = (from x in dtGabaritoAluno
                                                                    join y in dtAvaliacaoQuestao on x.cdQuestao equals y.cdQuestao
                                                                    where !x.anulada && x.acertou && y.cdDisciplina == row.cdDisciplina
                                                                    select new
                                                                    {
                                                                        cdQuestao = x.cdQuestao,
                                                                        valor = x.valor,
                                                                        cdDisciplina = y.cdDisciplina
                                                                    }).Distinct().Sum(x => x.valor);

                                    dtNotaDisciplina.AdddtAvaliacaoAlunoNotaDisciplinaRow(rowNotaDisciplina);
                                }

                                string ErroOperacao = avaliacaoAlunoNotaDisciplina.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtNotaDisciplina,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);


                                #endregion

                                Erro_Banco = avaliacaoAluno.AtualizaNotaAluno(
                                       rowAluno.cdAvaliacaoAluno.ToString(),
                                       pontuacaoAvaliacao,
                                       true,
                                       HttpContext.Current.Request.UserHostAddress,
                                       cdUsuario,
                                       anularQuestoes.cdEmpresa);


                                if (Erro_Banco == null)
                                    Erro_Banco = avaliacaoAlunoGabarito.atualiza(
                                    rowAluno.cdAvaliacaoAluno,
                                    dtGabaritoAluno,
                                    HttpContext.Current.Request.UserHostAddress,
                                    cdUsuario,
                                    anularQuestoes.cdEmpresa);

                            }
                        }
                    }
                }
                #endregion
            }
            #endregion

            return Erro_Banco;

        }

        //private decimal retornaPontuacaoAvaliacaoWeb(dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable dt)
        //{
        //    return (from x in dt
        //            where !x.IsacertouNull() &&
        //                  x.acertou
        //            select new
        //            {
        //                cdQuestao = x.cdQuestao,
        //                valor = x.pontuacao
        //            }).Distinct().ToList().Sum(x => x.valor);
        //}
        //private decimal retornaPontuacaoAvaliacaoImpressa(dtsAvaliacao.dtAvaliacaoAlunoGabaritoDataTable dt)
        //{
        //    return (from x in dt
        //            where !x.IsacertouNull() &&
        //                  x.acertou
        //            select new
        //            {
        //                cdQuestao = x.cdQuestao,
        //                valor = x.valor
        //            }).Distinct().ToList().Sum(x => x.valor);
        //}

        [HttpPut]
        [Route("{cdAvaliacao}/vincular")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string vincularQuestoes(int cdAvaliacao, [FromBody] List<AvaliacaoQuestaoModel> questoes)
        {
            cAvaliacao avaliacao = new cAvaliacao().Abrir(cdAvaliacao);
            if (avaliacao == null) throw new HttpException(404, "Avaliação não encontrada");

            int cdEmpresa = avaliacao.cdempresa;
            var dtQuestoesSelecionadas = AvaliacaoQuestaoModel.fromModel(questoes, out dtAlternativas);

            //redistribuiPontosAvaliacao(dtQuestoesSelecionadas);   redistribui os pontos nas questões.

            string Erro_Banco = avaliacaoQuestao.atualiza(
                cdAvaliacao,
                dtQuestoesSelecionadas,
                HttpContext.Current.Request.UserHostAddress,
                cdUsuario,
                cdEmpresa);

            if (Erro_Banco == null)
            {
                dtQuestoesSelecionadas = avaliacaoQuestao.getLista(cdAvaliacao);
                foreach (dtsAvaliacao.dtQuestaoSelecionadaRow row in dtQuestoesSelecionadas)
                {
                    dtsAvaliacao.dtAlternativasRow[] rowsAlternativa = (dtsAvaliacao.dtAlternativasRow[])dtAlternativas.Select("cdQuestao = " + row.cdQuestao);
                    dtsAvaliacao.dtAlternativasDataTable dt = new dtsAvaliacao.dtAlternativasDataTable();
                    foreach (dtsAvaliacao.dtAlternativasRow dtRow in rowsAlternativa)
                        dt.ImportRow(dtRow);

                    if (dt.Count > 0 && (dt[0].IsordemNull() || dt[0].ordem <= 0))
                    {
                        int i = 0;
                        foreach (dtsAvaliacao.dtAlternativasRow dtRow in dt)
                            dtRow.ordem = ++i;
                    }

                    if (Erro_Banco == null)
                        Erro_Banco = avaliacaoQuestaoAlternativa.atualiza(
                            row.cdAvaliacaoQuestao,
                            dt,
                            HttpContext.Current.Request.UserHostAddress,
                            cdUsuario,
                            cdEmpresa);
                }
            }

            if (Erro_Banco == null)
            {
                dtAlternativas = avaliacaoQuestaoAlternativa.getListaPorAvaliacao(cdAvaliacao);

                //VERIFICA SE TODAS AS QUESTÕES SÃO DO TIPO MULTIPLA ESCOLHA
                //CASO SEJA VERDADE CRIA O GABARITO DE QUESTÕES
                if (dtQuestoesSelecionadas.AsEnumerable().Count(x => x.cdQuestaoTipo == 3 /* 3 = MULTIPLA ESCOLHA */) == dtQuestoesSelecionadas.AsEnumerable().Count())
                {
                    foreach (dtsAvaliacao.dtQuestaoSelecionadaRow rowQuestao in dtQuestoesSelecionadas.OrderBy(x => x.ordemDisciplina).ThenBy(x => x.ordem))
                    {
                        dtsAvaliacao.dtAlternativasRow[] alternativasQuestao = (dtsAvaliacao.dtAlternativasRow[])dtAlternativas.Select("cdQuestao = " + rowQuestao.cdQuestao);
                        dtsAvaliacao.dtAlternativasRow[] alternativasCorretas = dtAlternativas.Where(x => x.cdQuestao == rowQuestao.cdQuestao && x.correta).ToArray();

                        //SE NAS ALTERNATIVAS TIVER ALGUMA RESPOSTA CORRETA SALVA NO GABARITO
                        string resposta = "";
                        if (alternativasCorretas.Length > 0)
                        {
                            foreach (dtsAvaliacao.dtAlternativasRow rowAlternativaCorreta in alternativasCorretas)
                            {
                                int indiceRespostaCorreta = Array.IndexOf(alternativasQuestao, rowAlternativaCorreta);

                                if (resposta == "")
                                    resposta += retornaLetraAlfabeto(indiceRespostaCorreta);
                                else
                                    resposta += ("*" + retornaLetraAlfabeto(indiceRespostaCorreta));
                            }

                            dtsAvaliacao.dtGabaritoRow rowGabarito = dtGabarito.NewdtGabaritoRow();
                            rowGabarito.cdAvaliacao = cdAvaliacao;
                            rowGabarito.cdQuestao = rowQuestao.cdQuestao;
                            rowGabarito.alternativa = resposta;
                            dtGabarito.AdddtGabaritoRow(rowGabarito);
                        }
                    }
                }

                Erro_Banco = avaliacaoGabarito.Delete("avaliacaoGabarito", "cdAvaliacao = " + cdAvaliacao);

                if (Erro_Banco == null)
                    Erro_Banco = avaliacaoGabarito.atualiza(
                        cdAvaliacao,
                        dtGabarito,
                        HttpContext.Current.Request.UserHostAddress,
                        cdUsuario,
                        cdEmpresa);
            }

            return Erro_Banco;

        }

        [HttpGet]
        [Route("validacoes/{cdAvaliacao}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<ValidacaoAvaliacaoModel> ListarValidacoes(int cdAvaliacao)
        {
            List<ValidacaoAvaliacaoModel> validacoes = new List<ValidacaoAvaliacaoModel>();

            List<cAvaliacaoValidacao> avaliacaoValidacoes = new cAvaliacaoValidacao().ListarPorAvaliacao(cdAvaliacao);
            foreach (var x in avaliacaoValidacoes)
            {
                validacoes.Add(new ValidacaoAvaliacaoModel()
                {
                    cdAvaliacaoValidacao = x.cdAvaliacaoValidacao,
                    cdAvaliacao = x.cdAvaliacao,
                    dtIncReg = x.dtIncReg,
                    nmUsuario = x.nmUsuario,
                    nucomputador = x.nucomputador
                });
            };

            return validacoes;
        }


        [HttpGet]
        [Route("correcao/ddl")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public AvaliacaoCorrecaoModel CarregarAvaliacaoCorrecao()
        {
            cDados.cProfessor prof = new cDados.cProfessor().AbrirPorUsuario(cdUsuario);

            List<DisciplinaModel> disciplinas = new List<DisciplinaModel>();
            List<SerieModel> series = new List<SerieModel>();
            List<PeriodoLetivoModel> periodoLetivos = new List<PeriodoLetivoModel>();

            List<cPeriodoLetivo> listaPL = new cPeriodoLetivo().Listar(" T.IDATIVO = 1");
            List<cDisciplina> profDisciplinas = new cDisciplina().ListarPorProfessor(prof.cdProfessor);
            List<cSerie> profSeries = new cSerie().ListarPorProfessor(prof.cdProfessor);


            foreach (var x in profDisciplinas)
            {
                DisciplinaModel disciplina = new DisciplinaModel();

                disciplina.cdDisciplina = x.cdDisciplina;
                disciplina.nmDisciplina = x.nmDisciplina;

                disciplinas.Add(disciplina);
            }

            foreach (var x in profSeries)
            {
                SerieModel serie = new SerieModel();

                serie.cdSerie = x.cdSerie;
                serie.nmSerie = x.nmSerie;

                series.Add(serie);
            }

            foreach (var x in listaPL)
            {
                PeriodoLetivoModel periodoLetivo = new PeriodoLetivoModel();

                periodoLetivo.cdPeriodoLetivo = x.cdPeriodoLetivo;
                periodoLetivo.nmPeriodoLetivo = x.nmPeriodoLetivo;

                periodoLetivos.Add(periodoLetivo);
            }


            return new AvaliacaoCorrecaoModel(series, disciplinas, periodoLetivos) { };
        }

        [HttpGet]
        [Route("correcao/pesquisa/serie/{cdSerie}/disciplina/{cdDisciplina}/turma/{cdTurma}/periodo/{cdPeriodoLetivo}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<PesquisaAvaliacaoModel> PesquisaAvaliacaoCorrecao(int cdSerie, int cdDisciplina, int cdTurma, int cdPeriodoLetivo)
        {
            cAvaliacao avaliacao = new cAvaliacao();

            List<cAvaliacao> avaliacoes = avaliacao.ListarPorPesquisa(cdSerie, cdTurma, cdDisciplina, cdPeriodoLetivo).OrderByDescending(x => x.dtIncReg).ToList();

            List<PesquisaAvaliacaoModel> pesquisaRes = new List<PesquisaAvaliacaoModel>();


            foreach (var x in avaliacoes)
            {
                PesquisaAvaliacaoModel pesqAvaliacao = new PesquisaAvaliacaoModel();
                pesqAvaliacao.cdAvaliacao = x.cdAvaliacao;
                pesqAvaliacao.nmAvaliacao = x.nmAvaliacao;
                pesqAvaliacao.nmAvaliacaoTipo = x.nmAvaliacaoTipo;
                pesqAvaliacao.nmEtapa = x.nmEtapa;
                pesqAvaliacao.nmAreaConhecimento = x.nmAreaConhecimento;
                pesqAvaliacao.nmSegmento = x.nmSegmento;
                pesqAvaliacao.tempoAvaliacao = x.tempoAvaliacao ?? 0;
                pesqAvaliacao.dtAplicacao = x.dtAplicacao;
                pesqAvaliacao.disponibilizada = (bool)x.disponibilizada;
                pesqAvaliacao.notasPorDisciplina = (bool)x.notasPorDisciplina;
                pesqAvaliacao.modoAplicacao = x.modoAplicacao;
                pesqAvaliacao.stTrilha = x.stTrilha;
                pesqAvaliacao.disciplinas = new List<DisciplinaModel>();

                foreach (var y in new cAvaliacaoDisciplina().ListarPorAvaliacao(x.cdAvaliacao))
                {
                    DisciplinaModel discModel = new DisciplinaModel();
                    discModel.nmDisciplina = y.nmDisciplina;
                    discModel.cdDisciplina = y.cdDisciplina;

                    if (pesqAvaliacao.notasPorDisciplina)
                    {
                        discModel.valor = y.valor;
                        pesqAvaliacao.valor += y.valor;
                    }
                    else
                    {
                        discModel.valor = x.valor;
                    }

                    pesqAvaliacao.disciplinas.Add(discModel);
                }
                pesquisaRes.Add(pesqAvaliacao);
            }

            return pesquisaRes;
        }

        [HttpGet]
        [Route("avaliacaoalunos/avaliacao/{cdAvaliacao}/turma/{cdTurma}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        //TO DO - Mudar acrescentar modulo de acesso para professor (Correção)
        public List<AvaliacaoAlunos> ListarAvaliacaoAlunoPorAvaliacao(int cdAvaliacao, int cdTurma)
        {
            cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno();

            List<cAvaliacaoAluno> avaliacoes = avaliacaoAluno.ListarAlunosPorAvaliacao(cdAvaliacao, cdTurma);
            List<AvaliacaoAlunos> avalAlunos = new List<AvaliacaoAlunos>();

            foreach (var x in avaliacoes)
            {
                AvaliacaoAlunos avalAluno = new AvaliacaoAlunos();
                avalAluno.cdAvaliacaoAluno = x.cdAvaliacaoAluno;
                avalAluno.cdMatricula = x.cdMatricula;
                avalAluno.nome = x.nome;
                avalAluno.cdAvaliacao = x.cdAvaliacao;
                avalAluno.dtInicioAvaliacao = x.dtInicioAvaliacaoNovo;
                avalAluno.notaObtida = x.notaObtida;
                avalAluno.cdTurma = x.cdTurma;
                avalAluno.nmTurma = x.nmTurma;
                avalAluno.notasPorDisciplina = x.notasPorDisciplina;
                avalAluno.dtFimAvaliacao = x.dtFimAvaliacaoNovo;
                avalAluno.corrigida = x.corrigida;

                avalAlunos.Add(avalAluno);
            }

            return avalAlunos;
        }

        [HttpGet]
        [Route("avaliacaoalunosnotadisciplina/avaliacaoaluno/{cdAvaliacaoAluno}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoAlunoNotasDisciplina> ListarAvaliacaoAlunoNotaDisciplinaPorAvaliacaoAluno(int cdAvaliacaoAluno)
        {
            cAvaliacaoAlunoNotaDisciplina avaliacaoAluno = new cAvaliacaoAlunoNotaDisciplina();

            List<cAvaliacaoAlunoNotaDisciplina> avaliacoes = avaliacaoAluno.Listar(cdAvaliacaoAluno);
            List<AvaliacaoAlunoNotasDisciplina> avalAlunos = new List<AvaliacaoAlunoNotasDisciplina>();

            foreach (var x in avaliacoes)
            {
                AvaliacaoAlunoNotasDisciplina avalAluno = new AvaliacaoAlunoNotasDisciplina();
                avalAluno.cdAvaliacaoAlunoNotaDisciplina = x.cdAvaliacaoAlunoNotaDisciplina;
                avalAluno.cdAvaliacaoAluno = x.cdAvaliacaoAluno;
                avalAluno.cdDisciplina = x.cdDisciplina;
                avalAluno.nmDisciplina = x.nmDisciplina;
                avalAluno.notaObtida = x.notaObtida;

                avalAlunos.Add(avalAluno);
            }

            return avalAlunos;
        }

        [HttpGet]
        [Route("alunoresposta/avaliacaoaluno/{cdAvaliacaoAluno}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoAlunoRespostaModel> ListarAvaliacaoAlunoRespostaPorAvaliacaoAluno(int cdAvaliacaoAluno)
        {
            List<AvaliacaoAlunoRespostaModel> avaliacaoAlunoRespostasModel = new List<AvaliacaoAlunoRespostaModel>();
            List<cAvaliacaoAlunoResposta> avaliacaoAlunoRespostas = new cAvaliacaoAlunoResposta().ListarPorAvaliacaoAluno(cdAvaliacaoAluno);

            foreach (var x in avaliacaoAlunoRespostas)
            {
                avaliacaoAlunoRespostasModel.Add(new AvaliacaoAlunoRespostaModel()
                {
                    cdAvaliacaoAlunoResposta = x.cdAvaliacaoAlunoResposta,
                    cdAvaliacaoAluno = x.cdAvaliacaoAluno,
                    cdQuestao = x.cdQuestao,
                    cdAlternativa = x.cdAlternativa ?? 0,
                    cdAlternativaResposta = x.cdAlternativaResposta ?? 0,
                    dsResposta = x.dsResposta,
                    verdadeiro = x.verdadeiro ?? false
                });
            }

            return avaliacaoAlunoRespostasModel;
        }

        [HttpGet]
        [Route("correcao/avaliacao/{cdAvaliacao}/avaliacaoaluno/{cdAvaliacaoAluno}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public AvaliacaoModel GetCorrecaoAluno(int cdAvaliacao, int cdAvaliacaoAluno)
        {
            List<string> alfabeto = new List<string>() { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
            cAvaliacao avaliacao = new cAvaliacao();
            cQuestao questao = new cQuestao();
            avaliacao.AbrirDetalhado(cdAvaliacao);
            AvaliacaoModel avaliacaoModel = new AvaliacaoModel
            {
                cdAvaliacao = avaliacao.cdAvaliacao,
                cdAvaliacaoTipo = avaliacao.cdAvaliacaoTipo,
                nmAvaliacaoTipo = avaliacao.nmAvaliacaoTipo,
                cdAvaliacaoSubTipo = avaliacao.cdAvaliacaoSubTipo ?? 0,
                nmAvaliacao = avaliacao.nmAvaliacao,
                cdStatus = avaliacao.cdStatus,
                dtAplicacao = avaliacao.dtAplicacao ?? DateTime.MinValue,
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
                resultado = avaliacao.resultado ?? 0,
                dtInicioAvaliacao = avaliacao.dtInicioAvaliacao,
                dtFimAvaliacao = avaliacao.dtFimAvaliacao == DateTime.MinValue ? DateTime.Now : (avaliacao.dtFimAvaliacao ?? DateTime.Now),
                tempoAvaliacao = avaliacao.tempoAvaliacao ?? 0,
                exibirNota = avaliacao.exibirNota ?? false,
                exibirRespostasEsperadas = (bool)avaliacao.exibirRespostasEsperadas,
                exibirRespostasAposFechamento = (bool)avaliacao.exibirRespostasAposFechamento,
                dtExibicaoRespostas = avaliacao.dtExibicaoRespostas ?? DateTime.MinValue,
                senhaAcesso = avaliacao.senhaAcesso,
                cdCriterio = avaliacao.cdCriterio ?? 0,
                regras = avaliacao.regras,
                cdClassificacaoInformacao = avaliacao.cdClassificacaoInformacao,
                disponibilizada = avaliacao.disponibilizada ?? false,
                dsCriterio = avaliacao.dsCriterio,
                idAtivo = avaliacao.idAtivo,
                verificaUso = avaliacao.verificaUso(cdAvaliacao)
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
            alternativas = alternativa.ListarAlternativasPorAvaliacao(cdAvaliacao, cdAvaliacaoAluno);

            foreach (var x in questao.ListarPorAvaliacao(cdAvaliacao))
            {
                AvaliacaoQuestaoModel avQuestaoModel = new AvaliacaoQuestaoModel();
                avQuestaoModel.QuestaoModel = new QuestaoModel();

                avQuestaoModel.cdAvaliacaoQuestao = x.cdAvaliacaoQuestao;
                avQuestaoModel.ordem = x.ordem;
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
                //avQuestaoModel.QuestaoModel.cdTopico = x.cdTopico;
                avQuestaoModel.QuestaoModel.dsComando = x.dsComando;
                avQuestaoModel.QuestaoModel.imgComando = x.imgComando;
                avQuestaoModel.QuestaoModel.dsSuporte = x.dsSuporte;
                avQuestaoModel.QuestaoModel.imgSuporte = x.imgSuporte;
                //avQuestaoModel.QuestaoModel.cdSubTopico = x.cdSubTopico;
                avQuestaoModel.QuestaoModel.cdUsuarioInc = x.cdUsuarioInc;
                avQuestaoModel.QuestaoModel.cdProfessorResponsavel = x.cdProfessorResponsavel;
                avQuestaoModel.QuestaoModel.idAtivo = x.idativo;

                List<cAvaliacaoAlunoResposta> res = new cAvaliacaoAlunoResposta().ListarPorAvaliacaoAluno(cdAvaliacaoAluno);
                avQuestaoModel.QuestaoModel.dsResposta = res.FirstOrDefault(z => z.cdQuestao == x.cdQuestao)?.dsResposta ?? "";

                if (alternativas != null)
                {
                    List<AlternativaModel> alternativasModel = new List<AlternativaModel>();
                    int counter = 0;
                    List<cQuestaoAlternativa> temp;
                    foreach (var y in temp = alternativas.Where(i => i.cdQuestao == x.cdQuestao).ToList())
                    {
                        AlternativaModel alternativaModel = new AlternativaModel();

                        if (x.cdQuestaoTipo != 4)
                        {
                            alternativaModel.cdQuestao = y.cdQuestao;
                            alternativaModel.cdQuestaoAlternativa = y.cdQuestaoAlternativa;
                            alternativaModel.correta = y.correta;
                            alternativaModel.dsAlternativa1 = y.dsAlternativa1;
                            alternativaModel.dsAlternativa2 = y.dsAlternativa2;
                            alternativaModel.imgAlternativa1 = y.imgAlternativa1;
                            alternativaModel.imgAlternativa2 = y.imgAlternativa2;
                            alternativaModel.ordem = y.ordem;
                            alternativaModel.acertou = y.acertou;
                            alternativaModel.verdadeiro = y.verdadeiro;
                        }
                        else
                        {
                            alternativaModel.cdQuestao = y.cdQuestao;
                            alternativaModel.cdQuestaoAlternativa = y.cdQuestaoAlternativa;
                            alternativaModel.cdQuestaoAlternativa2 = y.cdQuestaoAlternativa2;
                            alternativaModel.correta = alternativas.FirstOrDefault(z => z.cdQuestaoAlternativa2 == alternativaModel.cdQuestaoAlternativa2).correta;
                            alternativaModel.dsAlternativa1 = y.dsAlternativa1;
                            alternativaModel.dsAlternativa2 = temp.OrderBy(z => z.cdQuestaoAlternativa2).ToList()[counter].dsAlternativa2;
                            if (y.indice1 - 1 >= 0)
                                alternativaModel.indice1 = alfabeto[y.indice1 - 1];
                            alternativaModel.indice2 = alfabeto[counter];
                            alternativaModel.indiceCorreta = alfabeto[y.indiceCorreta - 1];
                            alternativaModel.imgAlternativa1 = y.imgAlternativa1;
                            alternativaModel.imgAlternativa2 = temp.OrderBy(z => z.cdQuestaoAlternativa2).ToList()[counter].imgAlternativa2;
                            alternativaModel.ordem = y.ordem;
                            alternativaModel.verdadeiro = false;
                            counter++;

                        }
                        alternativasModel.Add(alternativaModel);
                    }

                    avQuestaoModel.QuestaoModel.Alternativas = alternativasModel;
                }
                avaliacaoModel.AvaliacaoQuestaoModel.Add(avQuestaoModel);
            }

            return avaliacaoModel;
        }

        [HttpGet]
        [Route("avaliacaoalunoresposta/avaliacaoaluno/{cdAvaliacaoAluno}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public List<AvaliacaoAlunoRespostaModel> GetFeedBack(int cdAvaliacaoAluno)
        {
            List<cAvaliacaoAlunoResposta> avalAlunoResposta = new cAvaliacaoAlunoResposta().ListarPorAvaliacaoAluno(cdAvaliacaoAluno);

            List<AvaliacaoAlunoRespostaModel> avaAlunoResps = new List<AvaliacaoAlunoRespostaModel>();

            foreach (var x in avalAlunoResposta)
            {
                AvaliacaoAlunoRespostaModel avaAlunoResp = new AvaliacaoAlunoRespostaModel();

                avaAlunoResp.cdAvaliacaoAlunoResposta = x.cdAvaliacaoAlunoResposta;
                avaAlunoResp.cdAvaliacaoAluno = x.cdAvaliacaoAluno;
                avaAlunoResp.cdQuestao = x.cdQuestao;
                avaAlunoResp.cdAlternativa = x.cdAlternativa ?? 0;
                avaAlunoResp.cdAlternativaResposta = x.cdAlternativaResposta ?? 0;
                avaAlunoResp.dsResposta = x.dsResposta;
                avaAlunoResp.verdadeiro = x.verdadeiro ?? false;
                avaAlunoResp.feedback = x.feedback;
                avaAlunoResp.pontuacao = x.pontuacao;
                avaAlunoResp.acertou = x.acertou ?? false;
                avaAlunoResp.dtIncReg = x.dtIncReg;
                avaAlunoResp.referencia = x.referencia;

                avaAlunoResps.Add(avaAlunoResp);
            }

            return avaAlunoResps;
        }

        [HttpGet]
        [Route("carregarfeedback/avaliacaoaluno/{cdAvaliacaoAluno}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public IEnumerable<AvaliacaoAlunoRespostaModel> GetFeedBackPr(int cdAvaliacaoAluno)
        {
            cAvaliacaoAlunoResposta avalAlunoResposta = new cAvaliacaoAlunoResposta();
            var lista = avalAlunoResposta.ListarPorAvaliacaoAlunoFeedBack(cdAvaliacaoAluno);

            List<AvaliacaoAlunoRespostaModel> avaAlunoResp = new List<AvaliacaoAlunoRespostaModel>();

            foreach (var item in lista)
            {
                var obj = new AvaliacaoAlunoRespostaModel();

                obj.cdAvaliacaoAlunoResposta = item.cdAvaliacaoAlunoResposta;
                obj.cdAvaliacaoAluno = item.cdAvaliacaoAluno;
                obj.cdQuestao = item.cdQuestao;
                obj.cdAlternativa = item.cdAlternativa ?? 0;
                obj.cdAlternativaResposta = item.cdAlternativaResposta ?? 0;
                obj.dsResposta = item.dsResposta;
                obj.verdadeiro = item.verdadeiro ?? false;
                obj.feedback = item.feedback;
                obj.pontuacao = item.pontuacao;
                obj.acertou = item.acertou ?? false;
                obj.dtIncReg = item.dtIncReg;
                obj.referencia = item.referencia;

                avaAlunoResp.Add(obj);
            }



            return avaAlunoResp.GroupBy(x => x.cdQuestao).Select(x => new AvaliacaoAlunoRespostaModel()
            {
                cdAvaliacaoAlunoResposta = x.First().cdAvaliacaoAlunoResposta,
                cdQuestao = x.Key,
                feedback = x.First().feedback,
                pontuacao = x.First().pontuacao,
                dtIncReg = x.First().dtIncReg,
                referencia = x.First().referencia
            });
        }

        [HttpGet]
        [Route("carregarfeedback/avaliacaoaluno/{cdAvaliacaoAluno}/questao/{cdquestao}")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Consultar)]
        public AvaliacaoAlunoRespostaModel GetFeedBack(int cdAvaliacaoAluno, int cdQuestao)
        {
            cAvaliacaoAlunoResposta avalAlunoResposta = new cAvaliacaoAlunoResposta();
            avalAlunoResposta.AbrirPorAvaliacaoAlunoEQuestao(cdAvaliacaoAluno, cdQuestao);

            AvaliacaoAlunoRespostaModel avaAlunoResp = new AvaliacaoAlunoRespostaModel();

            avaAlunoResp.cdAvaliacaoAlunoResposta = avalAlunoResposta.cdAvaliacaoAlunoResposta;
            avaAlunoResp.cdAvaliacaoAluno = avalAlunoResposta.cdAvaliacaoAluno;
            avaAlunoResp.cdQuestao = avalAlunoResposta.cdQuestao;
            avaAlunoResp.cdAlternativa = avalAlunoResposta.cdAlternativa ?? 0;
            avaAlunoResp.cdAlternativaResposta = avalAlunoResposta.cdAlternativaResposta ?? 0;
            avaAlunoResp.dsResposta = avalAlunoResposta.dsResposta;
            avaAlunoResp.verdadeiro = avalAlunoResposta.verdadeiro ?? false;
            avaAlunoResp.feedback = avalAlunoResposta.feedback;
            avaAlunoResp.pontuacao = avalAlunoResposta.pontuacao;
            avaAlunoResp.acertou = avalAlunoResposta.acertou ?? false;
            avaAlunoResp.dtIncReg = avalAlunoResposta.dtIncReg;
            avaAlunoResp.referencia = avalAlunoResposta.referencia;

            return avaAlunoResp;
        }

        [HttpPost]
        [Route("salvarnota")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string SalvarNotaAvaliacaoAlunoResposta(AvaliacaoAlunoRespostaModel avalAlunoResp)
        {
            cAvaliacaoAlunoResposta avalAlunoResposta = new cAvaliacaoAlunoResposta();
            if (avalAlunoResp.cdAvaliacaoAlunoResposta > 0)
            {
                avalAlunoResposta = avalAlunoResposta.Abrir(avalAlunoResp.cdAvaliacaoAlunoResposta);
            }
            string error = null;
            //using (TransactionScope scope = new TransactionScope())
            //{
            error = avalAlunoResposta.Salvar(
               avalAlunoResp.cdAvaliacaoAlunoResposta.ToString(),
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? avalAlunoResposta.cdAvaliacaoAluno : avalAlunoResp.cdAvaliacaoAluno,
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? avalAlunoResposta.cdQuestao : avalAlunoResp.cdQuestao,
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? (String.IsNullOrEmpty(avalAlunoResposta.cdAlternativa.ToString()) || avalAlunoResposta.cdAlternativa == 0 ? null : avalAlunoResposta.cdAlternativa.ToString()) : avalAlunoResp.cdAlternativa.ToString(),
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? (String.IsNullOrEmpty(avalAlunoResposta.cdAlternativaResposta.ToString()) || avalAlunoResposta.cdAlternativaResposta == 0 ? null : avalAlunoResposta.cdAlternativaResposta.ToString()) : avalAlunoResp.cdAlternativaResposta.ToString(),
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? avalAlunoResposta.dsResposta : avalAlunoResp.dsResposta,
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? avalAlunoResposta.verdadeiro.ToString() : avalAlunoResp.verdadeiro.ToString(),
               avalAlunoResp.acertou.ToString(),
               avalAlunoResp.pontuacao.ToString(),
               avalAlunoResp.cdAvaliacaoAlunoResposta > 0 ? avalAlunoResposta.feedback : avalAlunoResp.feedback,
               null,
               HttpContext.Current.Request.UserHostAddress,
               cdUsuario,
               avalAlunoResp.cdEmpresa);

            if (error == null)
            {
                error = SalvaNotasPorAvaliacaoAluno(avalAlunoResp.cdAvaliacaoAluno, avalAlunoResp.cdQuestao, avalAlunoResp.pontuacao, avalAlunoResp.cdEmpresa);

                if (error == null)
                {
                    cQuestao questao = new cQuestao().Abrir(avalAlunoResp.cdQuestao);

                    var novoValor = questao.GetFirstField(@"
                                select sum(res.pontuacao) as total from (
	                                select distinct aar.cdQuestao, aar.pontuacao 
		                                from tbneg_avaliacaoAlunoNotaDisciplina aand
	                                inner join tbneg_avaliacaoAlunoResposta aar on aar.cdAvaliacaoAluno = aand.cdAvaliacaoAluno
	                                inner join tbneg_questao q on q.cdQuestao = aar.cdQuestao and q.cdDisciplina = aand.cdDisciplina
	                                where aar.cdAvaliacaoAluno = " + avalAlunoResp.cdAvaliacaoAluno + @" and aand.cdDisciplina = " + questao.cdDisciplina + @"
                                ) as res
                        ") as decimal?;

                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dt = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();
                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow row = dt.NewdtAvaliacaoAlunoNotaDisciplinaRow();

                    row.cdAvaliacaoAluno = avalAlunoResp.cdAvaliacaoAluno;
                    row.cdDisciplina = questao.cdDisciplina;
                    row.notaObtida = novoValor.HasValue ? novoValor.Value : 0;

                    dt.AdddtAvaliacaoAlunoNotaDisciplinaRow(row);

                    error = new cAvaliacaoAlunoNotaDisciplina().atualizaNovo(avalAlunoResp.cdAvaliacaoAluno,
                       dt,
                       HttpContext.Current.Request.UserHostAddress,
                       cdUsuario,
                       avalAlunoResp.cdEmpresa);
                }
            }

            //    scope.Complete();
            //}

            return error;
        }

        [HttpPost]
        [Route("salvarfeedback")]
        [Filters.Professor(Filters.Programa.avaliacao, TipoAcesso.Editar)]
        public string SalvarFeedBackAvaliacaoAlunoResposta(AvaliacaoAlunoRespostaModel avalAlunoResp)
        {
            try
            {
                string query = $@"
                    update tbNEG_AvaliacaoAlunoResposta set feedback = '{avalAlunoResp.feedback}', dtUltAlt = getDate(), nucomputador = '{HttpContext.Current.Request.UserHostAddress}',
                        cdEmpresa = {avalAlunoResp.cdEmpresa}, cdUsuarioAlt = {cdUsuario}
                        where cdQuestao = {avalAlunoResp.cdQuestao} and cdAvaliacaoAluno = {avalAlunoResp.cdAvaliacaoAluno}";

                new cAvaliacaoAlunoResposta().executaSQL(query);

                new cAvaliacaoAlunoResposta().CloseConnection();
            }
            catch (Exception ex)
            {

                throw ex;
            }

            return null;
        }

        public string SalvaNotasPorAvaliacaoAluno(int cdAvaliacaoAluno, int cdQuestao, decimal? pontuacao, int cdEmpresa)
        {
            List<cAvaliacaoAlunoResposta> notasAluno = new cAvaliacaoAlunoResposta().ListarNotasPorAvaliacaoAluno(cdAvaliacaoAluno);
            cAvaliacaoAlunoNota avalAlunoNota = new cAvaliacaoAlunoNota();
            avalAlunoNota.AbrirAvaliacaoAlunoNotaPorAvaliacaoAluno(cdAvaliacaoAluno);
            decimal notaObtida = 0;
            string erro = "";

            //agrupa as altenativas por questões e soma a média aritmética entre todas elas;
            notaObtida = notasAluno.GroupBy(x => x.cdQuestao).Select(x => x.Average(y => y.pontuacao ?? 0)).Sum(x => x);

            cAvaliacaoAluno avalAluno = new cAvaliacaoAluno().Abrir(cdAvaliacaoAluno);
            erro = avalAlunoNota.Salvar(
                avalAlunoNota != null ? avalAlunoNota.cdAvaliacaoAlunoNota.ToString() : null,
                cdAvaliacaoAluno,
                avalAluno.dtInicioAvaliacaoNovo.Value,
                avalAluno.dtFimAvaliacaoNovo ,
                notaObtida,
                HttpContext.Current.Request.UserHostAddress,
                cdUsuario,
                cdEmpresa
                );

            if (String.IsNullOrEmpty(erro))
            {
                erro = avalAluno.AtualizaNotaAluno(
                    avalAluno.cdAvaliacaoAluno.ToString(),
                    notaObtida,
                    avalAluno.corrigida,
                    HttpContext.Current.Request.UserHostAddress,
                    cdUsuario,
                    cdEmpresa);
            }

            return erro;
        }

        [HttpGet]
        [Route("corrigiravaliacao/avaliacaoaluno/{cdAvaliacaoAluno}/empresa/{cdEmpresa}")]
        [ProfessorAutenticado]
        //TO DO - Mudar acrescentar modulo de acesso para professor (Correção)
        public string CorrigirAvaliacao(int cdAvaliacaoAluno, int cdEmpresa)
        {
            cAvaliacaoAluno avalAluno = new cAvaliacaoAluno().Abrir(cdAvaliacaoAluno);

            string erro = avalAluno.AtualizaNotaAluno(
              cdAvaliacaoAluno.ToString(),
              avalAluno.notaObtida,
              true,
             HttpContext.Current.Request.UserHostAddress,
                    cdUsuario,
                    cdEmpresa);

            return erro;
        }

        private decimal retornaPontuacaoAvaliacaoWeb(dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable dt)
        {
            return (from x in dt
                    where !x.IsacertouNull() &&
                          x.acertou
                    select new
                    {
                        cdQuestao = x.cdQuestao,
                        valor = x.pontuacao
                    }).Distinct().ToList().Sum(x => x.valor);
        }
        private decimal retornaPontuacaoAvaliacaoImpressa(dtsAvaliacao.dtAvaliacaoAlunoGabaritoDataTable dt)
        {
            return (from x in dt
                    where !x.IsacertouNull() &&
                          x.acertou
                    select new
                    {
                        cdQuestao = x.cdQuestao,
                        valor = x.valor
                    }).Distinct().ToList().Sum(x => x.valor);
        }

        [HttpPost]
        [Route("trilha")]
        [ProfessorAutenticado]
        public List<PesquisaAvaliacaoModel> ListarPorTrilha(List<int> cdsAvaliacao)
        {
            if (cdsAvaliacao.Where(x => x != 0).ToList().Count == 0)
                return new List<PesquisaAvaliacaoModel>();

            cAvaliacao avaliacao = new cAvaliacao();

            List<cAvaliacao> avaliacoes = avaliacao.ListarParaTrilha(" t.cdAvaliacao in (" + string.Join(",", cdsAvaliacao) + ")");

            List<PesquisaAvaliacaoModel> avaliacoesRes = new List<PesquisaAvaliacaoModel>();

            foreach (var x in avaliacoes)
            {
                PesquisaAvaliacaoModel avaliacaoModel = new PesquisaAvaliacaoModel();
                avaliacaoModel.cdAvaliacao = x.cdAvaliacao;
                avaliacaoModel.nmAvaliacao = x.nmAvaliacao;
                avaliacaoModel.nmAvaliacaoTipo = x.nmAvaliacaoTipo;
                avaliacaoModel.nmEtapa = x.nmEtapa;
                avaliacaoModel.nmAreaConhecimento = x.nmAreaConhecimento;
                avaliacaoModel.nmSegmento = x.nmSegmento;
                avaliacaoModel.tempoAvaliacao = x.tempoAvaliacao ?? 0;
                avaliacaoModel.dtAplicacao = x.dtAplicacao;
                avaliacaoModel.disponibilizada = (bool)x.disponibilizada;
                avaliacaoModel.notasPorDisciplina = (bool)x.notasPorDisciplina;
                avaliacaoModel.modoAplicacao = x.modoAplicacao;
                avaliacaoModel.disciplinas = new List<DisciplinaModel>();

                foreach (var y in new cAvaliacaoDisciplina().ListarPorAvaliacao(x.cdAvaliacao))
                {
                    DisciplinaModel discModel = new DisciplinaModel();
                    discModel.nmDisciplina = y.nmDisciplina;
                    discModel.cdDisciplina = y.cdDisciplina;

                    if (avaliacaoModel.notasPorDisciplina)
                    {
                        discModel.valor = y.valor;
                        avaliacaoModel.valor += y.valor;
                    }
                    else
                    {
                        discModel.valor = x.valor;
                        avaliacaoModel.valor = x.valor;
                    }

                    avaliacaoModel.disciplinas.Add(discModel);
                }
                avaliacoesRes.Add(avaliacaoModel);
            }

            return avaliacoesRes;
        }

        [HttpGet]
        [Route("moduloItem/{cdItemModulo}")]
        [Filters.Aluno]
        public PesquisaAvaliacaoModel GetPorTrilha(int cdItemModulo)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAvaliacao avaliacao = new cAvaliacao().AbrirParaModuloItem(cdItemModulo);
            cAvaliacao aval = new cAvaliacao().GetNotaECorrigida(avaliacao.cdAvaliacao, perfil.Aluno.cdMatricula);

            PesquisaAvaliacaoModel avaliacaoModel = new PesquisaAvaliacaoModel();
            avaliacaoModel.cdAvaliacao = avaliacao.cdAvaliacao;
            avaliacaoModel.nmAvaliacao = avaliacao.nmAvaliacao;
            avaliacaoModel.nmAvaliacaoTipo = avaliacao.nmAvaliacaoTipo;
            avaliacaoModel.nmEtapa = avaliacao.nmEtapa;
            avaliacaoModel.nmAreaConhecimento = avaliacao.nmAreaConhecimento;
            avaliacaoModel.nmSegmento = avaliacao.nmSegmento;
            avaliacaoModel.tempoAvaliacao = avaliacao.tempoAvaliacao ?? 0;
            avaliacaoModel.dtAplicacao = avaliacao.dtAplicacao;
            avaliacaoModel.disponibilizada = (bool)avaliacao.disponibilizada;
            avaliacaoModel.notasPorDisciplina = (bool)avaliacao.notasPorDisciplina;
            avaliacaoModel.modoAplicacao = avaliacao.modoAplicacao;
            avaliacaoModel.exibirNota = avaliacao.exibirNota ?? false;
            if (aval != null)
            {
                avaliacaoModel.corrigida = aval.corrigida;
                avaliacaoModel.notaObtida = aval.notaObtida;
            }

            // Verifica se já está realizando outra ou à esta avaliação. Se não, verifica se já foi realizada ou se o tempo acabou.
            avaliacaoModel.comecar = (new cAluno().UltimaRealizada(perfil.Aluno.cdMatricula) == null || new cAluno().UltimaRealizada(perfil.Aluno.cdMatricula) == avaliacao.cdAvaliacao) ? 
                                      avaliacao.PodeComecar(avaliacao.cdAvaliacao, perfil.Aluno.cdMatricula) : false;
            avaliacaoModel.cdEmpresa = avaliacao.cdempresa;
            avaliacaoModel.disciplinas = new List<DisciplinaModel>();

            foreach (var y in new cAvaliacaoDisciplina().ListarPorAvaliacao(avaliacao.cdAvaliacao))
            {
                DisciplinaModel discModel = new DisciplinaModel();
                discModel.nmDisciplina = y.nmDisciplina;
                discModel.cdDisciplina = y.cdDisciplina;

                if (avaliacaoModel.notasPorDisciplina)
                {
                    discModel.valor = y.valor;
                    avaliacaoModel.valor += y.valor;
                }
                else
                {
                    discModel.valor = avaliacao.valor;
                    avaliacaoModel.valor = avaliacao.valor;
                }

                avaliacaoModel.disciplinas.Add(discModel);
            }

            return avaliacaoModel;
        }

        [HttpPost]
        [Route("portrilha")]
        public List<PesquisaAvaliacaoModel> GetByTrilha([FromBody] GetByTrilhaModel model)
        {
            string sql = " ad.CDDISCIPLINA IN (" + string.Join(" ,", model.disciplinas.ConvertAll(x => x.ToString())) + ") " +
                   " AND T.IDATIVO = 1 AND T.STTRILHA = 1";

            cAvaliacao avaliacao = new cAvaliacao();

            List<cAvaliacao> avaliacoes = avaliacao.ListarParaTrilha(sql);

            List<PesquisaAvaliacaoModel> avaliacoesRes = new List<PesquisaAvaliacaoModel>();

            foreach (var x in avaliacoes)
            {
                PesquisaAvaliacaoModel avaliacaoModel = new PesquisaAvaliacaoModel();
                avaliacaoModel.cdAvaliacao = x.cdAvaliacao;
                avaliacaoModel.nmAvaliacao = x.nmAvaliacao;
                avaliacaoModel.nmAvaliacaoTipo = x.nmAvaliacaoTipo;
                avaliacaoModel.nmEtapa = x.nmEtapa;
                avaliacaoModel.nmAreaConhecimento = x.nmAreaConhecimento;
                avaliacaoModel.nmSegmento = x.nmSegmento;
                avaliacaoModel.tempoAvaliacao = x.tempoAvaliacao ?? 0;
                avaliacaoModel.dtAplicacao = x.dtAplicacao;
                avaliacaoModel.disponibilizada = (bool)x.disponibilizada;
                avaliacaoModel.notasPorDisciplina = (bool)x.notasPorDisciplina;
                avaliacaoModel.modoAplicacao = x.modoAplicacao;
                avaliacaoModel.disciplinas = new List<DisciplinaModel>();

                foreach (var y in new cAvaliacaoDisciplina().ListarPorAvaliacao(x.cdAvaliacao))
                {
                    DisciplinaModel discModel = new DisciplinaModel();
                    discModel.nmDisciplina = y.nmDisciplina;
                    discModel.cdDisciplina = y.cdDisciplina;

                    if (avaliacaoModel.notasPorDisciplina)
                    {
                        discModel.valor = y.valor;
                        avaliacaoModel.valor += y.valor;
                    }
                    else
                    {
                        discModel.valor = x.valor;
                    }

                    avaliacaoModel.disciplinas.Add(discModel);
                }
                avaliacoesRes.Add(avaliacaoModel);
            }
            return avaliacoesRes;
        }

    }

}