import { Role } from "./role";

export class Usuario {
    id: number;
    username: string;
    email: string;
    password: string;
    enabled: boolean;
    roles: Role[];
    rolesString: string;
    rolesAuthorities: string[];
    estado: any;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    personalId: number;
    personal: any
}
