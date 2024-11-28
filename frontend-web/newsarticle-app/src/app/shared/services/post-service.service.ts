import {inject, Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '@models/post.model';
import {PostCreate} from '@models/post-create.model';
import {AuthService} from '@services/auth-service.service';
import {environment} from '../../../environments/environment';
import {UpdatepostModel} from '@models/updatepost.model';

@Injectable({
  providedIn: 'root'
})


export class PostService {
  private apiUrl = environment.apiUrl;

  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  getPostById(id: number): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post>(`${this.apiUrl}/${id}`, { headers });
  }

  getConceptPostsForUser(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const username = this.authService.userSubject.value; // Assuming you have a usernameSubject in AuthService
    const headers = new HttpHeaders()
      .set('Role', role ? role : '')
      .set('Username', username ? username : '');

    return this.http.get<Post[]>(`${this.apiUrl}/concepts`, { headers });
  }


  getFinishedPosts(): Observable<Post[]> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.get<Post[]>(this.apiUrl, { headers });
  }

  addPost(post: PostCreate) {
    const role = this.authService.roleSubject.value ;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    this.http.post(this.apiUrl, post, { headers }).subscribe(response => {
      console.log('Post created', response);
    });
  }


  updatePost(post: UpdatepostModel | null): Observable<Post> {
    const role = this.authService.roleSubject.value;
    const headers = new HttpHeaders().set('Role', role ? role : '');

    return this.http.put<Post>(`${this.apiUrl}/update`, post, { headers });
  }
}
