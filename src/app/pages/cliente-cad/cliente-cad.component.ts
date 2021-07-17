import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iEndereco } from 'src/app/models/Endereco';
import { Uteis } from 'src/app/models/Uteis';

@Component({
  selector: 'app-cliente-cad',
  templateUrl: './cliente-cad.component.html',
  styleUrls: ['./cliente-cad.component.scss']
})
export class ClienteCadComponent implements OnInit {

  form: FormGroup;
  formEndereco: FormGroup;

  enderecos: iEndereco[] = [
    {
      Id: 1,
      Cep: '77816-010',
      Rua: 'Rua São Luís',
      Bairro: 'JK',
      Cidade: 'Araguaína',
      Uf: 'TO',
      Complemento: 'Perto da pracinha',
      Pais: 'Brasil',
      PessoaId: 0
    }];

  constructor(private fb: FormBuilder) {
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
      UF: ['', Validators.compose([Validators.required])],
      complemento: [''],
      pais: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  }

  salvar() {
    if (this.form.valid) {

    } else {
      Uteis.markFormGroupTouched(this.form);
    }
  }

  adicionarEndereco() {
    if(this.formEndereco.valid){

    }else{
      Uteis.markFormGroupTouched(this.formEndereco);
    }
  }

  excluirEndereco(index: number) {
    this.enderecos.splice(index, 1);
  }

}
