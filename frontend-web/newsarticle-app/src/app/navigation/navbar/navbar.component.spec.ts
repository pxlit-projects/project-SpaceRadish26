import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '@services/auth-service.service';
import { PostService } from '@services/post-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;
  let postServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      roleSubject: { value: 'admin' }
    };

    postServiceMock = {
      getNotificationsForUser: jasmine.createSpy('getNotificationsForUser').and.returnValue(of([
        { notificationId: '1', content: 'Notification 1', postId: '1' },
        { notificationId: '2', content: 'Notification 2', postId: '2' }
      ])),
      deleteNotification: jasmine.createSpy('deleteNotification')
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule, MatMenuModule, MatIconModule, MatBadgeModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with notifications', () => {
    expect(postServiceMock.getNotificationsForUser).toHaveBeenCalled();
    expect(component.notifications.length).toBe(2);
  });

  it('should delete a notification', () => {
    component.deleteNotification('1');
    expect(postServiceMock.deleteNotification).toHaveBeenCalledWith('1');
  });


});
