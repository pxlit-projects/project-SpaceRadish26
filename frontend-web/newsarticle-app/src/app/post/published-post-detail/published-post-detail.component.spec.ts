import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishedPostDetailComponent } from './published-post-detail.component';
import { PostService } from '@services/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth-service.service';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

describe('PublishedPostDetailComponent', () => {
  let component: PublishedPostDetailComponent;
  let fixture: ComponentFixture<PublishedPostDetailComponent>;
  let postServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostById: jasmine.createSpy('getPostById').and.returnValue(of({
        id: '1',
        author: 'authorName',
        title: 'postTitle',
        content: 'postContent',
        creationDate: '2023-10-01'
      })),
      getCommentsByPostId: jasmine.createSpy('getCommentsByPostId').and.returnValue(of([
        { id: '1', content: 'commentContent', author: 'commentAuthor', postId: '1' }
      ])),
      createComment: jasmine.createSpy('createComment').and.returnValue(of({})),
      deleteComment: jasmine.createSpy('deleteComment').and.returnValue(of({})),
      updateComment: jasmine.createSpy('updateComment').and.returnValue(of({}))
    };

    authServiceMock = {
      roleSubject: { value: 'reader' },
      userSubject: { value: 'commentAuthor' }
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
      imports: [FormsModule, ReactiveFormsModule, MatIconModule, PublishedPostDetailComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublishedPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize post and comments on ngOnInit', () => {
    expect(postServiceMock.getPostById).toHaveBeenCalledWith('1');
    expect(postServiceMock.getCommentsByPostId).toHaveBeenCalledWith('1');
    expect(component.comments.length).toBe(1);
    expect(component.comments[0].content).toBe('commentContent');
  });

  it('should render post details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('postTitle');
    expect(compiled.querySelector('p')?.textContent).toContain('authorName');
    expect(compiled.querySelector('p')?.textContent).toContain('By authorName');
  });

  it('should toggle comment form visibility', () => {
    component.toggleCommentForm();
    expect(component.showCommentForm).toBeTrue();
    component.toggleCommentForm();
    expect(component.showCommentForm).toBeFalse();
  });

  it('should submit a new comment', () => {
    component.commentForm.controls['content'].setValue('newComment');
    component.submitComment();
    expect(postServiceMock.createComment).toHaveBeenCalled();
    expect(component.showCommentForm).toBeFalse();
  });

  it('should reload comments', () => {
    component.reloadComments();
    expect(postServiceMock.getCommentsByPostId).toHaveBeenCalledWith('1');
  });

  it('should delete a comment', () => {
    component.deleteComment('1');
    expect(postServiceMock.deleteComment).toHaveBeenCalledWith('1');
  });

  it('should start and cancel editing a comment', () => {
    const comment = { id: '1', content: 'commentContent', author: 'commentAuthor', postId: '1' };
    component.startEditing(comment);
    expect(component.isEditing).toBeTrue();
    expect(component.editingComment).toEqual(comment);
    component.cancelEditing();
    expect(component.isEditing).toBeFalse();
    expect(component.editingComment).toEqual({} as any);
  });

  it('should confirm editing a comment', () => {
    const comment = { id: '1', content: 'updatedContent', author: 'commentAuthor', postId: '1' };
    component.editingComment = comment;
    component.confirmEditing();
    expect(postServiceMock.updateComment).toHaveBeenCalledWith(comment);
    expect(component.isEditing).toBeFalse();
  });

  it('should check comment roles', () => {
    expect(component.checkCommentRoles()).toBeTrue();
  });
});
