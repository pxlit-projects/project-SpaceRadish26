import {Component, inject, OnInit} from '@angular/core';
import {PostService} from '@services/post-service.service';
import {Post} from '@models/post.model';
import {Comment} from '@models/comment.model';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '@services/auth-service.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-published-post-detail',
  templateUrl: './published-post-detail.component.html',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    MatIcon,
    FormsModule,
    DatePipe
  ],
  styleUrls: ['./published-post-detail.component.css']
})
export class PublishedPostDetailComponent implements OnInit {
  postService: PostService = inject(PostService);
  post!: Post;
  comments: Comment[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  commentForm!: FormGroup;
  showCommentForm = false;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  editingComment!: Comment;
  isEditing = false;
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    this.postService.getPostById(postId).subscribe(post => {
      this.post = post;
    });
    this.postService.getCommentsByPostId(postId).subscribe(comments => {
      this.comments = comments;
    });
    this.commentForm = this.fb.group({
      content: ['']
    });
  }


  checkCommentRoles(): boolean {
    let authorized: string[];
    authorized = [ 'reader', 'writer', 'admin'];
    return authorized.includes(this.authService.roleSubject.value);
  }
  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;

  }

  submitComment(): void {
    const newComment: Comment = {
      id: '',
      content: this.commentForm.value.content,
      author: this.authService.userSubject.value,
      postId: this.post.id
    };
    this.postService.createComment(newComment).subscribe(() => {
      this.commentForm.reset();
      this.showCommentForm = false;
    });
    this.reloadComments();
  }
  reloadComments(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    this.postService.getCommentsByPostId(postId).subscribe(comments => {
      this.comments = comments;
    });
  }
  updateComment(comment: Comment) {

  }

  deleteComment(id: string) {
    this.postService.deleteComment(id).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== id);
    });
  }

  startEditing(comment: Comment) {
    this.isEditing = true;
    this.editingComment = comment;
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingComment = {} as Comment;
  }

  confirmEditing() {
    this.postService.updateComment(this.editingComment).subscribe(() => {
      this.reloadComments();
      this.isEditing = false;
      this.editingComment = {} as Comment;
    });
  }
}
