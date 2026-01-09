# 블로그 개발 로드맵

> Next.js 14+ 기반 개인 기술 블로그 구축 계획

---

## 프로젝트 개요

**목표**: Content Provider 패턴을 활용한 유연한 블로그 시스템 구축

**핵심 아키텍처**: Adapter 패턴으로 다양한 컨텐츠 소스 지원

```
┌─────────────────────────────────────────┐
│         Next.js Application             │
├─────────────────────────────────────────┤
│       ContentProvider Interface         │
├──────────────┬──────────────────────────┤
│ MDXProvider  │  ObsidianProvider        │
│  (Phase 1)   │    (Phase 2)             │
└──────────────┴──────────────────────────┘
```

---

## 개발 단계

### Phase 1: MDX 기반 블로그 구축 ✅ (진행 예정)

**목표**: 코드 레벨에서 MDX로 컨텐츠 관리

**주요 기능**:
- Next.js 14+ App Router
- MDX 파일 기반 포스트 관리
- 포스트 목록/상세 페이지
- 태그 시스템
- 다크모드 (next-themes)
- utterances 댓글
- Tailwind CSS + Typography
- Vercel 배포

**기술 스택**:
```typescript
{
  "framework": "Next.js 14+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "content": "MDX (@next/mdx)",
  "markdown": "remark-gfm, rehype-highlight"
}
```

**디렉토리 구조**:
```
content/
└── posts/
    ├── first-post.mdx
    └── second-post.mdx
```

📄 **상세 문서**: [PHASE_1.md](./PHASE_1.md)

---

### Phase 2: Obsidian CMS 마이그레이션 🔄 (예정)

**목표**: MDX → Obsidian 기반 CMS로 전환

**주요 작업**:
- ObsidianProvider 구현
- Wiki-link 변환 (`[[Page]]` → `[Page](/posts/slug)`)
- 이미지 첨부파일 처리 (`![[image.png]]`)
- MDX 제거, Markdown으로 전환
- Obsidian vault 설정

**마이그레이션 전략**:
```typescript
// Before (Phase 1)
import { MDXProvider } from './mdx-provider';
export const provider = new MDXProvider();

// After (Phase 2)
import { ObsidianProvider } from './obsidian-provider';
export const provider = new ObsidianProvider();
```

**워크플로우**:
```
Obsidian에서 포스트 작성
  ↓
Git commit & push
  ↓
Vercel 자동 배포
  ↓
블로그에 반영
```

📄 **상세 문서**: [PHASE_2.md](./PHASE_2.md)

---

### Phase 3: SEO 강화 및 이미지 관리 📈 (예정)

**목표**: 검색 엔진 최적화 및 이미지 업로드 시스템

**주요 기능**:
- Sitemap 자동 생성
- robots.txt 설정
- RSS Feed
- OG 이미지 자동 생성 (@vercel/og)
- 썸네일 업로드
- 이미지 최적화 (next/image)

**SEO 체크리스트**:
- [ ] `/sitemap.xml` 생성
- [ ] `/feed.xml` RSS 피드
- [ ] 동적 OG 이미지
- [ ] 메타데이터 최적화
- [ ] Google Search Console 연동

📄 **상세 문서**: [PHASE_3.md](./PHASE_3.md)

---

### Phase 4: 사용자 경험 강화 ✨ (예정)

**목표**: 블로그 운영 필수 기능 완성

**주요 기능**:
- 읽기 시간 표시
- 코드 복사 버튼
- 관련 포스트 추천 (태그 기반)
- 소셜 공유 버튼
- 이전/다음 포스트 네비게이션
- 목차 (Table of Contents)
- 무한 스크롤

**UX 개선 포인트**:
```typescript
// 읽기 시간 계산
calculateReadingTime(content) // "5분 읽기"

// 관련 포스트 알고리즘
tagBasedRecommendation(currentPost, allPosts) // 최대 3개

// TOC 자동 생성
extractToc(markdown) // h2, h3 추출
```

📄 **상세 문서**: [PHASE_4.md](./PHASE_4.md)

---

## 향후 개선 계획

**상세 계획**: [IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md)

