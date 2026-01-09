# Phase 4: 사용자 경험 및 기능 강화

> 목표: 블로그 운영에 필수적인 기능 완성 및 독자 경험 개선

---

## 4.1 포스트 삭제 기능 (Admin)

### Tasks

- [ ] PostTable에 삭제 버튼 추가
- [ ] 삭제 확인 모달 연동 (ConfirmModal 재사용)
- [ ] DELETE API 호출 및 에러 처리
- [ ] 삭제 후 목록 새로고침

### 구현

```typescript
// components/admin/PostTable.tsx
const handleDelete = async (slug: string) => {
  if (!confirm) return;

  try {
    const response = await fetch(`/api/posts/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("삭제 실패");

    router.refresh();
  } catch (error) {
    setError("포스트 삭제에 실패했습니다.");
  }
};

// 테이블 row에 삭제 버튼 추가
<button
  onClick={() => setDeleteTarget(post.slug)}
  className="text-red-600 hover:text-red-800"
>
  삭제
</button>;
```

### 산출물

- `components/admin/PostTable.tsx` 업데이트

### 완료 기준

- [ ] 관리자 테이블에서 삭제 버튼 클릭 가능
- [ ] 삭제 전 확인 모달 표시
- [ ] 삭제 완료 후 목록에서 즉시 제거

---

## 4.2 읽기 시간 표시

### Tasks

- [ ] 읽기 시간 계산 유틸리티 함수 작성
- [ ] PostCard에 읽기 시간 표시
- [ ] 포스트 상세 페이지 헤더에 표시
- [ ] 한글/영문 혼합 콘텐츠 고려

### 구현

```typescript
// lib/utils/reading-time.ts
export function calculateReadingTime(content: string): number {
  // 평균 읽기 속도: 한글 500자/분, 영문 200단어/분
  const koreanChars = (content.match(/[가-힣]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;

  const koreanMinutes = koreanChars / 500;
  const englishMinutes = englishWords / 200;

  return Math.ceil(koreanMinutes + englishMinutes) || 1;
}

// 사용 예시
<span className="text-gray-500">
  ⏱️ {calculateReadingTime(post.content)}분 읽기
</span>;
```

### 산출물

- `lib/utils/reading-time.ts` 생성
- `components/post/PostCard.tsx` 업데이트
- `app/posts/[slug]/page.tsx` 업데이트

### 완료 기준

- [ ] 모든 포스트 카드에 "N분 읽기" 표시
- [ ] 포스트 상세 페이지 헤더에 읽기 시간 표시

---

## 4.3 코드 복사 버튼

### Tasks

- [ ] 코드 블록 래퍼 컴포넌트 생성
- [ ] 클립보드 복사 기능 구현
- [ ] 복사 완료 피드백 (아이콘 변경 또는 토스트)
- [ ] react-markdown의 code 컴포넌트 커스터마이징

### 구현

```typescript
// components/post/CodeBlock.tsx
"use client";

import { useState } from "react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100
                   bg-gray-700 text-white px-2 py-1 rounded text-xs"
      >
        {copied ? "✓ 복사됨" : "복사"}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// PostContent.tsx에서 사용
<ReactMarkdown
  components={{
    code({ node, inline, className, children, ...props }) {
      if (inline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{String(children)}</CodeBlock>;
    },
  }}
>
  {content}
</ReactMarkdown>;
```

### 산출물

- `components/post/CodeBlock.tsx` 생성
- `components/post/PostContent.tsx` 업데이트

### 완료 기준

- [ ] 코드 블록 호버 시 복사 버튼 표시
- [ ] 클릭 시 클립보드에 복사
- [ ] 복사 완료 시 시각적 피드백

---

## 4.4 관련 포스트 섹션

### Tasks

- [ ] 태그 기반 관련 포스트 추출 로직
- [ ] RelatedPosts 컴포넌트 생성
- [ ] 포스트 상세 페이지에 섹션 추가
- [ ] 최대 3개 표시, 현재 포스트 제외

### 구현

```typescript
// components/post/RelatedPosts.tsx
interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
  allPosts: Post[];
}

export function RelatedPosts({
  currentSlug,
  tags,
  allPosts,
}: RelatedPostsProps) {
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-semibold mb-4">관련 포스트</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} compact />
        ))}
      </div>
    </section>
  );
}
```

### 산출물

- `components/post/RelatedPosts.tsx` 생성
- `app/posts/[slug]/page.tsx` 업데이트

### 완료 기준

- [ ] 포스트 하단에 관련 포스트 3개 표시
- [ ] 태그 기반 매칭 동작
- [ ] 관련 포스트 없으면 섹션 숨김

---

## 4.5 소셜 공유 버튼

### Tasks

- [ ] ShareButtons 컴포넌트 생성
- [ ] Twitter, Facebook, LinkedIn 공유 링크
- [ ] 링크 복사 기능
- [ ] 복사 완료 토스트 알림

### 구현

```typescript
// components/common/ShareButtons.tsx
"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    // 토스트 알림 표시
  };

  return (
    <div className="flex gap-2">
      <a href={shareLinks.twitter} target="_blank" rel="noopener">
        <TwitterIcon />
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener">
        <FacebookIcon />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener">
        <LinkedInIcon />
      </a>
      <button onClick={copyToClipboard}>
        <LinkIcon />
      </button>
    </div>
  );
}
```

### 산출물

- `components/common/ShareButtons.tsx` 생성
- `app/posts/[slug]/page.tsx` 업데이트

### 완료 기준

- [ ] 포스트 상세 페이지에 공유 버튼 표시
- [ ] 각 SNS 클릭 시 새 창에서 공유 화면
- [ ] 링크 복사 시 피드백 표시

---

## 4.6 이전/다음 포스트 네비게이션

### Tasks

- [ ] 이전/다음 포스트 데이터 계산 로직
- [ ] PostNavigation 컴포넌트 생성
- [ ] 화살표 + 제목 표시
- [ ] 첫/마지막 포스트 처리

### 구현

```typescript
// components/post/PostNavigation.tsx
interface PostNavigationProps {
  prevPost: Post | null;
  nextPost: Post | null;
}

