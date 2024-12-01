import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth-service.service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule
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
  snackBar: MatSnackBar = inject(MatSnackBar);
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
    this.authService.logout();
    this.snackBar.open('Logout successful', 'Close', {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }
}
