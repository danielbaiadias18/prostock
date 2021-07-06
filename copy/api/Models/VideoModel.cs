using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class VideoModel
    {
        #region Campos
        #region Propriedades
        public int cdVideo { get; set; }

        [Display(Name = "Empresa")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdEmpresa { get; set; }

        [Display(Name = "Serie")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdSerie { get; set; }
        public string nmSerie { get; set; }

        public int cdOrigem { get; set; }
        public string ano { get; set; }

        [Display(Name = "Area do Conhecimento")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdAreaConhecimento { get; set; }
        public string nmAreaConhecimento { get; set; }

        [Display(Name = "Disciplina")]
        [Range(1, int.MaxValue, ErrorMessage = "O campo {0} deve ser maior que {1}.")]
        public int cdDisciplina { get; set; }
        public string nmDisciplina { get; set; }

        public int cdProfessorResponsavel { get; set; }
        public string comentario { get; set; }
        public string titulo { get; set; }
        public string linkVideo { get; set; }

        [Display(Name = "Topico")]
        public IEnumerable<int> cdTopico { get; set; }

        [Display(Name = "SubTopico")]
        public IEnumerable<int> cdSubTopico { get; set; }

        public int cdUsuarioInc { get; set; }
        public string nuComputador { get; set; }
        public bool idAtivo { get; set; }
        public string dsResposta { get; set; }

        #endregion
        #endregion
    }
}