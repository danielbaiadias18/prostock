import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendaDetalheComponent } from 'src/app/modals/venda-detalhe/venda-detalhe.component';
import { iVenda } from 'src/app/models/Venda';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ProdutoCadComponent } from '../produto-cad/produto-cad.component';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss']
})
export class VendaComponent implements OnInit {

  vendas: iVenda[] = [];

  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}venda`)
      .subscribe((response: any) => {
        this.vendas = response;
      });
  }

  excluirVenda(idVenda: number) {
    Swal.fire({
      title: 'Deseja excluir a venda \"' + this.vendas.filter(x => x.id === idVenda)[0].id + '\"?',
      showCancelButton: true,
      confirmButtonText: `Excluir`,
      confirmButtonColor: `#dc3545`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.api_url}venda/${idVenda}`)
          .subscribe(() => {
            this.ngOnInit();
          });
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
          title: 'Venda excluída com sucesso!'
        });
      }
    });

  }

  detalhe(venda: iVenda) {
    const modalRef = this.modalService.open(VendaDetalheComponent);
    modalRef.componentInstance.venda = venda;
  }

}
