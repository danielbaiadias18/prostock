import { iCliente } from "./Cliente";
import { iProdutoVenda } from "./ProdutoVenda";
import { iUsuario } from "./Usuario";

export interface iVenda {
    id: number;
    valorTotal: number;
    desconto: number;
    acrescimo: number;
    frete: number;
    data: Date;
    status: string;
    // descricao: string;
    clienteId: number;
    cliente: iCliente;
    usuarioId: number;
    usuario: iUsuario;
    produtos: iProdutoVenda[];
}


export interface iVendaPost {
    id: number;
    valorTotal: number;
    desconto: number;
    acrescimo: number;
    frete: number;
    data: Date;
    status: string;
    // descricao: string;
    clienteId: number;
    usuarioId: number;
    produtos: iProdutoVenda[];
}