import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iUsuario } from 'src/app/models/Usuario';
import { Uteis } from 'src/app/models/Uteis';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-cad',
  templateUrl: './usuario-cad.component.html',
  styleUrls: ['./usuario-cad.component.scss']
})
export class UsuarioCadComponent implements OnInit {

  
  pessoaForm: FormGroup;
  form: FormGroup;
  usuario: iUsuario | undefined;
  idUsuario!: number;
  fieldTextType: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    
    this.pessoaForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.form = this.fb.group({
      login: ['', Validators.compose([Validators.required])],
      senha: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (param) => {
      if (!Number.isNaN(Number(param.get('id')))) {
        this.idUsuario = +(param.get('id') ?? 0);

        this.http.get(`${environment.api_url}usuario/${this.idUsuario}`)
          .subscribe((response: any) => {
            this.usuario = response;

            this.form.controls['login'].setValue(this.usuario?.login);
            this.form.controls['senha'].setValue(this.usuario?.senha);

            this.pessoaForm.controls['nome'].setValue(this.usuario?.pessoa?.nome);
            this.pessoaForm.controls['cpf'].setValue(this.usuario?.pessoa?.cpf);
            this.pessoaForm.controls['telefone'].setValue(this.usuario?.pessoa?.telefone);
            this.pessoaForm.controls['email'].setValue(this.usuario?.pessoa?.email);
          });

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
          pessoa: this.pessoaForm.value
        };
        this.http.put(environment.api_url + `usuario/${this.idUsuario}`, this.usuario).subscribe((res: any) => {
          if (res)
            Swal.fire(
              'Usuário alterado com sucesso!',
              '',
              'success'
            );
          this.router.navigate(['usuario']);
        });

      } else {
        this.usuario! = {
          id: this.idUsuario,
          login: this.form.get('login')!.value,
          senha: this.form.get('senha')!.value,
          pessoa: this.pessoaForm.value
        };

        this.http.post(environment.api_url + 'usuario', this.usuario).subscribe((res: any) => {
          if (res){
            Swal.fire(
              `Usuário cadastrado com sucesso!`,
              '',
              'success'
            );
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

}
