# JaehyunGround

Jaehyun's dev blog — Next.js 14+ 기반 개인 기술 블로그

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Content | MDX + gray-matter |
| Comments | giscus (GitHub Discussions) |
| Theme | next-themes (dark mode) |
| Deploy | Vercel |

## Architecture

**Content Provider Pattern** 기반으로, 콘텐츠 소스를 어댑터 패턴으로 유연하게 교체할 수 있는 구조입니다.

```
src/
├── app/                  # App Router (pages)
├── components/           # UI components
├── lib/content/          # Content Provider (MDX → Notion 확장 가능)
└── lib/utils/            # Utility functions
content/
└── posts/                # MDX 게시글
```

## Getting Started

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Writing Posts

`content/posts/` 디렉토리에 MDX 파일을 추가합니다.

```yaml
---
title: "글 제목"
excerpt: "요약"
publishedAt: "2025-01-01"
tags: ["tag1", "tag2"]
---
```
