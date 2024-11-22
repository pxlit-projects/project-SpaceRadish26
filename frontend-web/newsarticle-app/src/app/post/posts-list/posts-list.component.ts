import {Component, inject, OnInit} from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import {Observable} from 'rxjs';
import {AsyncPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  posts!: Observable<Post[]>;

  postService: PostService = inject(PostService);


  ngOnInit(): void {
    this.posts = this.postService.getFinishedPosts();
  }
}
