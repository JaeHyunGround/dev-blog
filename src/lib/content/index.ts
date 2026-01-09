import { ContentProvider } from "./types";
import { MDXProvider } from "./mdx-provider";

// Phase 2: Obsidian Provider 추가 예정
// import { ObsidianProvider } from "./obsidian-provider";

/**
 * 환경 변수에 따라 적절한 Content Provider를 반환합니다
 *
 * CONTENT_PROVIDER 환경 변수:
 * - "mdx" (기본값): MDX 파일 기반 Provider
 * - "obsidian" (Phase 2): Obsidian vault 기반 Provider
 */
export function getContentProvider(): ContentProvider {
  const providerType = process.env.CONTENT_PROVIDER || "mdx";

  switch (providerType) {
    case "mdx":
      return new MDXProvider();
    // Phase 2: Obsidian Provider
    // case "obsidian":
    //   return new ObsidianProvider();
    default:
      console.warn(
        `Unknown provider type: ${providerType}. Falling back to MDX provider.`
      );
      return new MDXProvider();
  }
}

// 타입 및 Provider 클래스 export
export * from "./types";
export { MDXProvider } from "./mdx-provider";
