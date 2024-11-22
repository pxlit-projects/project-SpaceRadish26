import { Routes } from '@angular/router';
import {PostsListComponent} from './post/posts-list/posts-list.component';
import {WritePostComponent} from './post/write-post/write-post.component';
import {UpdatePostComponent} from './post/update-post/update-post.component';

export const routes: Routes = [
  {path: '', redirectTo: 'posts', pathMatch: 'full'},
  {path: 'posts', component: PostsListComponent},
  {path: 'posts/write', component: WritePostComponent},
  {path: 'posts/edit/:id', component: UpdatePostComponent}
];
