import { Component, OnInit, ViewChild } from '@angular/core';
import { iProduto } from 'src/app/models/Produto';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  produtos: iProduto[] = [
    {
      Id: 1,
      Nome: 'Caneca branca',
      Marca: 'Philips',
      Descricao: 'Caneca branca para customização',
      ValorUnit: 12.90,
      UsuarioId: 1
    },
    {
      Id: 2,
      Nome: 'Camiseta branca',
      Marca: 'ColorVest',
      Descricao: 'Camiseta branca para customização',
      ValorUnit: 20.90,
      UsuarioId: 1
    },
    {
      Id: 3,
      Nome: 'Tinta Azul',
      Marca: 'Azure',
      Descricao: 'Tinta azul para máquina de imprimir',
      ValorUnit: 3.50,
      UsuarioId: 1
    }
  ];
  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    console.log(this.auth.currentUser);
  }

  excluirProduto(idProduto: number){
    this.produtos = this.produtos.filter(x => x.Id != idProduto);
  }

}
