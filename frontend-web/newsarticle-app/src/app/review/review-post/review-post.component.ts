import { Component, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-post',
  templateUrl: './review-post.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  styleUrls: ['./review-post.component.css']
})
export class ReviewPostComponent implements OnInit {
  post: Post | null = null;
  approved: boolean | null = null;
  rejectedReason: string = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.postService.getPostToReviewById(postId).subscribe(post => {
      this.post = post;
    });
  }

  onSubmit(): void {
    if (this.post && this.approved !== null) {
      this.postService.updatePostReviewStatus(this.post.id, this.approved, this.rejectedReason).subscribe(() => {
        this.router.navigate(['/posts/review']);
      });
    }
  }
}
