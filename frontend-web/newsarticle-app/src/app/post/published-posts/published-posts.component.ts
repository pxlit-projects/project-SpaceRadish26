import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '@components/usability/filter-modal/filter-modal.component';
import {of} from 'rxjs';

@Component({
  selector: 'app-published-posts',
  templateUrl: './published-posts.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  styleUrls: ['./published-posts.component.css']
})
export class PublishedPostsComponent implements OnInit {
  posts!: Post[];
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);
  filteredPosts: Post[] = [];

  ngOnInit(): void {
    this.postService.getApprovedPosts().subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = posts;
    });
  }

  navigateToUpdatePost(postId: number): void {
    this.router.navigate(['/update-post', postId]);
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(FilterModalComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.applyFilter(result);
      }
    });
  }

  applyFilter(filterData: any): void {
    this.filteredPosts = this.posts.filter(post => {
      return (!filterData.filterAuthor || post.author.includes(filterData.filterAuthor)) &&
        (!filterData.filterContent || post.content.includes(filterData.filterContent)) &&
        (!filterData.filterDate || new Date(post.creationDate).toDateString() === new Date(filterData.filterDate).toDateString());
    });
  }

  protected readonly of = of;

  viewDetailsOf(id: string) {
    this.router.navigate([`/published-posts/${id}`]);
  }
}
