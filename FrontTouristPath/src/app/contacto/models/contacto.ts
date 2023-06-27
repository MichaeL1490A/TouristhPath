import { Cliente } from "src/app/cliente/models/cliente";
import { TablaAuxiliarDetalle } from "src/app/configuracion/models/tabla-auxiliar-detalle";
import { ContactoObservacion } from "./contacto-observacion";

export class Contacto{
    id: number;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombres: string;
    titulo: TablaAuxiliarDetalle;
    area: TablaAuxiliarDetalle;
    cargo: TablaAuxiliarDetalle;
    celular1: string;
    celular2: string;
    correo1: string;
    correo2: string;
    telefonoFijo1: string;
    telefonoFijo2: string;
    estado: TablaAuxiliarDetalle;
    red: TablaAuxiliarDetalle;
    institucionAdministrativa: TablaAuxiliarDetalle;
    cliente: Cliente;
    sede: Cliente;
    fechaCrea: Date;
    fechaModifica: Date;
    observaciones: ContactoObservacion[];
    idUsuarioModifica: number;
    idUsuarioCrea: number;
    numeroObservaciones: number;
    fechaUltimaActualizacion: Date;
    responsableUltimaActualizacion: string;
}

