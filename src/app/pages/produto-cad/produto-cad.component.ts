import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Uteis } from 'src/app/models/Uteis';

@Component({
  selector: 'app-produto-cad',
  templateUrl: './produto-cad.component.html',
  styleUrls: ['./produto-cad.component.scss']
})
export class ProdutoCadComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', Validators.required],
    });
   }

  ngOnInit(): void {
  }

  salvar(){
    if(this.form.valid){

    }else{
      Uteis.markFormGroupTouched(this.form)
    }
  }

}
