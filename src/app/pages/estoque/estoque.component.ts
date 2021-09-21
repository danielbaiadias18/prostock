import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iEstoque } from 'src/app/models/Estoque';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  estoques: iEstoque[] = [];

  constructor(private http: HttpClient, private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}estoque`)
      .subscribe((response: any) => {
        this.estoques = response;
        console.log(response, "response")
      });
  }

  excluirEstoque(idEstoque: number) {
    Swal.fire({
      title: 'Deseja excluir estoque do produto \"' + this.estoques.filter(x => x.id === idEstoque)[0].produto.nome + '\"?',
      showCancelButton: true,
      confirmButtonText: `Excluir`,
      confirmButtonColor: `#dc3545`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.api_url}estoque/${idEstoque}`)
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
          title: 'Produto excluído com sucesso do estoque!'
        });
      }
    });
  }
}
