// src/app/review/improve-post/improve-post.component.ts
import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-improve-post',
  templateUrl: './improve-post.component.html',
  styleUrls: ['./improve-post.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class ImprovePostComponent implements OnInit {
  post!: Post;
  router: Router = inject(Router);
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,

  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(postId).subscribe(post => {
        this.post = post;
      });
    }
  }

  onSubmit(): void {
    if (this.post) {
      this.postService.updatePost(this.post).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
