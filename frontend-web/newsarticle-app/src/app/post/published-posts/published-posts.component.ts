import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { Router } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-published-posts',
  templateUrl: './published-posts.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./published-posts.component.css']
})
export class PublishedPostsComponent implements OnInit {
  posts!: Post[];
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  filterAuthor: string = '';
  filterContent: string = '';
  filterDate: string = '';
  isFilterModalOpen: boolean = false;
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
    this.isFilterModalOpen = true;
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

  applyFilter(): void {
    this.filterPosts();
    this.closeFilterModal();
  }

  filterPosts(): void {
    this.filteredPosts = this.posts.filter(post =>
      (this.filterAuthor ? post.author.includes(this.filterAuthor) : true) &&
      (this.filterContent ? post.content.includes(this.filterContent) : true) &&
      (this.filterDate ? (post.creationDate && post.creationDate.slice(0, 10) === this.filterDate) : true)
    );
  }
}
