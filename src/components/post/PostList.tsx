import type { Post } from '@/lib/content/types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  emptyMessage?: string;
}

export function PostList({
  posts,
  emptyMessage = '포스트가 없습니다.',
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            {emptyMessage}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            아직 작성된 포스트가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
