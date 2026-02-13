import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "안재현에 대해 소개합니다.",
};

const skills = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "Tanstack-Query", "Zustand"],
  },
  {
    category: "UI & Design",
    items: ["Tailwind CSS", "Styled-components", "Storybook", "Chromatic"],
  },
  {
    category: "Testing",
    items: [
      "Jest",
      "React Testing Library",
      "Cypress",
      "Playwright",
      "Vitest",
      "MSW",
    ],
  },
];

const experiences = [
  {
    company: "스카이벤처스",
    position: "Frontend Engineer",
    period: "2025.03 ~ 현재",
    isCurrent: true,
    projects: [
      {
        name: "중타 - 중고 타이어 & 부품 거래 플랫폼",
        descriptions: [
          "퍼널 패턴을 제안·도입해 입력 플로우를 단계형 구조로 개선",
          "UI와 비즈니스 로직 레이어 분리, Custom Hook 기반 로직 관리로 유지보수성 개선",
          "Sentry 도입으로 프로덕션 환경 에러 모니터링 환경 구성 및 전역 Error Boundary 적용",
          "웹뷰 기반 정적 페이지 연동으로 앱 업데이트 없이 정책 변경 대응 가능하도록 개선",
        ],
      },
      {
        name: "BBQ 자사 서비스 운영 및 이벤트 페이지 개발",
        descriptions: [
          "Cypress 기반 E2E 테스트로 핵심 사용자 시나리오 자동 검증",
          "Jest 기반 단위 테스트 및 Storybook·Chromatic 기반 시각적 회귀 테스트 도입",
          "바르셀로나 내한 경기 티켓 추첨 이벤트 페이지 개발 (GSAP 애니메이션 적용)",
        ],
      },
      {
        name: "애플꼬마김밥 어드민 페이지",
        descriptions: [
          "Tiptap 기반 텍스트 에디터 구현 및 YouTube iframe 임베드 기능 구현 (XSS 방지 유지)",
          "Zustand 기반 전역 Toast UI 시스템 구축",
        ],
      },
    ],
  },
];

const sideProjects = [
  {
    name: "dear moment",
    description: "딱 맞는 웨딩 스냅 작가를 찾을 수 있도록 매칭을 돕는 서비스",
    details: [
      "Next.js 미들웨어 기반 쿠키 JWT 인증 및 접근 제어 로직 구현",
      "Canvas API 기반 이미지 리사이징 및 손실 압축으로 네트워크 부하 감소",
    ],
  },
  {
    name: "kiwing",
    description:
      "면접 준비를 돕기 위한 서비스로, 효율적이고 빠르게 면접을 준비할 수 있는 기능 제공",
    details: [
      "Auth HOC와 자동 로그인 기능 구현",
      "재사용성과 접근성을 고려한 공통 UI 컴포넌트 구조 설계",
      "MSW를 활용한 API 사전 테스트 환경 구성으로 백엔드 협업 효율화",
    ],
  },
];

const activities = [
  {
    name: "항해 플러스 프론트엔드 7기",
    period: "2025.10 ~ 2025.12",
    description:
      "TDD 사이클 수행, Vanilla JS 기반 SPA 구현, FSD 아키텍처 적용, 성능 최적화 경험. 팀장으로 활동하며 소통상 수상",
  },
  {
    name: "프로그래머스 데브코스 프론트엔드 5기",
    period: "2023.09 ~ 2024.03",
    description:
      "TypeScript·React 기반 프론트엔드 과정 이수, 2건의 팀 프로젝트를 통해 실무 역량 확보",
  },
  {
    name: "멋쟁이사자처럼 10, 11기",
    period: "",
    description:
      "프론트엔드 운영진 및 학교 대표로 활동하며 HTML/CSS, JavaScript, React 교육과 스터디 주도",
  },
];

const contacts = [
  {
    name: "GitHub",
    href: "https://github.com/JaeHyunGround",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/jaehyun-ahn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Resume",
    href: "https://www.figma.com/design/2idIf2EJFer4NbdejZG6is/2026-%EC%95%88%EC%9E%AC%ED%98%84-%EC%9D%B4%EB%A0%A5%EC%84%9C?node-id=0-1&t=39irpSmyjxM4kNOb-1",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:gothddlek@naver.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">JH</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">안재현</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Frontend Developer
        </p>
        <div className="flex justify-center gap-3">
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={contact.name}
            >
              {contact.icon}
            </a>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Introduction
        </h2>
        <div className="p-6 rounded-lg bg-muted/50 border border-border space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            사용자 흐름과 서비스 구조를 기준으로 문제를 정의하며 프론트엔드
            개발을 해왔습니다.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            입력 플로우, 상태 관리, 에러 대응 등 화면 단위 구현을 넘어 서비스
            전반의 안정성과 유지보수성을 개선하는 작업을 주로 담당했습니다.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            기능 요구사항을 그대로 구현하기보다, 사용자가 실제로 겪는 불편과 운영
            과정에서 발생하는 리스크를 기준으로 구조를 정리하고 개선하는 방식으로
            일해왔습니다.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            또한 지식이 개인에게 머무르지 않도록, 사내 개발 아티클 공유를
            제안·시작하며 팀 내 지식 공유에 기여해왔습니다.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Skills
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <div
              key={skill.category}
              className="p-5 rounded-lg bg-muted/50 border border-border"
            >
              <h3 className="font-medium mb-3 text-foreground">
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-sm rounded-md bg-background border border-border text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Work Experience
        </h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>

              <div className="p-5 rounded-lg bg-muted/50 border border-border">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {exp.company}
                  </h3>
                  {exp.isCurrent && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                      현재 재직중
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {exp.position}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {exp.period}
                </p>

                <div className="space-y-4">
                  {exp.projects.map((project, pIndex) => (
                    <div
                      key={pIndex}
                      className="p-3 rounded-md bg-background/50 border border-border"
                    >
                      <h4 className="font-medium text-sm text-foreground mb-2">
                        {project.name}
                      </h4>
                      <ul className="space-y-1">
                        {project.descriptions.map((desc, dIndex) => (
                          <li
                            key={dIndex}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Side Projects */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Side Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sideProjects.map((project, index) => (
            <div
              key={index}
              className="p-5 rounded-lg bg-muted/50 border border-border"
            >
              <h3 className="font-semibold text-foreground mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {project.description}
              </p>
              <ul className="space-y-1">
                {project.details.map((detail, dIndex) => (
                  <li
                    key={dIndex}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Activities & Education */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Activities & Education
        </h2>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{activity.name}</h3>
                {activity.period && (
                  <span className="text-xs text-muted-foreground">
                    {activity.period}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
            </div>
          ))}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">
                금오공과대학교 전자IT융합전공
              </h3>
              <span className="text-xs text-muted-foreground">
                2020.03 ~ 2024.02
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              학점 4.1 / 4.5 (수석 졸업)
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          블로그 글 보러가기
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </section>
    </div>
  );
}
