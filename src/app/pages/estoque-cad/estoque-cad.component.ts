import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iEstoque } from 'src/app/models/Estoque';
import { iProduto } from 'src/app/models/Produto';
import { Uteis } from 'src/app/models/Uteis';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estoque-cad',
  templateUrl: './estoque-cad.component.html',
  styleUrls: ['./estoque-cad.component.scss']
})
export class EstoqueCadComponent implements OnInit {

  produtos: iProduto[] = [];
  prods: any[] = [];
  form: FormGroup;
  idEstoque!: number;
  public estoque: iEstoque | undefined;
  
  constructor(private http: HttpClient, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { 
    this.form = this.fb.group({
      produtoId: ['', Validators.required],
      qtdAtual: ['', Validators.compose([Validators.required])],
      qtdMinima: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.http.get(environment.api_url + 'produto')
      .subscribe((response: any) => {
        this.prods = response.map(function (obj: iProduto) {
          var rObj = { id: obj.id, name: obj.nome };
          return rObj;
        });
      });

      this.route.paramMap.subscribe(async (param) => {
        if (!Number.isNaN(Number(param.get('id')))) {
          this.idEstoque = +(param.get('id') ?? 0);
  
          this.http.get(`${environment.api_url}estoque/${this.idEstoque}`)
            .subscribe((response: any) => {
              this.estoque = response;
              
              this.form.controls['produtoId'].setValue(this.prods.find(x => x.id === this.estoque?.produtoId));
              this.form.controls['qtdAtual'].setValue(this.estoque?.qtdAtual);
              this.form.controls['qtdMinima'].setValue(this.estoque?.qtdMinima);
            });
  
        } else {
          this.router.navigate(['/notfound']);
        }
      });
  }

  salvar() {
    if (this.form.valid) {
      if (this.idEstoque! > 0) {
        let estoquePost = {
          produtoId: this.form.controls['produtoId'].value.id,
          qtdAtual: this.form.controls['qtdAtual'].value,
          qtdMinima: this.form.controls['qtdMinima'].value,
        };

        this.http.put(environment.api_url + `estoque/${this.idEstoque}`, estoquePost).subscribe((res: any) => {
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
              title: 'Estoque alterado com sucesso!'
            });
          this.router.navigate(['estoque']);
        });

      } else {
        let estoquePost = {
          produtoId: this.form.controls['produtoId'].value.id,
          qtdAtual: this.form.controls['qtdAtual'].value,
          qtdMinima: this.form.controls['qtdMinima'].value,
        };

        this.http.post(environment.api_url + 'estoque', estoquePost).subscribe((res: any) => {
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
              title: 'Estoque realizado com sucesso!'
            });
          }
          this.router.navigate(['estoque']);
        });
      }
    } else {
      Uteis.markFormGroupTouched(this.form)
    }
  }

}
