import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth-service.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
