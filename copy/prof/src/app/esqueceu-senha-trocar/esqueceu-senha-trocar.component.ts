import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, HttpMethod, iModel } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { BarsService } from '../services/bars.service';

@Component({
  selector: 'app-esqueceu-senha-trocar',
  templateUrl: './esqueceu-senha-trocar.component.html',
  styleUrls: ['./esqueceu-senha-trocar.component.scss']
})
export class EsqueceuSenhaTrocarComponent implements OnInit {

  form: FormGroup;
  model: iModel;
  token: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private barsService: BarsService
  ) {
    this.form = this.fb.group({
      senha: ['', Validators.required],
      confirm: ['', Validators.compose([Validators.required])]
    }, {validators: this.mustMatch})
    this.token = activeRoute.snapshot.params.token;
  }

  ngOnInit(): void {
    this.api.api(HttpMethod.POST, 'login/validar', { token: this.token }).then((valido)=>{
      if(valido == false){
        Swal.fire({
          icon:'warning',
          title: 'Atenção!',
          text: 'Usuário inválido.'
        }).then(()=>{
          this.router.navigate(['/login']);
        })
      }
    });
    setTimeout(() => {
      this.barsService.emitCanSeeBarsEvent(false);
    }, 0);
  }

  submit(value){
    if(this.form.valid){
      let model = {
        token: this.token,
        senha: value.senha
      };
      this.api.api(HttpMethod.POST, 'login/trocarsenhaprofessor', model).then((res)=>{
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Sua senha foi alterada com sucesso!'
        }).then(()=>{
          this.router.navigate(['/login']);
        })
      });
    }
  }

  contains(...items: string[]) {
    if (!this.model) return false;

    for (let i of items)
      if (this.model.ModelState.has(i)) { console.log(items, true); return true };

    console.log(items, false);
    return false;
  }

  //Valida se as senhas são iguais
  mustMatch(frmCtrl: AbstractControl): null | {[key: string]: boolean} {
      const matches = frmCtrl.get('confirm').value == frmCtrl.get('senha').value;
      return matches == true? null : {'noMatch': true}

  }

}
