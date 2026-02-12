import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
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
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
