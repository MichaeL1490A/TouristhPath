import { Component, ElementRef, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})

export class PantallaPrincipalComponent implements OnInit{
  
  @ViewChild('btnIngresar', { static: false }) btnIngresar!: ElementRef;
  
  transcript: string = '';
  recognition: any;
  private router: Router;
  isCommandExecuted: boolean = false;
  isListening: boolean = false;


  constructor(
    private ngZone: NgZone, 
    private injector: Injector,
    private messageService: MessageService) {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.router = this.injector.get(Router);
  }

  ngOnInit(): void {
  }

  toggleListening() {
    this.isListening = !this.isListening;
    if (this.isListening) {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  startListening() {
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      this.ngZone.run(() => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      this.transcript = transcript;
      this.handleVoiceRecognition(transcript);
    });
  };

  this.recognition.onend = () => {
    if (this.isCommandExecuted) {
      this.router.navigateByUrl('');
      this.isCommandExecuted = false;
    }
    // No reiniciar el reconocimiento de voz aquí
  };
}

stopListening() {
  this.recognition.stop();
}
  
  
  handleIngresarClick() {
    console.log('Botón "Ingresar" clickeado');
  }
  handleVoiceRecognition(transcript: string): boolean {
    if (transcript === 'viaje listado') {
      this.handleVoiceCommand('viaje listado');
    } else if (transcript === 'pantalla principal') {
      this.handleVoiceCommand('pantalla principal');
    } else if (transcript === 'ingresar') {
      this.handleVoiceCommand('ingresar');
    }else {
      console.log('Comando no reconocido');
      return false;
    }
    return true;
  }

  handleVoiceCommand(command: string): boolean {
    if (command === 'viaje listado') {
      this.router.navigate(['/viaje/listado']);
      this.isCommandExecuted = true;
      setTimeout(() => {
        this.transcript = '';
      }, 2000);
    } else if (command === 'pantalla principal') {
      this.router.navigate(['/pantalla/principal']);
      this.isCommandExecuted = true;
      setTimeout(() => {
        this.transcript = '';
      }, 2000);
    } else if (command === 'ingresar') {
      this.btnIngresar.nativeElement.click();
      this.isCommandExecuted = true;
      setTimeout(() => {
        this.transcript = '';
      }, 2000);
    } else {
      console.log('Comando no reconocido');
      return false;
    }

    return true;
  }

  //////////////////////////
  searchQuery: string;
///////////////////////////////////////////////////busqueda
  search() {
    // Lógica de búsqueda aquí
    console.log('Realizando búsqueda:', this.searchQuery);
  }
  ///////////////////////////////////////////////////estrellas

  rating: number = 0; // Valor ingresado desde la página web
  stars: number[] = [1, 2, 3, 4, 5];

  updateStars(value: string) {
    const parsedRating = parseInt(value, 10);
    this.rating = isNaN(parsedRating) ? 0 : Math.max(1, Math.min(parsedRating, 5));
  }

  ///////////////////////////////////////////////////favorito
  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  ////////////////////////////////////puntaje gamifiacion
  puntos: number = 0;
  premioEspecialDesbloqueado: boolean = false;

  reservarViaje() {
    // Lógica para reservar un viaje
    this.puntos += 50; // Añadir puntos por reservar
    this.comprobarDesafio();
  }

  compartirEnRedes() {
    // Lógica para compartir en redes sociales
    this.puntos += 10; // Añadir puntos por compartir
    this.comprobarDesafio();
  }

  dejarResenia() {
    // Lógica para dejar una reseña
    this.puntos += 20; // Añadir puntos por dejar una reseña
    this.comprobarDesafio();
  }


  comprobarDesafio() {
    if (this.puntos >= 100) {
      this.premioEspecialDesbloqueado = true;
      this.messageService.add({severity:'success', summary: 'Felicidades', detail:'¡Has desbloqueado un premio especial!.Disfruta de un descuento del 10% en tu próximo viaje.'})
    }
  }


  
}
