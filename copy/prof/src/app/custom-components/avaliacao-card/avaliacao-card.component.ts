import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VisualizarAvaliacaoComponent } from 'src/app/modal/visualizar-avaliacao/visualizar-avaliacao.component';
import { iAvaliacao } from 'src/app/models/Avaliacao';

@Component({
  selector: 'app-avaliacao-card',
  templateUrl: './avaliacao-card.component.html',
  styleUrls: ['./avaliacao-card.component.scss'],
})
export class AvaliacaoCardComponent implements OnInit {
  constructor(private modalService: BsModalService) {}

  modal: BsModalRef;
  @Input() a: iAvaliacao;

  ngOnInit(): void {}

  visualizarAvaliacao() {
    this.modal = this.modalService.show(VisualizarAvaliacaoComponent, {
      animated: true,
      class: 'modal-xl',
    });
    (this.modal.content.addAvaliacao as EventEmitter<number>).emit(
      this.a.cdAvaliacao
    );
    this.modal.content.validarAvaliacaoEmitter = new EventEmitter<boolean>();
  }
}
