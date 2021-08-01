import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iCliente } from 'src/app/models/Cliente';
import { iEndereco } from 'src/app/models/Endereco';
import { Uteis } from 'src/app/models/Uteis';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-cad',
  templateUrl: './cliente-cad.component.html',
  styleUrls: ['./cliente-cad.component.scss']
})
export class ClienteCadComponent implements OnInit {

  form: FormGroup;
  formEndereco: FormGroup;
  cliente: iCliente | undefined;
  idCliente!: number;

  enderecos: iEndereco[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.formEndereco = this.fb.group({
      cep: ['', Validators.compose([Validators.required])],
      rua: ['', Validators.compose([Validators.required])],
      bairro: ['', Validators.compose([Validators.required])],
      cidade: ['', Validators.compose([Validators.required])],
      uf: ['', Validators.compose([Validators.required])],
      complemento: [''],
      pais: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (param) => {
      if (!Number.isNaN(Number(param.get('id')))) {
        this.idCliente = +(param.get('id') ?? 0);

        this.http.get(`${environment.api_url}cliente/${this.idCliente}`)
          .subscribe((response: any) => {
            this.cliente = response;
            this.enderecos = this.cliente?.pessoa?.enderecos ?? [];

            this.form.controls['nome'].setValue(this.cliente?.pessoa?.nome);
            this.form.controls['cpf'].setValue(this.cliente?.pessoa?.cpf);
            this.form.controls['telefone'].setValue(this.cliente?.pessoa?.telefone);
            this.form.controls['email'].setValue(this.cliente?.pessoa?.email);
          });

      } else {
        this.router.navigate(['/notfound']);
      }
    });
  }

  salvar() {
    if (this.form.valid) {
      if (this.idCliente! > 0) {
        this.cliente! = {
          id: this.idCliente,
          pessoa: this.form.value
        };
        this.cliente.pessoa.enderecos = this.enderecos;

        this.http.put(environment.api_url + `cliente/${this.idCliente}`, this.cliente).subscribe((res: any) => {
          if (res)
            Swal.fire(
              'Cliente alterado com sucesso!',
              '',
              'success'
            );
          this.router.navigate(['cliente']);
        });

      } else {
        this.cliente! = {
          id: this.idCliente,
          pessoa: this.form.value
        };
        this.cliente.pessoa.enderecos = this.enderecos;

        this.http.post(environment.api_url + 'cliente', this.cliente).subscribe((res: any) => {
          if (res){
            Swal.fire(
              `Cliente cadastrado com sucesso!`,
              '',
              'success'
            );
          }
          this.router.navigate(['cliente']);
        });
      }
    } else {
      Uteis.markFormGroupTouched(this.form)
    }
  }

  adicionarEndereco() {
    if (this.formEndereco.valid) {
      this.enderecos.push(this.formEndereco.value);
    } else {
      Uteis.markFormGroupTouched(this.formEndereco);
    }
  }
  excluirEndereco(index: number) {
    this.enderecos.splice(index, 1);
  }

}
