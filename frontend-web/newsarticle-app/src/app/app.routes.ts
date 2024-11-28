import { Routes } from '@angular/router';
import { PostsListComponent } from './post/posts-list/posts-list.component';
import { WritePostComponent } from './post/write-post/write-post.component';
import { UpdatePostComponent } from './post/update-post/update-post.component';
import { LoginComponent } from './security/login/login.component';
import { RoleGuard } from '@services/roleguard-service.service';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsListComponent },
  { path: 'posts/write', component: WritePostComponent, canActivate: [RoleGuard], data: { expectedRole: 'writer' } },
  { path: 'update-post/:id', component: UpdatePostComponent, canActivate: [RoleGuard], data: { expectedRole: 'writer' } },
  { path: 'posts/review', component: UpdatePostComponent, canActivate: [RoleGuard], data: { expectedRole: 'reviewer' } },
  { path: 'security/login', component: LoginComponent },

];
