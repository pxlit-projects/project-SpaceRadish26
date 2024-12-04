import { Routes } from '@angular/router';
import { PostsListComponent } from './post/posts-list/posts-list.component';
import { WritePostComponent } from './post/write-post/write-post.component';
import { UpdatePostComponent } from './post/update-post/update-post.component';
import { LoginComponent } from './security/login/login.component';
import { PublishedPostsComponent } from './post/published-posts/published-posts.component';
import { RoleGuard } from '@services/roleguard-service.service';
import {ReviewListComponent} from '@components/review/review-list/review-list.component';
import {ReviewPostComponent} from '@components/review/review-post/review-post.component';
import {ImprovePostComponent} from '@components/review/improve-post/improve-post.component';
import {PublishedPostDetailComponent} from '@components/post/published-post-detail/published-post-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PublishedPostsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['guest', 'reader', 'writer'] } },
  { path: 'dashboard', component: PostsListComponent, canActivate: [RoleGuard], data: { expectedRoles: ['writer'] } },
  { path: 'posts/write', component: WritePostComponent, canActivate: [RoleGuard], data: { expectedRoles: ['writer'] } },
  { path: 'update-post/:id', component: UpdatePostComponent, canActivate: [RoleGuard], data: { expectedRoles: ['writer'] } },
  { path: 'security/login', component: LoginComponent },
  { path: 'posts/review', component: ReviewListComponent, canActivate: [RoleGuard], data: { expectedRoles: ['reviewer', 'admin'] } },
  { path: 'posts/review/:id', component: ReviewPostComponent, canActivate: [RoleGuard], data: { expectedRoles: ['reviewer', 'admin'] } },
  {path: 'posts/improve/:id', component: ImprovePostComponent, canActivate: [RoleGuard], data: { expectedRoles: ['writer', 'admin'] } },
  {path: 'published-posts/:id', component: PublishedPostDetailComponent, canActivate: [RoleGuard], data: { expectedRoles: ['guest', 'reader', 'writer'] } }
];
