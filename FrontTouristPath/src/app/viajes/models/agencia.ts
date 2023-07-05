import { TablaAuxiliarDetalle } from "src/app/configuracion/models/tabla-auxiliar-detalle";
import { AgenciaArchivo } from "./agencia-archivo";

export class Agencia{
	id: number;

    nombreComercial: string;
	razonSocial: string;
	tipoDocumento: TablaAuxiliarDetalle;
	nroDocumento: string;
	correo: string;
	celular: string;
	descripcion: string;
	archivos: AgenciaArchivo[];

}