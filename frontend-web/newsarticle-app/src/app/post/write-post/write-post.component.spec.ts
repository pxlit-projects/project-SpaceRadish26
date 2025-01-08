import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritePostComponent } from './write-post.component';
import { PostService } from '@services/post-service.service';
import { AuthService } from '@services/auth-service.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {PostCreate} from '@models/post-create.model';

describe('WritePostComponent', () => {
  let component: WritePostComponent;
  let fixture: ComponentFixture<WritePostComponent>;
  let postServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    postServiceMock = {
      addPost: jasmine.createSpy('addPost').and.returnValue(of({}))
    };

    authServiceMock = {
      userSubject: { value: 'Test User' }
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WritePostComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WritePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.postForm).toBeDefined();
    expect(component.postForm.get('title')?.value).toBe('');
    expect(component.postForm.get('content')?.value).toBe('');
    expect(component.postForm.get('concept')?.value).toBe(undefined);
  });

  it('should validate form fields', () => {
    const titleInput = component.postForm.get('title');
    const contentInput = component.postForm.get('content');

    titleInput?.setValue('');
    contentInput?.setValue('');
    expect(titleInput?.valid).toBeFalse();
    expect(contentInput?.valid).toBeFalse();

    titleInput?.setValue('Test Title');
    contentInput?.setValue('Test Content');
    expect(titleInput?.valid).toBeTrue();
    expect(contentInput?.valid).toBeTrue();
  });

  it('should submit form if valid', () => {
    component.postForm.setValue({
      title: 'Test Title',
      content: 'Test Content',
      isConcept: false
    });

    component.submitPost();

    let post: PostCreate = {
      author: 'Test User',
      title: 'Test Title',
      content: 'Test Content',
      concept: false
    }

    expect(postServiceMock.addPost).toHaveBeenCalledWith(jasmine.objectContaining(post));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not submit form if invalid', () => {
    component.postForm.setValue({
      title: '',
      content: '',
      isConcept: false
    });

    component.submitPost();

    expect(postServiceMock.addPost).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });


});
