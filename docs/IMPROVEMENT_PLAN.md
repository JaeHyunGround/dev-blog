# 블로그 개선 계획

> Phase 1-4 완료 이후, 향후 개선 및 신규 기능 아이디어 정리

## 현재 완료된 기능 (Phase 1-4)

### Phase 1: 기본 블로그 구축

- Content Provider 패턴 (MDX 어댑터)
- 포스트 목록/상세 페이지
- 태그 시스템
- 다크모드
- utterances 댓글

### Phase 2: Obsidian CMS

- Obsidian vault 연동
- Wiki-link 변환
- 이미지 첨부파일 처리

### Phase 3: SEO 강화

- sitemap.xml / robots.txt
- RSS Feed
- OG 이미지 자동 생성
- 썸네일 이미지 업로드

### Phase 4: 사용자 경험 강화

- 읽기 시간 표시
- 코드 복사 버튼
- 관련 포스트 섹션 (태그 기반)
- 소셜 공유 버튼
- 이전/다음 포스트 네비게이션
- 목차 (Table of Contents)
- 무한 스크롤

---

## 개선 계획

### 1. 관련 포스트 추천 고도화 ⭐ Priority: High

**현재 구현**

- 태그 공통 개수만으로 관련도 계산
- 동점 시 최신 포스트 우선

**개선 방향**

#### 1.1 TF-IDF 기반 콘텐츠 유사도

```typescript
// lib/utils/related-posts.ts
interface SimilarityFactors {
  tagScore: number; // 태그 공통 개수 (가중치: 0.4)
  contentScore: number; // TF-IDF 텍스트 유사도 (가중치: 0.3)
  recencyScore: number; // 최신도 점수 (가중치: 0.1)
  categoryScore: number; // 카테고리 일치 (가중치: 0.2)
}

// 콘텐츠 유사도 계산
function calculateContentSimilarity(post1: Post, post2: Post): number {
  // 1. 텍스트 전처리 (불용어 제거, 형태소 분석)
  // 2. TF-IDF 벡터 생성
  // 3. 코사인 유사도 계산
}
```

#### 1.2 태그 가중치 시스템

```typescript
// 태그별 희소성 기반 가중치
// 많이 사용된 태그(예: "javascript")보다
// 드문 태그(예: "rust-wasm")가 더 높은 가중치

interface TagWeight {
  tag: string;
  weight: number; // 1 / log(사용횟수 + 1)
}

function getTagBasedScore(
  post1: Post,
  post2: Post,
  tagWeights: Map<string, number>
): number {
  const commonTags = post1.tags.filter((t) => post2.tags.includes(t));
  return commonTags.reduce((sum, tag) => sum + (tagWeights.get(tag) || 1), 0);
}
```

#### 1.3 사용자 행동 기반 추천 (Advanced)

```typescript
// 향후 조회수 데이터 축적 시
interface ViewPattern {
  postSlug: string;
  nextViewedSlug: string | null;
  timestamp: Date;
}

// 함께 조회된 포스트 패턴 분석
function getCollaborativeScore(
  currentSlug: string,
  candidateSlug: string
): number {
  // "이 포스트를 본 사람들이 함께 본 포스트"
}
```

#### 1.4 시리즈/카테고리 연결

```typescript
// Post 타입 확장
interface Post {
  // ... existing fields
  series?: string; // 시리즈명
  category?: string; // 카테고리
  relatedSlugs?: string[]; // 수동 지정 관련 포스트
}

// 같은 시리즈/카테고리는 높은 관련도
function getSeriesScore(post1: Post, post2: Post): number {
  if (post1.series && post1.series === post2.series) return 1.0;
  if (post1.category && post1.category === post2.category) return 0.5;
  return 0;
}
```

**구현 우선순위**

1. [x] 태그 가중치 기반 개선 (현재 구현됨)
2. [ ] 태그 희소성 가중치 추가
3. [ ] 시리즈/카테고리 필드 추가
4. [ ] TF-IDF 텍스트 유사도 (콘텐츠 양 증가 후)
5. [ ] 사용자 행동 기반 (조회수 기능 추가 후)

---

### 2. 검색 기능 ⭐ Priority: High

#### 2.1 클라이언트 사이드 검색 (Phase 1)

```typescript
// 빌드 시 검색 인덱스 생성
// lib/search/index.ts
interface SearchIndex {
  posts: {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    content: string; // 전문
  }[];
}

// Fuse.js 사용 퍼지 검색
import Fuse from "fuse.js";

const fuse = new Fuse(searchIndex.posts, {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "excerpt", weight: 0.2 },
    { name: "tags", weight: 0.2 },
    { name: "content", weight: 0.2 },
  ],
  threshold: 0.3,
  includeScore: true,
});
```

