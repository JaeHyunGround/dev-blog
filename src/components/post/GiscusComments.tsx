"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="mt-12 pt-8 border-t border-border">
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
