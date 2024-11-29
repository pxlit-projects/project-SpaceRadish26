import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth-service.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  users = [
    { name: 'Jinx', role: 'reader' },
    { name: 'Hagrid', role: 'admin' },
    { name: 'Mikumo', role: 'writer' }
  ];
  router: Router = inject(Router);
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      selectedUser: ['']
    });
  }

  onSubmit() {
    const selectedUser = this.loginForm.value.selectedUser;
    if (selectedUser) {
      this.authService.setUser(selectedUser);
      const user = this.users.find(user => user.name === selectedUser);
      this.authService.setRole(user ? user.role : '');
      this.router.navigate(['/dashboard']);
    }
  }
  logout() {
    this.authService.setUser('');
    this.authService.setRole('');
  }
}
