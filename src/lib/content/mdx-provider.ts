import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostFrontmatter, ContentProvider } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * MDX 파일 기반 Content Provider
 * content/posts/ 디렉토리의 MDX 파일을 읽어 포스트 데이터를 제공
 */
export class MDXProvider implements ContentProvider {
  /**
   * 모든 포스트를 가져옵니다 (최신순 정렬)
   */
  async getAllPosts(): Promise<Post[]> {
    const fileNames = this.getPostFilePaths();
    const posts = fileNames
      .map((fileName) => {
        try {
          return this.readPostFile(fileName);
        } catch (error) {
          console.error(`Error reading post file ${fileName}:`, error);
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
      // .mdx 또는 .md 파일 시도
      const mdxPath = `${slug}.mdx`;
      const mdPath = `${slug}.md`;

      if (fs.existsSync(path.join(POSTS_DIR, mdxPath))) {
        return this.readPostFile(mdxPath);
      } else if (fs.existsSync(path.join(POSTS_DIR, mdPath))) {
        return this.readPostFile(mdPath);
      }

      return null;
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
   * MDX 파일 경로 목록을 가져옵니다
   */
  private getPostFilePaths(): string[] {
    if (!fs.existsSync(POSTS_DIR)) {
      return [];
    }
    return fs.readdirSync(POSTS_DIR).filter((path) => /\.mdx?$/.test(path));
  }

  /**
   * 파일명에서 slug를 추출합니다
   */
  private getSlugFromFilename(filename: string): string {
    return filename.replace(/\.mdx?$/, "");
  }

  /**
   * MDX 파일을 읽어 Post 객체로 변환합니다
   */
  private readPostFile(filename: string): Post {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = this.getSlugFromFilename(filename);
    const frontmatter = data as PostFrontmatter;

    return {
      slug,
      content,
      ...frontmatter,
    };
  }
}
