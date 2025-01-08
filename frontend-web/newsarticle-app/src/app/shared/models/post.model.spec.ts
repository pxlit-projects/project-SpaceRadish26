import { Post } from './post.model';

describe('Post', () => {
  it('should create an instance with given properties', () => {
    const post = new Post('1', 'authorName', 'postTitle', 'postContent', '2023-10-01', true, false, 'rejectedReason');
    expect(post.id).toBe('1');
    expect(post.author).toBe('authorName');
    expect(post.title).toBe('postTitle');
    expect(post.content).toBe('postContent');
    expect(post.creationDate).toBe('2023-10-01');
    expect(post.concept).toBe(true);
    expect(post.approved).toBe(false);
    expect(post.rejectedReason).toBe('rejectedReason');
  });

  it('should create an instance with approved set to true', () => {
    const post = new Post('2', 'authorName', 'postTitle', 'postContent', '2023-10-01', false, true, '');
    expect(post.approved).toBe(true);
  });

  it('should create an instance with concept set to false', () => {
    const post = new Post('3', 'authorName', 'postTitle', 'postContent', '2023-10-01', false, false, '');
    expect(post.concept).toBe(false);
  });
});
