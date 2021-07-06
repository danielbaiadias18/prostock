using cDados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class AvaliacaoQuestaoModel
    {
        #region Campos
        public int cdAvaliacaoQuestao { get; set; }
        public int ordem { get; set; }
        public decimal valor { get; set; }
        public QuestaoModel QuestaoModel { get; set; }
        public int ordemDisciplina { get; set; }


        public static dtsAvaliacao.dtQuestaoSelecionadaDataTable fromModel(IEnumerable<AvaliacaoQuestaoModel> questoes, out dtsAvaliacao.dtAlternativasDataTable alternativas)
        {

            dtsAvaliacao.dtQuestaoSelecionadaDataTable dt = new dtsAvaliacao.dtQuestaoSelecionadaDataTable();
            dtsAvaliacao.dtAlternativasDataTable dtA = alternativas = new dtsAvaliacao.dtAlternativasDataTable();

            foreach (var item in questoes)
            {
                dtsAvaliacao.dtQuestaoSelecionadaRow dtRow = (dtsAvaliacao.dtQuestaoSelecionadaRow)dt.NewRow();

                dtRow.cdAvaliacaoQuestao = item.cdAvaliacaoQuestao;
                dtRow.cdQuestao = item.QuestaoModel.cdQuestao;
                dtRow.valor = item.valor;
                dtRow.ordem = item.ordem;
                dtRow.ordemDisciplina = item.ordemDisciplina;

                foreach (var a in item.QuestaoModel.Alternativas)
                {
                    dtsAvaliacao.dtAlternativasRow row = dtA.NewdtAlternativasRow();

                    row.ordem = a.ordem;
                    row.cdQuestaoAlternativa = a.cdQuestaoAlternativa;
                    row.correta = a.correta;
                    row.cdQuestao = a.cdQuestao;

                    dtA.AdddtAlternativasRow(row);
                }

                dt.AdddtQuestaoSelecionadaRow(dtRow);
            }

            return dt;
        }

        #endregion

    }
}