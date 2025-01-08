import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { PostService } from './post-service.service';
import { AuthService } from '@services/auth-service.service';
import { Post } from '@models/post.model';
import { PostCreate } from '@models/post-create.model';
import { NotificationModel } from '@models/notification.model';
import { Comment } from '@models/comment.model';
import { environment } from '../../../environments/environment';
import {UpdatepostModel} from '@models/updatepost.model';
import {provideHttpClient} from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      roleSubject: { value: 'admin' },
      userSubject: { value: 'testUser' }
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PostService, provideHttpClient(),provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get post by id', () => {
    const mockPost: Post = { id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' };

    service.getPostById('1').subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should get post to review by id', () => {
    const mockPost: Post = { id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' };

    service.getPostToReviewById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.reviewApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should get comments by post id', () => {
    const mockComments: Comment[] = [{ id: '1', postId: '1', author: 'Author', content: 'Content' }];

    service.getCommentsByPostId('1').subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${environment.commentApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should get concept posts for user', () => {
    const mockPosts: Post[] = [{ id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: true, approved: false, rejectedReason: '' }];

    service.getConceptPostsForUser().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/concepts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should update post review status', () => {
    const mockPost: Post = { id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' };

    service.updatePostReviewStatus('1', true, '').subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.reviewApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  it('should get posts to review', () => {
    const mockPosts: Post[] = [{ id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' }];

    service.getPostsToReview().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.reviewApiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should get finished posts', () => {
    const mockPosts: Post[] = [{ id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' }];

    service.getFinishedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should add a post', () => {
    const mockPostCreate: PostCreate = { title: 'Title', content: 'Content', author: 'Author', concept: false };

    service.addPost(mockPostCreate);

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockPostCreate);
  });

  it('should get notifications for user', () => {
    const mockNotifications: NotificationModel[] = [{ notificationId: '1', content: 'Content', postId: '1' }];

    service.getNotificationsForUser().subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(environment.notificationUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should delete a notification', () => {
    service.deleteNotification('1');

    const req = httpMock.expectOne(`${environment.notificationUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get approved and rejected messaged posts', () => {
    const mockPosts: Post[] = [{ id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' }];

    service.getApprovedAndRejectMessagedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/approved-rejected`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should update a post', () => {
    const mockPost: Post = { id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' };
    const mockUpdatePost: any = { id: '1', title: 'Updated Title', content: 'Updated Content' };

    service.updatePost(mockUpdatePost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  it('should get approved posts', () => {
    const mockPosts: Post[] = [{ id: '1', author: 'Author', title: 'Title', content: 'Content', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' }];

    service.getApprovedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/approved`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should create a comment', () => {
    const mockComment: Comment = { id: '1', postId: '1', author: 'Author', content: 'Content' };

    service.createComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${environment.commentApiUrl}/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockComment);
  });

  it('should update a comment', () => {
    const mockComment: Comment = { id: '1', postId: '1', author: 'Author', content: 'Updated Content' };

    service.updateComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${environment.commentApiUrl}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockComment);
  });

  it('should delete a comment', () => {
    service.deleteComment('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.commentApiUrl}/delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
