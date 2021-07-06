import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService, HttpMethod, iModel } from 'src/app/services/api.service';
import { BarsService } from 'src/app/services/bars.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.scss']
})
export class EsqueciSenhaComponent implements OnInit {

  form: FormGroup;
  model: iModel;
  inProcess: boolean = false;
  public cdEmpresa;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private bsModalRef: BsModalRef
  ) {
    this.form = fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit(value){
    if(this.form.valid){
      try{
        let profEmail = {
          email : value.email,
          cdEmpresa: this.cdEmpresa
        }
        this.inProcess = true
      this.api.api(HttpMethod.POST, 'login/esquecisenhaprofessor', profEmail).then((res)=>{
        Swal.fire({
          title: 'Sucesso!',
          icon: 'success',
          text: `Um link de recuperação de senha foi enviado para o e-mail ${value.email}.`
        });
        this.bsModalRef.hide();
      }).catch((err)=>{
        if(err instanceof iModel)
          this.model = err;
      }).finally(()=>{
        this.inProcess = false
      });
    }
    catch(err){
      console.log(err);
    }
    }
  }

  contains(...items: string[]) {
    if (!this.model) return false;

    for (let i of items)
      if (this.model.ModelState.has(i)) { console.log(items, true); return true };

    console.log(items, false);
    return false;
  }

  close(){
    this.bsModalRef.hide();
  }

}
