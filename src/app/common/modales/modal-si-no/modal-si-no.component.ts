import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-si-no',
  templateUrl: './modal-si-no.component.html',
  styleUrls: ['./modal-si-no.component.css']
})
export class ModalSiNoComponent implements OnInit{

  texto: string

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ){}
  
  ngOnInit(): void {
    this.texto = this.config.data.texto??''
  }

  salir(response: number){
    this.ref.close({response: response})
  }
}
