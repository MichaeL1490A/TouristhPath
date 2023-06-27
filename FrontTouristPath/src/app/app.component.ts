import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private config: PrimeNGConfig,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.config.setTranslation({
      startsWith: "Comience con",
      contains: "Contenga",
      notContains: "No contenga",
      endsWith: "Termine con",
      equals: "Igual a",
      notEquals: "Diferente a",
      noFilter: "Sin filtro",
      lt: "Menor que",
      lte: "Menor o igual a",
      gt: "Mayor que",
      gte: "Mayor o igual a",
      is: "Es",
      isNot: "No es",
      before: "Antes",
      after: "Después",
      dateIs: "Fecha igual a",
      dateIsNot: "Fecha diferente a",
      dateBefore: "Fecha antes de",
      dateAfter: "Fecha después de",
      clear: "Limpiar",
      apply: "Aplicar",
      matchAll: "Coincidir todo",
      matchAny: "Coincidir con cualquiera",
      addRule: "Agregar regla",
      removeRule: "Eliminar regla",
      accept: "Sí",
      reject: "No",
      choose: "Escoger",
      upload: "Subir",
      cancel: "Cancelar",
      dayNames: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
      ],
      dayNamesShort: [
          "Dom",
          "Lun",
          "Mar",
          "Mié",
          "Jue",
          "Vie",
          "Sáb"
      ],
      dayNamesMin: [
          "D",
          "L",
          "M",
          "X",
          "J",
          "V",
          "S"
      ],
      monthNames: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
      ],
      monthNamesShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
      ],
      today: "Hoy",
      weekHeader: "Sem",
      firstDayOfWeek: 1,
      dateFormat: "dd M yy",
      weak: "Débil",
      medium: "Medio",
      strong: "Fuerte",
      passwordPrompt: "Escriba una contraseña",
      emptyFilterMessage: "Sin opciones disponibles",
      emptyMessage: "No se han encontrado resultados"
    });
  }
}