export class Post {
  id: number;
  author: string;
  title: string;
  content: string;
  creationDate: Date;
  concept: boolean;
  constructor(id: number, author: string, title: string, content: string, creationDate: Date, isConcept: boolean) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
    this.creationDate = creationDate;
    this.concept = isConcept;
  }
}
