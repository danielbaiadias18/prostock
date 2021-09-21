import { iProduto } from "./Produto";

export interface iEstoque{
    id: number;
    qtdAtual: number;
    qtdMinima: number;
    dataAlteracao: Date;
    produtoId: number;
    produto: iProduto;
}