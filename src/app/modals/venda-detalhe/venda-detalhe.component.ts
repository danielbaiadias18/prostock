import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iProduto } from 'src/app/models/Produto';
import { iProdutoVenda } from 'src/app/models/ProdutoVenda';
import { iVenda, iVendaPost } from 'src/app/models/Venda';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-venda-detalhe',
  templateUrl: './venda-detalhe.component.html',
  styleUrls: ['./venda-detalhe.component.scss']
})
export class VendaDetalheComponent implements OnInit {

  @Input() public venda!: iVenda;
  items = [];

  form: FormGroup;
  vlTotal: number = 0;

  produtosVenda: iProdutoVenda[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, private auth: AuthenticationService) {
    this.form = this.fb.group({
      valorTotal: [''],
      descricao: [''],
      desconto: [0],
      acrescimo: [0],
      frete: [0],
      cliente: ['', Validators.required]
    }); 
  }

  ngOnInit(): void {
      if (this.venda.id > 0) {

        this.http.get(`${environment.api_url}venda/${this.venda.id}`)
          .subscribe((response: any) => {
            debugger;
            this.venda = response;
            this.produtosVenda = this.venda?.produtosVendas ?? [];

            this.form.controls['valorTotal'].setValue(this.venda?.valorTotal);
            this.form.controls['desconto'].setValue(this.venda?.desconto);
            this.form.controls['acrescimo'].setValue(this.venda?.acrescimo);
            this.form.controls['frete'].setValue(this.venda?.frete);
            this.form.controls['cliente'].setValue(this.venda?.cliente.id);
          });

      } else {
        this.router.navigate(['/notfound']);
      }
  }

}
