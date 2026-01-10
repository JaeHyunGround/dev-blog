import { getContentProvider } from '@/lib/content';
import { PostList } from '@/components/post/PostList';

export const revalidate = 3600; // 1시간마다 재생성

export const metadata = {
  title: 'All Posts',
  description: '모든 블로그 포스트 목록',
};

export default async function PostsPage() {
  const provider = getContentProvider();
  const posts = await provider.getAllPosts();

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          All Posts
        </h1>
        <p className="text-lg text-muted-foreground">
          총 {posts.length}개의 포스트
        </p>
      </div>

      {/* All Posts */}
      <section>
        <PostList posts={posts} />
      </section>
    </div>
  );
}
