import { Usuario } from "../../security/models/usuario";
import { TablaAuxiliarDetalle } from "../../configuracion/models/tabla-auxiliar-detalle";
import { PersonalPermiso } from "./personal-permiso";

export class Personal {
    id: number;
    tipoDocumento: TablaAuxiliarDetalle;
    nroDocumento: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombres: string;
    nombreCorto: string;
    titulo: TablaAuxiliarDetalle;
    area: TablaAuxiliarDetalle;
    cargo: TablaAuxiliarDetalle;
    tipo: TablaAuxiliarDetalle;
    celular1: string;
    celular2: string;
    correo1: string;
    correo2: string;
    anexo: string;
    foto: string = null;
    fotoAux: string = null;
    fotoFile: File = null;
    fotoUrl: string;
    firma: string;
    firmaAux: string;
    firmaFile: File = null;
    firmaUrl: string;
    observacion: string;
    tipoFirma: boolean;
    permisos: PersonalPermiso[] = [];
    permisosAux: PersonalPermiso[] = [];
    estado: TablaAuxiliarDetalle;
    usuario: Usuario;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaModifica: Date;
}