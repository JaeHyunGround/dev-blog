import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: false,
  },
};

const withMDX = createMDX({
  // MDX 설정 옵션은 여기서 제외하고, 별도로 remark/rehype 플러그인을 설정
});

export default withMDX(nextConfig);
