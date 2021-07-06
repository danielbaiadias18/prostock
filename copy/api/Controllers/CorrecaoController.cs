using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/correcao")]
    [ProfessorAutenticado]
    public class CorrecaoController : ApiController
    {
        #region Atributos

        //private cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno();
        //private cAvaliacaoGabarito avaliacaoGabarito = new cAvaliacaoGabarito();
        //private cAvaliacaoAlunoGabarito avaliacaoAlunoGabarito = new cAvaliacaoAlunoGabarito();
        //private cAvaliacaoDisciplina avaliacaoDisciplina = new cAvaliacaoDisciplina();
        //private cAvaliacaoAlunoNotaDisciplina avaliacaoAlunoNotaDisciplina = new cAvaliacaoAlunoNotaDisciplina();

        //private dtsAvaliacao.dtAvaliacaoAlunoDataTable dtAvaliacoes;
        //private DataView dv;
        //private dtsAvaliacao.dtAvaliacaoAlunoGabaritoDataTable dtGabaritoAluno;
        //private dtsAvaliacao.dtGabaritoDataTable dtGabarito;
        //private dtsAvaliacao.dtDisciplinaDataTable dtDisciplina;

        #endregion

        //[HttpPost]
        //[Route("avaliacao/{cdAvaliacao}/empresa/{cdEmpresa}")]
        //public void Post(int cdAvaliacao, int cdEmpresa)
        //{
        //    if (HttpContext.Current.Request.InputStream.Length > 0)
        //    {
        //        dtAvaliacoes = avaliacaoAluno.getLista(cdAvaliacao);
        //        dv = dtAvaliacoes.DefaultView;

        //        Processar(cdAvaliacao, cdEmpresa);
        //    }
        //    else
        //        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Esta requisição requer um arquivo"));
        //}

        //[HttpPost]
        //[Route("avaliacao/{cdAvaliacao}/turma/{cdTurma}/serie/{cdSerie}/empresa/{cdEmpresa}")]
        //public void Post(int cdAvaliacao, int cdTurma, int cdSerie, int cdEmpresa)
        //{
        //    if (HttpContext.Current.Request.InputStream.Length > 0)
        //    {
        //        dtAvaliacoes = avaliacaoAluno.getLista(cdAvaliacao);
        //        dtGabarito = avaliacaoGabarito.getLista(cdAvaliacao);

        //        dv = dtAvaliacoes.DefaultView;
        //        dv.RowFilter = "cdSerie = " + cdSerie;
        //        dv.RowFilter = "cdTurma = " + cdTurma;

        //        Processar(cdAvaliacao, cdEmpresa);
        //    }
        //    else
        //        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Esta requisição requer um arquivo"));
        //}

        //private void Processar(int cdAvaliacao, int cdEmpresa)
        //{
        //    List<string> listaMatriculasDuplicadas = new List<string>();
        //    List<string> listaMatriculasInvalidas = new List<string>();
        //    List<string> listaMatriculasValidas = new List<string>();

        //    string Erro_Banco = null;

        //    DataTable dt = dv.ToTable();

        //    int qtdLinhas = 0;
        //    using (StreamReader readerValidacao = new StreamReader(HttpContext.Current.Request.InputStream, Encoding.UTF8, true, 1024, true))
        //    {
        //        while (!readerValidacao.EndOfStream)
        //        {
        //            string linha = readerValidacao.ReadLine();
        //            if (!string.IsNullOrEmpty(linha))
        //            {
        //                qtdLinhas++;

        //                string matriculaAluno = linha.Substring(0, 5);

        //                bool matriculaValida = dt.AsEnumerable().Where(x => x["matricula"].ToString() == matriculaAluno).Select(x => x["matricula"]).Count() > 0 ? true : false;

        //                if (listaMatriculasValidas.Contains(matriculaAluno) || listaMatriculasInvalidas.Contains(matriculaAluno))
        //                {
        //                    if (!listaMatriculasDuplicadas.Contains(matriculaAluno))
        //                        listaMatriculasDuplicadas.Add(matriculaAluno);
        //                    listaMatriculasValidas.RemoveAll(x => x.Equals(matriculaAluno));
        //                    listaMatriculasInvalidas.RemoveAll(x => x.Equals(matriculaAluno));
        //                }
        //                else
        //                {
        //                    if (matriculaValida)
        //                        listaMatriculasValidas.Add(matriculaAluno);
        //                    else
        //                        listaMatriculasInvalidas.Add(matriculaAluno);
        //                }
        //            }
        //        }
        //    }

        //    if (listaMatriculasDuplicadas.Count > 0 || listaMatriculasInvalidas.Count > 0)
        //    {
        //        // Contém itens inválidos
        //        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Neste arquivo há matrículas duplicadas e/ou inválidas"));
        //    }
        //    else
        //    {
        //        HttpContext.Current.Request.InputStream.Position = 0;
        //        using (StreamReader reader = new StreamReader(HttpContext.Current.Request.InputStream))
        //        {
        //            while (!reader.EndOfStream)
        //            {
        //                string linha = reader.ReadLine();
        //                if (!string.IsNullOrEmpty(linha))
        //                {
        //                    string matriculaAluno = linha.Substring(0, 5);
        //                    string respostas = linha.Substring(5);

        //                    avaliacaoAluno.Abrir(matriculaAluno, cdAvaliacao);

        //                    List<string> listaRespostas = new List<string>();
        //                    foreach (char r in respostas)
        //                    {
        //                        listaRespostas.Add(r.ToString());
        //                    }

        //                    dtGabaritoAluno = avaliacaoAlunoGabarito.getLista(avaliacaoAluno.cdAvaliacaoAluno);

        //                    decimal pontuacao = 0;
        //                    foreach (dtsAvaliacao.dtGabaritoRow rowGabarito in dtGabarito)
        //                    {
        //                        dtsAvaliacao.dtAvaliacaoAlunoGabaritoRow rowGabaritoAluno = null;
        //                        rowGabaritoAluno = dtGabaritoAluno.Where(x => x.cdQuestao == rowGabarito.cdQuestao).FirstOrDefault();
        //                        if (rowGabaritoAluno == null)
        //                            rowGabaritoAluno = dtGabaritoAluno.NewdtAvaliacaoAlunoGabaritoRow();

        //                        rowGabaritoAluno.cdQuestao = rowGabarito.cdQuestao;
        //                        rowGabaritoAluno.cdDisciplina = rowGabarito.cdDisciplina;
        //                        rowGabaritoAluno.valor = rowGabarito.valor;
        //                        rowGabaritoAluno.resposta = listaRespostas[dtGabarito.Rows.IndexOf(rowGabarito)].ToUpper();
        //                        rowGabaritoAluno.anulada = false;

        //                        if (rowGabarito.alternativa.ToUpper() == rowGabaritoAluno.resposta.ToUpper())
        //                        {
        //                            pontuacao += rowGabarito.valor;
        //                            rowGabaritoAluno.acertou = true;
        //                        }
        //                        else
        //                            rowGabaritoAluno.acertou = false;

        //                        if (dtGabaritoAluno.Where(x => x.cdQuestao == rowGabarito.cdQuestao).Count() == 0)
        //                            dtGabaritoAluno.AdddtAvaliacaoAlunoGabaritoRow(rowGabaritoAluno);
        //                    }

        //                    dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable dtNotaDisciplina = new dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaDataTable();
        //                    dtDisciplina = avaliacaoDisciplina.getLista(avaliacaoAluno.cdAvaliacao);
        //                    foreach (dtsAvaliacao.dtDisciplinaRow rowDisciplina in dtDisciplina)
        //                    {
        //                        dtsAvaliacao.dtAvaliacaoAlunoNotaDisciplinaRow dtNotaDisciplinaRow = dtNotaDisciplina.NewdtAvaliacaoAlunoNotaDisciplinaRow();

        //                        dtNotaDisciplinaRow.cdDisciplina = rowDisciplina.cdDisciplina;
        //                        dtNotaDisciplinaRow.notaObtida = dtGabaritoAluno
        //                                                        .Where(x => !x.IscdDisciplinaNull() && x.cdDisciplina == rowDisciplina.cdDisciplina && x.acertou)
        //                                                        .Select(x => x.valor).Sum();

        //                        dtNotaDisciplina.AdddtAvaliacaoAlunoNotaDisciplinaRow(dtNotaDisciplinaRow);
        //                    }

        //                    if (Erro_Banco == null)
        //                    {
        //                        Erro_Banco = avaliacaoAlunoGabarito.atualiza(
        //                             avaliacaoAluno.cdAvaliacaoAluno,
        //                             dtGabaritoAluno,
        //                             HttpContext.Current.Request.UserHostAddress,
        //                             cdUsuario,
        //                             cdEmpresa);

        //                        if (Erro_Banco == null)
        //                            Erro_Banco = avaliacaoAlunoNotaDisciplina.atualiza(
        //                                avaliacaoAluno.cdAvaliacaoAluno,
        //                                dtNotaDisciplina,
        //                                HttpContext.Current.Request.UserHostAddress,
        //                                cdUsuario,
        //                                cdEmpresa);

        //                        if (Erro_Banco == null)
        //                            Erro_Banco = avaliacaoAluno.FinalizaAvaliacao(
        //                                avaliacaoAluno.cdAvaliacaoAluno.ToString(),
        //                                DateTime.Now.ToString(),
        //                                pontuacao,
        //                                true,
        //                                1,
        //                                HttpContext.Current.Request.UserHostAddress,
        //                                cdUsuario,
        //                                cdEmpresa);
        //                    }
        //                }
        //            }

        //            reader.Dispose();
        //        }
        //    }
        //}
    }
}