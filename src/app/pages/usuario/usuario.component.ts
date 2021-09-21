import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrocaSenhaComponent } from 'src/app/modals/troca-senha/troca-senha.component';
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

  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}usuario`)
      .subscribe((response: any) => {
        this.usuarios = response;
      });
  }

  excluirUsuario(idUsuario: number){
      Swal.fire({
        title: 'Deseja excluir o usuário \"' + (this.usuarios.filter(x => x.id === idUsuario)[0].pessoa.nome != null ? this.usuarios.filter(x => x.id === idUsuario)[0].pessoa.nome : this.usuarios.filter(x => x.id === idUsuario)[0].login) + '\"?',
        showCancelButton: true,
        confirmButtonText: `Excluir`,
        confirmButtonColor: `#dc3545`,
        cancelButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`${environment.api_url}usuario/${idUsuario}`)
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
            title: 'Usuário excluído com sucesso!'
          });
        }
      });
  }

  trocaSenha(usuario: iUsuario){
    const modalRef = this.modalService.open(TrocaSenhaComponent, {size: 'md'});
    modalRef.componentInstance.usuario = usuario;
  }

}
