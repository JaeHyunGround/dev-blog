# Phase 1: 기본 블로그 구축 (MDX)

> 목표: MDX로 코드 레벨에서 컨텐츠 관리하는 기본 블로그 구축

---

## 개요

**CMS 전략**:

- **1차**: MDX 파일로 코드 저장소 내에서 직접 관리
- **2차 (Phase 2)**: Obsidian CMS로 마이그레이션

**기술 스택**:

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- MDX (@next/mdx)
- next-themes (다크모드)
- utterances (댓글)

**Phase 1의 특징**:

- 별도의 CMS 도구 없이 코드로 모든 컨텐츠 관리
- MDX로 마크다운 + React 컴포넌트 혼합 사용 가능
- Git 기반 버전 관리
- Vercel 자동 배포

---

## 1.1 프로젝트 초기 설정

### Tasks

- [x] Next.js 프로젝트 생성 (App Router, TypeScript)
- [x] Tailwind CSS 설정
- [x] ESLint 설정
- [x] 기본 디렉토리 구조 생성
- [x] .env.example 파일 생성

### Commands

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

### 디렉토리 구조

```
dev-blog/
├── content/                  # MDX 컨텐츠
│   └── posts/               # 블로그 포스트
│       ├── hello-world.mdx
│       └── getting-started.mdx
├── public/
│   └── images/              # 포스트 이미지
│       └── posts/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── posts/
│   │   └── tags/
│   ├── components/
│   │   ├── layout/
│   │   ├── post/
│   │   └── mdx/            # MDX 커스텀 컴포넌트
│   └── lib/
│       ├── content/
│       │   ├── types.ts
│       │   ├── mdx-provider.ts
│       │   └── index.ts
│       └── utils/
└── mdx-components.tsx       # MDX 글로벌 컴포넌트
```

### 산출물

- 초기 프로젝트 구조
- 개발 환경 설정 완료

### 완료 기준

- [x] `pnpm dev`로 로컬 서버 실행 확인 (http://localhost:3000)
- [x] TypeScript 에러 없음
- [x] Tailwind 스타일 적용 확인

---

## 1.2 MDX 설정

### Tasks

- [x] @next/mdx, @mdx-js/loader, @mdx-js/react 설치
- [x] remark-gfm, rehype-highlight 설치
- [x] next.config.ts MDX 설정
- [x] mdx-components.tsx 생성
- [x] TypeScript 설정 (mdx 파일 인식)

### Dependencies

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install remark-gfm rehype-highlight rehype-slug rehype-autolink-headings
npm install gray-matter  # frontmatter 파싱용
```

### next.config.js

```javascript
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require("remark-gfm")],
    rehypePlugins: [
      require("rehype-slug"),
      require("rehype-autolink-headings"),
      require("rehype-highlight"),
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: false,
  },
};

module.exports = withMDX(nextConfig);
```

### mdx-components.tsx

```typescript
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Callout } from "@/components/mdx/Callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기본 HTML 요소 커스터마이징
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

    // 커스텀 컴포넌트
    Callout,

    ...components,
  };
}
```

### 산출물

- `next.config.js` MDX 설정
- `mdx-components.tsx`
- TypeScript 설정

### 완료 기준

- [x] MDX 파일 인식 및 렌더링 확인
- [x] 코드 하이라이팅 동작 확인
- [x] 빌드 성공 확인

---

## 1.3 Content Provider 인터페이스 설계

### Tasks

- [x] `Post` 타입 정의
- [x] `ContentProvider` 인터페이스 정의
- [x] MDXProvider 클래스 기본 구조
- [x] 타입 export 설정

### 파일 구조

```
src/lib/content/
├── types.ts           # Post, ContentProvider 인터페이스
├── mdx-provider.ts    # MDX 파일 읽기
└── index.ts           # Provider export
```

### 타입 정의

```typescript
// lib/content/types.ts
export interface PostFrontmatter {
  title: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  updatedAt?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string; // MDX source
}

