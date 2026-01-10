import Link from 'next/link';
import { getContentProvider } from '@/lib/content';
import { PostList } from '@/components/post/PostList';

export const revalidate = 3600; // 1시간마다 재생성

export default async function HomePage() {
  const provider = getContentProvider();
  const allPosts = await provider.getAllPosts();
  const recentPosts = allPosts.slice(0, 5);

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Dev Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Next.js와 MDX로 작성하는 개인 기술 블로그
        </p>
      </div>

      {/* Latest Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">최신 포스트</h2>
          <span className="text-sm text-muted-foreground">
            최근 {recentPosts.length}개
          </span>
        </div>
        <PostList posts={recentPosts} />

        {/* View All Posts Link */}
        {allPosts.length > 5 && (
          <div className="mt-8 text-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              모든 글 보기
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
