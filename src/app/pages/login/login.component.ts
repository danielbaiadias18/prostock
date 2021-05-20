import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';
import { Uteis } from 'src/app/models/Uteis';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;

  constructor(private bars: BarsService, private router: Router, private fb: FormBuilder) {
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

    console.log("Usuário Inválido");
    //add sweetalert2 ------ npm i sweetalert2
    if (true) {//retorno do swal
      if (this.loginForm.controls['login'].value == "Daniel" && this.loginForm.controls['senha'].value == "123")//retorno da api
      {
        console.log(this.loginForm, "this.loginForm");

        // Uteis.markFormGroupTouched(this.loginForm);
        location.href = './';
      } else {

      }
    } else {

    }
  }
}
