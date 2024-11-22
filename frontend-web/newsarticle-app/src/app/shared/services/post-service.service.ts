import {inject, Injectable, NgModule} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '@models/post.model';
import {PostCreate} from '@models/post-create.model';

@Injectable({
  providedIn: 'root'
})


export class PostService {
  private apiUrl = 'http://localhost:8093/post/api/posts';

  http: HttpClient = inject(HttpClient);

  getFinishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  addPost(post: PostCreate) {
    this.http.post(this.apiUrl, post)
  }
}
