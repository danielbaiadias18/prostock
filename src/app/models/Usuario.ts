import { iPessoa } from "./Pessoa";

export interface iUsuario extends iPessoa{
    login: string;
    senha: string;
}