import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  public userSubject = new BehaviorSubject<string | null>(null);
  user$ = this.userSubject.asObservable();

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  setUser(user: string) {
    this.userSubject.next(user);
  }
}
