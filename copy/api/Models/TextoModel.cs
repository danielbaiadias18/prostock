using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace api.Models
{
    public class TextoModel
    {
        private static string[] preposicoes = new string[] { "a", "e", "o", "da", "de", "do", "das", "des", "dos" };

        /// <summary>
        /// Formata uma string capitalizando a primeira letra de um nome
        /// </summary>
        /// <param name="entrada">Nome a ser formatado. Ex.: EDUARDO HENRIQUE DE VASCONCELOS SOLER</param>
        /// <returns>Nome formatado. Ex.: Eduardo Henrique de Vasconcelos Soler</returns>
        public static string Capitalizar(string entrada)
        {
            string[] nomes = entrada.ToLower().Split(' ');

            for (int i = 0; i < nomes.Length; i++)
                if (!preposicoes.Contains(nomes[i]) && !string.IsNullOrWhiteSpace(nomes[i]))
                {
                    string temp = nomes[i];
                    nomes[i] = nomes[i][0].ToString().ToUpper();
                    if (temp.Length > 1)
                        nomes[i] += temp.Substring(1);
                }

            return string.Join(" ", nomes);
        }

        #region Conversores
        /// <summary>
        /// Função que converte qualquer valor struct em string, seja DateTime, Decimal, int, etc...
        /// </summary>
        /// <typeparam name="T">Tipo do struct</typeparam>
        /// <param name="Valor">Valor que será convertido em texto</param>
        /// <returns>String convertida de um struct</returns>
        public static string getValor<T>(T Valor) where T : struct { return getValor(Valor, "{0}"); }
        /// <summary>
        /// Função que converte qualquer valor struct em string, seja DateTime, Decimal, int, etc...
        /// </summary>
        /// <typeparam name="T">Tipo do struct</typeparam>
        /// <param name="Valor">Valor que será convertido em texto</param>
        /// <param name="Formato">Formato de conversão. Ex.: "{0:dd/MM/yyyy}"</param>
        /// <returns>String formatada convertida de um struct</returns>
        public static string getValor<T>(T Valor, string Formato) where T : struct { return getValor((T?)Valor, Formato); }
        /// <summary>
        /// Função que converte qualquer valor struct em string, seja DateTime, Decimal, int, etc...
        /// </summary>
        /// <typeparam name="T">Tipo do struct</typeparam>
        /// <param name="Valor">Valor nulável que será convertido em texto, se for nulo retornará nulo</param>
        /// <returns>String convertida de um struct</returns>
        public static string getValor<T>(T? Valor) where T : struct { return getValor(Valor, "{0}"); }
        /// <summary>
        /// Função que converte qualquer valor struct em string, seja DateTime, Decimal, int, etc...
        /// </summary>
        /// <typeparam name="T">Tipo do struct</typeparam>
        /// <param name="Valor">Valor nulável que será convertido em texto, se for nulo retornará nulo</param>
        /// <param name="Formato">Formato de conversão. Ex.: "{0:dd/MM/yyyy}"</param>
        /// <returns>String formatada convertida de um struct</returns>
        public static string getValor<T>(T? Valor, string Formato) where T : struct
        {
            if (!Valor.HasValue)
                return null;

            return string.Format(Formato, Valor);
        }

        /// <summary>
        /// Função que converte qualquer valor string em struct, seja DateTime, Decimal, int, etc...
        /// </summary>
        /// <typeparam name="T">Tipo do struct, Ex.: int, Decimal, double, DateTime, etc...</typeparam>
        /// <param name="Text">Texto que será convertido</param>
        /// <returns>struct nulável convertido de uma String</returns>
        public static T? getValor<T>(string Text) where T : struct
        {
            T? Valor = null;
            TypeConverter Converter = TypeDescriptor.GetConverter(typeof(T));

            try
            {
                if (!string.IsNullOrWhiteSpace(Text))
                    Valor = (T?)Converter.ConvertFromString(Text);
            }
            catch
            {
                return null;
            }

            return Valor;
        }
        #endregion

        #region Tamanho

        public static string Max(string Texto, int TamMax)
        {
            if (Texto.Length <= TamMax)
                return Texto;

            return string.Format("{0}...", Texto.Substring(0, TamMax - 3));
        }

        #endregion

        #region Aleatório
        private static IDictionary<Possibilidade, string> contantes
        {
            get
            {
                var constantes = new Dictionary<Possibilidade, string>();
                constantes.Add(Possibilidade.LetraMinuscula, "abcdefghijkmnopqrstuvwxyz");
                constantes.Add(Possibilidade.LetraMaiuscula, "ABCDEFGHJKLMNOPQRSTUVWXYZ");
                constantes.Add(Possibilidade.LetraCamelCase, constantes[Possibilidade.LetraMaiuscula] + constantes[Possibilidade.LetraMinuscula]);
                constantes.Add(Possibilidade.Numeros, "0123456789");
                constantes.Add(Possibilidade.Especiais, "-_={}[]()");
                return constantes;
            }
        }
        public static string GerarNomeAleatorio(int qtdCaracteres)
        {
            return GerarNomeAleatorio(qtdCaracteres, Possibilidade.LetraCamelCase, Possibilidade.Numeros, Possibilidade.Especiais);
        }
        public static string GerarNomeAleatorio(int qtdCaracteres, params Possibilidade[] possibilidades)
        {
            string caracteresPermitidos = string.Join("", possibilidades.Distinct().Select(x => contantes[x]));
            char[] chars = new char[qtdCaracteres];
            Random rd = new Random();
            for (int i = 0; i < qtdCaracteres; i++)
            {
                chars[i] = caracteresPermitidos[rd.Next(0, caracteresPermitidos.Length)];
            }
            return new string(chars);
        }
        #endregion
    }
    public enum Possibilidade
    {
        LetraMinuscula,
        LetraMaiuscula,
        LetraCamelCase,
        Numeros,
        Especiais
    }
}
