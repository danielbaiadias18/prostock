import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';
import { Uteis } from 'src/app/models/Uteis';
import { ApiService, HttpMethod, iModel } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  model: iModel | undefined;

  constructor(private bars: BarsService, private router: Router, private fb: FormBuilder, private api: ApiService, private auth: AuthenticationService) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bars.emitCanSeeBarsEvent(false);
    }, 0);
  }

  logar() {
debugger;
    this.api.api(HttpMethod.POST, 'usuario/login', this.loginForm)
    .then((res) => {
      debugger;
      localStorage.setItem('currentUser', JSON.stringify(res));
      this.auth.currentUserSubject.next(res);
      location.href = './';
    })
    .catch(err => {
      if (err instanceof iModel) {
        this.model = err;
      }
    })
  }
}
