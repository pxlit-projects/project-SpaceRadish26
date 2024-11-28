import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { PostService } from '@services/post-service.service';
import { AuthService } from '@services/auth-service.service';
import { Post } from '@models/post.model';
import {UpdatepostModel} from '@models/updatepost.model';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class UpdatePostComponent implements OnInit {
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  post: Post | null = null;
  updatePost: UpdatepostModel = {id: 0, title: '', content: '', concept: false};
  canEdit: boolean = false;

  ngOnInit() {
    this.loadPost();
    this.checkRole();
  }

  loadPost() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(+postId).subscribe(post => {
        this.post = post;
        this.updatePost = {id: +postId, title: this.post.title, content: this.post.content, concept: this.post?.concept || false};
        console.log(('id= ' + postId + ' title= ' + this.post.title + ' content= ' + this.post.content + ' isConcept= ' + this.post.concept));
      });
    }
  }

  checkRole() {
    const role = this.authService.roleSubject.value;
    this.canEdit = role === 'admin' || role === 'writer';
  }



  onSubmit(updatePostForm: NgForm) {
    if (updatePostForm.valid) {
      this.postService.updatePost(this.updatePost).subscribe(response => {
        console.log('Post updated', response);
      });
    }
  }
}
