import { PostCreate } from './post-create.model';

describe('PostCreate', () => {
  it('should create an instance with given properties', () => {
    const post = new PostCreate('authorName', 'postTitle', 'postContent', true);
    expect(post.author).toBe('authorName');
    expect(post.title).toBe('postTitle');
    expect(post.content).toBe('postContent');
    expect(post.concept).toBe(true);
  });

  it('should create an instance with concept set to false', () => {
    const post = new PostCreate('authorName', 'postTitle', 'postContent', false);
    expect(post.concept).toBe(false);
  });
});
