import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col items-center justify-center text-center">
        <svg
          className="h-16 w-16 text-muted-foreground mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          포스트를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground mb-8">
          요청하신 포스트가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
