import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { PostService } from '@services/post-service.service';
import { PostCreate } from '@models/post-create.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-write-post',
  templateUrl: './write-post.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./write-post.component.css']
})
export class WritePostComponent implements OnInit {
  postForm!: FormGroup;

  postService: PostService = inject(PostService);
  fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.postForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      isConcept: [false]
    });
  }

  submitPost(): void {
    if (this.postForm.valid) {
      const post: PostCreate = new PostCreate(
        this.postForm.value.author,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.isConcept
      );
      this.postService.addPost(post);
    }
  }
}
