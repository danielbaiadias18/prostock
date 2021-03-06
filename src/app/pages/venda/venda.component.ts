import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendaDetalheComponent } from 'src/app/modals/venda-detalhe/venda-detalhe.component';
import { iVenda } from 'src/app/models/Venda';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss']
})
export class VendaComponent implements OnInit {

  vendas: iVenda[] = [];
  response: any;

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
    const modalRef = this.modalService.open(VendaDetalheComponent, {size: 'xl'});
    modalRef.componentInstance.venda = venda;
  }

  imprimir(id: number){
    this.http.get(`${environment.api_url}venda/report/${id}`)
    .subscribe((response: any) => {
      this.response = response;
    });

    var doc = new jsPDF();
    setTimeout(()=>{
      doc.html(document.getElementById('vendaDiv')!, {
        callback: function (doc) {
            doc.output('dataurlnewwindow');
        },
        width:100,
        windowWidth: 250
    })
    },500);
  }

}
