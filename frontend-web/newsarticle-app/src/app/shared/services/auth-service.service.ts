import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public roleSubject = new BehaviorSubject<string>('guest');
  role$ = this.roleSubject.asObservable();

  public userSubject = new BehaviorSubject<string>('guest');
  user$ = this.userSubject.asObservable();

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  setUser(user: string) {
    this.userSubject.next(user);
  }
}
