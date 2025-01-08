import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePostComponent } from './update-post.component';
import { PostService } from '@services/post-service.service';
import { AuthService } from '@services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;
  let postServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostById: jasmine.createSpy('getPostById').and.returnValue(of({
        id: '1',
        author: 'Test Author',
        title: 'Test Title',
        content: 'Test Content',
        creationDate: new Date(),
        concept: true,
        approved: false,
        rejectedReason: ''
      })),
      updatePost: jasmine.createSpy('updatePost').and.returnValue(of({}))
    };

    authServiceMock = {
      roleSubject: { value: 'admin' }
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, UpdatePostComponent],

      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', () => {
    expect(postServiceMock.getPostById).toHaveBeenCalledWith('1');
    expect(component.post).toEqual({
      id: '1',
      author: 'Test Author',
      title: 'Test Title',
      content: 'Test Content',
      creationDate: jasmine.any(Date),
      concept: true,
      approved: false,
      rejectedReason: ''
    });
    expect(component.updatePost).toEqual({
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      concept: true
    });
  });

  it('should check role on init', () => {
    expect(component.canEdit).toBeTrue();
  });

  it('should update post on form submit', () => {
    component.updatePost = { id: '1', title: 'Updated Title', content: 'Updated Content', concept: false };
    component.onSubmit({ valid: true } as any);
    expect(postServiceMock.updatePost).toHaveBeenCalledWith(component.updatePost);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not update post if form is invalid', () => {
    component.onSubmit({ valid: false } as any);
    expect(postServiceMock.updatePost).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should disable submit button if user cannot edit', () => {
    authServiceMock.roleSubject.value = 'reader';
    component.checkRole();
    expect(component.canEdit).toBeFalse();
  });
});
