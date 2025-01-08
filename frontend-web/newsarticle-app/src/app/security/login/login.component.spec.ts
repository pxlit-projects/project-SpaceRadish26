import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@services/auth-service.service';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    authServiceMock = {
      setUser: jasmine.createSpy('setUser'),
      setRole: jasmine.createSpy('setRole'),
      logout: jasmine.createSpy('logout')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    snackBarMock = {
      open: jasmine.createSpy('open')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Login');
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('select')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should call authService setUser and setRole on form submit', () => {
    component.loginForm.controls['selectedUser'].setValue('Jinx');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(authServiceMock.setUser).toHaveBeenCalledWith('Jinx');
    expect(authServiceMock.setRole).toHaveBeenCalledWith('reader');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not call authService setUser and setRole if no user is selected', () => {
    component.loginForm.controls['selectedUser'].setValue('');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(authServiceMock.setUser).not.toHaveBeenCalled();
    expect(authServiceMock.setRole).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });



});
