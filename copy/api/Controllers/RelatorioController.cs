using cDados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/relatorio")]
    public class RelatorioController : ApiController
    {
        [HttpGet]
        [Route("impressaoCorrecaoAvaliacao/avaliacao/{cdAvaliacao}/serie/{cdSerie}/disciplina/{cdDisciplina}/turma/{cdTurma}")]
        public HttpResponseMessage ImpressaoCorrecaoAvaliacao(int cdAvaliacao, int cdSerie, int cdDisciplina, int cdTurma)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;
            ReportViewer report = new ReportViewer();

            dtsCorrecao dt = new dtsCorrecao();
            dtAvaliacaoTableAdapter tba = new dtAvaliacaoTableAdapter();
            dtAlunoTableAdapter tbal = new dtAlunoTableAdapter();
            tba.Fill(dt.dtAvaliacao, cdAvaliacao, cdSerie, cdTurma, cdDisciplina);
            tbal.Fill(dt.dtAluno, cdAvaliacao, cdSerie, cdTurma, cdDisciplina);

            //report.LocalReport.Refresh();
            //report.Reset();
            report.LocalReport.EnableExternalImages = true;
            report.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds2 = new ReportDataSource("dtAvaliacao", dt.dtAvaliacao as DataTable);
            ReportDataSource rds3 = new ReportDataSource("dtAluno", dt.dtAluno as DataTable);

            report.LocalReport.DataSources.Add(rds2);
            report.LocalReport.DataSources.Add(rds3);
            report.LocalReport.ReportPath = "Reports/CorrecaoAvaliacao.rdlc";
            byte[] bytes = report.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            //Stream stream = new MemoryStream(bytes);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
            };
            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = "CorrecaoAvaliacao.pdf"
                };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");

            return result;
        }

        [HttpGet]
        [Route("monitoramentoresultado/avaliacao/{cdAvaliacao}/serie/{cdSerie}/disciplina/{cdDisciplina}")]
        public HttpResponseMessage RelatorioMonitoramento(int cdAvaliacao, int cdSerie, int cdDisciplina)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;
            ReportViewer report = new ReportViewer();

            dtMonitoramentoResultado dt = new dtMonitoramentoResultado();
            avaliacaoTableAdapter tba = new avaliacaoTableAdapter();
            turmaTableAdapter tbt = new turmaTableAdapter();
            questaoTableAdapter qbt = new questaoTableAdapter();
            tba.Fill(dt.avaliacao, cdAvaliacao, cdSerie, cdDisciplina);
            tbt.Fill(dt.turma, cdAvaliacao, cdSerie);
            qbt.Fill(dt.questao, cdAvaliacao, cdDisciplina);

            //report.LocalReport.Refresh();
            //report.Reset();
            report.LocalReport.EnableExternalImages = true;
            report.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds2 = new ReportDataSource("avaliacao", dt.avaliacao as DataTable);
            ReportDataSource rds3 = new ReportDataSource("turma", dt.turma as DataTable);
            ReportDataSource rds4 = new ReportDataSource("questao", dt.questao as DataTable);

            report.LocalReport.DataSources.Add(rds2);
            report.LocalReport.DataSources.Add(rds3);
            report.LocalReport.DataSources.Add(rds4);
            report.LocalReport.ReportPath = "Reports/monitoramentoResultado.rdlc";
            byte[] bytes = report.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            //Stream stream = new MemoryStream(bytes);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
            };
            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = "#" + cdAvaliacao.ToString() + " - RelatorioMonitoramento.pdf"
                };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");

            return result;
        }

        [HttpGet]
        [Route("questao/aluno/avaliacao/{cdAvaliacao}")]
        public HttpResponseMessage QuestaoAluno(int cdAvaliacao)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;
            ReportViewer report = new ReportViewer();

            dtsQuestaoAluno dt = new dtsQuestaoAluno();
            string sql = @"
                select Res.cdAvaliacaoAluno,
	                Res.cdQuestao,
	                Res.ordem,
	                Res.nmpessoa,
	                Res.nmTurma,
	                Res.dsAlternativa,
	                case when Res.acertou = 1 then Res.dsAlternativa 
	                else (
	                select alternativa from(
		                select qa.correta, char((row_number() 
					                over(partition by aar.cdAvaliacaoAluno, aar.cdQuestao order by aar.cdAvaliacaoAluno, aar.cdQuestao)) + 64) as alternativa 
				                from tbneg_avaliacaoAlunoResposta aar
				                inner join tbneg_questaoAlternativa qa on qa.cdQuestaoAlternativa = aar.cdAlternativa
				                where aar.cdAvaliacaoAluno = Res.cdAvaliacaoAluno and aar.cdQuestao = Res.cdQuestao ) as Res1
		                where Res1.correta = 1
	                ) 
	                end as dsAlternativaCorreta,
	                d.nmDisciplina,
	                c.nmtopico,
	                h.nmHabilidade,
	                case when Res.anulada = 1 then 'S' else null end as anulada
                from (
                select aar.cdAvaliacaoAluno,
	                aar.cdQuestao,
	                aq.ordem,
	                p.nmpessoa,
	                t.nmTurma,
	                char(
	                (row_number() 
	                over(partition by aar.cdAvaliacaoAluno, aar.cdQuestao order by aar.cdAvaliacaoAluno, aar.cdQuestao)) + 64) 
	                as dsAlternativa,
	                aar.acertou,
	                aar.verdadeiro,
	                aar.anulada
		                from tbneg_avaliacaoQuestao aq
                inner join tbneg_questao q on q.cdQuestao = aq.cdQuestao
                inner join tbneg_avaliacaoAlunoResposta aar on aar.cdQuestao = aq.cdQuestao
                inner join tbneg_avaliacaoAluno aa on aa.cdAvaliacaoAluno = aar.cdAvaliacaoAluno and aa.cdAvaliacao = aq.cdAvaliacao
                inner join tbneg_aluno a on a.cdAluno = aa.cdAluno
				inner join tbneg_pessoa p on p.cdpessoa = a.cdpessoa
				inner join tbneg_matricula mat on mat.cdaluno = a.cdaluno
                inner join tbneg_turma t on mat.cdTurma = t.cdTurma
                where aq.cdAvaliacao = " + cdAvaliacao + @" and q.cdQuestaoTipo = 3
                ) as Res
                inner join tbneg_questao q on q.cdQuestao = Res.cdQuestao
                inner join tbneg_disciplina d on d.cdDisciplina = q.cdDisciplina
                inner join tbNEG_Topico c on c.cdTopico = q.cdTopico
                inner join tbneg_habilidade h on h.cdHabilidade = q.cdHabilidade
                where Res.verdadeiro = 1
                order by ordem
            ";

            dt.QuestaoAluno.Load(new cComum().ExecuteReader(sql));

            //report.LocalReport.Refresh();
            //report.Reset();
            report.LocalReport.EnableExternalImages = true;
            report.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds2 = new ReportDataSource("QuestaoAluno", dt.QuestaoAluno as DataTable);

            report.LocalReport.DataSources.Add(rds2);
            report.LocalReport.ReportPath = "Reports/questaoAluno.rdlc";
            //ReportParameter rptParam = new ReportParameter("your_parameter");
            //report.LocalReport.SetParameters(rptParam);
            byte[] bytes = report.LocalReport.Render("Excel", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            //Stream stream = new MemoryStream(bytes);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
            };
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "DadosGeraisAvaliacao.xls"
                };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/excel");

            return result;
        }


        [HttpGet]
        [Route("impressaogabarito/avaliacao/{cdAvaliacao}/serie/{cdserie}")]
        public HttpResponseMessage RelatorioImpressaoGabarito(int cdAvaliacao, int cdSerie)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;
            ReportViewer report = new ReportViewer();

            dtsImpressaoGabarito dt = new dtsImpressaoGabarito();
            avaliacaoGabaritoTableAdapter atba = new avaliacaoGabaritoTableAdapter();
            gabaritoTableAdapter gtba = new gabaritoTableAdapter();
            atba.Fill(dt.avaliacaoGabarito, cdAvaliacao, cdSerie);
            gtba.Fill(dt.gabarito, cdAvaliacao);

            //report.LocalReport.Refresh();
            //report.Reset();
            report.LocalReport.EnableExternalImages = true;
            report.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds2 = new ReportDataSource("avaliacaoGabarito", dt.avaliacaoGabarito as DataTable);
            ReportDataSource rds3 = new ReportDataSource("gabarito", dt.gabarito as DataTable);
            report.LocalReport.DataSources.Add(rds2);
            report.LocalReport.DataSources.Add(rds3);
            report.LocalReport.ReportPath = "Reports/impressaoGabarito.rdlc";
            byte[] bytes = report.LocalReport.Render("Excel", null, out mimeType, out encoding, out extension, out streamIds, out warnings);

            //Stream stream = new MemoryStream(bytes);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
            };
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "#" + cdAvaliacao.ToString() + " - ImpressaoGabarito.xls"
                };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/excel");

            return result;
        }




        cAvaliacao avaliacao = new cAvaliacao();
        cAvaliacaoTipo avaliacaoTipo = new cAvaliacaoTipo();
        cAvaliacaoDisciplina avaliacaoDisciplina = new cAvaliacaoDisciplina();

        string cdAvaliacoes = string.Empty;
        string ordem = string.Empty;
        string qtdeNomesPublicados = string.Empty;

        string[] arrAvaliacoes;

        DataTable dtDisciplinas = new DataTable();

        [HttpGet]
        [Route("notaspordisciplina/avaliacao/{cdAvaliacaoP}")]
        public HttpResponseMessage RelNotasPorDisciplina(string cdAvaliacaoP)
        {
            cdAvaliacoes = cdAvaliacaoP;
            ordem = "nmTurma, nome, matricula";
            qtdeNomesPublicados = "";

            arrAvaliacoes = cdAvaliacoes.Split(',');

            avaliacao.Abrir(Convert.ToInt32(arrAvaliacoes[0]));
            avaliacaoTipo.Abrir(avaliacao.cdAvaliacaoTipo);

            DataTable dtAvaliacoes = new DataTable();

            #region CRIA COLUNAS DO DATATABLE

            dtAvaliacoes.Columns.Add(new DataColumn("cdAluno", typeof(int)));
            dtAvaliacoes.Columns.Add(new DataColumn("Nr.", typeof(int)));
            dtAvaliacoes.Columns.Add(new DataColumn("Turma", typeof(string)));
            dtAvaliacoes.Columns.Add(new DataColumn("Matrícula", typeof(string)));
            dtAvaliacoes.Columns.Add(new DataColumn("Aluno", typeof(string)));
            dtAvaliacoes.Columns.Add(new DataColumn("SOMA", typeof(decimal)));

            foreach (string cdAvaliacao in arrAvaliacoes)
            {

                dtsAvaliacao.dtDisciplinaDataTable dtDisciplina = avaliacaoDisciplina.getListaDisciplina(Convert.ToInt32(cdAvaliacao));
                foreach (dtsAvaliacao.dtDisciplinaRow rowDisciplina in dtDisciplina.Rows)
                {

                    if (!dtAvaliacoes.Columns.Contains(rowDisciplina.cdDisciplina.ToString()))
                        dtAvaliacoes.Columns.Add(new DataColumn(rowDisciplina.cdDisciplina.ToString(), typeof(decimal)));
                }

            }

            #endregion

            #region PREENCHE VALORES DO DATATABLE

            try
            {
                /* string SQL = string.Format(@"SELECT distinct a.cdAluno, null as 'Nr.', t.nmTurma as Turma, a.matricula as Matrícula, a.nome as Aluno, cast(isnull(sum(aa.notaObtida), 0) as decimal(18, 1)) as SOMA
                                              FROM aluno a
                                              INNER JOIN avaliacaoAluno aa on a.cdAluno = aa.cdAluno
                                              INNER JOIN turma t on t.cdTurma = a.cdTurma
                                              WHERE aa.cdAvaliacao in ({0})
                                              GROUP BY  a.cdAluno, t.nmTurma, a.matricula, a.nome
                                              ORDER BY {1}", cdAvaliacoes, ordem);

                 */
                string SQL = string.Format(@"SELECT distinct a.cdAluno, null as 'Nr.', t.nmTurma as Turma, a.matricula as Matrícula, a.nome as Aluno, cast(isnull(sum(aa.notaObtida), 0) as decimal(18, 1)) as SOMA
                                         FROM aluno a
                                         INNER JOIN avaliacaoAluno aa on a.cdAluno = aa.cdAluno
                                         INNER JOIN turma t on t.cdTurma = a.cdTurma
                                         WHERE aa.cdAvaliacao in ({0})
                                         GROUP BY  a.cdAluno, t.nmTurma, a.matricula, a.nome
                                         ", cdAvaliacoes);



                SqlDataReader objDR = avaliacao.ExecuteReader(SQL);
                dtAvaliacoes.Load(objDR);

                foreach (DataRow dtRow in dtAvaliacoes.Rows)
                {
                    int indiceColuna = 0;
                    foreach (DataColumn dtColumn in dtAvaliacoes.Columns)
                    {
                        if (indiceColuna > 5 && indiceColuna < dtAvaliacoes.Columns.Count)
                        {
                            int cdDisciplina = Convert.ToInt32(dtColumn.ColumnName);
                            int cdAluno = Convert.ToInt32(dtRow["cdAluno"]);

                            string sqlDisciplina = string.Format(@"SELECT andi.notaObtida as SOMA
                                                               FROM aluno a
                                                               INNER JOIN avaliacaoAluno aa on a.cdAluno = aa.cdAluno
                                                               INNER JOIN avaliacaoDisciplina ad on ad.cdAvaliacao = aa.cdAvaliacao
                                                               INNER JOIN avaliacaoAlunoNotaDisciplina andi on andi.cdAvaliacaoAluno = aa.cdAvaliacaoAluno and andi.cdDisciplina = ad.cdDisciplina
                                                               WHERE aa.cdAvaliacao in ({0}) and a.cdAluno = {1} and ad.cdDisciplina = {2}", cdAvaliacoes, cdAluno, cdDisciplina);

                            decimal? nota = null;

                            SqlDataReader objDRNota = avaliacao.ExecuteReader(sqlDisciplina);
                            while (objDRNota.Read())
                            {
                                if (!nota.HasValue)
                                    nota = 0;

                                if (!objDRNota.IsDBNull(0))
                                    nota += objDRNota.GetDecimal(0);
                            }

                            if (nota.HasValue)
                                dtRow[dtColumn] += Convert.ToDecimal(nota).ToString("n1");
                        }

                        indiceColuna++;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                avaliacao.CloseConnection();
            }


            // int linha = 0;
            int indiceCol = 0;
            DataRow row;

            if (!dtDisciplinas.Columns.Contains("Disciplina"))
                dtDisciplinas.Columns.Add(new DataColumn("Disciplina", typeof(int)));
            if (!dtDisciplinas.Columns.Contains("Area"))
                dtDisciplinas.Columns.Add(new DataColumn("Area", typeof(int)));
            if (!dtDisciplinas.Columns.Contains("NomeArea"))
                dtDisciplinas.Columns.Add(new DataColumn("NomeArea", typeof(string)));
            if (!dtDisciplinas.Columns.Contains("NomeDisciplina"))
                dtDisciplinas.Columns.Add(new DataColumn("NomeDisciplina", typeof(string)));

            if (!dtDisciplinas.Columns.Contains("nColuna"))
                dtDisciplinas.Columns.Add(new DataColumn("nColuna", typeof(int)));

            if (!dtDisciplinas.Columns.Contains("Nota"))
                dtDisciplinas.Columns.Add(new DataColumn("Nota", typeof(decimal)));

            try
            {

                foreach (DataColumn dtColumn in dtAvaliacoes.Columns)
                {
                    string nome = "";
                    if (indiceCol > 5 && indiceCol < dtAvaliacoes.Columns.Count)
                    {

                        string codigo = dtColumn.ColumnName;
                        string SQL2 = string.Format(@"select distinct acd.cdAreaConhecimento, ac.nmAreaConhecimento ,d.nmDisciplina
                                                from areaConhecimentoDisciplina acd
                                                inner join disciplina d on d.cdDisciplina= acd.cdDisciplina
                                                inner join areaConhecimento ac on acd.cdAreaConhecimento= ac.cdAreaConhecimento
                                                where acd.cdDisciplina ={0}", codigo);

                        SqlDataReader objDR2 = avaliacao.ExecuteReader(SQL2);
                        if (objDR2.Read())
                        {

                            //var listaFiltro = lista.Select(x => x.ItemArray.GetValue(3)).Distinct();
                            var lista = dtDisciplinas.AsEnumerable().ToList();
                            nome = objDR2.GetValue(2).ToString().Substring(0, 3);
                            var filtro = lista.Where(y => y.Field<string>("NomeDisciplina") == nome);

                            if (filtro.Count() > 0)
                            {
                                nome = nome + 2;
                            }

                            row = dtDisciplinas.NewRow();
                            row["Disciplina"] = dtColumn.ColumnName;
                            row["Area"] = objDR2.GetValue(0);
                            row["NomeArea"] = objDR2.GetValue(1);
                            row["NomeDisciplina"] = nome;
                            dtDisciplinas.Rows.Add(row);

                        }
                        //  linha++;

                    }
                    indiceCol++;
                }

            }
            catch (Exception ex)
            {

            }
            finally
            {
                avaliacao.CloseConnection();
            }

            DataView dv = dtAvaliacoes.AsDataView();
            if (ordem.Contains("SOMA"))
                dv.Sort = "SOMA DESC, Aluno";
            else
                dv.Sort = "Turma, Aluno";
            dtAvaliacoes = dv.ToTable();

            #endregion

            #region ALTERA O NOME DAS COLUNAS DA AVALIAÇÃO DE ACORDO COM O TIPO ESCOLHIDO

            foreach (string cdAvaliacaoItem in arrAvaliacoes)
            {
                int cdAvaliacao = Convert.ToInt32(cdAvaliacaoItem);

                dtsAvaliacao.dtDisciplinaDataTable dtDisciplina = avaliacaoDisciplina.getLista(cdAvaliacao);
                foreach (dtsAvaliacao.dtDisciplinaRow rowDisciplina in dtDisciplina)
                    if (dtAvaliacoes.Columns[rowDisciplina.cdDisciplina.ToString()] != null)
                        dtAvaliacoes.Columns[rowDisciplina.cdDisciplina.ToString()].ColumnName =
                            rowDisciplina.nmDisciplina.Length > 2 ?
                            dtAvaliacoes.Columns.Contains(rowDisciplina.nmDisciplina.Substring(0, 3)) ? rowDisciplina.nmDisciplina.Substring(0, 3) + "2" : rowDisciplina.nmDisciplina.Substring(0, 3) :
                            rowDisciplina.nmDisciplina;
            }

            dtAvaliacoes.Columns.Remove("cdAluno");

            #endregion

            #region PREENCHE A CLASSIFICAÇÃO DOS ALUNOS E ORDENA O DATATABLE

            if (!string.IsNullOrEmpty(qtdeNomesPublicados) && Convert.ToInt32(qtdeNomesPublicados) < dtAvaliacoes.Rows.Count)
            {
                if (ordem.Contains("SOMA"))
                {
                    for (int i = Convert.ToInt32(qtdeNomesPublicados); i < dtAvaliacoes.Rows.Count; i++)
                        dtAvaliacoes.Rows[i]["Aluno"] = string.Empty;
                }
                else
                {
                    foreach (string turma in dtAvaliacoes.AsEnumerable().Select(a => a["Turma"]).Distinct().ToArray())
                    {
                        if (!string.IsNullOrEmpty(qtdeNomesPublicados) && Convert.ToInt32(qtdeNomesPublicados) < dtAvaliacoes.AsEnumerable().Count(t => t["Turma"].ToString() == turma))
                        {
                            int indice = 0;
                            foreach (DataRow dtRow in dtAvaliacoes.AsEnumerable().Where(t => t["Turma"].ToString() == turma))
                            {
                                if (indice >= Convert.ToInt32(qtdeNomesPublicados))
                                    dtRow["Aluno"] = string.Empty;
                                indice++;
                            }
                        }
                    }
                }
            }

            DataView dvComNome = dtAvaliacoes.AsDataView();
            dvComNome.RowFilter = "Aluno <> ''";

            DataView dvSemNome = dtAvaliacoes.AsDataView();
            dvSemNome.RowFilter = "Aluno = ''";

            if (ordem.Contains("SOMA"))
            {
                decimal notaAnterior = 0;
                int posicao = 1;
                int index = 0;
                int posicaoAnterior = 1;
                foreach (DataRow dtRow in dtAvaliacoes.Rows)
                {
                    decimal notaAtual = 0;
                    if (dtRow["SOMA"].GetType() != typeof(DBNull))
                        notaAtual = Convert.ToDecimal(dtRow["SOMA"]);

                    if (notaAtual.ToString("n1") != notaAnterior.ToString("n1"))
                    {
                        dtRow["Nr."] = (posicao + index).ToString();
                        posicaoAnterior = posicao + index;
                    }
                    else
                    {
                        dtRow["Nr."] = posicaoAnterior;
                    }

                    index++;

                    notaAnterior = notaAtual;
                }

                dvComNome.Sort = "SOMA DESC, Aluno";
                dvSemNome.Sort = "Matrícula";
            }
            else
            {
                dtAvaliacoes.Columns.Remove("Nr.");

                dvComNome.Sort = "Turma, Aluno";
                dvSemNome.Sort = "Turma, Matrícula";
            }

            DataTable dtComNome = dvComNome.ToTable();
            DataTable dtSemNome = dvSemNome.ToTable();

            DataTable dtExportar = dtAvaliacoes.Copy();
            dtExportar.Clear();

            foreach (DataRow dtRowNome in dtComNome.Rows)
                dtExportar.ImportRow(dtRowNome);

            foreach (DataRow dtRowSemNome in dtSemNome.Rows)
                dtExportar.ImportRow(dtRowSemNome);

            #endregion

            #region EXPORTAR PARA EXCEL

            string nomeRelatorio = "NOTAS POR DISCIPLINA";

            if (ordem.Contains("Turma"))
                return criarPlanilha(dtExportar, nomeRelatorio, true);
            else
                return criarPlanilha(dtExportar, nomeRelatorio, false);

            #endregion
        }

        private HttpResponseMessage criarPlanilha(DataTable dt, string nomeRelatorio, bool separarPorTurma)
        {
            string alfebeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            int entrou = 0;

            var workbook = new XLWorkbook();

            if (separarPorTurma)
            {
                foreach (string turma in dt.AsEnumerable().Select(t => t["Turma"]).Distinct())
                {
                    var ws = workbook.Worksheets.Add("Turma " + (turma.Length > 25 ? turma.Substring(0, 25) : turma));

                    string nomeAvaliacao = string.Empty;

                    foreach (string cdAvaliacao in arrAvaliacoes)
                    {
                        avaliacao = new cAvaliacao();
                        avaliacao.Abrir(Convert.ToInt32(cdAvaliacao));

                        if (string.IsNullOrEmpty(nomeAvaliacao))
                            nomeAvaliacao += avaliacao.nmAvaliacao;
                        else
                            nomeAvaliacao += " / " + avaliacao.nmAvaliacao;
                    }

                    //criar titulo
                    ws.Cell("A2").Value = nomeRelatorio;
                    ws.Cell("A4").Value = "Tipo de Avaliação: " + avaliacaoTipo.dsTipo;
                    ws.Cell("A5").Value = "Nome da avaliação: " + nomeAvaliacao;

                    cClassificacao classificacao = new cClassificacao();
                    classificacao.Abrir(avaliacao.cdClassificacaoInformacao);

                    cAvaliacaoGrupo avaliacaoGrupo = new cAvaliacaoGrupo();
                    dtsAvaliacao.dtGrupoDataTable dtGrupo = avaliacaoGrupo.getLista(avaliacao.cdAvaliacao);

                    ws.Cell("A7").Value = "Classificação da informação: " + classificacao.titClassificacao;
                    ws.Cell("A8").Value = "Grupo de acesso: " + string.Join(", ", dtGrupo.Select(g => g.nmGrupo));

                    int indexLinha = 10;
                    int indexColuna = 0;


                    //inserir colunas media
                    var lista = dtDisciplinas.AsEnumerable().ToList();
                    var listaFiltro = lista.Select(x => x.ItemArray.GetValue(2)).Distinct();

                    var listaFiltro2 = lista.Select(x => x.ItemArray.GetValue(1)).Distinct();

                    List<int> colunas = new List<int>();
                    Dictionary<int, string> areasColunas = new Dictionary<int, string>();
                    int Ncoluna = 4;
                    int p = 0;
                    foreach (int d in listaFiltro2)
                    {
                        int cont = lista.Where(y => y.Field<int>("Area") == d).Count();

                        Ncoluna = Ncoluna + cont + p;

                        colunas.Add(Ncoluna);
                        areasColunas.Add(Ncoluna, lista.Where(y => y.Field<int>("Area") == d).FirstOrDefault().Field<string>("NomeArea").Substring(0, 3));

                        if (p == 0)
                            ++p;
                    }

                    //criar cabecalho
                    foreach (DataColumn coluna in dt.Columns)
                    {
                        ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = coluna.ColumnName;

                        if (!coluna.ColumnName.Equals("Aluno"))
                            ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        else
                            ws.Column(indexColuna + 1).Width = 40;

                        indexColuna++;
                    }

                    //criar linhas
                    indexLinha = 11;
                    indexColuna = 0;
                    foreach (DataRow linha in dt.AsEnumerable().Where(t => t["Turma"].Equals(turma)))
                    {
                        indexColuna = 0;
                        foreach (DataColumn coluna in dt.Columns)
                        {
                            if (linha[coluna].GetType() == typeof(decimal))
                            {
                                ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = Convert.ToDecimal(linha[coluna]);
                                ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).SetDataType(XLCellValues.Number);
                            }
                            else
                            {
                                ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = linha[coluna];
                            }

                            if (!coluna.ColumnName.Equals("Aluno"))
                            {
                                ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                                if (string.IsNullOrEmpty(ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value.ToString()))
                                    ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Fill.BackgroundColor = XLColor.LightGray;
                            }

                            indexColuna++;
                        }
                        indexLinha++;
                    }


                    for (int x = 0; x < dtDisciplinas.Rows.Count; x++)
                    {
                        dtDisciplinas.Rows[x][4] = dt.Columns.IndexOf(dtDisciplinas.Rows[x][3].ToString());
                    }



                    int a = 1;
                    foreach (int k in colunas)
                    {
                        int linha = 10;

                        if (a != colunas.Count())
                        {
                            ws.Column(k).InsertColumnsAfter(1);
                            ws.Cell(alfebeto[k] + linha.ToString()).Value = areasColunas[k];//"MÉD";
                            ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                            ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                        }

                        else
                        {
                            ws.Cell(alfebeto[k] + linha.ToString()).Value = areasColunas[k];//"MÉD";
                            ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                            ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                        }
                        a++;
                    }

                    indexLinha = 11;
                    indexColuna = 0;
                    foreach (DataRow linha in dt.AsEnumerable().Where(t => t["Turma"].Equals(turma)))
                    {

                        decimal valor = 0;
                        for (int x = 0; x < dtDisciplinas.Rows.Count; x++)
                        {
                            if (linha.ItemArray.GetValue(Convert.ToInt32(dtDisciplinas.Rows[x][4])) != DBNull.Value)
                            {
                                valor = Convert.ToDecimal(linha.ItemArray.GetValue(Convert.ToInt32(dtDisciplinas.Rows[x][4])));

                            }

                            else { valor = 0; }

                            dtDisciplinas.Rows[x][5] = valor;
                        }

                        indexColuna = 0;

                        foreach (DataColumn coluna in dt.Columns)
                        {

                            decimal mediaArea = 0;
                            var listaArea = lista.Select(x => x.ItemArray.GetValue(1)).Distinct();
                            int o = 0;
                            int c = 1;
                            foreach (int k in colunas)
                            {
                                int n = Convert.ToInt32(listaArea.ElementAt(o));

                                mediaArea = lista
                                        .Where(y => y.Field<int>("Area") == n).Average(s => s.Field<decimal>("Nota"));

                                if (c != colunas.Count())
                                {
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Value = mediaArea;
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.NumberFormat.Format = "0.0";
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                                }

                                else
                                {
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Value = mediaArea;
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.NumberFormat.Format = "0.0";
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                                    ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                                }
                                c++;

                                o++;
                            }

                            indexColuna++;
                        }
                        indexLinha++;
                    }


                    //Range tabela
                    var rngTabela = ws.Range("A1:" + alfebeto[dt.Columns.Count + colunas.Count] + (dt.AsEnumerable().Where(t => t["turma"].ToString() == turma).Count() + 10));
                    rngTabela.Style.Font.FontName = "Arial";
                    rngTabela.Style.Font.FontSize = 10;

                    //Cabeçalho tabela
                    var rngCabecalhoGrid = ws.Range("A10:" + alfebeto[dt.Columns.Count + colunas.Count] + 10);
                    rngCabecalhoGrid.Style.Font.Bold = true;

                    //Range tabela sem titulo
                    var rngTabelaSemTitulo = ws.Range("A10:" + alfebeto[dt.Columns.Count + colunas.Count - 1] + (dt.AsEnumerable().Where(t => t["turma"].ToString() == turma).Count() + 10));
                    rngTabelaSemTitulo.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                    rngTabelaSemTitulo.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                    rngTabelaSemTitulo.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                    rngTabelaSemTitulo.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                    //int qtdeColunas = 11;
                    //if (dt.Columns.Count - 1 > 11)
                    int qtdeColunas = 8;
                    if (dt.Columns.Count - 1 > 8)
                        qtdeColunas = dt.Columns.Count - 1;

                    //Range titulo
                    //var rngTitulo = ws.Range("A2:" + alfebeto[qtdeColunas] + "2");
                    var rngTitulo = ws.Range("A2:" + alfebeto[qtdeColunas - 1] + "2");
                    rngTitulo.Merge();
                    rngTitulo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    rngTitulo.Style.Font.Bold = true;

                    //Range tipo
                    //var rngTipo = ws.Range("A4:" + alfebeto[qtdeColunas] + "4");
                    var rngTipo = ws.Range("A4:" + alfebeto[qtdeColunas - 1] + "4");
                    rngTipo.Merge();
                    rngTipo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    rngTipo.Style.Font.Bold = true;

                    //Range nome
                    //var rngNome = ws.Range("A5:" + alfebeto[qtdeColunas] + "5");
                    var rngNome = ws.Range("A5:" + alfebeto[qtdeColunas - 1] + "5");
                    rngNome.Merge();
                    rngNome.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    rngNome.Style.Font.Bold = true;

                    //Range classificação
                    //var rngClasificacao = ws.Range("A7:" + alfebeto[qtdeColunas] + "7");
                    var rngClasificacao = ws.Range("A7:" + alfebeto[qtdeColunas - 1] + "7");
                    rngClasificacao.Merge();
                    rngClasificacao.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                    rngClasificacao.Style.Font.FontSize = 8;

                    //Range grupo acesso
                    //var rngGrupoAcesso = ws.Range("A8:" + alfebeto[qtdeColunas] + "8");
                    var rngGrupoAcesso = ws.Range("A8:" + alfebeto[qtdeColunas - 1] + "8");
                    rngGrupoAcesso.Merge();
                    rngGrupoAcesso.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                    rngGrupoAcesso.Style.Font.FontSize = 8;

                    ws.Columns().AdjustToContents();
                    entrou = 1;
                }
            }
            else
            {
                var ws = workbook.Worksheets.Add("Plan1");

                string nomeAvaliacao = string.Empty;

                foreach (string cdAvaliacao in arrAvaliacoes)
                {
                    avaliacao = new cAvaliacao();
                    avaliacao.Abrir(Convert.ToInt32(cdAvaliacao));

                    if (string.IsNullOrEmpty(nomeAvaliacao))
                        nomeAvaliacao += avaliacao.nmAvaliacao;
                    else
                        nomeAvaliacao += " / " + avaliacao.nmAvaliacao;
                }

                //criar titulo
                ws.Cell("A2").Value = nomeRelatorio;
                ws.Cell("A4").Value = "Tipo de Avaliação: " + avaliacaoTipo.dsTipo;
                ws.Cell("A5").Value = "Nome da avaliação: " + nomeAvaliacao;

                cClassificacao classificacao = new cClassificacao();
                classificacao.Abrir(avaliacao.cdClassificacaoInformacao);

                cAvaliacaoGrupo avaliacaoGrupo = new cAvaliacaoGrupo();
                dtsAvaliacao.dtGrupoDataTable dtGrupo = avaliacaoGrupo.getLista(avaliacao.cdAvaliacao);

                ws.Cell("A7").Value = "Classificação da informação: " + classificacao.titClassificacao;
                ws.Cell("A8").Value = "Grupo de acesso: " + string.Join(", ", dtGrupo.Select(g => g.nmGrupo));

                int indexLinha = 10;
                int indexColuna = 0;

                //inserir colunas media
                var lista = dtDisciplinas.AsEnumerable().ToList();
                var listaFiltro = lista.Select(x => x.ItemArray.GetValue(2)).Distinct();

                var listaFiltro2 = lista.Select(x => x.ItemArray.GetValue(1)).Distinct();

                List<int> colunas = new List<int>();
                Dictionary<int, string> areasColunas = new Dictionary<int, string>();
                int Ncoluna = 5;
                int p = 0;
                foreach (int d in listaFiltro2)
                {
                    int cont = lista.Where(y => y.Field<int>("Area") == d).Count();

                    Ncoluna = Ncoluna + cont + p;

                    colunas.Add(Ncoluna);
                    areasColunas.Add(Ncoluna, lista.Where(y => y.Field<int>("Area") == d).FirstOrDefault().Field<string>("NomeArea").Substring(0, 3));

                    if (p == 0)
                        ++p;
                }
                //int i = 0;
                // criar cabecalho
                foreach (DataColumn coluna in dt.Columns)
                {
                    ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = coluna.ColumnName;

                    if (!coluna.ColumnName.Equals("Aluno"))
                        ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    else
                        ws.Column(indexColuna + 1).Width = 40;

                    indexColuna++;
                }


                for (int x = 0; x < dtDisciplinas.Rows.Count; x++)
                {
                    dtDisciplinas.Rows[x][4] = dt.Columns.IndexOf(dtDisciplinas.Rows[x][3].ToString());
                }


                //criar linhas
                indexLinha = 11;
                indexColuna = 0;

                foreach (DataRow linha in dt.Rows)
                {
                    indexColuna = 0;
                    foreach (DataColumn coluna in dt.Columns)
                    {
                        if (linha[coluna].GetType() == typeof(decimal))
                        {
                            ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = Convert.ToDecimal(linha[coluna]);
                            ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).SetDataType(XLCellValues.Number);
                        }
                        else
                        {
                            ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value = linha[coluna];
                        }

                        if (!coluna.ColumnName.Equals("Aluno"))
                        {
                            ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                            if (string.IsNullOrEmpty(ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Value.ToString()))
                                ws.Cell(alfebeto[indexColuna] + indexLinha.ToString()).Style.Fill.BackgroundColor = XLColor.LightGray;
                        }

                        indexColuna++;
                    }
                    indexLinha++;
                }


                //Preencher colunas da média
                int a = 1;
                foreach (int k in colunas)
                {
                    int linha = 10;

                    if (a != colunas.Count())
                    {
                        ws.Column(k).InsertColumnsAfter(1);
                        ws.Cell(alfebeto[k] + linha.ToString()).Value = areasColunas[k];//"MÉD";
                        ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                    }

                    else
                    {
                        ws.Cell(alfebeto[k] + linha.ToString()).Value = areasColunas[k];//"MÉD";
                        ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                    }
                    a++;
                }

                indexLinha = 11;
                indexColuna = 0;
                foreach (DataRow linha in dt.Rows)
                {

                    decimal valor = 0;
                    for (int x = 0; x < dtDisciplinas.Rows.Count; x++)
                    {
                        if (linha.ItemArray.GetValue(Convert.ToInt32(dtDisciplinas.Rows[x][4])) != DBNull.Value)
                        {
                            valor = Convert.ToDecimal(linha.ItemArray.GetValue(Convert.ToInt32(dtDisciplinas.Rows[x][4])));

                        }

                        else { valor = 0; }

                        dtDisciplinas.Rows[x][5] = valor;
                    }

                    indexColuna = 0;

                    foreach (DataColumn coluna in dt.Columns)
                    {

                        decimal mediaArea = 0;
                        var listaArea = lista.Select(x => x.ItemArray.GetValue(1)).Distinct();
                        int o = 0;
                        int c = 1;
                        foreach (int k in colunas)
                        {
                            int n = Convert.ToInt32(listaArea.ElementAt(o));

                            mediaArea = lista
                                    .Where(y => y.Field<int>("Area") == n).Average(s => s.Field<decimal>("Nota"));

                            if (c != colunas.Count())
                            {
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Value = mediaArea;
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.NumberFormat.Format = "0.0";
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                            }

                            else
                            {
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Value = mediaArea;
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.NumberFormat.Format = "0.0";
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                                ws.Cell(alfebeto[k] + indexLinha.ToString()).Style.Font.Bold = true;
                            }
                            c++;

                            o++;
                        }

                        indexColuna++;
                    }
                    indexLinha++;
                }

                //Range tabela
                var rngTabela = ws.Range("A1:" + alfebeto[dt.Columns.Count + colunas.Count] + (dt.Rows.Count + 10));
                rngTabela.Style.Font.FontName = "Arial";
                rngTabela.Style.Font.FontSize = 10;

                //Cabeçalho tabela
                var rngCabecalhoGrid = ws.Range("A10:" + alfebeto[dt.Columns.Count + colunas.Count] + 10);
                rngCabecalhoGrid.Style.Font.Bold = true;

                //Range tabela sem cabeçalho
                var rngTabelaSemTitulo = ws.Range("A10:" + alfebeto[dt.Columns.Count + colunas.Count - 1] + (dt.Rows.Count + 10));
                rngTabelaSemTitulo.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                rngTabelaSemTitulo.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                rngTabelaSemTitulo.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                rngTabelaSemTitulo.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                //int qtdeColunas = 11;
                int qtdeColunas = 8;

                //if (dt.Columns.Count - 1 > 11)
                if (dt.Columns.Count - 1 > 8)
                    qtdeColunas = dt.Columns.Count - 1;

                //Range titulo
                //var rngTitulo = ws.Range("A2:" + alfebeto[qtdeColunas] + "2");
                var rngTitulo = ws.Range("A2:" + alfebeto[qtdeColunas - 1] + "2");
                rngTitulo.Merge();
                rngTitulo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                rngTitulo.Style.Font.Bold = true;

                //Range tipo
                //var rngTipo = ws.Range("A4:" + alfebeto[qtdeColunas] + "4");
                var rngTipo = ws.Range("A4:" + alfebeto[qtdeColunas - 1] + "4");
                rngTipo.Merge();
                rngTipo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                rngTipo.Style.Font.Bold = true;

                //Range nome
                //var rngNome = ws.Range("A5:" + alfebeto[qtdeColunas] + "5");
                var rngNome = ws.Range("A5:" + alfebeto[qtdeColunas - 1] + "5");
                rngNome.Merge();
                rngNome.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                rngNome.Style.Font.Bold = true;

                //Range classificação
                //var rngClasificacao = ws.Range("A7:" + alfebeto[qtdeColunas] + "7");
                var rngClasificacao = ws.Range("A7:" + alfebeto[qtdeColunas - 1] + "7");
                rngClasificacao.Merge();
                rngClasificacao.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                rngClasificacao.Style.Font.FontSize = 8;

                //Range grupo acesso
                var rngGrupoAcesso = ws.Range("A8:" + alfebeto[qtdeColunas - 1] + "8");
                rngGrupoAcesso.Merge();
                rngGrupoAcesso.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                rngGrupoAcesso.Style.Font.FontSize = 8;

                ws.Columns().AdjustToContents();

                entrou = 1;
            }

            if (entrou == 0)
            {
                var ws = workbook.Worksheets.Add("Plan1");
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            using (MemoryStream MyMemoryStream = new MemoryStream())
            {
                workbook.SaveAs(MyMemoryStream);
                byte[] bytes = MyMemoryStream.ToArray();

                result.Content = new ByteArrayContent(bytes);
                result.Content.Headers.ContentDisposition =
                    new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = "#" + cdAvaliacoes + " - NotasPorDisciplina.xlsx"
                    };
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }

            return result;

        }

    }
}