import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iCliente } from 'src/app/models/Cliente';
import { iProduto } from 'src/app/models/Produto';
import { iProdutoVenda } from 'src/app/models/ProdutoVenda';
import { Uteis } from 'src/app/models/Uteis';
import { iVenda, iVendaPost } from 'src/app/models/Venda';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venda-cad',
  templateUrl: './venda-cad.component.html',
  styleUrls: ['./venda-cad.component.scss']
})
export class VendaCadComponent implements OnInit {

  items = [];

  form: FormGroup;
  formProduto: FormGroup;
  venda: iVenda | undefined;
  vendaPost: iVendaPost | undefined;
  idVenda!: number;
  vlTotal: number = 0;

  clientes: [] = [];

  selected = { id: null, name: '' };
  prods: [] = [];
  produtos: iProduto[] = [];
  produtosVenda: iProdutoVenda[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, private auth: AuthenticationService) {
    this.form = this.fb.group({
      valorTotal: ['', Validators.required],
      // descricao: [''],
      desconto: [0],
      acrescimo: [0],
      frete: [0],
      data: [new Date().toLocaleDateString('pt-BR')],
      clienteId: ['', Validators.required],
      produtos: this.produtosVenda
    });

    this.formProduto = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.http.get(environment.api_url + 'produto')
      .subscribe((response: any) => {
        this.produtos = response;
        this.prods = response.map(function (obj: iProduto) {
          var rObj = { id: obj.id, name: obj.nome };
          return rObj;
        });
      });

    this.http.get(environment.api_url + 'cliente')
      .subscribe((response: any) => {
        this.clientes = response.map(function (obj: iCliente) {
          var rObj = { id: obj.id, name: obj.pessoa.nome };
          return rObj;
        });;
      });
  };

  salvar() {
    if (this.produtosVenda.length <= 0) {
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
        icon: 'warning',
        title: 'N??o ?? poss??vel realizar uma venda sem produtos!'
      });
    } else {

      if (this.form.valid) {

        var data = this.form.controls['data'].value.split("/");

        var dia = data[0];
        var mes = data[1];
        var ano = data[2];

        let dataFormatada =  mes + "/" + dia + "/" + ano;

        if (this.idVenda! > 0) {
          this.vendaPost! = {
            id: this.idVenda,
            valorTotal: this.vlTotal,
            desconto: this.form.controls['desconto'].value,
            acrescimo: this.form.controls['acrescimo'].value,
            frete: this.form.controls['frete'].value,
            data: new Date(dataFormatada),
            status: "concluida",
            // descricao: this.form.controls['descricao'].value,
            clienteId: this.form.controls['clienteId'].value.id,
            usuarioId: this.auth.currentUserValue.user!.id,
            produtos: this.produtosVenda
          };

          this.http.put(environment.api_url + `venda/${this.idVenda}`, this.vendaPost).subscribe((res: any) => {
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
                title: 'Venda alterada com sucesso!'
              });
            this.router.navigate(['venda']);
          });

        } else {
          this.vendaPost! = {
            id: this.idVenda,
            valorTotal: this.form.controls['valorTotal'].value,
            desconto: this.form.controls['desconto'].value,
            acrescimo: this.form.controls['acrescimo'].value,
            frete: this.form.controls['frete'].value,
            data: new Date(dataFormatada),
            status: "concluida",
            // descricao: this.form.controls['descricao'].value,
            clienteId: this.form.controls['clienteId'].value.id,
            usuarioId: this.auth.currentUserValue.user!.id,
            produtos: this.produtosVenda
          };

          this.http.post(environment.api_url + 'venda', this.vendaPost).subscribe((res: any) => {
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
                title: 'Venda realizada com sucesso!'
              });
            }
            this.router.navigate(['venda']);
          });
        }

      } else {
        Uteis.markFormGroupTouched(this.form)
      }
    }
  }

  adicionarProduto() {
    if (this.formProduto.valid) {
      this.produtosVenda.push({
        produtoId: this.formProduto.get('produtoId')!.value.id,
        quantidade: this.formProduto.get('quantidade')!.value,
        id: 0,
        vendaId: 0,
        produto: this.produtos.filter(x => x.id == this.formProduto.get('produtoId')!.value.id)[0]
      });

      this.calcTtl();
    } else {
      Uteis.markFormGroupTouched(this.formProduto);
    }
  }
  removerProd(index: number) {
    this.produtosVenda.splice(index, 1);
    this.calcTtl();
  }

  calcTtl() {
    this.vlTotal = 0;
    this.produtosVenda.forEach((prodVenda) => {
      this.vlTotal += prodVenda.produto.valorUnit * prodVenda.quantidade;
    });

    let valor = this.vlTotal + this.form.controls['acrescimo'].value + this.form.controls['frete'].value - this.form.controls['desconto'].value;
    this.form.controls['valorTotal'].setValue(valor);
    this.vlTotal = valor;
  }

}
