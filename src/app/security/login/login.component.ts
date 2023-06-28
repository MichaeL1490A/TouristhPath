import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  modo: number = 1;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  if(this.authService.isAuthenticated){
    this.router.navigate(['/']);
  }
  }
}
