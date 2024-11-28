import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '@services/post-service.service';
import { Post } from '@models/post.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  posts!: Post[];
  filteredPosts!: Post[];
  postConcepts!: Post[];
  filteredPostConcepts!: Post[];
  postService: PostService = inject(PostService);
  router: Router = inject(Router);

  filterAuthor: string = '';
  filterContent: string = '';
  filterDate: string = '';
  isFilterModalOpen: boolean = false;

  ngOnInit(): void {
    this.postService.getFinishedPosts().subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = posts;
    });
    this.postService.getConceptPostsForUser().subscribe(posts => {
      this.postConcepts = posts;
      this.filteredPostConcepts = posts;
    });
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
      (this.filterDate ? new Date(post.creationDate).toLocaleDateString().includes(this.filterDate) : true)
    );

    this.filteredPostConcepts = this.postConcepts.filter(post =>
      (this.filterAuthor ? post.author.includes(this.filterAuthor) : true) &&
      (this.filterContent ? post.content.includes(this.filterContent) : true) &&
      (this.filterDate ? new Date(post.creationDate).toLocaleDateString().includes(this.filterDate) : true)
    );
  }

  navigateToUpdatePost(postId: number): void {
    this.router.navigate(['/update-post', postId]);
  }
}
