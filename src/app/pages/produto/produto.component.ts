import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iProduto } from 'src/app/models/Produto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})

export class ProdutoComponent implements OnInit {
    
  produtos: iProduto[] = [];
  //   {
  //     Id: 1,
  //     Nome: 'Caneca branca',
  //     Marca: 'Philips',
  //     Descricao: 'Caneca branca para customização',
  //     ValorUnit: 12.90,
  //     UsuarioId: 1
  //   },
  //   {
  //     Id: 2,
  //     Nome: 'Camiseta branca',
  //     Marca: 'ColorVest',
  //     Descricao: 'Camiseta branca para customização',
  //     ValorUnit: 20.90,
  //     UsuarioId: 1
  //   },
  //   {
  //     Id: 3,
  //     Nome: 'Tinta Azul',
  //     Marca: 'Azure',
  //     Descricao: 'Tinta azul para máquina de imprimir',
  //     ValorUnit: 3.50,
  //     UsuarioId: 1
  //   }
  // ];
  constructor(private http: HttpClient,private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}produto`)
      .subscribe((response: any) => {
        this.produtos = response;
        console.log(response, "produtos")
      });
  }

  excluirProduto(idProduto: number){
    // this.produtos = this.produtos.filter(x => x.id != idProduto);

    this.http.delete(`${environment.api_url}produto/${idProduto}`)
      .subscribe((response: any) => {
        Swal.fire(
          'Produto excluído com sucesso!',
          '',
          'success'
        );
this.ngOnInit();
      });
  }

}
