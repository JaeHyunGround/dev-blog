# Phase 2: Notion CMS 마이그레이션

> 목표: MDX에서 Notion으로 컨텐츠 관리 방식 전환

---

## 개요

**Phase 1**에서 구축한 MDX 기반 블로그를 **Notion CMS**로 전환합니다.

**마이그레이션 목표**:

- Notion의 강력한 에디팅 기능 활용
- 웹 기반 컨텐츠 관리 (어디서나 작성 가능)
- Notion Database를 컨텐츠 소스로 활용
- 자동 동기화 및 빌드 트리거
- Git 커밋 없이 포스트 발행

**기술 변경사항**:

- MDX → Notion Database
- MDXProvider → NotionProvider
- Notion API 연동
- Notion blocks → Markdown 변환
- ISR (Incremental Static Regeneration) 활용

---

## 2.1 Notion 설정

### Tasks

- [ ] Notion 워크스페이스 생성 또는 기존 사용
- [ ] Blog Posts 데이터베이스 생성
- [ ] 데이터베이스 속성 설정
- [ ] Notion Integration 생성
- [ ] Integration을 데이터베이스에 연결
- [ ] 환경변수 설정

### Notion Database 속성

블로그 포스트를 관리할 데이터베이스 속성:

| 속성명         | 타입        | 설명                           | 필수 |
| -------------- | ----------- | ------------------------------ | ---- |
| Title          | Title       | 포스트 제목                    | ✅   |
| Slug           | Text        | URL slug (예: hello-world)     | ✅   |
| Excerpt        | Text        | 포스트 요약                    | ✅   |
| Published      | Checkbox    | 발행 상태                      | ✅   |
| PublishedAt    | Date        | 발행일                         | ✅   |
| UpdatedAt      | Last edited | 마지막 수정일 (자동)           | ❌   |
| Tags           | Multi-select| 태그 목록                      | ❌   |
| Thumbnail      | Files       | 썸네일 이미지                  | ❌   |
| Views          | Number      | 조회수 (선택)                  | ❌   |

### Notion Integration 생성

