# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**한국어로 답변하세요**

## Project Overview

This is a Next.js 14+ personal blog project with SEO optimization, built using the **Content Provider Pattern** for flexible content source management. The blog allows switching between different content sources (MDX files, Obsidian) through an adapter pattern interface.

**Current Status**: Phase 1 in progress - Basic blog implementation with MDX content management.

## Technology Stack

| Category       | Technology                                       |
| -------------- | ------------------------------------------------ |
| Framework      | Next.js 14+ (App Router)                         |
| Language       | TypeScript                                       |
| Styling        | Tailwind CSS                                     |
| Content Source | MDX (Phase 1) → Notion CMS (Phase 2)            |
| Comments       | giscus (GitHub Discussions)                      |
| Deployment     | Vercel                                           |
| Markdown       | react-markdown, remark-gfm, rehype-highlight     |

## Architecture: Content Provider Pattern

The core architectural pattern is an **adapter-based Content Provider interface** that allows seamless switching between content sources.

### Key Interfaces

```typescript
// lib/content/types.ts
interface Post {
  slug: string;
  title: string;
  content: string; // markdown raw
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  thumbnail?: string;
}

interface ContentProvider {
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
  getAllTags(): Promise<string[]>;
  getPostsByTag(tag: string): Promise<Post[]>;
  // Phase 2: Notion migration
  syncFromNotion?(): Promise<void>;
  createPost?(post: Partial<Post>): Promise<Post>;
  updatePost?(slug: string, post: Partial<Post>): Promise<Post>;
  deletePost?(slug: string): Promise<void>;
}
```

### Provider Selection

```typescript
// lib/content/index.ts
const provider =
  process.env.CONTENT_PROVIDER === "notion"
    ? new NotionProvider()
    : new MDXProvider();
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with dark mode
│   ├── page.tsx              # Home (post list)
│   ├── posts/
│   │   └── [slug]/page.tsx   # Post detail
│   └── tags/
│       └── [tag]/page.tsx    # Posts by tag
├── components/
│   ├── common/               # Reusable components
│   ├── post/                 # Post-related components
│   └── layout/               # Layout components
├── lib/
│   ├── content/              # Content Provider
│   │   ├── types.ts
│   │   ├── index.ts
│   │   ├── mdx-provider.ts
│   │   └── notion-provider.ts (Phase 2)
│   └── utils/                # Utility functions
├── content/
│   └── posts/                # MDX files (Phase 1)
└── public/
    └── images/               # Static images
```

## Development Phases

### Phase 1: MDX-based Blog (Current)
- MDX files in `content/posts/`
- Code-level content management
- Basic blog features (list, detail, tags)
- Dark mode with next-themes
- Reference design implementation (zoomkod.ing inspired)

### Phase 2: Notion CMS Migration
- Notion API integration
- Notion database as content source
- Automatic content sync from Notion
- Rich text block conversion to Markdown
- Image URL handling from Notion CDN

### Phase 3: SEO & Image Management
- sitemap.xml, robots.txt
- RSS feed
- OG image generation
- Image optimization

### Phase 4: UX Enhancements
- Reading time
- Code copy buttons
- Related posts
- Table of contents
- Social sharing

## Common Patterns and Conventions

### Component Organization

- Use Server Components by default
- Client Components only when needed ('use client')
- Co-locate components with their pages when possible

### Content Provider Usage

All content operations go through the provider interface, never directly accessing the data source:

```typescript
// Good
const provider = await getContentProvider();
const posts = await provider.getAllPosts();

// Bad - don't access data sources directly
const files = fs.readdirSync("./content/posts");
```

### Static Generation with ISR

Posts use static generation with Incremental Static Regeneration:

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const provider = await getContentProvider();
  const posts = await provider.getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### Dark Mode Implementation

Uses `next-themes` with Tailwind's class-based dark mode:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class",
  // ...
};
```

### Markdown Frontmatter Format

```yaml
---
title: "Post Title"
excerpt: "Post summary"
publishedAt: "2025-01-02"
tags: ["next.js", "blog"]
thumbnail: "/images/post.png" # optional
updatedAt: "2025-01-09" # optional
---
```

## Design Reference

Design inspired by [zoomkod.ing](https://zoomkod.ing/):

- **Layout**: Centered 720px max-width container
- **Colors**: CSS custom properties for light/dark themes
- **Typography**: System fonts + display font (Montserrat alternative)
- **Components**: Clean card design, minimal navigation
- **Responsive**: Mobile-first with 768px breakpoint

Key Tailwind adaptations:
```javascript
// tailwind.config.js
theme: {
  extend: {
    maxWidth: {
      'content': '720px',
    },
    colors: {
      // Custom color tokens from reference
    },
  },
}
```

## Important Notes

### Content Provider Implementation

When implementing providers:

1. **MDX Provider (Phase 1)**:
   - Read MDX files from `content/posts/`
   - Use `gray-matter` for frontmatter parsing
   - Use `next-mdx-remote` for rendering
   - Sort posts by `publishedAt` (newest first)

2. **Notion Provider (Phase 2)**:
   - Connect to Notion API using official SDK
   - Query Notion database for published posts
   - Convert Notion blocks to Markdown
   - Handle Notion images and embed URLs
   - Cache results for performance

### SEO Best Practices

- Dynamic `generateMetadata` for each post
- Sitemap includes all posts, tags, and static pages
- OG images generated dynamically
- RSS feed available at `/feed.xml`

### Task-based Git Workflow

- One task = One commit
- Wait for user confirmation before proceeding to next task
- Clear commit messages describing the completed task

## Future Improvements

See `docs/IMPROVEMENT_PLAN.md` for detailed enhancement ideas:

- Tag rarity weighting for related posts
- Full-text search (Fuse.js or Algolia)
- Series/category support
- View count tracking
- Newsletter integration
