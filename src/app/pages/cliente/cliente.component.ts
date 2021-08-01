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

  constructor(private http: HttpClient, private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}cliente`)
      .subscribe((response: any) => {
        this.clientes = response;
      });
  }

  excluirCliente(idCliente: number){
    this.http.delete(`${environment.api_url}cliente/${idCliente}`)
      .subscribe((response: any) => {
        Swal.fire(
          'Cliente excluído com sucesso!',
          '',
          'success'
        );
        this.ngOnInit();
      });
  }

}
