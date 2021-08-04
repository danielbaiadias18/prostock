import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iUsuario } from 'src/app/models/Usuario';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  usuarios: iUsuario[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}usuario`)
      .subscribe((response: any) => {
        debugger;
        this.usuarios = response;
      });
  }

  excluirUsuario(idUsuario: number){
    this.http.delete(`${environment.api_url}usuario/${idUsuario}`)
      .subscribe((response: any) => {
        Swal.fire(
          'Usuário excluído com sucesso!',
          '',
          'success'
        );
        this.ngOnInit();
      });
  }

}
