import { Component, OnInit, Renderer2 } from '@angular/core';
import { Anexo, TenMB } from 'src/app/models/Anexo';
import { iMensagem } from 'src/app/models/Mensagem';
import { iTicket } from 'src/app/models/Ticket';
import { ApiService, HttpMethod } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private renderer: Renderer2,
    private config: ConfigService,
    private api: ApiService) { }

  anexos: File[] = [];
  anexosArray = new Array<string>();
  newMessage: string;
  texto: string;

  ticket: iTicket;
  tickets: iTicket[] = [];
  ticketsEmAberto: boolean = true;
  mensagens: iMensagem[] = [];
  urlSistema: string;

  ngOnInit(): void {
    this.config.Ready((conf) => { this.urlSistema = conf.url_imagens });
    this.renderer.addClass(document.body, 'sidebar-collapse');
    this.listarTicketsEmAberto();
  }

  listarTicketsConcluidos() {
    this.ticketsEmAberto = false;

    this.api.api(HttpMethod.GET, 'ticket/profConcluidos')
      .then((res) => {
        this.tickets = res;
      });
  }

  listarTicketsEmAberto() {
    this.ticketsEmAberto = true;

    this.api.api(HttpMethod.GET, 'ticket/profAbertos')
      .then((res) => {
        this.tickets = res;
      });
  }

  selectFiles(event) {
    this.anexosArray = [];
    let allImported = true;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile: File = event.target.files[i];
      if (selectedFile.size <= TenMB) {
        this.anexos.push(selectedFile);
        this.anexosArray.push(selectedFile.name);
      }
      else
        allImported = false;
    }
    if (allImported == false) {
      const toast = Swal.mixin({
        toast: true,
        text: "Alguns arquivos não foram anexados pois excediam o tamanho de 10MB.",
        timer: 5000,
        showConfirmButton: false,
        icon: 'error',
        position: 'bottom'
      });
      toast.fire();
    }
  }

  finalizarTicket() {
    const mixin = Swal.mixin({
      icon: 'question',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim',
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    mixin.fire('Finalizar', 'Deseja finalizar o ticket?').then((res) => {
      if (res.isConfirmed) {
        this.api.api(HttpMethod.GET, 'ticket/finalizarProf/' + this.ticket.cdTicket)
          .then(() => {
            this.mensagens = [];
            this.listarTicketsConcluidos();

            this.chargeMessages(this.ticket.cdTicket);

            Swal.fire({
              icon: 'success',
              title: 'Ticket Finalizado',
              text: 'O ticket #' + this.ticket.cdTicket + ' foi finalizado com sucesso!'
            });

          });
      }
    });

  }


  carregarMensagens(index: number) {
    this.ticket = this.tickets[index];

    this.chargeMessages(this.ticket.cdTicket);
  }


  chargeMessages(cdTicket: number) {
    this.api.api(HttpMethod.GET, 'ticket/profMensagens/' + cdTicket)
      .then((res) => {
        this.mensagens = res;
      //  console.log(this.mensagens, "this.mensagens");
        setTimeout(() => {
          this.scrollDown();
        }, 300);
      });
  }

  onKeydown(event) {
    event.preventDefault();
  }

  refreshMensagens() {
    if (this.ticket != null) {
      this.api.api(HttpMethod.GET, 'ticket/profMensagens/' + this.ticket.cdTicket)
        .then((res) => {
          this.mensagens = res;
          setTimeout(() => {
            this.scrollDown();
          }, 300);
        });
    }
    if (this.ticketsEmAberto == true) {
      this.listarTicketsEmAberto();
    } else if (this.ticketsEmAberto == false) {
      this.listarTicketsConcluidos();
    }
  }

  removeSelectedFile(index) {
    this.anexosArray.splice(index, 1);
    this.anexos.splice(index, 1);
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async converterArquivosParaBase64() {
    let array: Anexo[] = [];
    for (let i = 0; i < this.anexos.length; i++) {
      let arquivo = this.anexos[i];
      let b64: string = await this.toBase64(arquivo) as string;
      let objAnexo: Anexo = {
        nome: arquivo.name,
        base64: b64.substring(b64.lastIndexOf(',') + 1)
      }
      array.push(objAnexo);
    }
    return array
  }

  async sendMessage() {
    if (this.texto || this.anexos.length > 0) {
      let anexosData = await this.converterArquivosParaBase64();
      let body = {
        cdTicket: this.ticket.cdTicket,
        texto: this.anexos.length > 0 && !this.texto ? '' : this.texto,
        anexos: anexosData
      }

      await this.api.api(HttpMethod.POST, 'ticket/profEnviarMensagem', body).then(async () => {
        this.refreshMensagens();
        this.scrollDown();
        this.texto = '';
        this.anexosArray = [];
        this.anexos = [];
      });
    } else {
      this.refreshMensagens();
    }
  }

  scrollDown() {
    var elm = document.querySelector(".myScrollContainer");
    elm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
