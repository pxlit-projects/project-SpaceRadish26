import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get role', () => {
    service.setRole('admin');
    expect(service.roleSubject.value).toBe('admin');
    expect(localStorage.getItem('userRole')).toBe('admin');
  });

  it('should set and get user', () => {
    service.setUser('testUser');
    expect(service.userSubject.value).toBe('testUser');
    expect(localStorage.getItem('username')).toBe('testUser');
  });

  it('should logout and reset role and user', () => {
    service.setRole('admin');
    service.setUser('testUser');
    service.logout();
    expect(service.roleSubject.value).toBe('guest');
    expect(service.userSubject.value).toBe('guest');
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  it('should initialize with saved role and user from localStorage', () => {
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('username', 'testUser');
    const newService = new AuthService();
    expect(newService.roleSubject.value).toBe('admin');
    expect(newService.userSubject.value).toBe('testUser');
  });
});
