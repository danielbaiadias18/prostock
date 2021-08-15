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
  
  constructor(private http: HttpClient, private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}produto`)
      .subscribe((response: any) => {
        debugger;
        this.produtos = response;
      });
  }

  excluirProduto(idProduto: number) {
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
