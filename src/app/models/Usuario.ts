import { iPessoa } from "./Pessoa";

export interface iUsuario {
    id: number;
    login: string;
    lojaId: string
    senha: string;
    pessoaId: number;
    pessoa: iPessoa;
}