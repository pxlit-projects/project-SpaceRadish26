import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ROLE_KEY = 'userRole';
  private readonly USER_KEY = 'username';

  public roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('guest');
  public userSubject: BehaviorSubject<string> = new BehaviorSubject<string>('guest');

  role$ = this.roleSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor() {
    const savedRole = localStorage.getItem(this.ROLE_KEY) || 'guest';
    const savedUser = localStorage.getItem(this.USER_KEY) || 'guest';

    this.roleSubject = new BehaviorSubject<string>(savedRole);
    this.userSubject = new BehaviorSubject<string>(savedUser);
  }

  setRole(role: string) {
    localStorage.setItem(this.ROLE_KEY, role);
    this.roleSubject.next(role);
  }

  setUser(user: string) {
    localStorage.setItem(this.USER_KEY, user);
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.roleSubject.next('guest');
    this.userSubject.next('guest');
  }
}
