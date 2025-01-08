import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './roleguard-service.service';
import { AuthService } from '@services/auth-service.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let service: RoleGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      roleSubject: { value: 'user' }
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow activation if user has expected role', () => {
    authServiceMock.roleSubject.value = 'user';
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['user'] };
    const state = {} as RouterStateSnapshot;

    expect(service.canActivate(route, state)).toBeTrue();
  });

  it('should allow activation if user is admin', () => {
    authServiceMock.roleSubject.value = 'admin';
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['user'] };
    const state = {} as RouterStateSnapshot;

    expect(service.canActivate(route, state)).toBeTrue();
  });

  it('should deny activation and navigate to login if user does not have expected role', () => {
    authServiceMock.roleSubject.value = 'guest';
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['user'] };
    const state = {} as RouterStateSnapshot;

    expect(service.canActivate(route, state)).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/security/login']);
  });
});
