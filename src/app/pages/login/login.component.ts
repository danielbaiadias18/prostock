import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';
import { Uteis } from 'src/app/models/Uteis';
import { ApiService, HttpMethod, iModel } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  model: iModel | undefined;

  constructor(private bars: BarsService, private router: Router, private fb: FormBuilder, private http: HttpClient, private auth: AuthenticationService) {
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
    this.http.post(environment.api_url + 'usuario/login', this.loginForm.value).subscribe((res: any) => {
      localStorage.setItem('currentUser', JSON.stringify(res));
      this.auth.currentUserSubject.next(res);
      location.href = './';
    });
  }
}
