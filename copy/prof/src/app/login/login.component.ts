import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BarsService } from '../services/bars.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, HttpMethod, iModel } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { iEmpresa } from '../models/Empresa';
import { User } from '../models/User';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EsqueciSenhaComponent } from '../modal/esqueci-senha/esqueci-senha.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  login: FormGroup;
  inProcess = false;
  model: iModel;
  bsModalRef: BsModalRef;

  empresas: iEmpresa[] = [];

  constructor(
    private bars: BarsService,
    private api: ApiService,
    private autheticate: AuthenticationService,
    private router: Router,
    private bsModalService: BsModalService,
    fb: FormBuilder) {
    this.login = fb.group({
      'login': ['', Validators.compose([Validators.required])],
      'senha': ['', Validators.compose([Validators.required])],
      'cdEmpresa': ['', Validators.compose([Validators.required])]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bars.emitCanSeeBarsEvent(false);
    }, 0);
  }

  contains(...items: string[]) {
    if (!this.model) return false;

    for (let i of items)
      if (this.model.ModelState.has(i)) { console.log(items, true); return true };

    console.log(items, false);
    return false;
  }

  ngOnInit(): void {
    this.api.api(HttpMethod.GET, 'empresa').then((res: iEmpresa[]) => {
      this.empresas = res;
      if (res && res.length > 0)
        this.login.controls.cdEmpresa.setValue(res[0].cdEmpresa);
    })
  }

  ngOnDestroy() {
    this.bars.emitCanSeeBarsEvent(true);
  }

  openModal(){
    this.bsModalRef = this.bsModalService.show(EsqueciSenhaComponent, {
      class: 'modal-lg'
    },);
    this.bsModalRef.content.cdEmpresa = this.login.controls.cdEmpresa.value;
  }

  logar(value) {
    this.inProcess = true;
    this.api.api(HttpMethod.POST, 'login/professor', value)
      .then((res) => {
        this.inProcess = false;
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.autheticate.currentUserSubject.next(res);
        location.href = './';
      })
      .catch(err => {
        if (err instanceof iModel) {
          this.inProcess = false;
          this.model = err;
        }
      })
  }

}
