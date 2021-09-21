import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iUsuario } from 'src/app/models/Usuario';
import { Uteis } from 'src/app/models/Uteis';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  pessoaForm: FormGroup;
  form: FormGroup;
  usuario: iUsuario | undefined;
  idUsuario!: number;
  fieldTextType: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, public auth: AuthenticationService) {
    this.pessoaForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.form = this.fb.group({
      login: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([])],
      tipoUsuario: [2, Validators.compose([])],
    });
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(async (param) => {
      if (this.auth.currentUserValue.user.pessoaId > 0) {
        this.idUsuario = this.auth.currentUserValue.user.pessoaId;

        this.http.get(`${environment.api_url}usuario/${this.idUsuario}`)
          .subscribe((response: any) => {
            this.usuario = response;

            this.form.controls['login'].setValue(this.usuario?.login);
            this.form.controls['senha'].setValue(this.usuario?.senha);
            this.form.controls['tipoUsuario'].setValue(this.usuario?.tipoUsuario == 1);

            this.pessoaForm.controls['nome'].setValue(this.usuario?.pessoa?.nome);
            this.pessoaForm.controls['cpf'].setValue(this.usuario?.pessoa?.cpf);
            this.pessoaForm.controls['telefone'].setValue(this.usuario?.pessoa?.telefone);
            this.pessoaForm.controls['email'].setValue(this.usuario?.pessoa?.email);
          });

        if (this.idUsuario == 0)
          this.form.controls['senha'].setValidators(Validators.required);

      } else {
        this.router.navigate(['/notfound']);
      }
    });

  }

  salvar() {
    if (this.form.valid) {
      if (this.idUsuario! > 0) {
        this.usuario! = {
          id: this.idUsuario,
          login: this.form.get('login')!.value,
          senha: this.form.get('senha')!.value,
          pessoa: this.pessoaForm.value,
          pessoaId: this.auth.currentUserValue.user.pessoaId,
          lojaId: this.auth.currentUserValue.user.lojaId,
          tipoUsuario: this.form.get('tipoUsuario')!.value
        };
        this.http.put(environment.api_url + `usuario/${this.idUsuario}`, this.usuario).subscribe((res: any) => {
          if (res)
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
            title: 'Usuário alterado com sucesso!'
          });
          this.router.navigate(['home']);
        });

      } else {
        this.usuario! = {
          id: this.idUsuario,
          login: this.form.get('login')!.value,
          senha: this.form.get('senha')!.value,
          pessoa: this.pessoaForm.value,
          pessoaId: this.auth.currentUserValue.user.pessoaId,
          lojaId: this.auth.currentUserValue.user.lojaId,
          tipoUsuario: this.form.get('tipoUsuario')!.value
        };

        this.http.post(environment.api_url + 'usuario', this.usuario).subscribe((res: any) => {
          if (res) {
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
              title: 'Usuário cadastrado com sucesso!'
            });
          }
          this.router.navigate(['usuario']);
        });
      }
    } else {
      Uteis.markFormGroupTouched(this.form)
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  changeCkb(checked: any){
    this.form.controls['tipoUsuario'].setValue( checked.currentTarget.checked ? 1 : 2);
  }

}
