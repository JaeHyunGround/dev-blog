# AGENTS.md - Development Guidelines for JaehyunGround Blog

This document provides comprehensive guidelines for agentic coding assistants working on this Next.js blog project.

## 프로젝트 개요

- **Framework**: Next.js 14+ (App Router)
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS v4
- **콘텐츠**: MDX 기반 Content Provider 패턴
- **배포**: Vercel

## 빌드 및 테스트 명령어

### 기본 명령어
```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 실행
pnpm lint
```

### 테스트 (현재 미구현)
```bash
# 테스트 실행 (추가 예정)
pnpm test

# 단일 테스트 파일 실행 (추가 예정)
pnpm test -- path/to/test.file

# 테스트 커버리지 (추가 예정)
pnpm test:coverage
```

⚠️ **현재 프로젝트에 테스트 프레임워크가 설치되어 있지 않습니다.** 테스트 추가 시 Jest 또는 Vitest + React Testing Library 권장.

## 코드 스타일 가이드라인

### TypeScript 설정
- **엄격 모드 활성화**: `strict: true`
- **타입 정의**: 모든 변수, 함수, 컴포넌트에 명시적 타입 지정
- **인터페이스 우선**: 데이터 구조는 인터페이스로 정의
- **옵셔널 속성**: `?:` 사용으로 선택적 속성 표시

### 임포트 및 모듈
```typescript
// ✅ 권장: 그룹화된 임포트 (React, 외부 라이브러리, 내부 모듈 순)
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/content/types";
import { ThemeToggle } from "@/components/common/ThemeToggle";

// ❌ 비권장: 혼재된 임포트
import { useState } from "react";
import { Post } from "@/lib/content/types";
import Link from "next/link";
import React from "react";
```

### 컴포넌트 패턴
```typescript
// ✅ 권장: 함수형 컴포넌트 + 명명된 익스포트
export function Header() {
  // 컴포넌트 로직
  return (
    <header>
      {/* JSX */}
    </header>
  );
}

// ✅ 클라이언트 컴포넌트
"use client";

import { useState } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState(initialValue);
  // ...
}
```

### 네이밍 컨벤션
- **컴포넌트**: PascalCase (`PostCard`, `Header`)
- **함수/변수**: camelCase (`getAllPosts`, `isMenuOpen`)
- **인터페이스**: PascalCase (`Post`, `ContentProvider`)
- **타입**: PascalCase (`PostFrontmatter`)
- **파일**: kebab-case (`post-card.tsx`, `content-provider.ts`)
- **디렉토리**: kebab-case (`components/common`, `lib/content`)

### 에러 처리
```typescript
// ✅ 권장: 명시적 에러 처리
try {
  const posts = await provider.getAllPosts();
  return posts;
} catch (error) {
  console.error("Failed to fetch posts:", error);
  throw new Error("Unable to load blog posts");
}
```

### 주석 및 문서화
```typescript
/**
 * 블로그 포스트 타입
 * 한글로 작성된 JSDoc 주석 권장
 */
export interface Post {
  slug: string;
  title: string;
  // ...
}
```

## 프로젝트 구조

```
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 루트 레이아웃 (다크모드 지원)
│   ├── page.tsx              # 홈페이지 (포스트 목록)
│   ├── posts/[slug]/         # 포스트 상세 페이지
│   └── tags/[tag]/           # 태그별 포스트 목록
├── components/
│   ├── common/               # 재사용 컴포넌트
│   ├── post/                 # 포스트 관련 컴포넌트
│   └── layout/               # 레이아웃 컴포넌트
├── lib/
│   ├── content/              # Content Provider 패턴
│   │   ├── types.ts          # 인터페이스 정의
│   │   ├── index.ts          # Provider 팩토리
│   │   └── mdx-provider.ts   # MDX 구현체
│   └── utils/                # 유틸리티 함수
├── content/posts/            # MDX 포스트 파일들
└── public/                   # 정적 파일들
```

## Content Provider 패턴

모든 콘텐츠 작업은 Provider 인터페이스를 통해 수행:

```typescript
// ✅ 권장: Provider를 통한 콘텐츠 접근
const provider = getContentProvider();
const posts = await provider.getAllPosts();

// ❌ 비권장: 직접 파일 시스템 접근
const files = fs.readdirSync("./content/posts");
```

## 컴포넌트 개발 원칙

### 서버 컴포넌트 우선
- 기본적으로 서버 컴포넌트 사용
- 클라이언트 컴포넌트는 필요한 경우에만 (`"use client"`)

### 스타일링
- **Tailwind CSS** 클래스 사용
- **시맨틱 클래스명**: `text-foreground`, `bg-background`
- **반응형 디자인**: 모바일 우선 (`sm:`, `md:`, `lg:`)

### 접근성
- 의미있는 `aria-*` 속성
- 키보드 네비게이션 지원
- 스크린 리더 지원 (`sr-only` 클래스)

## 개발 워크플로우

### Git 커밋 전략
- **태스크 기반 커밋**: 하나의 태스크 = 하나의 커밋
- **명확한 커밋 메시지**: "why" 중심 설명
- **사용자 확인 후 커밋**: 변경사항 적용 전 확인

### 코드 변경 프로세스
1. 관련 파일 분석 및 이해
2. 변경사항 구현
3. 린트 실행 (`pnpm lint`)
4. 타입 체크 (TypeScript 컴파일러)
5. 사용자 확인 후 커밋

## 보안 및 성능

### 보안
- 환경변수로 민감정보 관리
- 사용자 입력 검증 및 이스케이핑
- HTTPS 강제 사용

### 성능
- 정적 생성 활용 (`generateStaticParams`)
- 이미지 최적화 (Next.js Image 컴포넌트)
- 불필요한 클라이언트 컴포넌트 피하기

## 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 상세 정보

---

이 가이드라인은 프로젝트의 일관성과 품질을 유지하기 위해 만들어졌습니다. 코드 작성 시 이 가이드라인을 준수해 주세요.