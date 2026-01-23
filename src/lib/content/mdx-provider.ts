import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostFrontmatter, ContentProvider } from "./types";
import { calculateReadingTime } from "../utils/reading-time";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * MDX 파일 기반 Content Provider
 *
 * 지원하는 구조:
 * 1. 폴더 기반: content/posts/my-post/index.mdx (이미지와 함께 관리)
 * 2. 파일 기반: content/posts/my-post.mdx (하위 호환)
 */
export class MDXProvider implements ContentProvider {
  /**
   * 모든 포스트를 가져옵니다 (최신순 정렬)
   */
  async getAllPosts(): Promise<Post[]> {
    const postSlugs = this.getPostSlugs();
    const posts = postSlugs
      .map((slug) => {
        try {
          return this.readPost(slug);
        } catch (error) {
          console.error(`Error reading post ${slug}:`, error);
          return null;
        }
      })
      .filter((post): post is Post => post !== null);

    // 최신순 정렬
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  /**
   * slug로 특정 포스트를 가져옵니다
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      return this.readPost(slug);
    } catch (error) {
      console.error(`Error reading post ${slug}:`, error);
      return null;
    }
  }

  /**
   * 특정 태그를 가진 포스트들을 가져옵니다
   */
  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await this.getAllPosts();
    return posts.filter((post) => post.tags.includes(tag));
  }

  /**
   * 모든 태그 목록을 가져옵니다
   */
  async getAllTags(): Promise<string[]> {
    const posts = await this.getAllPosts();
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  /**
   * 모든 포스트의 slug 목록을 가져옵니다
   * 폴더 기반과 파일 기반 모두 지원
   */
  private getPostSlugs(): string[] {
    if (!fs.existsSync(POSTS_DIR)) {
      return [];
    }

    const slugs: string[] = [];
    const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // 폴더 기반: content/posts/my-post/index.mdx
        const indexMdx = path.join(POSTS_DIR, entry.name, "index.mdx");
        const indexMd = path.join(POSTS_DIR, entry.name, "index.md");
        if (fs.existsSync(indexMdx) || fs.existsSync(indexMd)) {
          slugs.push(entry.name);
        }
      } else if (/\.mdx?$/.test(entry.name)) {
        // 파일 기반: content/posts/my-post.mdx
        slugs.push(entry.name.replace(/\.mdx?$/, ""));
      }
    }

    return slugs;
  }

  /**
   * slug로 포스트 파일 경로를 찾습니다
   */
  private getPostFilePath(slug: string): string | null {
    // 1. 폴더 기반 확인
    const folderIndexMdx = path.join(POSTS_DIR, slug, "index.mdx");
    const folderIndexMd = path.join(POSTS_DIR, slug, "index.md");

    if (fs.existsSync(folderIndexMdx)) return folderIndexMdx;
    if (fs.existsSync(folderIndexMd)) return folderIndexMd;

    // 2. 파일 기반 확인
    const fileMdx = path.join(POSTS_DIR, `${slug}.mdx`);
    const fileMd = path.join(POSTS_DIR, `${slug}.md`);

    if (fs.existsSync(fileMdx)) return fileMdx;
    if (fs.existsSync(fileMd)) return fileMd;

    return null;
  }

  /**
   * 포스트를 읽어 Post 객체로 변환합니다
   */
  private readPost(slug: string): Post | null {
    const filePath = this.getPostFilePath(slug);
    if (!filePath) return null;

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const frontmatter = data as PostFrontmatter;
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      content,
      readingTime,
      ...frontmatter,
    };
  }
}
