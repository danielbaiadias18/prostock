import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Uteis } from 'src/app/models/Uteis';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-produto-cad',
  templateUrl: './produto-cad.component.html',
  styleUrls: ['./produto-cad.component.scss']
})
export class ProdutoCadComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descricao: ['', Validators.required],
      valorUnit: ['', Validators.required],
    });
   }

  ngOnInit(): void {
  }

  salvar(){
    if(this.form.valid){
      debugger;
      this.http.post(environment.api_url + 'produto', this.form.value).subscribe((res: any) => {
        console.log(res, "resresrs");
      });
    }else{
      Uteis.markFormGroupTouched(this.form)
    }
  }

}
