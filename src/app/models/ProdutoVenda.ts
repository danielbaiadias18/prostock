import { iProduto } from "./Produto";
import { iVenda } from "./Venda";

export interface iProdutoVenda{
    id: number;
    produtoId: number;
    produto: iProduto;
    vendaId: number;
    quantidade: number;
}

export interface iProdutoVendaGet{
    id: number;
    descricao: string;
    quantidade: number;
    marca: string;
    nome: string;
    usuarioId: number;
    valorUnit: number;
    vendas: null
}