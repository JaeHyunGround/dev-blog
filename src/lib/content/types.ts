/**
 * 블로그 포스트의 프론트매터 타입
 */
export interface PostFrontmatter {
  title: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  updatedAt?: string;
}

/**
 * 블로그 포스트 타입
 */
export interface Post extends PostFrontmatter {
  slug: string;
  content: string; // MDX/Markdown raw source
  readingTime: number; // 읽기 시간 (분)
}

/**
 * Content Provider 인터페이스
 * MDX 또는 Obsidian 등 다양한 컨텐츠 소스를 추상화
 */
export interface ContentProvider {
  /**
   * 모든 포스트를 가져옵니다 (최신순 정렬)
   */
  getAllPosts(): Promise<Post[]>;

  /**
   * slug로 특정 포스트를 가져옵니다
   */
  getPostBySlug(slug: string): Promise<Post | null>;

  /**
   * 특정 태그를 가진 포스트들을 가져옵니다
   */
  getPostsByTag(tag: string): Promise<Post[]>;

  /**
   * 모든 태그 목록을 가져옵니다
   */
  getAllTags(): Promise<string[]>;

  // Phase 2: Obsidian 마이그레이션을 위한 옵셔널 메서드
  createPost?(post: Partial<Post>): Promise<Post>;
  updatePost?(slug: string, post: Partial<Post>): Promise<Post>;
  deletePost?(slug: string): Promise<void>;
}
