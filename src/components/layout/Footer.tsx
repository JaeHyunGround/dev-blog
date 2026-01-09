import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* About Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                About
              </h3>
              <p className="text-sm text-muted-foreground">
                Next.js와 MDX로 만든 개인 기술 블로그입니다.
              </p>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/posts"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tags"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tags
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Social
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@example.com"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Dev Blog. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Built with{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Next.js
              </a>{' '}
              and{' '}
              <a
                href="https://mdxjs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                MDX
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