1. [Notion Integrations](https://www.notion.so/my-integrations) 접속
2. "New integration" 클릭
3. 설정:
   - Name: `Dev Blog`
   - Associated workspace: 본인 워크스페이스 선택
   - Type: Internal
   - Capabilities:
     - ✅ Read content (필수)
     - ✅ Update content (향후 CRUD 기능 사용 시)
     - ✅ Insert content (향후 CRUD 기능 사용 시)
4. "Submit" 클릭
5. **Integration Token** 복사 (나중에 사용)

**보안 주의사항**:
- Integration Token은 절대 Git에 커밋하지 말 것
- `.env.local` 파일을 `.gitignore`에 추가
- Vercel 등 배포 환경에서는 Environment Variables로 설정

### Integration 연결

1. Notion에서 Blog Posts 데이터베이스 페이지 열기
2. 우측 상단 `···` 메뉴 → `Add connections`
3. 방금 생성한 `Dev Blog` integration 선택

### 환경변수 설정

```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTENT_PROVIDER=notion  # MDX에서 Notion으로 전환
```

**Database ID 찾는 방법**:
- 데이터베이스 페이지 URL: `https://www.notion.so/{workspace}/{database_id}?v=...`
- `database_id` 부분 복사 (32자리 영숫자)

### 산출물

- Notion Blog Posts 데이터베이스
- Notion Integration + Token
- `.env.local` 설정

### 완료 기준

- [ ] Notion 데이터베이스에 샘플 포스트 1개 이상 작성
- [ ] Integration이 데이터베이스에 연결됨
- [ ] `.env.local`에 토큰 및 Database ID 설정

---

## 2.2 Notion SDK 및 NotionProvider 구현

### Tasks

- [ ] `@notionhq/client` 패키지 설치
- [ ] `notion-to-md` 패키지 설치
- [ ] NotionProvider 클래스 구현
- [ ] Notion blocks → Markdown 변환 로직
- [ ] 이미지 URL 처리
- [ ] Provider 인터페이스 구현

### Dependencies

```bash
pnpm add @notionhq/client notion-to-md
```

### lib/content/notion-provider.ts

```typescript
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { Post, ContentProvider } from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export class NotionProvider implements ContentProvider {
  async getAllPosts(): Promise<Post[]> {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "PublishedAt",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map((page) => this.pageToPost(page))
    );

    return posts.filter((post): post is Post => post !== null);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    return this.pageToPost(response.results[0]);
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter((post) => post.tags.includes(tag));
  }

  async getAllTags(): Promise<string[]> {
    const allPosts = await this.getAllPosts();
    const tagSet = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  private async pageToPost(page: any): Promise<Post | null> {
    try {
      const properties = page.properties;

      // Extract properties
      const title = properties.Title?.title[0]?.plain_text || "";
      const slug = properties.Slug?.rich_text[0]?.plain_text || "";
      const excerpt = properties.Excerpt?.rich_text[0]?.plain_text || "";
      const publishedAt = properties.PublishedAt?.date?.start || "";
      const updatedAt = properties.UpdatedAt?.last_edited_time || "";
      const tags = properties.Tags?.multi_select.map((tag: any) => tag.name) || [];
      const thumbnail = properties.Thumbnail?.files[0]?.file?.url || properties.Thumbnail?.files[0]?.external?.url || "";

      // Convert page content to markdown
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const content = mdString.parent || "";

      return {
        slug,
        title,
        content,
        excerpt,
        publishedAt,
        updatedAt,
        tags,
        thumbnail,
      };
    } catch (error) {
      console.error(`Error converting page to post:`, error);
      return null;
    }
  }
}
```

### lib/content/index.ts 업데이트

```typescript
import { NotionProvider } from "./notion-provider";
import { MDXProvider } from "./mdx-provider";

export function getContentProvider() {
  const provider = process.env.CONTENT_PROVIDER || "mdx";

  if (provider === "notion") {
    return new NotionProvider();
  }

  return new MDXProvider();
}

export type { Post, ContentProvider } from "./types";
```

### 산출물

- `lib/content/notion-provider.ts`
- `lib/content/index.ts` 업데이트

### Notion API CRUD 참고 (향후 확장용)

Phase 2에서는 읽기 전용으로 구현하지만, 향후 앱 내에서 포스트를 관리하려면 다음 API를 사용:

```typescript
// Notion API CRUD
// Create: POST https://api.notion.com/v1/pages
// Update: PATCH https://api.notion.com/v1/pages/{page_id}
// Archive (Delete): PATCH https://api.notion.com/v1/pages/{page_id}
//   { "archived": true }

// 예시: createPost 구현 (선택)
async createPost(input: CreatePostInput): Promise<Post> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      Title: { title: [{ text: { content: input.title } }] },
      Slug: { rich_text: [{ text: { content: input.slug } }] },
      Excerpt: { rich_text: [{ text: { content: input.excerpt } }] },
      Published: { checkbox: input.published || false },
      PublishedAt: { date: { start: input.publishedAt || new Date().toISOString() } },
      Tags: { multi_select: input.tags.map(tag => ({ name: tag })) },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: input.content } }],
        },
      },
    ],
  });

  return this.pageToPost(response);
}

// 예시: updatePost 구현 (선택)
async updatePost(slug: string, input: UpdatePostInput): Promise<Post> {
  const post = await this.getPostBySlug(slug);
  if (!post) throw new Error('Post not found');

  // page_id를 어딘가에 저장해둬야 함
  // 또는 slug로 다시 검색하여 page_id 획득

  const response = await notion.pages.update({
    page_id: post.id,
    properties: {
      Title: input.title ? { title: [{ text: { content: input.title } }] } : undefined,
      // ... 나머지 속성
    },
  });

  return this.pageToPost(response);
}
```

**참고**: Notion API로 페이지 컨텐츠(blocks)를 수정하려면 별도로 `blocks.children.append` API를 사용해야 합니다.

### 완료 기준

- [ ] NotionProvider가 모든 ContentProvider 메서드 구현
- [ ] Notion 데이터베이스에서 포스트 읽기 성공
- [ ] Notion blocks가 Markdown으로 변환
- [ ] 태그, 썸네일 등 모든 속성 정상 파싱

---

## 2.3 ISR 및 캐싱 설정

### Tasks

- [ ] ISR revalidate 시간 설정
- [ ] Notion API 요청 최적화
- [ ] 로컬 개발 시 캐싱 고려 (선택)
- [ ] 빌드 시간 최적화

### ISR 설정

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 3600; // 1시간마다 재생성

// app/page.tsx
export const revalidate = 1800; // 30분마다 재생성
```

### Notion API Rate Limit 고려

Notion API는 rate limit이 있으므로:

- ISR을 활용하여 빌드 시 모든 페이지 생성
- 런타임에는 최소한의 API 요청만 발생
- 필요 시 Redis 등으로 캐싱 추가 (Phase 3+)

### 산출물

- ISR 설정이 적용된 page 파일들

### 완료 기준

- [ ] ISR revalidate 설정 완료
- [ ] 빌드 시 모든 포스트 정적 생성 확인
- [ ] Notion API 요청 횟수가 최소화됨

---

## 2.4 Notion 이미지 처리

### Tasks

- [ ] Notion CDN 이미지 URL 처리
- [ ] 만료되는 URL 대응 (Notion 이미지는 1시간 후 만료)
- [ ] next/image 최적화 활용
- [ ] 이미지 다운로드 및 로컬 저장 (선택)

### Notion 이미지 URL 이슈

Notion에서 제공하는 이미지 URL은 **1시간 후 만료**됩니다.

**해결 방법**:

1. **ISR 활용** (추천): revalidate 시간을 1시간 이하로 설정하여 주기적으로 새 URL 받아오기
2. **이미지 다운로드**: 빌드 시 이미지를 다운로드하여 `public/` 폴더에 저장
3. **프록시 서버**: 자체 이미지 프록시 구현 (고급)

### 옵션 1: ISR로 URL 갱신 (간단)

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 3000; // 50분마다 재생성 (1시간 이전)
```

### 옵션 2: 이미지 다운로드 스크립트

```typescript
// scripts/download-notion-images.ts
import fs from "fs";
import path from "path";
import https from "https";
import { NotionProvider } from "../lib/content/notion-provider";

async function downloadImage(url: string, filepath: string) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(filepath);
      });
    }).on("error", reject);
  });
}

async function downloadAllImages() {
  const provider = new NotionProvider();
  const posts = await provider.getAllPosts();

  for (const post of posts) {
    if (post.thumbnail) {
      const filename = `${post.slug}-thumbnail.jpg`;
      const filepath = path.join(process.cwd(), "public/images", filename);

      await downloadImage(post.thumbnail, filepath);
      console.log(`Downloaded: ${filename}`);
    }
  }
}

downloadAllImages();
```

```json
// package.json
{
  "scripts": {
    "prebuild": "tsx scripts/download-notion-images.ts",
    "build": "next build"
  }
}
```

### next.config.js 이미지 설정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // Notion CDN
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.**.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

### 산출물

- ISR 시간 조정 또는 이미지 다운로드 스크립트
- `next.config.js` 이미지 도메인 설정

### 완료 기준

- [ ] Notion 이미지가 블로그에 정상 표시
- [ ] 이미지 만료 문제 해결 (ISR 또는 다운로드)
- [ ] next/image 최적화 동작

---

## 2.5 Webhook을 통한 자동 빌드 (선택)

### Tasks

- [ ] Vercel Deploy Hook 생성
- [ ] Notion Automation 설정 (Make.com 또는 Zapier)
- [ ] 포스트 발행 시 자동 빌드 트리거

### Vercel Deploy Hook

1. Vercel 프로젝트 Settings → Git → Deploy Hooks
2. Hook name: `Notion Publish Trigger`
3. Branch: `main`
4. "Create Hook" 클릭
5. **Webhook URL** 복사

### Notion Automation (Make.com 사용)

1. [Make.com](https://www.make.com) 가입 (무료 플랜 가능)
2. 새 시나리오 생성
3. **트리거 모듈 추가**: Notion → Watch Database Items
   - **Connection**: Notion 계정 연결 (Integration 사용)
   - **Database ID**: Blog Posts 데이터베이스 ID 입력
   - **Properties to Watch**: `Published` 체크박스 선택
   - **Trigger**: `On update` 또는 `On create/update`
   - **Filter**: Published = true 조건 추가

4. **액션 모듈 추가**: HTTP → Make a Request
   - **URL**: Vercel Deploy Hook URL 붙여넣기
   - **Method**: POST
   - **Headers** (선택):
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   - **Body** (선택): 빌드 정보 전달
     ```json
     {
       "trigger": "notion",
       "post_title": "{{1.properties.Title.title[].plain_text}}"
     }
     ```

5. **시나리오 저장 및 활성화**
   - "Save" → "Schedule" → "On" 으로 설정
   - Interval: 15분마다 체크 (무료 플랜 기준)

**Make.com 제약사항**:
- 무료 플랜: 월 1,000 operations
- 최소 체크 주기: 15분
- 대안: Zapier (유료), n8n (셀프 호스팅)

### 대안: GitHub Actions (고급)

Notion API를 주기적으로 폴링하여 변경사항 감지 후 빌드:

```yaml
# .github/workflows/notion-sync.yml
name: Sync from Notion

on:
  schedule:
    - cron: '0 */6 * * *' # 6시간마다
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Notion changes
        run: |
          # Notion API 체크 로직
          # 변경사항 있으면 Vercel Deploy Hook 호출
```

### 산출물

- Vercel Deploy Hook
- Make.com 시나리오 또는 GitHub Actions

### 완료 기준

- [ ] Notion에서 포스트 발행 시 자동 빌드
- [ ] 5-10분 내 블로그 업데이트 반영

---

## 2.6 Notion 워크플로우 테스트

### Tasks

- [ ] Notion에서 새 포스트 작성
- [ ] 모든 속성 채우기
- [ ] Published 체크박스 활성화
- [ ] 로컬 개발 서버에서 확인
- [ ] 빌드 및 배포 테스트
- [ ] 블로그에서 정상 표시 확인

### 테스트 시나리오

1. **새 포스트 작성**
   - Notion Blog Posts 데이터베이스에서 "New" 클릭
   - Title: `Notion으로 블로그 포스팅하기`
   - Slug: `notion-blog-posting`
   - Excerpt: `Notion을 CMS로 활용한 블로그 운영기`
   - Tags: `notion`, `blog`
   - Published: ✅
   - PublishedAt: 오늘 날짜

2. **본문 작성**
   - Heading, Paragraph, Code block 등 다양한 블록 사용
   - 이미지 삽입 테스트

3. **로컬 확인**
   ```bash
   pnpm dev
   ```
   - http://localhost:3000 접속
   - 포스트 목록에 새 포스트 표시 확인
   - 포스트 상세 페이지 확인
   - Markdown 변환 정상 확인

4. **배포 테스트**
   ```bash
   git add .
   git commit -m "feat: Add Notion CMS integration"
   git push origin main
   ```
   - Vercel 빌드 성공 확인
   - 프로덕션에서 포스트 확인

### 완료 기준

- [ ] Notion에서 포스트 작성 및 발행 가능
- [ ] 로컬 개발 서버에서 포스트 표시
- [ ] 빌드 에러 없음
- [ ] 프로덕션 배포 성공
- [ ] 모든 Notion 블록이 Markdown으로 변환
- [ ] 이미지 정상 표시

---

## 2.7 트러블슈팅 및 팁

### 자주 발생하는 문제

**1. Notion API 응답이 느림**
```typescript
// 해결: 병렬 요청으로 최적화
const posts = await Promise.all(
  response.results.map(async (page) => {
    const content = await this.pageToPost(page);
    return content;
  })
);
```

**2. 한글 Slug가 깨짐**
```typescript
// 해결: slugify 라이브러리 사용
import slugify from 'slugify';

const slug = slugify(title, {
  lower: true,
  strict: true,
  locale: 'ko'
});
```

**3. Notion 블록 타입이 지원되지 않음**
```typescript
// notion-to-md는 모든 블록 타입을 지원하지 않음
// 지원 블록: paragraph, heading, bulleted_list, code, quote 등
// 미지원: toggle, callout 등

// 해결: 커스텀 변환 로직 추가
n2m.setCustomTransformer('callout', async (block) => {
  const { callout } = block as any;
  const text = callout.rich_text[0]?.plain_text || '';
  return `> **${callout.icon?.emoji || '📌'}** ${text}`;
});
```

**4. 빌드 시간이 너무 오래 걸림**
```typescript
// 해결: 캐싱 추가
import { unstable_cache } from 'next/cache';

const getCachedPosts = unstable_cache(
  async () => provider.getAllPosts(),
  ['notion-posts'],
  { revalidate: 3600 }
);
```

### 개발 팁

**1. 로컬 개발 시 .env.local 설정**
```bash
# .env.local
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx
CONTENT_PROVIDER=mdx  # 로컬에서는 MDX 사용

# 프로덕션에서만 Notion 사용
# Vercel Environment Variables에서 CONTENT_PROVIDER=notion 설정
```

**2. Notion 데이터베이스 템플릿 복제**
- 데이터베이스 우측 상단 `...` → `Duplicate`
- 여러 환경(dev/staging/prod)에서 각각 사용

**3. 에러 로깅**
```typescript
// lib/content/notion-provider.ts
private async pageToPost(page: any): Promise<Post | null> {
  try {
    // ... 변환 로직
  } catch (error) {
    console.error('Failed to convert Notion page:', {
      pageId: page.id,
      error: error.message,
      page: JSON.stringify(page, null, 2)
    });
    return null;
  }
}
```

**4. Notion API Rate Limit 모니터링**
```typescript
// Notion API 헤더 확인
const response = await notion.databases.query({ ... });
console.log('Rate limit remaining:', response.headers['x-notion-request-id']);
```

---

## Phase 2 최종 체크리스트

- [ ] Notion 데이터베이스 및 Integration 설정 완료
- [ ] NotionProvider 구현 및 테스트
- [ ] Notion blocks → Markdown 변환 정상 동작
- [ ] 이미지 URL 처리 완료 (만료 문제 해결)
- [ ] ISR 설정 및 최적화
- [ ] Notion에서 포스트 작성 및 발행 테스트
- [ ] 자동 빌드 트리거 설정 (선택)
- [ ] Git push → Vercel 배포 정상 동작
- [ ] 모든 페이지 정상 렌더링
- [ ] 에러 로깅 및 모니터링 설정

---

## Phase 3 예고

Phase 3에서는 **SEO 최적화**를 진행합니다:

- Sitemap 자동 생성
- RSS Feed
- OG 이미지 자동 생성
- 메타데이터 최적화

---

## 참고 자료

- [Notion API Documentation](https://developers.notion.com/)
- [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
- [notion-to-md](https://github.com/souvikinator/notion-to-md)
- [Vercel Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks)
- [Make.com](https://www.make.com) - Automation platform
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
