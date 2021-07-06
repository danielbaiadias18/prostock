using api.Filters;
using api.Models;
using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers.Aluno
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/aluno")]
    public class AlunoController : ApiController
    {
        [HttpPost]
        [Route("porToken")]
        [Filters.Aluno]
        public AlunoAuth GetPorToken()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAluno aluno = new cAluno().AbrirPorToken(perfil.Aluno.token);

            if (aluno == null)
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Token inválido"));

            AlunoAuth alunoAuth = new AlunoAuth(aluno);
            return alunoAuth;
        }

        [HttpPost]
        [Route("avaliacoes")]
        [Filters.Aluno]
        public List<PesquisaAvaliacaoModel> ListarAvaliacoes()
        {
            Perfil.TryGetPerfil(out Perfil perfil);

            List<ProximaAvaliacaoModel> list;

            if (perfil.Aluno != null)
            {
                list = new cAluno().ListarAvaliacoes(perfil.Aluno.cdAluno, perfil.Aluno.cdTurma);

                List<PesquisaAvaliacaoModel> pesquisaRes = new List<PesquisaAvaliacaoModel>();

                foreach (var x in list)
                {
                    PesquisaAvaliacaoModel pesqAvaliacao = new PesquisaAvaliacaoModel();
                    pesqAvaliacao.cdAvaliacao = x.cdAvaliacao;
                    pesqAvaliacao.nmAvaliacao = x.nmAvaliacao;
                    pesqAvaliacao.nmSerie = x.nmSerie;
                    pesqAvaliacao.nmAvaliacaoTipo = x.nmAvaliacaoTipo;
                    pesqAvaliacao.nmEtapa = x.nmEtapa;
                    pesqAvaliacao.nmAreaConhecimento = x.nmAreaConhecimento;
                    pesqAvaliacao.nmSegmento = x.nmSegmento;
                    pesqAvaliacao.dtInicioAvaliacao = x.dtInicioAvaliacao;
                    pesqAvaliacao.dtFimAvaliacao = x.dtFimAvaliacao;
                    pesqAvaliacao.tempoAvaliacao = x.tempoAvaliacao;
                    pesqAvaliacao.dtAplicacao = x.dtAplicacao;
                    pesqAvaliacao.notasPorDisciplina = x.notasPorDisciplina;
                    if (!pesqAvaliacao.notasPorDisciplina)
                        pesqAvaliacao.valor = x.valor;
                    pesqAvaliacao.modoAplicacao = x.modoAplicacao;
                    pesqAvaliacao.disciplinas = new List<DisciplinaModel>();
                    pesqAvaliacao.comecar = DateTime.Now >= x.dtInicioAvaliacao;

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

                //return list;
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Token inválido!"));

        }

        [HttpGet]
        [Route("realizando")]
        [Filters.Aluno]
        public int? UltimaRealizando()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            return new cAluno().UltimaRealizada(perfil.Aluno.cdMatricula);
        }

        [HttpPost]
        [Route("realizadas")]
        [Filters.Aluno]
        public List<PesquisaAvaliacaoRealizadaModel> ListarAvaliacoesRealizadas()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cAluno aluno = new cAluno().AbrirPorToken(perfil.Aluno.token);
            List<AvaliacaoRealizadaModel> list;

            if (aluno != null)
            {
                list = aluno.listarAvaliacoesRealizadas(aluno.cdAluno.ToString(), perfil.Aluno.cdTurma).ToList();

                List<PesquisaAvaliacaoRealizadaModel> pesquisaRes = new List<PesquisaAvaliacaoRealizadaModel>();


                foreach (var x in list)
                {
                    PesquisaAvaliacaoRealizadaModel pesqAvaliacao = new PesquisaAvaliacaoRealizadaModel();
                    pesqAvaliacao.cdAvaliacaoAluno = x.cdAvaliacaoAluno;
                    pesqAvaliacao.cdAvaliacao = x.cdAvaliacao;
                    pesqAvaliacao.nmAvaliacao = x.nmAvaliacao;
                    pesqAvaliacao.nmAvaliacaoTipo = x.nmAvaliacaoTipo;
                    pesqAvaliacao.nmEtapa = x.nmEtapa;
                    pesqAvaliacao.nmAreaConhecimento = x.nmAreaConhecimento;
                    pesqAvaliacao.nmSegmento = x.nmSegmento;
                    pesqAvaliacao.tempoAvaliacao = x.tempoAvaliacao;
                    pesqAvaliacao.dtAplicacao = x.dtAplicacao;
                    pesqAvaliacao.notasPorDisciplina = x.notasPorDisciplina;
                    pesqAvaliacao.corrigida = x.corrigida;
                    pesqAvaliacao.modoAplicacao = x.modoAplicacao;
                    pesqAvaliacao.stTrilha = x.stTrilha;

                    if (!pesqAvaliacao.notasPorDisciplina)
                        pesqAvaliacao.valor = x.valor;
                    pesqAvaliacao.dtInicioAvaliacao = x.dtInicioAvaliacao;
                    pesqAvaliacao.dtFimAvaliacao = x.dtFimAvaliacao;
                    pesqAvaliacao.disponibilizada = x.disponibilizada;
                    pesqAvaliacao.dtFinalizouAvaliacao = x.dtFinalizouAvaliacao;
                    pesqAvaliacao.dsCriterio = x.dsCriterio;
                    pesqAvaliacao.exibirRespostaPosFechamento = x.exibirRespostaPosFechamento;
                    pesqAvaliacao.dtExibicaoResposta = x.dtExibicaoResposta;
                    pesqAvaliacao.exibirRespostasEsperadas = x.exibirRespostasEsperadas;
                    pesqAvaliacao.exibirNota = x.exibirNota;
                    if (pesqAvaliacao.exibirNota)
                        pesqAvaliacao.notaObtida = x.notaObtida;

                    pesqAvaliacao.verProva = x.exibirRespostasEsperadas || (x.dtExibicaoResposta.HasValue && DateTime.Now >= x.dtExibicaoResposta);

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

                //return list;
            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Token inválido!"));

        }

        [HttpGet]
        [Route("validamatricula/{cdAluno}/dtnascimento/{dtNascimento}")]
        public AlunoValidaModel ExisteMatricula(int cdAluno, DateTime dtNascimento)
        {
            if (cdAluno > 0 && dtNascimento > DateTime.MinValue)
            {
                cAluno aluno = new cAluno().Abrir(cdAluno);
                if (aluno == null)
                {
                    ModelState.AddModelError("matInvalida", "Matricula inválida.");
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                }
                else
                {
                    if (dtNascimento != aluno.dtNasc)
                    {
                        ModelState.AddModelError("dtInvalida", "Data de nascimento inválida.");
                        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                    }
                    else
                    {
                        if (String.IsNullOrEmpty(aluno.token))
                        {
                            ModelState.AddModelError("enviaSenha.primeiroAcesso", "O aluno vinculado a esta matrícula não realizou nenhum acesso.");
                            throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                        }

                        return new AlunoValidaModel()
                        {
                            email = aluno.email,
                            valida = true
                        };
                    }
                }
            }
            else
            {
                if (cdAluno <= 0)
                    ModelState.AddModelError("matInvalida", "Matricula inválida.");
                if (dtNascimento > DateTime.MinValue)
                    ModelState.AddModelError("dtInvalida", "Data de nascimento inválida.");

                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        [HttpGet]
        [Route("validamatriculaprimeiroacesso/{cdAluno}/dtnascimento/{dtNascimento}")]
        public string ExisteMatriculaPrimeioAcesso(int cdAluno, DateTime dtNascimento)
        {
            if (cdAluno > 0 && dtNascimento > DateTime.MinValue)
            {
                cAluno aluno = new cAluno().Abrir(cdAluno);
                if (aluno == null)
                {
                    ModelState.AddModelError("matInvalida", "Matricula inválida.");
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                }
                else
                {
                    if (aluno.Logou(aluno.matricula))
                    {
                        ModelState.AddModelError("matCadastrada", "Você já possui senha cadastrada.");
                        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                    }

                    if (dtNascimento != aluno.dtNasc)
                    {
                        ModelState.AddModelError("dtInvalida", "Data de nascimento inválida.");
                        throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
                    }
                    else
                        return aluno.email;
                }
            }
            else
            {
                if (cdAluno <= 0)
                    ModelState.AddModelError("matInvalida", "Matricula inválida.");
                if (dtNascimento > DateTime.MinValue)
                    ModelState.AddModelError("dtInvalida", "Data de nascimento inválida.");

                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        [HttpPost]
        [Route("alterarSenha")]
        [Filters.Aluno]
        public void AlterarSenha([FromBody] AlunoTrocarSenhaModel model )
        {
            if (ModelState.IsValid)
            {
                Perfil.TryGetPerfil(out Perfil perfil);

                cPessoa pessoa = new cPessoa().Abrir(perfil.Aluno.cdPessoa);
                
                if(pessoa == null)
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Não foi possível encontrar um usuário com o token atual"));

                if (pessoa.senha != ARWEB.Ferramentas.cCriptografia.Criptografar(model.senhaAtual))
                    throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "A senha atual incorreta."));

                pessoa.Salvar(pessoa.cdPessoa, ARWEB.Ferramentas.cCriptografia.Criptografar(model.senha), HttpContext.Current.Request.UserHostAddress, -1);

            }
            else
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Todos os campos são requiridos"));
        }

        public class Token
        {
            public string token;
        }

    }
}