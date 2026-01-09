import { getContentProvider } from '@/lib/content';
import { PostList } from '@/components/post/PostList';

export const revalidate = 3600; // 1시간마다 재생성

export default async function HomePage() {
  const provider = getContentProvider();
  const posts = await provider.getAllPosts();

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
            총 {posts.length}개
          </span>
        </div>
        <PostList posts={posts} />
      </section>
    </div>
  );
}
