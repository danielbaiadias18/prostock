import { iProduto } from "./Produto";
import { iVenda } from "./Venda";

export interface iProdutoVenda{
    id: number;
    produtoId: number;
    produto: iProduto;
    vendaId: number;
    venda: iVenda;
    quantidade: number;
}