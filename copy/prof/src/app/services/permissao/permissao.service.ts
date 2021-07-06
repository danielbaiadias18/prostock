import { Injectable, OnInit } from '@angular/core';
import { ApiService, HttpMethod } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PermissaoService {
  permissao: Map<string, iPermissao>;

  constructor(private api: ApiService) {}
  async get(): Promise<Map<string, iPermissao>> {
    return new Promise((ok) => {
      if (this.permissao) ok(this.permissao);
      else {
        this.api
          .api(HttpMethod.GET, 'permissao')
          .then((result: iApiPermissao[]) => {
            this.permissao = new Map();
            for (let a of result) this.permissao.set(a.nmProgramaMan, a);
            ok(this.permissao);
          });
      }
    });
  }
}

interface iApiPermissao extends iPermissao {
  idPrograma: number;
  nmProgramaMan: string;
}

export interface iPermissao {
  idConsultar: boolean;
  idAlterar: boolean;
  idExcluir: boolean;
  idIncluir: boolean;
}
