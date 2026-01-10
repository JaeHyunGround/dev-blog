import { notFound } from "next/navigation";
import { getContentProvider } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "../../../../mdx-components";
import Link from "next/link";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { formatReadingTime } from "@/lib/utils/reading-time";

export const revalidate = 3600; // 1시간마다 재생성

interface PostPageProps {
  params: {
    slug: string;
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const provider = getContentProvider();
  const posts = await provider.getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getContentProvider();
  const post = await provider.getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "Dev Blog" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const provider = getContentProvider();
  const post = await provider.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-8 pb-8 border-b border-border">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4 text-sm">
          <time dateTime={post.publishedAt}>
            {formattedDate}
          </time>
          <span>·</span>
          <span>{formatReadingTime(post.readingTime)}</span>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              <span>·</span>
              <span>
                최종 수정:{" "}
                {new Date(post.updatedAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* MDX Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                rehypeAutolinkHeadings,
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark-dimmed",
                    keepBackground: true,
                    defaultLang: "plaintext",
                  },
                ],
              ],
            },
          }}
        />
      </div>

      {/* Footer Navigation */}
      <footer className="mt-12 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로 돌아가기
        </Link>
      </footer>
    </article>
  );
}
