export class NotificationModel {
  notificationId: string;
  content: string;
  postId: string;

  constructor(notificationId: string, content: string, postId: string) {
    this.content = content;
    this.postId = postId;
    this.notificationId = notificationId;
  }

}
