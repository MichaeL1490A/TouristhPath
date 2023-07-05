import { TablaAuxiliarDetalle } from "src/app/configuracion/models/tabla-auxiliar-detalle";
import { ViajePasajeroDetalle } from "./viaje-pasajero-detalle";

export class ViajePasajero{
	id: number;
	
	viajeId: number;
	fechaCrea: Date;
	estado: TablaAuxiliarDetalle;
	usuarioId: number;
	pasajeroDetalle: ViajePasajeroDetalle[];
}