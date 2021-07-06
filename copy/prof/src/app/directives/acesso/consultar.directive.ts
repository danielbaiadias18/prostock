import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PermissaoService } from 'src/app/services/permissao/permissao.service';

@Directive({
  selector: '[consultar]',
})
export class ConsultarDirective implements OnInit {
  @Input() consultar: string;

  constructor(
    private el: ElementRef,
    private permissao: PermissaoService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.permissao.get().then((map) => {
      let permissao = map.get(this.consultar);
      //console.log(permissao, "permissao");
      if (!permissao.idConsultar)
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    });
  }
}
