"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="mt-16">
      {/* 그라디언트 구분선 */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 mt-8 mb-2">
        <svg
          className="w-5 h-5 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-foreground">댓글</h2>
      </div>

      {/* Giscus 위젯 */}
      <Giscus
        id="comments"
        repo="JaeHyunGround/dev-blog"
        repoId="R_kgDOQ10-Ug"
        category="General"
        categoryId="DIC_kwDOQ10-Us4C4I9P"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}
