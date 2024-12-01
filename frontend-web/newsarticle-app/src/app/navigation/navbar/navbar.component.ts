import {Component, inject, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth-service.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';
import { PostService } from '@services/post-service.service';
import { NotificationModel } from '@models/notification.model';
import {MatIcon} from '@angular/material/icon';
import {MatBadge, MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf, MatMenuItem, MatButton, MatMenuTrigger, MatBadgeModule, MatMenu, NgClass, MatIconButton, MatIcon, NgForOf, MatBadge],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  notifications: NotificationModel[] = [];
  private intervalId: any;


  ngOnInit() {
    this.getNotifications();
    this.intervalId = setInterval(() => {
      this.getNotifications();
    }, 5000);
  }

  deleteNotification(id: string) {
    this.postService.deleteNotification(id)
    this.getNotifications();
  }
  getNotifications() {
    if (this.authService.roleSubject.value != 'guest') {
      this.postService.getNotificationsForUser().subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          console.log('Notifications:', this.notifications);
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
        },
        complete: () => {
          console.log('Notification retrieval complete');
        }
      });
    }
  }
}