#### 2.2 서버 사이드 전문 검색 (Phase 2)

- Algolia 또는 Typesense 연동
- 실시간 인덱싱
- 자동완성 지원

---

### 3. 포스트 시리즈/카테고리 ⭐ Priority: Medium

```typescript
// content/posts/*.md frontmatter 확장
---
title: "React Query 시리즈 1"
series: "React Query 완벽 가이드"
seriesOrder: 1
category: "Frontend"
---

// 시리즈 네비게이션 컴포넌트
function SeriesNavigation({ series, currentSlug }: Props) {
  // 같은 시리즈 포스트 목록
  // 현재 위치 하이라이트
  // 이전/다음 시리즈 포스트 링크
}
```

---

### 4. 조회수 통계 ⭐ Priority: Medium

```typescript
// Vercel KV 또는 Upstash Redis 사용
// lib/analytics/views.ts

export async function incrementViews(slug: string): Promise<number> {
  const kv = getKVClient();
  return await kv.incr(`views:${slug}`);
}

export async function getViews(slug: string): Promise<number> {
  const kv = getKVClient();
  return (await kv.get(`views:${slug}`)) || 0;
}

// 포스트 상세 페이지에서 호출
// Server Component에서 조회수 증가 + 표시
```

---

### 5. Draft/Published 상태 관리 ⭐ Priority: Medium

```typescript
// Post 타입 확장
interface Post {
  // ... existing fields
  status: "draft" | "published" | "scheduled";
  scheduledAt?: string; // 예약 발행 시간
}

// 관리자만 draft 볼 수 있도록
// getAllPosts에 status 필터 추가
```

---

### 6. 뉴스레터 구독 ⭐ Priority: Low

- Buttondown 또는 ConvertKit 연동
- 새 포스트 발행 시 자동 알림
- 구독 폼 컴포넌트

---

### 7. 다국어 지원 (i18n) ⭐ Priority: Low

```typescript
// next-intl 또는 next-i18next 사용
// 콘텐츠 구조
content / posts / ko / my - post.md;
en / my - post.md;
```

---

### 8. 성능 최적화 ⭐ Priority: Medium

#### 8.1 이미지 최적화

- [ ] next/image 활용 극대화
- [ ] 블러 플레이스홀더 적용
- [ ] WebP 자동 변환

#### 8.2 번들 최적화

- [ ] 번들 사이즈 분석 (next-bundle-analyzer)
- [ ] 코드 스플리팅 검토
- [ ] 동적 import 활용

#### 8.3 캐싱 전략

- [ ] ISR 최적화
- [ ] 정적 에셋 캐시 헤더

---

### 9. 접근성 (a11y) 개선 ⭐ Priority: Medium

- [ ] 키보드 네비게이션 개선
- [ ] 스크린 리더 지원
- [ ] 색상 대비 검증
- [ ] ARIA 라벨 추가
- [ ] 포커스 관리

---

### 10. 모니터링 및 분석 ⭐ Priority: Low

- [ ] Vercel Analytics 설정
- [ ] Core Web Vitals 모니터링
- [ ] 에러 추적 (Sentry)

---

## 구현 로드맵

| 순서 | 기능                             | 예상 복잡도 | 의존성      |
| ---- | -------------------------------- | ----------- | ----------- |
| 1    | 관련 포스트 고도화 (태그 희소성) | Low         | 없음        |
| 2    | 검색 기능 (클라이언트)           | Medium      | 없음        |
| 3    | 시리즈/카테고리                  | Medium      | 없음        |
| 4    | 조회수 통계                      | Medium      | Vercel KV   |
| 5    | Draft 상태 관리                  | Low         | 없음        |
| 6    | 관련 포스트 고도화 (TF-IDF)      | High        | 콘텐츠 축적 |
| 7    | 검색 기능 (Algolia)              | Medium      | 비용        |
| 8    | 뉴스레터                         | Low         | 외부 서비스 |
| 9    | 다국어                           | High        | 콘텐츠 번역 |

---

## 기술 부채

- [ ] 테스트 코드 작성 (Jest + React Testing Library)
- [ ] E2E 테스트 (Playwright)
- [ ] Storybook 컴포넌트 문서화
- [ ] 타입 안전성 강화 (strict TypeScript)
- [ ] 에러 바운더리 추가
- [ ] 로딩 스켈레톤 UI

---

## 참고 자료

- [Fuse.js 퍼지 검색](https://fusejs.io/)
- [Algolia 문서](https://www.algolia.com/doc/)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [next-intl](https://next-intl-docs.vercel.app/)
