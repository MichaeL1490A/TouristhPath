import { Component, OnInit, OnDestroy } from '@angular/core';
import { DemoService } from './demo.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit, OnDestroy {

  value: string = '';
  textA: string = '';

  cities: any[];
  selectedCity: any;

  selectedCities: any[];

  countries: any[];
  selectedCountry: any;
  filteredCountries: any[];

  date: Date = new Date();

  products: any[];
  productsSelected: any[] = [];

  ref: DynamicDialogRef;

  constructor(
    private demoService: DemoService,
    private messageService: MessageService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.demoService.getCountries().then((countries) => {
      this.countries = countries;
    });

    this.demoService.getProducts().then((products) => {
      this.products = products;
    })
  }

  filterCountry(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.countries.length; i++) {
        let country = this.countries[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredCountries = filtered;
  }

  abrirToast() {
    this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Mensaje de prueba' });
  }

  abrirModal() {
    this.ref = this.dialogService.open(ModalDemoComponent, {
      draggable: true,
      data: {
        valor: 'valor'
      },
      header: 'Titulo del Modal',
      width: '40%'
    });

    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Mensaje de prueba modal' });
      }
    });
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }
}