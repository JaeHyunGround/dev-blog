# Phase 2: Obsidian CMS 마이그레이션

> 목표: MDX에서 Obsidian으로 컨텐츠 관리 방식 전환

---

## 개요

**Phase 1**에서 구축한 MDX 기반 블로그를 **Obsidian CMS**로 전환합니다.

**마이그레이션 목표**:

- Obsidian의 강력한 마크다운 에디팅 기능 활용
- 위키링크, 백링크, 그래프 뷰 등 Obsidian 고유 기능 사용
- 마크다운 문법으로 작성 (MDX 컴포넌트 제거)
- Git 기반 워크플로우 유지

**기술 변경사항**:

- MDX → Markdown (.md)
- MDXProvider → ObsidianProvider
- 위키링크 변환 로직 추가
- 이미지 경로 처리 개선

---

## 2.1 Obsidian Vault 설정

### Tasks

- [ ] `content/` 폴더를 Obsidian vault로 설정
- [ ] Obsidian 설정 조정
  - Default location for new attachments → `attachments/`
  - New link format → "Shortest path when possible"
  - Automatically update internal links → ON
- [ ] Paste Image Rename 플러그인 설치
- [ ] Templater 플러그인 설치 (포스트 템플릿)
- [ ] `.gitignore` 업데이트 (`.obsidian/workspace` 제외)

### Obsidian 설정

**Files & Links**:

```
Default location for new attachments: attachments/
Automatically update internal links: ON
New link format: Shortest path when possible
```

**플러그인**:

1. **Paste Image Rename**: 이미지 파일명 자동 정규화
2. **Templater**: 포스트 템플릿 자동화

### 포스트 템플릿

```markdown
---
title: <% tp.file.title %>
publishedAt: <% tp.date.now("YYYY-MM-DD") %>
excerpt: ""
tags: []
thumbnail: ""
---

# <% tp.file.title %>

<!-- 본문 작성 -->
```

### 산출물

- Obsidian vault 설정 완료
- 템플릿 파일 (`content/templates/post.md`)
- `.gitignore` 업데이트

### 완료 기준

- [ ] Obsidian에서 `content/` 폴더 열기 가능
- [ ] 이미지 붙여넣기 시 `attachments/`에 저장
- [ ] 템플릿으로 새 포스트 생성 가능

---

## 2.2 ObsidianProvider 구현

### Tasks

- [ ] `ObsidianProvider` 클래스 생성
- [ ] 위키링크 변환 유틸리티 (`convertWikiLinks`)
- [ ] 이미지 링크 변환 유틸리티 (`convertImageLinks`)
- [ ] `.md` 파일 읽기 (`.mdx` 대신)
- [ ] MDXProvider 대체

### lib/utils/obsidian.ts

```typescript
/**
 * Obsidian 위키링크를 마크다운 링크로 변환
 * [[포스트명]] → [포스트명](/posts/post-slug)
 */
export function convertWikiLinks(content: string, allSlugs: string[]): string {
  return content.replace(
    /\[\[([^\]|]+)(\|([^\]]+))?\]\]/g,
    (match, linkText, _, displayText) => {
      // [[포스트명|표시텍스트]] 또는 [[포스트명]]
      const display = displayText || linkText;
      const slug = slugify(linkText);

      // 실제 존재하는 포스트인지 확인
      if (allSlugs.includes(slug)) {
        return `[${display}](/posts/${slug})`;
      }

      // 존재하지 않으면 일반 텍스트로
      return display;
    }
  );
}

/**
 * Obsidian 이미지 링크를 마크다운 이미지로 변환
 * ![[image.png]] → ![](/attachments/image.png)
 */
export function convertImageLinks(content: string): string {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    return `![](/attachments/${imageName})`;
  });
}

/**
 * 문자열을 slug로 변환
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");
}
```

