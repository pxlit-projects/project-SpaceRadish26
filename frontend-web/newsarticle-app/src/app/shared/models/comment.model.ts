export class Comment {
  id: string;
  content: string;
  author: string;
  postId: string;

  constructor(id: string, content: string, author: string, postId: string) {
    this.id = id;
    this.content = content;
    this.author = author;
    this.postId = postId;
  }
}
