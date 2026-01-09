import { getContentProvider } from '@/lib/content';
import { PostList } from '@/components/post/PostList';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600; // 1시간마다 재생성

interface TagPageProps {
  params: {
    tag: string;
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const provider = getContentProvider();
  const tags = await provider.getAllTags();

  return tags.map((tag) => ({
    tag: tag,
  }));
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag: tagParam } = await params;
  const tag = decodeURIComponent(tagParam);

  return {
    title: `${tag} 태그`,
    description: `${tag} 태그가 포함된 포스트 목록`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagParam } = await params;
  const tag = decodeURIComponent(tagParam);
  const provider = getContentProvider();

  // 태그로 포스트 필터링
  const posts = await provider.getPostsByTag(tag);

  // 태그가 존재하지 않으면 404
  if (posts.length === 0) {
    const allTags = await provider.getAllTags();
    if (!allTags.includes(tag)) {
      notFound();
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Tag Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏷️</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            {tag}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          총 {posts.length}개의 포스트
        </p>
      </div>

      {/* Posts List */}
      <PostList
        posts={posts}
        emptyMessage={`'${tag}' 태그가 포함된 포스트가 없습니다.`}
      />
    </div>
  );
}
