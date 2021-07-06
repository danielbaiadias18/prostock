import { NgModule } from '@angular/core';
import { AlterarDirective } from './alterar.directive';
import { ConsultarDirective } from './consultar.directive';
import { ExcluirDirective } from './excluir.directive';
import { IncluirDirective } from './incluir.directive';

@NgModule({
  declarations: [
    IncluirDirective,
    ConsultarDirective,
    ExcluirDirective,
    AlterarDirective,
  ],
  exports: [
    IncluirDirective,
    ConsultarDirective,
    ExcluirDirective,
    AlterarDirective,
  ],
})
export class AcessoModule {}
