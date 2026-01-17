import Link from "next/link";
import type { Post } from "@/lib/content/types";
import { formatReadingTime } from "@/lib/utils/reading-time";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group rounded-lg border border-border bg-background p-6 transition-all hover:border-primary hover:shadow-lg">
      {/* Title */}
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

      {/* Meta Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Date & Reading Time */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt}>{formattedDate}</time>
          <span>·</span>
          <span>{formatReadingTime(post.readingTime)}</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
