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
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/video")]
    [ProfessorAutenticado]
    public class VideoController : ApiController
    {
        private readonly Regex tagImg = new Regex("<img.*?src=\"(.*?)\"[^\\>]+>");

        [HttpGet]
        [Route("{cdVideo}")]
        [Filters.Professor(Filters.Programa.video, TipoAcesso.Consultar)]
        public VideoModel Get(int cdVideo)
        {
            cVideo video = new cVideo().Abrir(cdVideo);
            List<cVideoTopico> topicos = new cVideoTopico().Listar("cdVideo", cdVideo);
            List<cVideoSubTopico> subTopicos = new cVideoSubTopico().Listar("cdVideo", cdVideo);

            if (video == null) throw new HttpResponseException(HttpStatusCode.NotFound);


            return new VideoModel()
            {
                cdVideo = video.cdVideo,
                cdAreaConhecimento = video.cdAreaConhecimento,
                nmAreaConhecimento = video.nmAreaConhecimento, 
                cdSerie = video.cdSerie,
                nmSerie = video.nmSerie, 
                cdDisciplina = video.cdDisciplina,
                nmDisciplina = video.nmDisciplina, 
                cdTopico = topicos.Select(x => x.cdTopico),
                cdSubTopico = subTopicos.Select(x => x.cdSubTopico),
                cdUsuarioInc = video.cdUsuarioInc,
                cdProfessorResponsavel = video.cdProfessorResponsavel,
                idAtivo = video.idativo,
                cdOrigem = video.cdOrigem,
                ano = video.ano,
                comentario = video.comentario,
                titulo = video.titulo,
                linkVideo = video.linkVideo
            };
        }

        public string RemoverTagsHtml(string text)
        {
            return tagImg.Replace(text, string.Empty);
        }

        [HttpGet]
        [Route("detalhado/{cdVideo}")]
        [Filters.Professor(Filters.Programa.video, TipoAcesso.Consultar)]
        public VideoModel GetDetalhado(int cdVideo)
        {
            cVideo video = new cVideo().AbrirDetalhado(cdVideo);
            List<cVideoTopico> topicos = new cVideoTopico().Listar("cdVideo", cdVideo);
            List<cVideoSubTopico> subTopicos = new cVideoSubTopico().Listar("cdVideo", cdVideo);

            if (video == null) throw new HttpResponseException(HttpStatusCode.NotFound);

            return new VideoModel()
            {
                cdVideo = video.cdVideo,
                cdAreaConhecimento = video.cdAreaConhecimento,
                nmAreaConhecimento = video.nmAreaConhecimento,
                cdSerie = video.cdSerie,
                nmSerie = video.nmSerie,
                cdDisciplina = video.cdDisciplina,
                nmDisciplina = video.nmDisciplina,
                cdTopico = topicos.Select(x => x.cdTopico),
                cdSubTopico = subTopicos.Select(x => x.cdSubTopico),
                cdUsuarioInc = video.cdUsuarioInc,
                cdProfessorResponsavel = video.cdProfessorResponsavel,
                idAtivo = video.idativo,
                comentario = video.comentario,
                titulo = video.titulo
            };
        }

        [Filters.Professor(Filters.Programa.video, TipoAcesso.Consultar)]
        public List<VideoModel> Get()
        {
            List<VideoModel> questoes = new List<VideoModel>();

            string dump;
            cVideo quest = new cVideo();
            foreach (var x in quest.Listar())
            {
                questoes.Add(new VideoModel()
                {
                    cdVideo = x.cdVideo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    titulo = x.titulo,
                    comentario = x.comentario,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    idAtivo = x.idativo,
                });

            };


            return questoes;
        }

        [HttpPost]
        [Route("portrilha")]
        public List<VideoModel> Get([FromBody] GetByTrilhaModel model)
        {
            List<VideoModel> videos = new List<VideoModel>();

            cVideo video = new cVideo();
            string sql = " T.CDDISCIPLINA IN (" + string.Join(",", model.disciplinas.ConvertAll(x => x.ToString())) + ") " +
                "AND T.CDSERIE = " + model.cdSerie + " AND T.CDAREACONHECIMENTO = " + model.cdAreaConhecimento + " AND T.IDATIVO = 1";
            foreach (var x in video.Listar(sql))
            {
                videos.Add(new VideoModel()
                {
                    cdVideo = x.cdVideo,
                    cdAreaConhecimento = x.cdAreaConhecimento,
                    nmAreaConhecimento = x.nmAreaConhecimento,
                    cdSerie = x.cdSerie,
                    nmSerie = x.nmSerie,
                    cdDisciplina = x.cdDisciplina,
                    nmDisciplina = x.nmDisciplina,
                    titulo = x.titulo,
                    comentario = x.comentario,
                    cdUsuarioInc = x.cdUsuarioInc,
                    cdProfessorResponsavel = x.cdProfessorResponsavel,
                    linkVideo = x.linkVideo,
                    idAtivo = x.idativo,
                });

            };

            return videos;
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
        [Route("filtroVideo")]
        [Filters.Professor(Filters.Programa.video, TipoAcesso.Consultar)]
        public List<VideoModel> FiltroVideo(FiltroVideo filtroVideoModel)
        {
            cVideo video = new cVideo();
            List<cVideo.Join> joins = new List<cVideo.Join>();

            string where = " where 1 = 1 ";

            if (filtroVideoModel.cdSerie > 0)
                where += " and ser.cdSerie = " + filtroVideoModel.cdSerie;

            if (filtroVideoModel.cdAreaConhecimento > 0)
                where += " and t.cdAreaConhecimento = " + filtroVideoModel.cdAreaConhecimento;

            if (filtroVideoModel.cdDisciplina > 0)
                where += " and dis.cdDisciplina = " + filtroVideoModel.cdDisciplina;

            if (filtroVideoModel.cdTopico > 0)
            {
                joins.Add(new cVideo.Join(cVideo.TipoJoin.Inner, "vc", "tbNEG_VideoTopico", "vc.cdVideo = t.cdVideo"));
                joins.Add(new cVideo.Join(cVideo.TipoJoin.Inner, "c", "tbNEG_Topico", "vc.cdTopico = c.cdTopico"));
                where += " and c.cdTopico = " + filtroVideoModel.cdTopico;
            }

            if (filtroVideoModel.cdSubTopico > 0)
            {
                joins.Add(new cVideo.Join(cVideo.TipoJoin.Inner, "vsc", "tbNEG_VideoSubTopico", "vsc.cdVideo = t.cdVideo"));
                joins.Add(new cVideo.Join(cVideo.TipoJoin.Inner, "sc", "tbNEG_SubTopico", "vsc.cdSubTopico = sc.cdSubTopico"));
                where += " and sc.cdSubTopico = " + filtroVideoModel.cdSubTopico;
            }

            if (filtroVideoModel.cdUsuario > 0)
                where += " and t.cdUsuarioInc = " + filtroVideoModel.cdUsuario;

            if (filtroVideoModel.cdProfessor > 0)
                where += " and t.cdProfessorResponsavel = " + filtroVideoModel.cdProfessor;

            if (filtroVideoModel.cdPesquisarEm > 0 && !string.IsNullOrWhiteSpace(filtroVideoModel.txtPesquisa))
                where += " and " + (filtroVideoModel.cdPesquisarEm == 1 ? "t.cdVideo" : "t.titulo") + " like '%" + filtroVideoModel.txtPesquisa + "%' ";


            List<cVideo> videos = video.ListarPorPesquisa(joins, where);

            return videos.Select(x => new VideoModel()
            {
                cdVideo = x.cdVideo,
                nmAreaConhecimento = x.nmAreaConhecimento,
                nmSerie = x.nmSerie,
                cdDisciplina = x.cdDisciplina,
                nmDisciplina = x.nmDisciplina,
                titulo = x.titulo,
                idAtivo = x.idAtivo,
            }).ToList();
        }
        
        [HttpGet]
        [Route("origem")]
        [Filters.Professor(Filters.Programa.video, TipoAcesso.Consultar)]
        public List<OrigemModel> Origens()
        {
            List<OrigemModel> origens = new List<OrigemModel>();

            cVideo video = new cVideo();
            foreach (var x in video.ListarOrigens())
            {
                origens.Add(new OrigemModel()
                {
                    cdOrigem = x.cdOrigem,
                    nmOrigem = x.nmOrigem
                });
            };

            return origens;
        }

        [HttpDelete]
        [Route("{cdVideo}")]
        [Filters.Professor(Filters.Programa.video, TipoAcesso.Excluir)]
        public void Delete(int cdVideo)
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            cVideo video = new cVideo().Abrir(cdVideo);
            if (video == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            string Erro_Banco_Ativar = video.trocaidativo(cdVideo, !video.idAtivo, perfil.Professor.nucomputador, perfil.Professor.cdProfessor);
            if (!string.IsNullOrWhiteSpace(Erro_Banco_Ativar))
                throw new Exception(Erro_Banco_Ativar);
        }

        [HttpGet]
        [Route("getLastId")]
        public int GetLastId()
        {
            Perfil.TryGetPerfil(out Perfil perfil);
            int cd = Convert.ToInt32(new cVideo().getLastID("tbNEG_Video", "cdVideo", "cdUsuarioAlt = " + perfil.Professor.cd_usuario));
            return cd;
        }


        [Filters.Professor(Filters.Programa.video, TipoAcesso.Incluir | TipoAcesso.Editar)]
        public string Post(VideoModel video)
        {
            if (ModelState.IsValid)
            {
                Perfil.TryGetPerfil(out Perfil perfil);

                cVideo vid = new cVideo()
                {
                    cdVideo = video.cdVideo,
                    cdAreaConhecimento = video.cdAreaConhecimento,
                    cdSerie = video.cdSerie,
                    cdDisciplina = video.cdDisciplina,
                    cdProfessorResponsavel = video.cdProfessorResponsavel,
                    ano = video.ano,
                    linkVideo = video.linkVideo,
                    comentario = video.comentario,
                    titulo = video.titulo,
                    cdOrigem = video.cdOrigem,
                    cdempresa = video.cdEmpresa
                };

                string res = vid.Salvar(
                    vid.cdVideo,
                    vid.cdSerie,
                    vid.cdOrigem,
                    vid.ano,
                    vid.cdAreaConhecimento,
                    vid.cdDisciplina,
                    vid.cdProfessorResponsavel,
                    vid.comentario,
                    vid.linkVideo,
                    vid.titulo,
                    perfil.Professor.nucomputador,
                    perfil.Professor.cdProfessor,
                    vid.cdempresa
                   );

                List<cVideoTopico> topicos;
                List<cVideoSubTopico> subTopicos;

                //FormType 1
                
                    if (res == null && vid.cdVideo <= 0)
                    {
                        vid.cdVideo = Convert.ToInt32(vid.getLastID("tbNEG_Video", "cdVideo", "cdUsuarioAlt = " + perfil.Professor.cdProfessor));
                        new cVideoTopico().Salvar("cdVideo",
                           vid.cdVideo,
                           video.cdTopico.Select(x => new cVideoTopico() { cdTopico = x }).ToList(),
                           HttpContext.Current.Request.UserHostAddress,
                           perfil.Professor.cdUsuarioVinculado,
                           video.cdEmpresa);

                        new cVideoSubTopico().Salvar("cdVideo",
                            vid.cdVideo,
                            video.cdSubTopico.Select(x => new cVideoSubTopico() { cdSubTopico = x }).ToList(),
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            video.cdEmpresa);
                    }
                    else
                    {
                        topicos = new cVideoTopico().Listar("cdVideo", video.cdVideo);
                        subTopicos = new cVideoSubTopico().Listar("cdVideo", video.cdVideo);

                        var excecoes = video.cdTopico.Except(topicos.Select(x => x.cdTopico));
                        topicos.AddRange(excecoes.Select(x => new cVideoTopico() { cdTopico = x }));
                        topicos.RemoveAll(x => !video.cdTopico.Any(y => y == x.cdTopico));
                        new cVideoTopico().Salvar("cdVideo",
                            vid.cdVideo,
                            topicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            video.cdEmpresa);

                        excecoes = video.cdSubTopico.Except(subTopicos.Select(x => x.cdSubTopico));
                        subTopicos.AddRange(excecoes.Select(x => new cVideoSubTopico() { cdSubTopico = x }));
                        subTopicos.RemoveAll(x => !video.cdSubTopico.Any(y => y == x.cdSubTopico));
                        new cVideoSubTopico().Salvar("cdVideo",
                            vid.cdVideo,
                            subTopicos,
                            HttpContext.Current.Request.UserHostAddress,
                            perfil.Professor.cdUsuarioVinculado,
                            video.cdEmpresa);
                    }
                
                return res;
            }
            else
            {
                throw new HttpResponseException(ActionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        //[HttpGet]
        //[Route("disciplina/{cdDisciplina}/avaliacao/{cdAvaliacao}")]
        //public List<QuestaoModel> QuestoesPorDisciplina(int cdDisciplina, int cdAvaliacao)
        //{
        //    List<QuestaoModel> questoes = new List<QuestaoModel>();
        //    string dump;
        //    cQuestao quest = new cQuestao();
        //    foreach (var x in quest.ListarPorDisciplina(cdDisciplina, cdAvaliacao))
        //    {
        //        questoes.Add(new QuestaoModel()
        //        {
        //            cdQuestao = x.cdQuestao,
        //            cdQuestaoTipo = x.cdQuestaoTipo,
        //            cdAreaConhecimento = x.cdAreaConhecimento,
        //            cdSerie = x.cdSerie,
        //            cdDisciplina = x.cdDisciplina,
        //            cdHabilidade = x.cdHabilidade,
        //            cdDificuldade = x.cdDificuldade,
        //            //cdTopico = x.cdTopico,
        //            dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 201 ? dump.Substring(0, 200) : dump,
        //            imgComando = x.imgComando,
        //            dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 201 ? dump.Substring(0, 200) : dump,
        //            imgSuporte = x.imgSuporte,
        //            //cdSubTopico = x.cdSubTopico,
        //            cdUsuarioInc = x.cdUsuarioInc,
        //            cdProfessorResponsavel = x.cdProfessorResponsavel,
        //            idAtivo = x.idativo,
        //            nmQuestaoTipo = x.nmQuestaoTipo,
        //            nmAreaConhecimento = x.nmAreaConhecimento,
        //            nmSerie = x.nmSerie,
        //            nmDisciplina = x.nmDisciplina,
        //            nmDificuldade = x.nmDificuldade
        //        });
        //    };

        //    return questoes;
        //}

        //[HttpGet]
        //[Route("avaliacao/{cdAvaliacao}")]
        //public List<QuestaoModel> QuestoesPorAvaliacao(int cdAvaliacao)
        //{
        //    List<QuestaoModel> questoes = new List<QuestaoModel>();
        //    string dump;

        //    cQuestao quest = new cQuestao();
        //    foreach (var x in quest.ListarPorAvaliacao(cdAvaliacao))
        //    {
        //        questoes.Add(new QuestaoModel()
        //        {
        //            cdQuestao = x.cdQuestao,
        //            cdQuestaoTipo = x.cdQuestaoTipo,
        //            cdAreaConhecimento = x.cdAreaConhecimento,
        //            cdSerie = x.cdSerie,
        //            cdDisciplina = x.cdDisciplina,
        //            cdHabilidade = x.cdHabilidade,
        //            cdDificuldade = x.cdDificuldade,
        //            //cdTopico = x.cdTopico,
        //            dsComando = (dump = Regex.Replace(x.dsComando, "<.*?>", string.Empty)).Length >= 201 ? dump.Substring(0, 200) : dump,
        //            imgComando = x.imgComando,
        //            dsSuporte = (dump = Regex.Replace(x.dsSuporte, "<.*?>", string.Empty)).Length >= 201 ? dump.Substring(0, 200) : dump,
        //            imgSuporte = x.imgSuporte,
        //            //cdSubTopico = x.cdSubTopico,
        //            cdUsuarioInc = x.cdUsuarioInc,
        //            cdProfessorResponsavel = x.cdProfessorResponsavel,
        //            idAtivo = x.idativo
        //        });
        //    };

        //    return questoes;
        //}

        //[HttpGet]
        //[Route("avaliacaoUtilizada/{cdQuestao}/agrupar/{agrupar}")]
        //public List<AvaliacaoUtilizadaModel> AvaliacoesUtilizadas(int cdQuestao, bool agrupar)
        //{
        //    List<AvaliacaoUtilizadaModel> avaliacoesUtilizadas = new cQuestao().ListarAvaliacoesUtilizadas(cdQuestao, agrupar);
        //    return avaliacoesUtilizadas;
        //}

    }
}