export interface ContentProvider {
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
  getPostsByTag(tag: string): Promise<Post[]>;
  getAllTags(): Promise<string[]>;
}
```

### 산출물

- `lib/content/types.ts`
- `lib/content/mdx-provider.ts` (기본 구조)
- `lib/content/index.ts`

### 완료 기준

- [x] 타입 정의 완료
- [x] Provider 기본 구조 작성
- [x] TypeScript 컴파일 성공

---

## 1.4 MDX Provider 구현

### Tasks

- [x] 로컬 MDX 파일 읽기 로직
- [x] frontmatter 파싱
- [x] `getAllPosts()` 구현
- [x] `getPostBySlug()` 구현
- [x] `getPostsByTag()` 구현
- [x] `getAllTags()` 구현
- [x] 샘플 포스트 3개 작성 (hello-world, nextjs-app-router-guide, typescript-best-practices)

### MDXProvider 구현

```typescript
// lib/content/mdx-provider.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostFrontmatter, ContentProvider } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export class MDXProvider implements ContentProvider {
  async getAllPosts(): Promise<Post[]> {
    const fileNames = fs.readdirSync(POSTS_DIR);
    const posts = fileNames
      .filter((name) => name.endsWith(".mdx"))
      .map((fileName) => this.parsePost(fileName))
      .filter((post) => post !== null) as Post[];

    // 최신순 정렬
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      return this.parsePost(`${slug}.mdx`);
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

  private parsePost(fileName: string): Post | null {
    try {
      const filePath = path.join(POSTS_DIR, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const slug = fileName.replace(/\.mdx$/, "");

      return {
        slug,
        title: data.title || slug,
        content,
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

### lib/content/index.ts

```typescript
import { MDXProvider } from "./mdx-provider";

export function getContentProvider() {
  return new MDXProvider();
}

export type { Post, PostFrontmatter, ContentProvider } from "./types";
```

### Frontmatter 스펙

```yaml
---
title: "포스트 제목"
excerpt: "포스트 요약"
publishedAt: "2025-01-09"
tags: ["next.js", "blog", "mdx"]
thumbnail: "/images/posts/thumbnail.png" # optional
---
```

### 샘플 포스트 작성

`content/posts/hello-world.mdx`:

```mdx
---
title: "Hello World"
publishedAt: "2025-01-09"
excerpt: "첫 번째 블로그 포스트입니다."
tags: ["introduction"]
---

# Hello World

이것은 **MDX**로 작성한 첫 번째 포스트입니다.

## MDX의 장점

MDX를 사용하면 마크다운 안에서 React 컴포넌트를 사용할 수 있습니다:

<Callout type="info">이것은 커스텀 Callout 컴포넌트입니다!</Callout>

## 코드 예시

\`\`\`typescript
function hello() {
console.log("Hello, World!");
}
\`\`\`
```

### 산출물

- `lib/content/mdx-provider.ts`
- `lib/content/index.ts`
- `content/posts/*.mdx` 샘플 포스트

### 완료 기준

- [x] `getAllPosts()` 호출 시 포스트 목록 반환 (3개 포스트)
- [x] `getPostBySlug('hello-world')` 정상 동작
- [x] 존재하지 않는 slug는 `null` 반환
- [x] 태그 필터링 정상 동작 (`getPostsByTag()`, `getAllTags()`)
- [x] TypeScript 컴파일 및 빌드 성공

---

## 1.5 레이아웃 및 공통 컴포넌트

### Tasks

- [ ] 루트 레이아웃 구현
- [ ] Header 컴포넌트 (로고, 네비게이션)
- [ ] Footer 컴포넌트
- [ ] 반응형 네비게이션 (모바일 메뉴)
- [ ] SEO 기본 메타데이터 설정

### 메타데이터

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "My Dev Blog",
    template: "%s | My Dev Blog",
  },
  description: "MDX로 작성하는 개인 기술 블로그",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "My Dev Blog",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 산출물

- `app/layout.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

### 완료 기준

- [ ] 모든 페이지에 Header/Footer 표시
- [ ] 모바일에서 햄버거 메뉴 동작
- [ ] 메타데이터 정상 적용

---

## 1.6 다크모드 구현

### Tasks

- [ ] next-themes 설치
- [ ] ThemeProvider 설정
- [ ] Tailwind dark mode 설정 (`darkMode: 'class'`)
- [ ] ThemeToggle 컴포넌트
- [ ] 시스템 설정 감지
- [ ] localStorage 저장/복원

### Dependencies

```bash
npm install next-themes
```

### Tailwind 설정

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
};
```

### ThemeProvider

```typescript
// components/providers/ThemeProvider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

### 산출물

- `components/providers/ThemeProvider.tsx`
- `components/layout/ThemeToggle.tsx`

### 완료 기준

- [ ] 토글 버튼으로 테마 전환
- [ ] 새로고침 후에도 테마 유지
- [ ] 시스템 설정 변경 시 자동 반영

---

## 1.7 Post 목록 페이지

### Tasks

- [ ] 홈페이지에 최신 포스트 목록
- [ ] PostCard 컴포넌트
- [ ] PostList 컴포넌트
- [ ] 태그별 목록 페이지 (`/tags/[tag]`)
- [ ] ISR 설정 (revalidate)
- [ ] 빈 목록 상태 처리

### 렌더링 전략

```typescript
// app/page.tsx
import { getContentProvider } from "@/lib/content";
import { PostList } from "@/components/post/PostList";

export const revalidate = 3600; // 1시간마다 재생성

export default async function HomePage() {
  const provider = getContentProvider();
  const posts = await provider.getAllPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <PostList posts={posts} />
    </main>
  );
}
```

### 파일 구조

```
src/app/
├── page.tsx                # 홈 (전체 목록)
└── tags/
    └── [tag]/
        └── page.tsx        # 태그별 목록
```

### 산출물

- `app/page.tsx`
- `app/tags/[tag]/page.tsx`
- `components/post/PostCard.tsx`
- `components/post/PostList.tsx`

### 완료 기준

- [ ] 홈에서 전체 포스트 목록 표시
- [ ] PostCard에 제목, 요약, 날짜, 태그 표시
- [ ] 태그 클릭 시 해당 태그 포스트만 필터링
- [ ] 포스트 없을 때 적절한 메시지 표시

---

## 1.8 Post 상세 페이지 (MDX 렌더링)

### Tasks

- [ ] 동적 라우트 설정 (`[slug]`)
- [ ] MDX 컴포넌트 렌더링
- [ ] generateStaticParams 설정
- [ ] generateMetadata 설정 (동적 SEO)
- [ ] 404 처리 (notFound)
- [ ] MDX 커스텀 컴포넌트 작성

### 코드 구조

```typescript
// app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getContentProvider } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";

export async function generateStaticParams() {
  const provider = getContentProvider();
  const posts = await provider.getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = getContentProvider();
  const post = await provider.getPostBySlug(params.slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const provider = getContentProvider();
  const post = await provider.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <article className="prose dark:prose-invert mx-auto">
      <header>
        <h1>{post.title}</h1>
        <time>{post.publishedAt}</time>
      </header>

      <MDXRemote source={post.content} components={components} />
    </article>
  );
}
```

### Dependencies

```bash
npm install next-mdx-remote
```

### MDX 커스텀 컴포넌트

```typescript
// components/mdx/CodeBlock.tsx
"use client";

export function CodeBlock({ children }: { children: React.ReactNode }) {
  // 코드 복사 버튼 등 기능 추가
  return <pre className="relative">{children}</pre>;
}

// components/mdx/Callout.tsx
export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "error";
  children: React.ReactNode;
}) {
  return <div className={`callout callout-${type}`}>{children}</div>;
}
```

### 산출물

- `app/posts/[slug]/page.tsx`
- `components/mdx/CodeBlock.tsx`
- `components/mdx/Callout.tsx`
- Markdown/코드블록 스타일 (Tailwind Typography)

### 완료 기준

- [ ] MDX 정상 렌더링 (헤딩, 리스트, 링크, 이미지)
- [ ] 코드블록 구문 강조 동작
- [ ] 커스텀 컴포넌트 사용 가능
- [ ] 존재하지 않는 slug 접근 시 404
- [ ] SEO 메타데이터 동적 생성 확인

---

## 1.9 Tailwind Typography 설정

### Tasks

- [ ] @tailwindcss/typography 설치
- [ ] Tailwind 설정에 추가
- [ ] prose 스타일 커스터마이징
- [ ] 다크모드 prose 스타일

### Dependencies

```bash
npm install @tailwindcss/typography
```

### Tailwind 설정

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // 커스텀 스타일
          },
        },
      }),
    },
  },
};
```

### 산출물

- Tailwind Typography 설정
- 커스텀 prose 스타일

### 완료 기준

- [ ] prose 클래스로 마크다운 스타일 적용
- [ ] 다크모드에서 올바른 스타일

---

## 1.10 About 페이지

### Tasks

- [ ] 정적 소개 페이지 구현
- [ ] 프로필 이미지/아바타
- [ ] 자기소개 섹션
- [ ] 기술 스택 (선택)
- [ ] 소셜 링크 (GitHub, LinkedIn 등)

### 산출물

- `app/about/page.tsx`

### 완료 기준

- [ ] /about 접근 시 페이지 표시
- [ ] 반응형 레이아웃
- [ ] 소셜 링크 동작

---

## 1.11 utterances 댓글 연동

### Tasks

- [ ] GitHub repo에 utterances 앱 설치
- [ ] Utterances 컴포넌트 구현
- [ ] Post 상세 페이지에 통합
- [ ] 다크모드 테마 연동

### 컴포넌트

```typescript
// components/common/Utterances.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function Utterances() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.setAttribute("repo", "username/blog-comments");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute(
      "theme",
      resolvedTheme === "dark" ? "github-dark" : "github-light"
    );
    script.setAttribute("crossorigin", "anonymous");

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [resolvedTheme]);

  return <div ref={ref} />;
}
```

### 산출물

- `components/common/Utterances.tsx`
- GitHub repo utterances 설정

### 완료 기준

- [ ] 포스트 하단에 댓글 영역 표시
- [ ] GitHub 로그인 후 댓글 작성 가능
- [ ] 다크모드 전환 시 댓글 테마도 변경

---

## 1.12 배포 및 CI/CD

### Tasks

- [ ] Vercel 프로젝트 연결
- [ ] 프로덕션 배포
- [ ] 커스텀 도메인 연결 (선택)
- [ ] Git Push 시 자동 배포 확인

### Vercel 배포 흐름

1. GitHub 저장소와 Vercel 연결
2. `main` 브랜치 push 시 자동 배포
3. MDX 파일 수정 → Git commit/push → 자동 빌드

### 워크플로우

```
코드 에디터에서 MDX 작성
  ↓
content/posts/new-post.mdx 생성
  ↓
Git commit & push
  ↓
Vercel 자동 빌드 트리거
  ↓
새 포스트 블로그에 반영
```

### 산출물

- Vercel 배포 완료
- 자동 배포 워크플로우 확인

### 완료 기준

- [ ] 프로덕션 URL 접근 가능
- [ ] 새 포스트 push 후 자동 배포 확인
- [ ] 빌드 시 에러 없음

---

## Phase 1 최종 체크리스트

- [ ] MDX 설정 및 렌더링 정상 동작
- [ ] MDX에서 커스텀 컴포넌트 사용 가능
- [ ] 포스트 목록/상세 페이지 정상 동작
- [ ] 태그 기반 필터링 동작
- [ ] 다크모드 정상 동작
- [ ] Tailwind Typography 적용
- [ ] utterances 댓글 정상 동작
- [ ] Vercel 배포 완료
- [ ] Git push → 자동 배포 확인
- [ ] 모바일 반응형 확인
- [ ] Lighthouse 성능 점수 확인 (목표: 90+)

---

## Phase 2 예고

Phase 2에서는 **Obsidian CMS로 마이그레이션**합니다:

- Obsidian vault 설정
- 위키링크 변환 로직 추가
- 이미지 경로 처리 개선
- Obsidian 전용 기능 활용

---

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [utterances](https://utteranc.es/)
- [next-themes](https://github.com/pacocoursey/next-themes)
