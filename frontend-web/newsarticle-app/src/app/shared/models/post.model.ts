export class Post {
  id: string;
  author: string;
  title: string;
  content: string;
  creationDate: string;
  concept: boolean;
  approved: boolean;
  rejectedReason: string;


  constructor(id: string, author: string, title: string, content: string, creationDate: string, isConcept: boolean, approved: boolean, rejectedMessage: string) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
    this.creationDate = creationDate;
    this.concept = isConcept;
    this.approved = approved;
    this.rejectedReason = rejectedMessage;

  }
}
