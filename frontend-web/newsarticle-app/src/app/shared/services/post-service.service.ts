import {inject, Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '@models/post.model';
import {PostCreate} from '@models/post-create.model';
import {AuthService} from '@services/auth-service.service';
import {environment} from '../../../environments/environment';
import {UpdatepostModel} from '@models/updatepost.model';
import {List} from 'postcss/lib/list';
import {NotificationModel} from '@models/notification.model';
import {Comment} from '@models/comment.model';

@Injectable({
  providedIn: 'root'
})


export class PostService {
  private apiUrl = environment.apiUrl;
  private reviewApiUrl = environment.reviewApiUrl;
  private notificationUrl = environment.notificationUrl;
  private commentApiUrl = environment.commentApiUrl;
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  getPostById(id: string): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post>(`${this.apiUrl}/${id}`, { headers });
  }

  getPostToReviewById(id: number): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post>(`${this.reviewApiUrl}/${id}`, { headers });
  }


  getCommentsByPostId(id: string): Observable<Comment[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value; // Assuming you have a usernameSubject in AuthService
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.get<Comment[]>(`${this.commentApiUrl}/${id}`, { headers });
  }

  getConceptPostsForUser(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value; // Assuming you have a usernameSubject in AuthService
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.get<Post[]>(`${this.apiUrl}/concepts`, { headers });
  }

  updatePostReviewStatus(postId: string, approved: boolean, rejectedReason: string): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');
    const body = { approved: approved, rejectedReason: rejectedReason };

    return this.http.put<Post>(`${this.reviewApiUrl}/${postId}`, body, { headers });
  }
  getPostsToReview(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post[]>(`${this.reviewApiUrl}`, { headers });
  }

  getFinishedPosts(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    console.log(role);
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.get<Post[]>(this.apiUrl, { headers });
  }

  addPost(post: PostCreate) {
    const role = this.authService.roleSubject.value ;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    this.http.post(this.apiUrl, post, { headers }).subscribe(response => {
      console.log('Post created', response);
    });
  }

  getNotificationsForUser(): Observable<NotificationModel[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.get<NotificationModel[]>(`${this.notificationUrl}`, { headers });
  }

  deleteNotification(id: string)  {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    this.http.delete(`${this.notificationUrl}/${id}`, { headers }).subscribe(response => {
      console.log('Notification deleted', response);
    });
  }

  getApprovedAndRejectMessagedPosts(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');
    console.log('getting approved and rejected posts');
    return this.http.get<Post[]>(`${this.apiUrl}/approved-rejected`, { headers });
  }

  updatePost(post: UpdatepostModel | null): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.put<Post>(`${this.apiUrl}/update`, post, { headers });
  }

  getApprovedPosts(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post[]>(`${this.apiUrl}/approved`, { headers });
  }

  createComment(newComment: Comment) {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.post<Comment>(`${this.commentApiUrl}/create`, newComment, { headers });
  }


  updateComment(comment: Comment): Observable<Comment> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.put<Comment>(`${this.commentApiUrl}/update/${comment.id}`, comment, { headers });
  }
  deleteComment(id: string) {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value;
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.delete<Comment>(`${this.commentApiUrl}/delete/${id}`, {headers});
  }
}
