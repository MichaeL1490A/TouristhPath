import { TablaAuxiliarDetalle } from "src/app/configuracion/models/tabla-auxiliar-detalle";
import { Distrito } from "src/app/ubigeo/models/distrito";
import { ViajePasajero } from "./viaje-pasajero";

export class Viaje{
	id: number;
	descripcion: string;
	estado: TablaAuxiliarDetalle;
	totalPasajeros: number;
	idUsuarioCrea: number;
	idUsuarioModifica: number;
	oferta: TablaAuxiliarDetalle;
	serviciosVip: string;
	origenTerminalSalida: string;
	origenDistrito: Distrito;
	origenDireccion: string;
	destinoTerminalLlegada: string;
	destinoDistrito: Distrito;
	destinoDireccion: string;
	calificacionSuma: number;
	calificacionCantidad: number;
	diaSalida: Date;
	pasajeros: number;
	precioRegular: number;
	precioVip: number;
	reembolsable: boolean;
	horasViaje: number;
	fechaCrea: Date;
	fechaModifica: Date;
	pasajero: ViajePasajero[];
}