### lib/content/obsidian-provider.ts

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, ContentProvider } from "./types";
import { convertWikiLinks, convertImageLinks } from "../utils/obsidian";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export class ObsidianProvider implements ContentProvider {
  async getAllPosts(): Promise<Post[]> {
    const fileNames = fs.readdirSync(POSTS_DIR);
    const allSlugs = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, ""));

    const posts = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((fileName) => this.parsePost(fileName, allSlugs))
      .filter((post) => post !== null) as Post[];

    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const allSlugs = fs
        .readdirSync(POSTS_DIR)
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(/\.md$/, ""));

      return this.parsePost(`${slug}.md`, allSlugs);
    } catch (error) {
      console.error(`Error reading post ${slug}:`, error);
      return null;
    }
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await this.getAllPosts();
    return posts.filter((post) => post.tags.includes(tag));
  }

  async getAllTags(): Promise<string[]> {
    const posts = await this.getAllPosts();
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  private parsePost(fileName: string, allSlugs: string[]): Post | null {
    try {
      const filePath = path.join(POSTS_DIR, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      // Obsidian 문법 변환
      let convertedContent = convertWikiLinks(content, allSlugs);
      convertedContent = convertImageLinks(convertedContent);

      const slug = fileName.replace(/\.md$/, "");

      return {
        slug,
        title: data.title || slug,
        content: convertedContent,
        excerpt: data.excerpt || "",
        publishedAt: data.publishedAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
        tags: data.tags || [],
        thumbnail: data.thumbnail || "",
      };
    } catch (error) {
      console.error(`Error parsing ${fileName}:`, error);
      return null;
    }
  }
}
```

### lib/content/index.ts 업데이트

```typescript
import { ObsidianProvider } from "./obsidian-provider";

export function getContentProvider() {
  return new ObsidianProvider();
}

export type { Post, ContentProvider } from "./types";
```

### 산출물

- `lib/utils/obsidian.ts`
- `lib/content/obsidian-provider.ts`
- `lib/content/index.ts` 업데이트

### 완료 기준

- [ ] 위키링크가 일반 링크로 변환
- [ ] 이미지 링크가 올바른 경로로 변환
- [ ] 존재하지 않는 위키링크는 일반 텍스트로 표시
- [ ] 모든 Provider 메서드 정상 동작

---

## 2.3 MDX 제거 및 Markdown 렌더링 전환

### Tasks

- [ ] MDX 관련 패키지 제거
- [ ] `react-markdown` 설치
- [ ] PostContent 컴포넌트를 react-markdown으로 전환
- [ ] mdx-components.tsx 제거
- [ ] MDX 커스텀 컴포넌트를 일반 컴포넌트로 변경 (선택)

### Dependencies

**제거**:

```bash
npm uninstall @next/mdx @mdx-js/loader @mdx-js/react next-mdx-remote
```

**설치**:

```bash
npm install react-markdown remark-gfm rehype-highlight rehype-raw
```

### PostContent 컴포넌트 업데이트

```typescript
// components/post/PostContent.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // 커스텀 렌더링 (선택)
          h2: ({ children }) => (
            <h2 id={slugify(String(children))}>{children}</h2>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

### next.config.js 업데이트

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // MDX 설정 제거
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
```

### 산출물

- `components/post/PostContent.tsx` 업데이트
- `next.config.js` 업데이트
- MDX 관련 파일 제거

### 완료 기준

- [ ] Markdown 정상 렌더링
- [ ] 코드 하이라이팅 동작
- [ ] MDX 의존성 완전 제거
- [ ] 빌드 에러 없음

---

## 2.4 이미지 경로 처리

### Tasks

- [ ] `public/attachments/` 경로 설정
- [ ] Obsidian `attachments/` → `public/attachments/` 연결
- [ ] 심볼릭 링크 또는 빌드 스크립트
- [ ] next.config.js 이미지 설정

### 옵션 1: 심볼릭 링크 (개발 환경 추천)

```bash
# content/attachments를 public/attachments로 심볼릭 링크
ln -s ../content/attachments public/attachments
```

### 옵션 2: 빌드 스크립트

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "mkdir -p public/attachments && cp -r content/attachments/* public/attachments/ || true",
    "build": "next build",
    "start": "next start"
  }
}
```

### .gitignore 업데이트

```
# Obsidian
.obsidian/workspace
.obsidian/workspace.json

# 심볼릭 링크 사용 시
public/attachments
```

### 산출물

- 이미지 경로 설정
- 빌드 스크립트 (선택)

### 완료 기준

- [ ] Obsidian에서 붙여넣은 이미지가 블로그에 표시
- [ ] `/attachments/image.png` 경로로 접근 가능
- [ ] 빌드 시 이미지 정상 포함

---

## 2.5 기존 MDX 포스트 마이그레이션

### Tasks

- [ ] MDX 포스트를 Markdown으로 변환
- [ ] JSX 컴포넌트를 일반 Markdown으로 변경
- [ ] 파일 확장자 변경 (.mdx → .md)
- [ ] 이미지 경로 확인 및 수정

### 마이그레이션 스크립트 (선택)

```typescript
// scripts/migrate-mdx-to-md.ts
import fs from "fs";
import path from "path";

const POSTS_DIR = "content/posts";

fs.readdirSync(POSTS_DIR).forEach((file) => {
  if (file.endsWith(".mdx")) {
    const oldPath = path.join(POSTS_DIR, file);
    const newPath = path.join(POSTS_DIR, file.replace(".mdx", ".md"));

    let content = fs.readFileSync(oldPath, "utf8");

    // MDX 컴포넌트를 Markdown으로 변환
    // 예: <Callout>...</Callout> → > **Note**: ...
    content = content.replace(
      /<Callout type="info">([\s\S]*?)<\/Callout>/g,
      (_, inner) => `> **ℹ️ Info**\n> ${inner.trim()}`
    );

    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);

    console.log(`Migrated: ${file} → ${file.replace(".mdx", ".md")}`);
  }
});
```

### 수동 변환 가이드

**Before (MDX)**:

```mdx
<Callout type="info">이것은 정보 박스입니다.</Callout>
```

**After (Markdown)**:

```markdown
> **ℹ️ Info**
>
> 이것은 정보 박스입니다.
```

### 산출물

- Markdown으로 변환된 포스트
- 마이그레이션 스크립트 (선택)

### 완료 기준

- [ ] 모든 포스트가 `.md` 확장자로 변환
- [ ] MDX 전용 문법 제거
- [ ] 기존 포스트 정상 렌더링

---

## 2.6 Obsidian 워크플로우 테스트

### Tasks

- [ ] Obsidian에서 새 포스트 작성
- [ ] 위키링크 사용해보기
- [ ] 이미지 붙여넣기 테스트
- [ ] Git commit & push
- [ ] Vercel 자동 배포 확인
- [ ] 블로그에서 정상 표시 확인

### 테스트 시나리오

1. **새 포스트 작성**

   ```markdown
   ---
   title: "Obsidian 테스트"
   publishedAt: "2025-01-09"
   excerpt: "Obsidian으로 작성한 테스트 포스트"
   tags: ["test", "obsidian"]
   ---

   # Obsidian 테스트

   이전 글: [[Hello World]]

   이미지 테스트:
   ![[test-image.png]]
   ```

2. **이미지 추가**

   - 스크린샷 복사 → Obsidian에 붙여넣기
   - 자동으로 `attachments/` 폴더에 저장되는지 확인

3. **Git Workflow**

   ```bash
   git add .
   git commit -m "Add: Obsidian 테스트 포스트"
   git push origin main
   ```

4. **배포 확인**
   - Vercel 빌드 성공 확인
   - 블로그에서 포스트 확인
   - 위키링크 변환 확인
   - 이미지 표시 확인

### 완료 기준

- [ ] Obsidian에서 포스트 작성 가능
- [ ] 위키링크 정상 변환
- [ ] 이미지 정상 표시
- [ ] Git push → 자동 배포 성공
- [ ] 블로그에서 모든 기능 동작

---

## Phase 2 최종 체크리스트

- [ ] Obsidian vault 설정 완료
- [ ] ObsidianProvider 구현 및 테스트
- [ ] 위키링크 변환 정상 동작
- [ ] 이미지 링크 변환 정상 동작
- [ ] MDX 완전히 제거 (Markdown으로 전환)
- [ ] 기존 포스트 마이그레이션 완료
- [ ] 이미지 경로 처리 동작 확인
- [ ] Obsidian 워크플로우 테스트 완료
- [ ] Git push → Vercel 배포 정상 동작
- [ ] 모든 페이지 정상 렌더링

---

## Phase 3 예고

Phase 3에서는 **SEO 최적화**를 진행합니다:

- Sitemap 자동 생성
- RSS Feed
- OG 이미지 자동 생성
- 메타데이터 최적화

---

## 참고 자료

- [Obsidian Help](https://help.obsidian.md/)
- [Neil Mathew - Next.js Blog with Obsidian](https://www.neilmathew.co/posts/nextjs-blog-with-obsidian-as-cms)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
