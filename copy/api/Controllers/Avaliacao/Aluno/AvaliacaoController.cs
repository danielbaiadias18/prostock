using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web;
using System.Web.Http;

namespace api.Controllers
{
    public partial class AvaliacaoController
    {

        [HttpPost]
        [Route("vincular/aluno")]
        [Filters.Aluno]
        public string AdicionaAlunoAvaliacaoTrilha(AvaliacaoAlunoModel avaliacaoAluno)
        {
            var aluno = avaliacaoAluno.alunos.FirstOrDefault();
            cAvaliacaoAluno avalAluno = new cAvaliacaoAluno().Abrir(aluno.cdMatricula, avaliacaoAluno.cdAvaliacao);
            cAvaliacaoAluno avalAlun = new cAvaliacaoAluno();
            if (avalAluno == null)
            {
                string erro = avalAlun.Salvar(
                    null,
                    aluno.cdMatricula,
                    avaliacaoAluno.cdAvaliacao,
                    null,
                    null,
                    HttpContext.Current.Request.UserHostAddress,
                    -1,
                    avaliacaoAluno.cdEmpresa
                    );
                if (erro != null)
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Não foi possível vincular o aluno."));
            }

            return "Aluno adicionado com sucesso!";
        }

        [HttpPost]
        [Route("{cdAvaliacao}/comecar")]
        [Filters.Aluno]
        public object comecar(int cdAvaliacao, [FromBody] Senha senha)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAvaliacao avaliacao = new cAvaliacao().Abrir(cdAvaliacao);
            cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno().Abrir(perfil.Aluno.cdMatricula, cdAvaliacao);
            cAvaliacaoTurma turma = new cAvaliacaoTurma().Abrir(cdAvaliacao, perfil.Aluno.cdTurma);
            int? cdAvaliacaoRealizando = new cAluno().UltimaRealizada(perfil.Aluno.cdMatricula);
            List<cQuestao> questoes = new List<cQuestao>();
            List<cQuestaoAlternativa> alternativas = new List<cQuestaoAlternativa>();

            #region Validações

