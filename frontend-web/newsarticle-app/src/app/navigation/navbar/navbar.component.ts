import {Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth-service.service';
import {NgIf} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf, MatMenuItem, MatButton, MatMenuTrigger, MatMenu],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);



}
