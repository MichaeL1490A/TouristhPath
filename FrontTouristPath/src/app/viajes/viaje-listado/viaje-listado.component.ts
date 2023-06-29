import { Component } from '@angular/core';

@Component({
  selector: 'app-viaje-listado',
  templateUrl: './viaje-listado.component.html',
  styleUrls: ['./viaje-listado.component.css']
})
export class ViajeListadoComponent {
  listaFavoritos: any[] = [{ id: 1, nombre: 'Mis viajes', cantidad: '16' },
  { id: 2, nombre: 'Guardados', cantidad: '5' },
  { id: 3, nombre: 'Favoritos', cantidad: '7' }]

  listaPuntuacion: any[] = [{ id: 1, nombre: '5 Estrellas', cantidad: '123' },
  { id: 2, nombre: '4 Estrellas', cantidad: '147' },
  { id: 3, nombre: '3 Estrellas', cantidad: '487' },
  { id: 4, nombre: 'Menos a 3 Estrellas', cantidad: '12' }]

  listaQueTengan: any[] = [{ id: 1, nombre: 'Asientos reclinables', cantidad: '531' },
  { id: 2, nombre: 'Pantallas Individuales', cantidad: '430' },
  { id: 3, nombre: 'GPS', cantidad: '312' },
  { id: 4, nombre: 'WIFI', cantidad: '387' },
  { id: 5, nombre: 'Servicios Higiénicos', cantidad: '780' },
  { id: 6, nombre: 'Aire Acondicionado', cantidad: '620' },
  { id: 7, nombre: 'Toma corriente', cantidad: '789' }]

  listaTuPresupuesto: any[] = [{ id: 1, nombre: 'S/. 0 - S/. 200', cantidad: '556' },
  { id: 2, nombre: 'S/. 200 - S/. 400', cantidad: '342' },
  { id: 3, nombre: 'S/. 400 - S/. 600', cantidad: '66' },
  { id: 4, nombre: '+ S/. 600', cantidad: '66' }]

}
