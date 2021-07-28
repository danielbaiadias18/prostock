import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iProduto } from 'src/app/models/Produto';
import { Uteis } from 'src/app/models/Uteis';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-produto-cad',
  templateUrl: './produto-cad.component.html',
  styleUrls: ['./produto-cad.component.scss']
})
export class ProdutoCadComponent implements OnInit {

  form: FormGroup;
  produto: iProduto | undefined;
  idProduto: number | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descricao: ['', Validators.required],
      valorUnit: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (param) => {
      if (!Number.isNaN(Number(param.get('id')))) {
        this.idProduto = +(param.get('id') ?? 0);
        console.log(this.idProduto, "idProduto");

        this.http.get(`${environment.api_url}produto/${this.idProduto}`)
          .subscribe((response: any) => {
            this.produto = response;
            console.log(response, "produto");

            this.form.controls['nome'].setValue(this.produto?.nome);
            this.form.controls['marca'].setValue(this.produto?.marca);
            this.form.controls['descricao'].setValue(this.produto?.descricao);
            this.form.controls['valorUnit'].setValue(this.produto?.valorUnit);
          });

      } else {
        this.router.navigate(['/notfound']);
      }
    });
  }

  salvar() {
    if (this.form.valid) {
      debugger;
      if(this.idProduto! > 0){
        this.http.put(environment.api_url + `produto/${this.idProduto}`, this.form.value).subscribe((res: any) => {
          console.log(res, "resresrs");
        });

      }else{
        this.http.post(environment.api_url + 'produto', this.form.value).subscribe((res: any) => {
          console.log(res, "resresrs");
        });
      }
    } else {
      Uteis.markFormGroupTouched(this.form)
    }
  }

}
