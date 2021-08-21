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
        this.produtos = response;
      });
  }

  excluirProduto(idProduto: number) {
    Swal.fire({
      title: 'Deseja excluir o produto \"' + this.produtos.filter(x => x.id === idProduto)[0].nome + '\"?',
      showCancelButton: true,
      confirmButtonText: `Excluir`,
      confirmButtonColor: `#dc3545`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.api_url}produto/${idProduto}`)
        .subscribe(() => {
          this.ngOnInit();
        });
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        }).fire({
          icon: 'success',
          title: 'Produto excluído com sucesso!'
        });
      }
    });
  }
}
