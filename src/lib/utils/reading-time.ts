/**
 * Calculate reading time for blog posts
 *
 * Algorithm:
 * - Remove code blocks (they are read slower than text)
 * - Korean: ~400 characters per minute
 * - English: ~200 words per minute
 * - Minimum 1 minute
 */

const KOREAN_CHARS_PER_MIN = 400;
const ENGLISH_WORDS_PER_MIN = 200;

export function calculateReadingTime(content: string): number {
  // Remove code blocks (```...```)
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`...`)
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, '');

  // Remove markdown links, images, and other syntax
  const cleanText = withoutInlineCode
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
    .replace(/#{1,6}\s/g, '') // Remove heading markers
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s/gm, ''); // Remove numbered list markers

  // Count Korean characters (hangul)
  const koreanChars = (cleanText.match(/[가-힣]/g) || []).length;

  // Count English words (exclude Korean)
  const englishText = cleanText.replace(/[가-힣]/g, ' ');
  const englishWords = englishText
    .split(/\s+/)
    .filter(word => word.length > 0 && /[a-zA-Z]/.test(word))
    .length;

  // Calculate reading time
  const koreanTime = koreanChars / KOREAN_CHARS_PER_MIN;
  const englishTime = englishWords / ENGLISH_WORDS_PER_MIN;
  const totalMinutes = koreanTime + englishTime;

  // Round up and ensure minimum 1 minute
  return Math.max(1, Math.ceil(totalMinutes));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes}분 읽기`;
}
