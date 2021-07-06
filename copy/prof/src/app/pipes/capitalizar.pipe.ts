import { Pipe, PipeTransform } from '@angular/core';

const excessoes = ['a', 'e', 'as', 'os', 'o', 'da', 'de', 'do', 'das', 'dos', 'ou']
const regex = /^((\(M\)){0,3})(\(C\)\(M\)|\(C\)\(D\)|(\(D\))?(\(C\)){0,3})(\(X\)\(C\)|\(X\)\(L\)|(\(L\))?(\(X\)){0,3})(M\(X\)|M\(V\)|(\(V\))?)(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/

@Pipe({
  name: 'capitalizar'
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    let nomes: string[] = value.toLowerCase().split(' ');

    for (let nome of nomes) {
      if (excessoes.indexOf(nome) == -1 && nome) {
        if (regex.test(nome.toUpperCase())) {
          nomes[nomes.indexOf(nome)] = nome.toUpperCase();
          continue;
        }

        let temp = nome[0].toUpperCase();
        if (nome.length > 1)
          temp = temp + nome.substr(1);

        nomes[nomes.indexOf(nome)] = temp;
      }
    }

    return nomes.join(' ');
  }

}