### 우선순위 High ⭐⭐⭐
1. **관련 포스트 고도화**
   - 태그 희소성 기반 가중치
   - TF-IDF 콘텐츠 유사도
   - 시리즈/카테고리 연결

2. **검색 기능**
   - 클라이언트 사이드 검색 (Fuse.js)
   - 전문 검색 (Algolia - 선택)

### 우선순위 Medium ⭐⭐
3. **포스트 시리즈/카테고리**
4. **조회수 통계** (Vercel KV)
5. **Draft/Published 상태 관리**

### 우선순위 Low ⭐
6. **뉴스레터 구독**
7. **다국어 지원 (i18n)**
8. **성능 최적화**
9. **접근성 (a11y) 개선**

---

## 기술 스택 전체 구성

### Frontend
```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui": "Headless UI (선택)",
  "markdown": "react-markdown, remark-gfm, rehype-highlight",
  "theme": "next-themes"
}
```

### Content Management
```json
{
  "phase1": "MDX (@next/mdx)",
  "phase2": "Obsidian (Markdown)",
  "provider": "Content Provider Pattern"
}
```

### Deployment
```json
{
  "platform": "Vercel",
  "ci_cd": "GitHub Actions (자동 배포)",
  "storage": "Vercel Blob (이미지)",
  "analytics": "Vercel Analytics (선택)"
}
```

### Optional Services
```json
{
  "comments": "utterances (GitHub Issues)",
  "search": "Algolia (선택)",
  "newsletter": "Buttondown (선택)",
  "analytics": "Google Analytics (선택)"
}
```

---

## 개발 원칙

### 1. Content Provider 패턴 준수
모든 컨텐츠 접근은 Provider 인터페이스를 통해서만 이루어짐

```typescript
// Good
const provider = await getContentProvider();
const posts = await provider.getAllPosts();

// Bad
const files = fs.readdirSync('./content/posts');
```

### 2. Server Components 우선
- 기본적으로 Server Components 사용
- 클라이언트 인터랙션 필요 시에만 'use client'

### 3. Static Generation + ISR
- 포스트는 빌드 타임에 정적 생성
- ISR로 주기적 재생성 (revalidate)

### 4. SEO 최우선
- 모든 페이지에 적절한 메타데이터
- Open Graph, Twitter Card 지원
- sitemap, RSS 필수

### 5. 반응형 디자인
- Mobile-first 접근
- 레퍼런스 디자인 (zoomkod.ing) 기반
- 720px max-width 중앙 레이아웃

---

## 마일스톤

### Milestone 1: 기본 블로그 (Phase 1) 🎯
**예상 기간**: 2주
- [x] 프로젝트 초기 설정
- [ ] MDX Provider 구현
- [ ] 포스트 목록/상세 페이지
- [ ] 다크모드
- [ ] Vercel 배포

### Milestone 2: Obsidian 전환 (Phase 2)
**예상 기간**: 1주
- [ ] ObsidianProvider 구현
- [ ] Wiki-link 변환
- [ ] 이미지 처리
- [ ] 워크플로우 테스트

### Milestone 3: SEO 최적화 (Phase 3)
**예상 기간**: 1주
- [ ] Sitemap/RSS
- [ ] OG 이미지
- [ ] 이미지 최적화

### Milestone 4: UX 강화 (Phase 4)
**예상 기간**: 1-2주
- [ ] 읽기 시간, 코드 복사 등
- [ ] 관련 포스트
- [ ] TOC, 무한 스크롤

---

## 참고 자료

### 공식 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/)
- [Obsidian Help](https://help.obsidian.md/)

### 레퍼런스 블로그
- [zoomkod.ing](https://zoomkod.ing/) - 디자인 레퍼런스
- [Neil Mathew - Obsidian CMS](https://www.neilmathew.co/posts/nextjs-blog-with-obsidian-as-cms)

### 라이브러리
- [next-themes](https://github.com/pacocoursey/next-themes)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [utterances](https://utteranc.es/)
- [Fuse.js](https://fusejs.io/)

---

## 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
```

**예시**:
```
feat: Add MDX Provider implementation
fix: Fix wiki-link conversion regex
docs: Update PHASE_1.md
```

---

## 라이센스

MIT License

---

## Contact

- GitHub: [your-github]
- Email: [your-email]
- Blog: [your-blog-url]
