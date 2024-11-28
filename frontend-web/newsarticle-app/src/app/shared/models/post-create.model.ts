export class PostCreate {
  author: string;
  title: string;
  content: string;
  concept: boolean;

  constructor( author: string, title: string, content: string, isConcept: boolean) {
    this.author = author;
    this.title = title;
    this.content = content;
    this.concept = isConcept;
  }
}