            /*
             validar aluno avaliação
             */
            if (avaliacaoAluno == null)
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.NotFound, "Não foi encontrado nenhuma avaliação para você"));

            if (cdAvaliacaoRealizando.HasValue && cdAvaliacaoRealizando != cdAvaliacao)
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Você já está realizando outra avaliação"));

            //valida se é para trilhas e realiza as validações devidas
            if (avaliacao.stTrilha != true)
            {
                /*
                 valida se a turma não existe
                 */
                if (turma == null)
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Você não tem permissão para realizar esta prova"));

                /*
                 validar data de inicio e fim da turma do aluno
                 */
                if (turma.dtInicioAvaliacao > DateTime.Now || (DateTime.Now > turma.dtFimAvaliacao && !(perfil.Aluno.Aluno.stLaudo ?? false)))
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, turma.dtInicioAvaliacao > DateTime.Now ? "Aguarde o horário de início da Avaliação!" : "A avaliação já foi encerrada"));
            }

            /*
             validar se o tempo acabou ou se está finalizada
             */
            if (avaliacaoAluno.dtInicioAvaliacaoNovo.HasValue)
            {
                double expireIn = (avaliacao.tempoAvaliacao ?? 0) - (DateTime.Now - avaliacaoAluno.dtInicioAvaliacaoNovo.Value).TotalMinutes, span;
                if (avaliacao.stTrilha != true && ((span = (turma.dtFimAvaliacao - DateTime.Now).TotalMinutes) < expireIn))
                    expireIn = span;

                if (perfil.Aluno.Aluno.stLaudo ?? false)
                    expireIn += perfil.Aluno.Aluno.qtdMinExtraLaudo ?? 0;

                if (expireIn <= 0)
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "A avaliação já foi encerrada"));

                return new
                {
                    expireIn
                };
            }
            else 
            /*
            valida se a prova é para trilhas. Se for, validar senha da prova (turma)
            */
            if (avaliacao.stTrilha != true && turma.senhaAcesso != senha.senha)
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Senha inválida"));


            #endregion

            #region Montar avaliacao

            questoes = new cQuestao().ListarPorAvaliacao(cdAvaliacao);
            alternativas = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao);
            Random random = new Random();

            foreach (var questao in questoes)
            {
                switch (questao.cdQuestaoTipo)
                {
                    //Dissertativa
                    case 1:
                        alternativas.Add(new cQuestaoAlternativa()
                        {
                            cdQuestao = questao.cdQuestao,
                            cdDisciplina = questao.cdDisciplina
                        });
                        break;
                    //Multipla escolha e V ou F
                    case 2:
                    case 3:
                        if (avaliacao.randomizarAlternativas ?? false)
                        {
                            List<cQuestaoAlternativa> temp;
                            temp = alternativas.Where(x => x.cdQuestao == questao.cdQuestao).Shuffle(random).ToList();

                            alternativas.RemoveAll(x => x.cdQuestao == questao.cdQuestao);
                            alternativas.AddRange(temp);
                        }
                        else
                        {
                            List<cQuestaoAlternativa> temp;
                            temp = alternativas.Where(x => x.cdQuestao == questao.cdQuestao).ToList();

                            alternativas.RemoveAll(x => x.cdQuestao == questao.cdQuestao);
                            alternativas.AddRange(temp);
                        }
                        break;
                    //Associativa
                    case 4:
                        //Randomizar
                        List<cQuestaoAlternativa> temp1 = alternativas
                            .Where(x => x.cdQuestao == questao.cdQuestao)
                            .Shuffle(random)
                            .ToList();

                        alternativas.RemoveAll(x => x.cdQuestao == questao.cdQuestao);
                        alternativas.AddRange(temp1);
                        break;
                }
            }

            if (avaliacao.randomizarQuestoes ?? false)
                alternativas =
                    alternativas
                    /* Agrupar por disciplina e randomizar */
                    .GroupBy(x => x.cdDisciplina)
                    .Shuffle()
                    .ToList()
                    /* Agrupamento interno de questões e aleatorizar */
                    .SelectMany(x => x.GroupBy(y => y.cdQuestao).Shuffle().ToList().SelectMany(y => y))
                    .ToList();
            else
                alternativas = alternativas
                    .GroupBy(x => x.cdDisciplina)
                    .ToList()
                    .SelectMany(x => x)
                    .ToList();

            try
            {
                string erro_banco = new cAvaliacaoAlunoResposta().atualiza(avaliacaoAluno.cdAvaliacaoAluno,
                     toData(cdAvaliacao, alternativas),
                     HttpContext.Current.Request.UserHostAddress,
                     -99,
                     1);

                DateTime dtIniciou = DateTime.MinValue;
                if (string.IsNullOrWhiteSpace(erro_banco))
                {
                    erro_banco = avaliacaoAluno.Salvar(avaliacaoAluno.cdAvaliacaoAluno.ToString(),
                        avaliacaoAluno.cdMatricula,
                        avaliacaoAluno.cdAvaliacao,
                        (dtIniciou = DateTime.Now).ToString("yyyy-MM-dd HH:mm:ss"),
                        null,
                         HttpContext.Current.Request.UserHostAddress,
                        -99,
                        1);
                }

                if (!string.IsNullOrWhiteSpace(erro_banco))
                    throw new Exception(erro_banco);

                var temp = new cAvaliacaoAlunoNota().AbrirAvaliacaoAlunoNotaPorAvaliacaoAluno(avaliacaoAluno.cdAvaliacaoAluno);
                new cAvaliacaoAlunoNota().Salvar(
                       0, avaliacaoAluno.cdAvaliacaoAluno, dtIniciou, null, 0,
                       HttpContext.Current.Request.UserHostAddress, -99, 1);

                new cAvaliacaoAlunoNotaDisciplina().executaSQL($@"insert into tbneg_avaliacaoAlunoNotaDisciplina 
                                                                        (cdAvaliacaoAluno, cdDisciplina, notaObtida, nuComputador, idAtivo, dtultalt, cdusuarioalt, cdempresa, dtIncReg, cdUsuarioInc)
                                                                    select aa.cdAvaliacaoAluno, ad.cdDisciplina, 0, '{HttpContext.Current.Request.UserHostAddress}', 1, getDate(), -99, 1, getDate(), -99
                                                                        from tbNEG_AvaliacaoAluno aa
                                                                    inner join tbNEG_AvaliacaoDisciplina ad on ad.cdAvaliacao = aa.cdAvaliacao
                                                                    left join tbNEG_AvaliacaoAlunoNotaDisciplina aand on aand.cdAvaliacaoAluno = aa.cdAvaliacaoAluno
	                                                                    and aand.cdDisciplina = ad.cdDisciplina
                                                                    where aa.cdAvaliacaoAluno = { avaliacaoAluno.cdAvaliacaoAluno }  and aand.cdAvaliacaoAlunoNotaDisciplina is null");

                double expireIn = (avaliacao.tempoAvaliacao ?? 0) - (DateTime.Now - dtIniciou).TotalMinutes, span;
                if (avaliacao.stTrilha != true && ((span = (turma.dtFimAvaliacao - DateTime.Now).TotalMinutes) < expireIn) )
                    expireIn = span;

                if (perfil.Aluno.Aluno.stLaudo ?? false)
                    expireIn += perfil.Aluno.Aluno.qtdMinExtraLaudo ?? 0;

                return new
                {
                    expireIn
                };
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    ActionContext.Request.CreateErrorResponse(
                        HttpStatusCode.InternalServerError, "Não foi possível criar a sua avaliação"));
            }

            #endregion
        }

        [HttpGet]
        [Route("{cdAvaliacao}/questoes")]
        [Filters.Aluno]
        public IEnumerable<object> QuestoesAluno(int cdAvaliacao)
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<cAvaliacaoAlunoResposta> avalQuestao = new cAvaliacaoAlunoResposta().ListarPorAvaliacaoEAluno(cdAvaliacao, perfil.Aluno.cdMatricula);

            if (avalQuestao.Count <= 0)
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Não foi possível recuperar avaliação(" + cdAvaliacao + ")"));

            IEnumerable<object> cds = avalQuestao.GroupBy(x => x.cdQuestao).Select(x => new
            {
                cdQuestao = x.Key,
                x.First().cdDisciplina,
                x.First().nmDisciplina,
                respondida = x.Any(y => !string.IsNullOrEmpty(y.dsResposta) || y.cdAlternativaResposta > 0 ||
                (y.verdadeiro.HasValue && (y.cdQuestaoTipo != 3 || y.verdadeiro == true)))
            });

            return cds;
        }

        [HttpGet]
        [Route("{cdAvaliacao}/questao/{cdQuestao}")]
        [Filters.Aluno]
        public QuestaoModel QuestaoAluno(int cdAvaliacao, int cdQuestao)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cQuestao questao = new cQuestao().AbrirPorAvaliacaoEQuestao(cdAvaliacao, cdQuestao);

            QuestaoModel questModel = new QuestaoModel();

            questModel.cdQuestao = questao.cdQuestao;
            questModel.cdQuestaoTipo = questao.cdQuestaoTipo;
            questModel.nmTipo = questao.nmTipo;
            questModel.dsComando = questao.dsComando;
            questModel.dsSuporte = questao.dsSuporte;
            questModel.ordem = questao.ordem;
            questModel.valor = questao.valor;
            questModel.cdDisciplina = questao.cdDisciplina;
            questModel.nmDisciplina = questao.nmDisciplina;

            List<AlternativaModel> alternativasModel = new List<AlternativaModel>();
            List<cQuestaoAlternativa> alternativas = new cQuestaoAlternativa().ListarPorAvaliacaoEQuestaoEAluno(cdAvaliacao, cdQuestao, perfil.Aluno.cdMatricula);

            foreach (var item in alternativas)
            {
                AlternativaModel altModel = new AlternativaModel();

                altModel.cdAvaliacaoAlunoResposta = item.cdAvaliacaoAlunoResposta;

                switch (questModel.cdQuestaoTipo)
                {
                    case 1:
                        altModel.cdQuestao = item.cdQuestao;
                        altModel.dsResposta = item.dsResposta;
                        break;
                    case 2:
                        altModel.cdQuestaoAlternativa = item.cdQuestaoAlternativa;
                        altModel.cdQuestao = item.cdQuestao;
                        altModel.dsAlternativa1 = item.dsAlternativa1;
                        altModel.verdadeiro = item.verdadeiro;
                        break;
                    case 3:
                        altModel.cdQuestaoAlternativa = item.cdQuestaoAlternativa;
                        altModel.cdQuestao = item.cdQuestao;
                        altModel.dsAlternativa1 = item.dsAlternativa1;
                        altModel.verdadeiro = item.verdadeiro;
                        break;
                    case 4:
                        altModel.indice1 = alternativas.IndexOf(item).ToString();
                        if (item.cdQuestaoAlternativa2.HasValue)
                            altModel.indice2 = alternativas.OrderBy(x => x.cdQuestaoAlternativa).ToList().FindIndex(x => x.cdQuestaoAlternativa == item.cdQuestaoAlternativa2).ToString();

                        altModel.cdQuestao = item.cdQuestao;
                        altModel.dsAlternativa1 = item.dsAlternativa1;
                        altModel.dsAlternativa2 = alternativas.OrderBy(x => x.cdQuestaoAlternativa).ToList()[alternativas.IndexOf(item)].dsAlternativa2;
                        break;
                }

                alternativasModel.Add(altModel);
            }

            questModel.Alternativas = alternativasModel;

            return questModel;
        }

        private dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable toData(
            int cdAvaliacao,
            IEnumerable<cQuestaoAlternativa> alternativas)
        {
            dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable dt = new dtsAvaliacao.dtAvaliacaoAlunoRespostaDataTable();

            foreach (var a in alternativas)
            {
                var row = dt.NewdtAvaliacaoAlunoRespostaRow();
                if (a.cdAvaliacaoAlunoResposta > 0)
                    row.cdAvaliacaoAlunoResposta = a.cdAvaliacaoAlunoResposta;
                if (a.cdQuestaoAlternativa > 0)
                    row.cdAlternativa = a.cdQuestaoAlternativa;
                if (a.cdQuestaoAlternativa2 > 0)
                    row.cdAlternativaResposta = a.cdQuestaoAlternativa2.Value;
                row.cdAvaliacao = cdAvaliacao;
                row.acertou = a.acertou;
                row.cdQuestao = a.cdQuestao;

                row["verdadeiro"] = a.verdadeiro.HasValue ? (object)Convert.ToBoolean(a.verdadeiro.Value) : DBNull.Value;

                row.dsResposta = a.dsResposta;
                if (a.pontuacao.HasValue)
                    row.pontuacao = a.pontuacao.Value;

                dt.AdddtAvaliacaoAlunoRespostaRow(row);
            }

            return dt;
        }

        [HttpPut]
        [Route("{cdAvaliacao}/questao/{cdQuestao}/tipo/{cdTipo}")]
        [Filters.Aluno]
        public void SalvarQuestao(int cdAvaliacao, int cdQuestao, int cdTipo, [FromBody] IEnumerable<AlternativaModel> alternativas)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno().Abrir(perfil.Aluno.cdMatricula, cdAvaliacao);
            List<cQuestaoAlternativa> antigo;
            cAvaliacaoAlunoResposta avalAluno = new cAvaliacaoAlunoResposta();
            cAvaliacaoQuestao avaliacaoQuestao = new cAvaliacaoQuestao();
            avaliacaoQuestao.AbrirPorAvaliacaoEQuestao(cdAvaliacao, cdQuestao);

            switch (cdTipo)
            {
                case 1:
                    break;
                //V ou F
                case 2:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    foreach (var a in alternativas)
                    {
                        a.acertou = a.verdadeiro.HasValue && a.verdadeiro.Value && antigo.FirstOrDefault(x => x.cdQuestaoAlternativa2 == a.cdQuestaoAlternativa).correta ||
                            (a.verdadeiro.HasValue && !a.verdadeiro.Value && !antigo.FirstOrDefault(x => x.cdQuestaoAlternativa2 == a.cdQuestaoAlternativa).correta);

                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }

                    }
                    break;
                // Múltipla escolha
                case 3:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    var correta = antigo.FirstOrDefault(x => x.correta);
                    var verdadeiro = alternativas.FirstOrDefault(x => x.verdadeiro.HasValue && x.verdadeiro.Value);

                    foreach (var a in alternativas)
                    {
                        a.acertou = correta.cdQuestaoAlternativa2 == verdadeiro?.cdQuestaoAlternativa;
                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }
                    }
                    break;
                case 4:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    foreach (var a in alternativas)
                    {
                        a.cdQuestaoAlternativa = antigo[alternativas.ToList().IndexOf(a)].cdQuestaoAlternativa2.Value;
                        if (int.TryParse(a.indice2, out int indice2))
                            a.cdQuestaoAlternativa2 = antigo.OrderBy(x => x.cdQuestaoAlternativa2).ToList()[indice2].cdQuestaoAlternativa2.Value;

                        a.acertou = a.cdQuestaoAlternativa == a.cdQuestaoAlternativa2;

                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }
                    }
                    break;
            }

            try
            {
                avalAluno.atualizaPorQuestao(
                avaliacaoAluno.cdAvaliacaoAluno,
                cdQuestao,
                toData(cdAvaliacao, alternativas.Select(x => new cQuestaoAlternativa()
                {
                    cdAvaliacaoAlunoResposta = x.cdAvaliacaoAlunoResposta,
                    cdQuestao = x.cdQuestao,
                    cdQuestaoAlternativa = x.cdQuestaoAlternativa,
                    cdQuestaoAlternativa2 = x.cdQuestaoAlternativa2,
                    dsResposta = x.dsResposta,
                    verdadeiro = x.verdadeiro,
                    acertou = x.acertou,
                    pontuacao = x.pontuacao
                }).ToList()),
                HttpContext.Current.Request.UserHostAddress,
                -99,
                1);

                //new cAvaliacaoAlunoNotaDisciplina().executaSQL($@"update aand set notaObtida = isnull(res.notaObtida, 0), dtUltAlt = getDate() from (
                //                                                    select d.cdDisciplina, sum(pontuacao) as notaObtida from (
                //                                                     select cdQuestao, cast(sum(isnull(pontuacao, 0)) / count(cdQuestao) as decimal(18,2)) as pontuacao
                //                                                      from avaliacaoAlunoResposta aar
                //                                                     where cdAvaliacaoAluno = {avaliacaoAluno.cdAvaliacaoAluno}
                //                                                    group by cdQuestao) as result
                //                                                    inner join questao q on q.cdQuestao = result.cdQuestao
                //                                                    inner join disciplina d on d.cdDisciplina = q.cdDisciplina
                //                                                    group by d.cdDisciplina
                //                                                    ) as res
                //                                                    inner join avaliacaoAlunoNotaDisciplina aand on aand.cdDisciplina = res.cdDisciplina
                //                                                    where aand.cdAvaliacaoAluno = { avaliacaoAluno.cdAvaliacaoAluno }");

                //new cAvaliacaoAlunoNota().executaSQL($@"update avaliacaoAlunoNota set notaObtida = isnull(nota, 0), dtUltAlt = getDate() from (
                //                                         select sum(nota) as nota from (
                //                                         select sum(pontuacao) / count(cdQuestao) as nota 
                //                                          from avaliacaoalunoresposta where cdavaliacaoaluno = {avaliacaoAluno.cdAvaliacaoAluno } 
                //                                          group by cdQuestao) as resultado
                //                                          ) as res
                //                                          where avaliacaoAlunoNota.cdAvaliacaoAluno = {avaliacaoAluno.cdAvaliacaoAluno }");

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    ActionContext.Request.CreateErrorResponse(
                        HttpStatusCode.InternalServerError, "Não foi possível salvar a sua avaliação"));
            }
        }

        [HttpPut]
        [Route("{cdAvaliacao}/questao/{cdQuestao}/tipo/{cdTipo}/finalizacao")]
        [Filters.Aluno]
        public bool FinalizarQuestao(int cdAvaliacao, int cdQuestao, int cdTipo, [FromBody] IEnumerable<AlternativaModel> alternativas)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAvaliacaoAluno avaliacaoAluno = new cAvaliacaoAluno().Abrir(perfil.Aluno.cdMatricula, cdAvaliacao);
            List<cQuestaoAlternativa> antigo;
            bool corrigida = false;
            decimal notaObtida = 0;
            cAvaliacaoQuestao avaliacaoQuestao = new cAvaliacaoQuestao();
            avaliacaoQuestao.AbrirPorAvaliacaoEQuestao(cdAvaliacao, cdQuestao);

            switch (cdTipo)
            {
                case 1:
                    break;
                case 2:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    foreach (var a in alternativas)
                    {
                        a.acertou = a.verdadeiro.HasValue && a.verdadeiro.Value && antigo.FirstOrDefault(x => x.cdQuestaoAlternativa2 == a.cdQuestaoAlternativa).correta ||
                            (a.verdadeiro.HasValue && !a.verdadeiro.Value && !antigo.FirstOrDefault(x => x.cdQuestaoAlternativa2 == a.cdQuestaoAlternativa).correta);

                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }
                    }
                    break;
                case 3:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    var correta = antigo.FirstOrDefault(x => x.correta);
                    var verdadeiro = alternativas.FirstOrDefault(x => x.verdadeiro.HasValue && x.verdadeiro.Value);

                    foreach (var a in alternativas)
                    {
                        a.acertou = correta.cdQuestaoAlternativa2 == verdadeiro?.cdQuestaoAlternativa;
                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }
                    }
                    break;
                case 4:
                    antigo = new cQuestaoAlternativa().ListarPorAvaliacao(cdAvaliacao, avaliacaoAluno.cdAvaliacaoAluno, cdQuestao);
                    foreach (var a in alternativas)
                    {
                        a.cdQuestaoAlternativa = antigo[Convert.ToInt32(a.indice1)].cdQuestaoAlternativa2.Value;
                        if (int.TryParse(a.indice2, out int indice2))
                            a.cdQuestaoAlternativa2 = antigo.OrderBy(x => x.cdQuestaoAlternativa2).ToList()[indice2].cdQuestaoAlternativa2.Value;

                        a.acertou = a.cdQuestaoAlternativa == a.cdQuestaoAlternativa2;

                        if (a.acertou)
                        {
                            a.pontuacao = avaliacaoQuestao.valor;
                        }
                        else
                        {
                            a.pontuacao = 0;
                        }
                    }
                    break;
            }

            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    new cAvaliacaoAlunoResposta().atualizaPorQuestao(
                        avaliacaoAluno.cdAvaliacaoAluno,
                        cdQuestao,
                        toData(cdAvaliacao, alternativas.Select(x => new cQuestaoAlternativa()
                        {
                            cdAvaliacaoAlunoResposta = x.cdAvaliacaoAlunoResposta,
                            cdQuestao = x.cdQuestao,
                            cdQuestaoAlternativa = x.cdQuestaoAlternativa,
                            cdQuestaoAlternativa2 = x.cdQuestaoAlternativa2,
                            dsResposta = x.dsResposta,
                            verdadeiro = x.verdadeiro,
                            acertou = x.acertou,
                            pontuacao = x.pontuacao
                        }).ToList()),
                        HttpContext.Current.Request.UserHostAddress,
                        -99,
                        1);



                    new cAvaliacaoAlunoNota().executaSQL($@"update tbneg_avaliacaoAlunoNota set notaObtida = isnull(nota, 0), dtUltAlt = getDate() from (
	                                                        select sum(nota) as nota from (
	                                                        select sum(pontuacao) / count(cdQuestao) as nota 
		                                                        from tbNEG_avaliacaoalunoresposta where cdavaliacaoaluno = {avaliacaoAluno.cdAvaliacaoAluno } 
		                                                        group by cdQuestao) as resultado
		                                                        ) as res
		                                                        where tbNEG_avaliacaoAlunoNota.cdAvaliacaoAluno = {avaliacaoAluno.cdAvaliacaoAluno }");

                    notaObtida = new cAvaliacaoAlunoResposta().getNotaObtida(avaliacaoAluno.cdAvaliacaoAluno);

                    corrigida = avaliacaoAluno.getCorrigida(avaliacaoAluno.cdAvaliacaoAluno);

                    string erro_banco = avaliacaoAluno.AtualizaNotaAlunoEDtFim(avaliacaoAluno.cdAvaliacaoAluno.ToString(), notaObtida, corrigida, DateTime.Now, HttpContext.Current.Request.UserHostAddress, -99, 1);

                    if (!string.IsNullOrWhiteSpace(erro_banco))
                        throw new Exception(erro_banco);

                    new cAvaliacaoAlunoNotaDisciplina().executaSQL($@"update aand set notaObtida = isnull(res.notaObtida, 0), dtUltAlt = getDate() from (
                                                                    select d.cdDisciplina, sum(pontuacao) as notaObtida from (
	                                                                    select cdQuestao, cast(sum(isnull(pontuacao, 0)) / count(cdQuestao) as decimal(18,2)) as pontuacao
		                                                                    from tbNEG_avaliacaoAlunoResposta aar
	                                                                    where cdAvaliacaoAluno = {avaliacaoAluno.cdAvaliacaoAluno}
                                                                    group by cdQuestao) as result
                                                                    inner join tbNEG_questao q on q.cdQuestao = result.cdQuestao
                                                                    inner join tbNEG_disciplina d on d.cdDisciplina = q.cdDisciplina
                                                                    group by d.cdDisciplina
                                                                    ) as res
                                                                    inner join tbNEG_avaliacaoAlunoNotaDisciplina aand on aand.cdDisciplina = res.cdDisciplina
                                                                    where aand.cdAvaliacaoAluno = { avaliacaoAluno.cdAvaliacaoAluno }");

                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    ActionContext.Request.CreateErrorResponse(
                        HttpStatusCode.InternalServerError, "Não foi possível salvar a sua avaliação"));
            }

            return avaliacaoAluno.corrigida;
        }

        [HttpGet]
        [Route("{cdAvaliacao}/cabecalho")]
        public AvaliacaoModel CabecalhoAvaliacao(int cdAvaliacao)
        {
            cAvaliacao avaliacao = new cAvaliacao();
            avaliacao.AbrirDetalhado(cdAvaliacao);

            AvaliacaoModel avaliacaoModel = new AvaliacaoModel
            {
                cdAvaliacao = avaliacao.cdAvaliacao,
                cdAvaliacaoTipo = avaliacao.cdAvaliacaoTipo,
                nmAvaliacaoTipo = avaliacao.nmAvaliacaoTipo,
                cdAvaliacaoSubTipo = avaliacao.cdAvaliacaoSubTipo,
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
                verificaUso = avaliacao.verificaUso(cdAvaliacao),
                stTrilha = avaliacao.stTrilha
            };

            return avaliacaoModel;
        }

        [HttpGet]
        [Route("{cdAvaliacao}/gabarito")]
        [Filters.Aluno]
        public object Gabarito(int cdAvaliacao)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAvaliacao aval = new cAvaliacao().AbrirAvaliacao(cdAvaliacao);
            List<AvaliacaoAlunoNotasDisciplina> notas = new List<AvaliacaoAlunoNotasDisciplina>();
            cAvaliacaoAluno avalAluno = new cAvaliacaoAluno().Abrir(perfil.Aluno.cdMatricula, cdAvaliacao);

            if (aval.exibirNota ?? false)
            {
                if (aval.notasPorDisciplina ?? false)
                {
                    List<cAvaliacaoAlunoNotaDisciplina> avalAlunosNotas = new cAvaliacaoAlunoNotaDisciplina().Listar(avalAluno.cdAvaliacaoAluno);

                    foreach (var item in avalAlunosNotas)
                    {
                        AvaliacaoAlunoNotasDisciplina nota = new AvaliacaoAlunoNotasDisciplina();

                        nota.cdAvaliacaoAlunoNotaDisciplina = item.cdAvaliacaoAlunoNotaDisciplina;
                        nota.cdAvaliacaoAluno = item.cdAvaliacaoAluno;
                        nota.cdDisciplina = item.cdDisciplina;
                        nota.nmDisciplina = item.nmDisciplina;
                        nota.notaObtida = item.notaObtida;

                        notas.Add(nota);
                    }
                }
                else
                {
                    List<cAvaliacaoAlunoNotaDisciplina> avalAlunosNotas = new cAvaliacaoAlunoNotaDisciplina().ListarPorAreaConhecimento(avalAluno.cdAvaliacaoAluno);

                    foreach (var item in avalAlunosNotas)
                    {
                        AvaliacaoAlunoNotasDisciplina nota = new AvaliacaoAlunoNotasDisciplina();

                        nota.nmDisciplina = item.nmDisciplina;
                        nota.notaObtida = item.notaObtida;

                        notas.Add(nota);
                    }
                }


            }

            return new { notas, porDisciplina = aval.notasPorDisciplina };
        }

        [HttpGet]
        [Route("correcao/avaliacao/{cdAvaliacao}/avaliacaoaluno/{cdAvaliacaoAluno}/aluno")]
        [Filters.Aluno]
        public AvaliacaoModel GetCorrecao(int cdAvaliacao, int cdAvaliacaoAluno)
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
            alternativas = alternativa.ListarPorAvaliacao(cdAvaliacao);

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
                    foreach (var y in alternativas.Where(i => i.cdQuestao == x.cdQuestao).ToList())
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
                            alternativaModel.acertou = res.FirstOrDefault(z => z.cdAlternativa == y.cdQuestaoAlternativa).verdadeiro == y.correta ? true : false;
                            alternativaModel.verdadeiro = res.FirstOrDefault(z => z.cdAlternativa == y.cdQuestaoAlternativa).verdadeiro ?? false;
                        }
                        else
                        {
                            alternativaModel.cdQuestao = y.cdQuestao;

                            var resWhere = res.Where(z => z.cdQuestao == y.cdQuestao).ToList();

                            alternativaModel.cdQuestaoAlternativa = resWhere.Count() > 0 ? ((resWhere)[counter].cdAlternativa ?? 0) : 0;
                            alternativaModel.cdQuestaoAlternativa2 = y.cdQuestaoAlternativa;
                            alternativaModel.correta = alternativas.FirstOrDefault(z => z.cdQuestaoAlternativa == alternativaModel.cdQuestaoAlternativa)?.correta ?? false;
                            alternativaModel.dsAlternativa1 = y.dsAlternativa1;
                            alternativaModel.dsAlternativa2 = alternativas.FirstOrDefault(z => z.cdQuestaoAlternativa == alternativaModel.cdQuestaoAlternativa)?.dsAlternativa2 ?? "";
                            alternativaModel.indice2 = alfabeto[counter];
                            alternativaModel.imgAlternativa1 = y.imgAlternativa1;
                            alternativaModel.imgAlternativa2 = alternativas.FirstOrDefault(z => z.cdQuestaoAlternativa == alternativaModel.cdQuestaoAlternativa)?.imgAlternativa2 ?? false;
                            alternativaModel.ordem = alternativas.FirstOrDefault(z => z.cdQuestaoAlternativa == alternativaModel.cdQuestaoAlternativa)?.ordem ?? 0;
                            alternativaModel.verdadeiro = false;
                            counter++;

                        }
                        alternativasModel.Add(alternativaModel);
                    }

                    if (x.cdQuestaoTipo == 4)
                    {
                        foreach (var k in alternativasModel)
                        {
                            k.indice1 = alternativasModel.FirstOrDefault(z => z.cdQuestaoAlternativa2 == (res.FirstOrDefault(l => l.cdAlternativa == k.cdQuestaoAlternativa)?.cdAlternativaResposta ?? 0))?.indice2 ?? "";
                            k.indiceCorreta = alternativasModel.FirstOrDefault(z => z.cdQuestaoAlternativa2 == k.cdQuestaoAlternativa)?.indice2 ?? "";
                        }
                    }

                    avQuestaoModel.QuestaoModel.Alternativas = alternativasModel;
                }
                avaliacaoModel.AvaliacaoQuestaoModel.Add(avQuestaoModel);
            }

            return avaliacaoModel;
        }

        [HttpGet]
        [Route("alunoresposta/avaliacaoaluno/{cdAvaliacaoAluno}/aluno")]
        [Filters.Aluno]
        public List<AvaliacaoAlunoRespostaModel> ListarAvaliacaoAlunoRespostaPorAvaliacaoAlunoAl(int cdAvaliacaoAluno)
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
        [Route("carregarfeedback/avaliacaoaluno/{cdAvaliacaoAluno}/questao/{cdquestao}/aluno")]
        [Filters.Aluno]
        public AvaliacaoAlunoRespostaModel GetFeedBackAl(int cdAvaliacaoAluno, int cdQuestao)
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

    }

    public static class ShuffleExtension
    {
        public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source)
        {
            return source.Shuffle(new Random());
        }
        public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source, Random rng)
        {
            T[] elements = source.ToArray();
            for (int i = elements.Length - 1; i >= 0; i--)
            {
                // Swap element "i" with a random earlier element it (or itself)
                // ... except we don't really need to swap it fully, as we can
                // return it immediately, and afterwards it's irrelevant.
                int swapIndex = rng.Next(i + 1);
                yield return elements[swapIndex];
                elements[swapIndex] = elements[i];
            }
        }
    }

    public class Senha
    {
        [Required]
        public string senha { get; set; }
    }
}