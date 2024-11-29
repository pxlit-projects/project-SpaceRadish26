// src/app/post/posts-list/posts-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterModalComponent } from '../../usability/filter-modal/filter-modal.component';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayModule
  ],
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  posts!: Post[];
  filteredPosts!: Post[];
  postConcepts!: Post[];
  filteredPostConcepts!: Post[];
  approRejePosts!: Post[];
  filteredApproRejePosts!: Post[];
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this.postService.getFinishedPosts().subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = posts;
    });
    this.postService.getConceptPostsForUser().subscribe(posts => {
      this.postConcepts = posts;
      this.filteredPostConcepts = posts;
    });
    this.postService.getApprovedAndRejectMessagedPosts().subscribe(posts => {
      this.approRejePosts = posts;
      this.filteredApproRejePosts = posts;
    });
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(FilterModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilter(result.filterAuthor, result.filterContent, result.filterDate);
      }
    });
  }

  applyFilter(filterAuthor: string, filterContent: string, filterDate: string): void {
    this.filteredPosts = this.posts.filter(post =>
      (filterAuthor ? post.author.includes(filterAuthor) : true) &&
      (filterContent ? post.content.includes(filterContent) : true) &&
      (filterDate ? (post.creationDate && post.creationDate.slice(0, 10) === filterDate) : true)
    );

    this.filteredPostConcepts = this.postConcepts.filter(post =>
      (filterAuthor ? post.author.includes(filterAuthor) : true) &&
      (filterContent ? post.content.includes(filterContent) : true) &&
      (filterDate ? (post.creationDate && post.creationDate.slice(0, 10) === filterDate) : true)
    );

    this.filteredApproRejePosts = this.approRejePosts.filter(post =>
      (filterAuthor ? post.author.includes(filterAuthor) : true) &&
      (filterContent ? post.content.includes(filterContent) : true) &&
      (filterDate ? (post.creationDate && post.creationDate.slice(0, 10) === filterDate) : true)
    );
  }

  navigateToUpdatePost(postId: string): void {
    this.router.navigate(['/update-post', postId]);
  }

  // src/app/post/posts-list/posts-list.component.ts
  navigateToImprovePost(postId: string): void {
    this.router.navigate(['/posts/improve', postId]);
  }


}
