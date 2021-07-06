using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class QuestaoModel
    {
        #region Campos
        #region Propriedades
        public int cdQuestao { get; set; }

        [Display(Name = "Tipo de Questao")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdQuestaoTipo { get; set; }
        public string nmQuestaoTipo { get; set; }

        [Display(Name = "Empresa")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdEmpresa { get; set; }

        [Display(Name = "Area do Conhecimento")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdAreaConhecimento { get; set; }
        public string nmAreaConhecimento { get; set; }

        [Display(Name = "Serie")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdSerie { get; set; }
        public string nmSerie { get; set; }

        [Display(Name = "Disciplina")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }

        [Display(Name = "Dificuldade")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdDificuldade { get; set; }
        public string nmDificuldade { get; set; }

        [Display(Name = "Topico")]
        public IEnumerable<int> cdTopico { get; set; }

        [Display(Name = "SubTopico")]
        public IEnumerable<int> cdSubTopico { get; set; }

        [Display(Name = "Enunciado")]
        [Required]
        public string dsComando { get; set; }
        public string dsSuporte { get; set; }
        public bool imgComando { get; set; }
        public bool imgSuporte { get; set; }
        public int cdUsuarioInc { get; set; }
        public int cdProfessorResponsavel { get; set; }
        public string nuComputador { get; set; }
        public bool idAtivo { get; set; }
        public string dsResposta { get; set; }
        public string nmTipo { get; set; }
        public int cdHabilidade { get; set; }
        public int cdCompetencia { get; set; }
        public string nmCompetencia { get; set; }
        public string comentario { get; set; }
        public string ano { get; set; }
        public string refSuporte { get; set; }
        public string refComando{ get; set; }
        public int cdOrigem { get; set; }
        public string status { get; set; }
        public int cdQuestaoStatus { get; set; }
        public int ordem { get; set; }
        public decimal valor { get; set; }

        public List<AlternativaModel> Alternativas { get; set; }
        #endregion
        #endregion
    }
}