# Phase 3: SEO 강화 및 이미지 관리

> 목표: 검색 엔진 최적화와 이미지 업로드/관리 기능 완성

---

## 3.1 Sitemap 설정

### Tasks

- [ ] `app/sitemap.ts` 생성
- [ ] 동적 sitemap 생성 (모든 포스트 포함)
- [ ] 태그 페이지 포함
- [ ] lastModified 날짜 반영
- [ ] robots.txt 설정

### 구현

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { getContentProvider } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const provider = await getContentProvider();
  const posts = await provider.getAllPosts();
  const tags = await provider.getAllTags();

  const postUrls = posts.map((post) => ({
    url: `https://yourdomain.com/posts/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagUrls = tags.map((tag) => ({
    url: `https://yourdomain.com/tags/${tag}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    { url: "https://yourdomain.com", priority: 1.0 },
    { url: "https://yourdomain.com/about", priority: 0.5 },
    ...postUrls,
    ...tagUrls,
  ];
}
```

### 산출물

- `app/sitemap.ts`
- `app/robots.ts`

### 완료 기준

- [ ] `/sitemap.xml` 접근 시 모든 포스트 URL 포함
- [ ] Google Search Console에서 sitemap 제출 가능
- [ ] robots.txt에 sitemap 위치 명시

---

## 3.2 RSS Feed 생성

### Tasks

- [ ] RSS 피드 생성 API/라우트
- [ ] Atom 피드 지원 (선택)
- [ ] 메타데이터에 RSS 링크 추가

### 구현

```typescript
// app/feed.xml/route.ts
export async function GET() {
  const provider = await getContentProvider();
  const posts = await provider.getAllPosts();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Samuel's Blog</title>
    <link>https://yourdomain.com</link>
    <description>개인 기술 블로그</description>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>https://yourdomain.com/posts/${post.slug}</link>
      <description>${post.excerpt}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

### 산출물

- `app/feed.xml/route.ts`

### 완료 기준

- [ ] `/feed.xml` 접근 시 유효한 RSS 피드 반환
- [ ] RSS 리더에서 구독 가능

---

## 3.3 마크다운 인라인 이미지 관리

### Tasks

- [ ] 에디터에서 이미지 붙여넣기(paste) 지원
- [ ] 드래그앤드롭 이미지 업로드
- [ ] 업로드된 이미지 URL을 마크다운에 자동 삽입
- [ ] 이미지 업로드 중 로딩 표시
- [ ] 업로드 실패 시 에러 처리

### 구현 방향

```typescript
// 에디터에서 이미지 처리 흐름
// 1. 이미지 paste/drop 감지
// 2. /api/upload 호출
// 3. 반환된 URL로 ![alt](url) 형식 삽입

// MarkdownEditor에 추가
const handlePaste = async (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      const url = await uploadImage(file);
      insertAtCursor(`![image](${url})`);
    }
  }
};
```

### 산출물

- `components/admin/MarkdownEditor.tsx` 업데이트
- 이미지 업로드 훅 또는 유틸리티

### 완료 기준

- [ ] 에디터에 이미지 붙여넣기 시 자동 업로드 및 삽입
- [ ] 드래그앤드롭으로 이미지 추가 가능
- [ ] 업로드 진행 상태 표시

---

## 3.4 썸네일 이미지 업로드

### Tasks

- [ ] PostForm에 썸네일 업로드 UI 추가
- [ ] 이미지 미리보기
- [ ] 기존 썸네일 표시 및 변경 가능
- [ ] 썸네일 삭제 기능

### 구현

```typescript
// PostForm에 추가
<div className="space-y-2">
  <label>썸네일</label>
  <ImageUpload
    value={thumbnail}
    onChange={setThumbnail}
    onRemove={() => setThumbnail("")}
  />
  {thumbnail && (
    <img src={thumbnail} alt="썸네일 미리보기" className="max-w-xs" />
  )}
</div>
```

### 산출물

- `components/admin/PostForm.tsx` 업데이트
- `components/admin/ThumbnailUpload.tsx` (선택)

### 완료 기준

- [ ] 포스트 작성 시 썸네일 업로드 가능
- [ ] 썸네일 미리보기 표시
- [ ] 수정 시 기존 썸네일 유지 또는 변경 가능

---

## 3.5 OG 이미지 자동 생성

### Tasks

- [ ] @vercel/og 설치
- [ ] OG 이미지 생성 API 라우트
- [ ] 포스트별 동적 OG 이미지
- [ ] 메타데이터에 OG 이미지 URL 설정

### 구현

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "@vercel/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Samuel's Blog";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(to right, #1a1a2e, #16213e)",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Dependencies

```bash
pnpm add @vercel/og
```

### 산출물

- `app/api/og/route.tsx`
- 메타데이터 업데이트

### 완료 기준

- [ ] `/api/og?title=xxx` 접근 시 OG 이미지 생성
- [ ] 소셜 미디어 공유 시 동적 이미지 표시

---

## 3.6 이미지 최적화

### Tasks

- [ ] next/image 활용
- [ ] 외부 이미지 도메인 설정
- [ ] 이미지 lazy loading
- [ ] WebP 자동 변환 (Vercel에서 자동)

### 구현

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};
```

### 산출물

- `next.config.js` 업데이트
- 이미지 컴포넌트 최적화

### 완료 기준

- [ ] Vercel Blob 이미지가 next/image로 최적화됨
- [ ] Lighthouse 이미지 점수 개선

---

## Phase 3 최종 체크리스트

- [ ] sitemap.xml 생성 및 Google Search Console 제출
- [ ] robots.txt 설정
- [ ] RSS 피드 동작
- [ ] 에디터에서 이미지 붙여넣기/드래그앤드롭 동작
- [ ] 썸네일 업로드 및 미리보기 동작
- [ ] OG 이미지 자동 생성
- [ ] 이미지 최적화 적용

---

## 추가 고려사항

### 향후 개선 (Phase 4 후보)

- [ ] 포스트 예약 발행
- [ ] 포스트 시리즈/카테고리
- [ ] 검색 기능 (전문 검색)
- [ ] 조회수/좋아요 통계
- [ ] 뉴스레터 구독
- [ ] 다국어 지원 (i18n)
- [ ] PWA 지원
- [ ] 성능 모니터링 (Web Vitals)
