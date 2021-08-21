import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iCliente } from 'src/app/models/Cliente';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  clientes: iCliente[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}cliente`)
      .subscribe((response: any) => {
        this.clientes = response;
      });
  }

  excluirCliente(idCliente: number) {

    Swal.fire({
      title: 'Deseja excluir o cliente \"' + this.clientes.filter(x => x.id === idCliente)[0].pessoa.nome + '\"?',
      showCancelButton: true,
      confirmButtonText: `Excluir`,
      confirmButtonColor: `#dc3545`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.api_url}cliente/${idCliente}`)
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
          title: 'Cliente excluído com sucesso!'
        });
      }
    });

  }
}
