import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { iUsuario } from 'src/app/models/Usuario';
import { Uteis } from 'src/app/models/Uteis';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-troca-senha',
  templateUrl: './troca-senha.component.html',
  styleUrls: ['./troca-senha.component.scss']
})
export class TrocaSenhaComponent implements OnInit {

  fieldTextType: boolean = false;
  fieldTextType2: boolean = false;
  fieldTextType3: boolean = false;
  form: FormGroup;

  @Input() public usuario!: iUsuario;

  constructor(private fb: FormBuilder, private modalService: NgbActiveModal, private http: HttpClient, private auth: AuthenticationService) {
    this.form = this.fb.group({
      // senhaAntiga: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])],
      confirmarSenha: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  }

  toggleFieldTextType(field: number) {
    switch (field) {
      case 1:
        this.fieldTextType = !this.fieldTextType;
        break;
      case 2:
        this.fieldTextType2 = !this.fieldTextType2;
        break;
      case 3:
        this.fieldTextType3 = !this.fieldTextType3;
        break;
    }
  }
  
  confirm() {
    if (!this.matchPass()) {
      this.form.controls['confirmarSenha'].setErrors({ notMatch: true });
      Uteis.markFormGroupTouched(this.form);
    } else {
      this.form.addControl("usuarioId", new FormControl(this.auth.currentUserValue.user.id, Validators.required));
      this.http.put(environment.api_url + `usuario/changeSenha/${this.usuario.id}`, this.form.value).subscribe((res: any) => {
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
            title: 'Senha alterada com sucesso!'
          });
        this.close();
      });
    }
  }

  close() {
    this.modalService.close();
  }
  matchPass() {
    return this.form.controls['confirmarSenha'].value === this.form.controls['senha'].value;
  }
}