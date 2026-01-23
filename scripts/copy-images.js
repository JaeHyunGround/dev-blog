/**
 * content/posts 폴더의 이미지를 public/images/posts로 복사하는 스크립트
 * 빌드 전에 실행됩니다.
 */
const fs = require("fs");
const path = require("path");

const CONTENT_POSTS_DIR = path.join(process.cwd(), "content/posts");
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public/images/posts");

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

function copyImages() {
  if (!fs.existsSync(CONTENT_POSTS_DIR)) {
    console.log("content/posts 폴더가 없습니다.");
    return;
  }

  const entries = fs.readdirSync(CONTENT_POSTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const postDir = path.join(CONTENT_POSTS_DIR, entry.name);
      const targetDir = path.join(PUBLIC_IMAGES_DIR, entry.name);

      const files = fs.readdirSync(postDir);
      const imageFiles = files.filter(isImageFile);

      if (imageFiles.length > 0) {
        ensureDir(targetDir);

        for (const imageFile of imageFiles) {
          const srcPath = path.join(postDir, imageFile);
          const destPath = path.join(targetDir, imageFile);

          fs.copyFileSync(srcPath, destPath);
          console.log(`복사: ${entry.name}/${imageFile}`);
        }
      }
    }
  }

  console.log("이미지 복사 완료!");
}

copyImages();
