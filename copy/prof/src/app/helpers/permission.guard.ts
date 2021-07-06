import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PermissaoService } from '../services/permissao/permissao.service';

@Injectable({ providedIn: 'root' })
export class Permissao implements CanActivate {
  constructor(private router: Router, private permissao: PermissaoService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((ok) => {
      let data = route.data;
      this.permissao.get().then((map) => {
        let permissao = map.get(data.man);
        if (!permissao) {
          this.router.navigate(['/401']);
          ok(false);
        } else {
          let retorno = false;

          for (let a of data.permissao) {
            switch (a) {
              case 'consultar':
                retorno = permissao.idConsultar;
                break;
              case 'incluir':
                retorno = permissao.idConsultar && permissao.idIncluir;
                break;
              case 'alterar':
                retorno = permissao.idConsultar && permissao.idAlterar;
                break;
              case 'excluir':
                retorno = permissao.idConsultar && permissao.idExcluir;
                break;
            }

            if (!retorno) break;
          }

          if (!retorno) this.router.navigate(['/401']);
          ok(retorno);
        }
      });
    });
  }
}

export var Configurar = function (
  man: string,
  ...permissoes: ('consultar' | 'incluir' | 'alterar' | 'excluir')[]
): { data: {} } {
  return { data: { man: man, permissao: permissoes } };
};
