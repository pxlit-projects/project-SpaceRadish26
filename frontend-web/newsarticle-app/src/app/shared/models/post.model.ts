export class Post {
  id: number;
  author: string;
  title: string;
  content: string;

  constructor(id: number, author: string, title: string, content: string) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
  }
}