export function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  return (
    <nav className="flex justify-between mt-12 pt-8 border-t">
      {prevPost ? (
        <Link href={`/posts/${prevPost.slug}`} className="group">
          <span className="text-sm text-gray-500">← 이전 글</span>
          <p className="font-medium group-hover:text-blue-600">
            {prevPost.title}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {nextPost ? (
        <Link href={`/posts/${nextPost.slug}`} className="group text-right">
          <span className="text-sm text-gray-500">다음 글 →</span>
          <p className="font-medium group-hover:text-blue-600">
            {nextPost.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

// 포스트 페이지에서 계산
const sortedPosts = allPosts.sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);
const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);
const prevPost = sortedPosts[currentIndex + 1] || null;
const nextPost = sortedPosts[currentIndex - 1] || null;
```

### 산출물

- `components/post/PostNavigation.tsx` 생성
- `app/posts/[slug]/page.tsx` 업데이트

### 완료 기준

- [ ] 포스트 하단에 이전/다음 포스트 링크 표시
- [ ] 첫 번째 포스트는 이전 글 없음
- [ ] 마지막 포스트는 다음 글 없음

---

## 4.7 목차 (Table of Contents)

### Tasks

- [ ] 마크다운 헤딩 파싱 유틸리티 작성
- [ ] TableOfContents 컴포넌트 생성
- [ ] 현재 읽고 있는 섹션 하이라이트 (Intersection Observer)
- [ ] 클릭 시 해당 섹션으로 스크롤
- [ ] 모바일에서는 접기/펼치기 또는 숨김

### 구현

```typescript
// lib/utils/toc.ts
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "");

    toc.push({ id, text, level });
  }

  return toc;
}

// components/post/TableOfContents.tsx
("use client");

import { useState, useEffect } from "react";
import type { TocItem } from "@/lib/utils/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav className="sticky top-24 hidden lg:block">
      <h2 className="font-semibold mb-3 text-sm text-gray-500">목차</h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 hover:text-blue-600 transition-colors ${
                activeId === item.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### PostContent 업데이트

```typescript
// components/post/PostContent.tsx
// 헤딩에 id 추가
<ReactMarkdown
  components={{
    h2: ({ children }) => {
      const id = String(children)
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-");
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const id = String(children)
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-");
      return <h3 id={id}>{children}</h3>;
    },
  }}
>
  {content}
</ReactMarkdown>
```

### 레이아웃 구조

```
┌──────────────────────────────────────────────────┐
│  포스트 상세 페이지                               │
├────────────────────────────┬─────────────────────┤
│                            │  📋 목차            │
│  본문 콘텐츠               │  ├─ 소개            │
│                            │  ├─ 주요 기능       │
│                            │  │  ├─ 기능 1      │
│                            │  │  └─ 기능 2      │
│                            │  └─ 결론           │
│                            │                     │
│                            │  (sticky, lg 이상)  │
└────────────────────────────┴─────────────────────┘
```

### 산출물

- `lib/utils/toc.ts` 생성
- `components/post/TableOfContents.tsx` 생성
- `components/post/PostContent.tsx` 업데이트
- `app/posts/[slug]/page.tsx` 레이아웃 업데이트

### 완료 기준

- [ ] 포스트 우측에 목차 표시 (데스크톱)
- [ ] 현재 읽고 있는 섹션 하이라이트
- [ ] 목차 클릭 시 해당 섹션으로 스크롤
- [ ] 헤딩 3개 미만이면 목차 숨김
- [ ] 모바일에서는 숨김 또는 접기

---

## 4.8 무한 스크롤 (Infinite Scroll)

### Tasks

- [ ] API에 페이지네이션 파라미터 추가 (page, limit)
- [ ] useInfiniteScroll 훅 또는 라이브러리 사용
- [ ] 로딩 스피너 표시
- [ ] "더 이상 포스트가 없습니다" 처리
- [ ] SEO를 위한 초기 포스트 SSR 유지

### 구현

```typescript
// app/api/posts/route.ts 수정
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const provider = await getContentProvider();
  const allPosts = await provider.getAllPosts();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const posts = allPosts.slice(startIndex, endIndex);

  return NextResponse.json({
    posts,
    hasMore: endIndex < allPosts.length,
    total: allPosts.length,
  });
}

// components/post/InfinitePostList.tsx
("use client");

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "./PostCard";
import type { Post } from "@/lib/content/types";

interface InfinitePostListProps {
  initialPosts: Post[];
}

export function InfinitePostList({ initialPosts }: InfinitePostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page + 1}&limit=10`);
      const data = await response.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* 로딩 트리거 영역 */}
      <div ref={observerRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500">모든 포스트를 불러왔습니다</p>
        )}
      </div>
    </div>
  );
}
```

### 홈페이지 업데이트

```typescript
// app/page.tsx
export default async function HomePage() {
  const provider = await getContentProvider();
  const allPosts = await provider.getAllPosts();

  // 초기 로드: 첫 10개만 (SEO용 SSR)
  const initialPosts = allPosts.slice(0, 10);

  return (
    <main>
      <h1>최신 포스트</h1>
      <InfinitePostList initialPosts={initialPosts} />
    </main>
  );
}
```

### 산출물

- `app/api/posts/route.ts` 업데이트 (페이지네이션)
- `components/post/InfinitePostList.tsx` 생성
- `app/page.tsx` 업데이트

### 완료 기준

- [ ] 스크롤 시 자동으로 다음 포스트 로드
- [ ] 로딩 중 스피너 표시
- [ ] 모든 포스트 로드 완료 시 메시지 표시
- [ ] 초기 포스트는 SSR로 렌더링 (SEO 유지)

---

## Phase 4 최종 체크리스트

- [ ] 관리자에서 포스트 삭제 가능
- [ ] 읽기 시간 표시 동작
- [ ] 코드 블록 복사 버튼 동작
- [ ] 관련 포스트 섹션 표시
- [ ] 소셜 공유 버튼 동작
- [ ] 이전/다음 포스트 네비게이션 동작
- [ ] 목차 표시 및 스크롤 동작
- [ ] 무한 스크롤 동작

---

## 추가 고려사항

### 향후 개선 (Phase 5 후보)

- [ ] 검색 기능 (전문 검색)
- [ ] 포스트 시리즈/카테고리
- [ ] Draft/Published 상태 관리
- [ ] 예약 발행
- [ ] 조회수 통계
- [ ] 뉴스레터 구독
- [ ] 다국어 지원 (i18n)
- [ ] 미디어 라이브러리
