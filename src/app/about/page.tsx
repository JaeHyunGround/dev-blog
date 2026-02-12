import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "안재현에 대해 소개합니다.",
};

const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    category: "Backend & Database",
    items: ["Node.js", "Express", "PostgreSQL", "Prisma"],
  },
  {
    category: "Tools & Platform",
    items: ["Git", "GitHub", "Vercel", "VS Code", "Figma"],
  },
];

const experiences = [
  {
    company: "회사명",
    position: "Frontend Developer",
    period: "2024.01 - 현재",
    isCurrent: true,
    description: "웹 프론트엔드 개발 담당",
    projects: [
      {
        name: "프로젝트 A",
        description: "사용자 대시보드 개발 및 유지보수",
        skills: ["React", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "프로젝트 B",
        description: "어드민 페이지 리뉴얼",
        skills: ["Next.js", "Zustand"],
      },
    ],
  },
];

const contacts = [
  {
    name: "GitHub",
    href: "https://github.com/ahnjaehyun",
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
    name: "Email",
    href: "mailto:your-email@example.com",
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
        <p className="text-muted-foreground text-lg mb-6">Software Developer</p>
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
        <div className="p-6 rounded-lg bg-muted/50 border border-border">
          <p className="text-muted-foreground leading-relaxed">
            안녕하세요, 소프트웨어 개발자 안재현입니다. 주로 웹 개발을 하며,
            새로운 기술을 배우고 적용하는 것을 좋아합니다. 사용자 경험을
            개선하고 깔끔한 코드를 작성하는 데 관심이 많습니다.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Skills
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
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

      {/* Experience */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary"></span>
          Experience
        </h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-border">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>

              <div className="p-5 rounded-lg bg-muted/50 border border-border">
                {/* Header */}
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

                {/* Description */}
                <p className="text-muted-foreground mb-4">{exp.description}</p>

                {/* Projects */}
                <div className="space-y-3">
                  {exp.projects.map((project, pIndex) => (
                    <div
                      key={pIndex}
                      className="p-3 rounded-md bg-background/50 border border-border"
                    >
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {project.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
