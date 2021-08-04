import { iPessoa } from "./Pessoa";

export interface iUsuario{
    id: number;
    login: string;
    senha: string;
    pessoa: iPessoa;
}