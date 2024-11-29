import { Component, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { Router } from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  postsToReview: Post[] = [];

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.postService.getPostsToReview().subscribe(posts => {
      this.postsToReview = posts;
    });
  }

  reviewPost(postId: string): void {
    this.router.navigate([`/posts/review/${postId}`]);
  }
}
