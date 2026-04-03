import Link from "next/link";
import Navbar from "@/components/Navbar";

const DIFFICULTY_STYLES: Record<string, string> = {
  入門: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  基礎: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  応用: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  発展: "bg-red-500/10 text-red-400 border border-red-500/30",
};

interface Props {
  icon: string;
  title: string;
  titleEn: string;
  difficulty: string;
  difficultyColor: string;
  description: string;
  sections: { heading: string; body: string }[];
  accentColor: string;
  relatedTopics: { title: string; href: string; desc: string }[];
}

export default function TopicStub({
  icon, title, titleEn, difficulty,
  description, sections, relatedTopics,
}: Props) {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6e7681] mb-6">
          <Link href="/" className="hover:text-[#e6edf3] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/topics" className="hover:text-[#e6edf3] transition-colors">トピック</Link>
          <span>/</span>
          <span className="text-[#8b949e]">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Article content */}
          <article className="flex-1 min-w-0">

            {/* Header */}
            <header className="mb-8 pb-6 border-b border-[#21262d]">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_STYLES[difficulty]}`}>
                  {difficulty}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e6edf3] mb-1 leading-tight">
                {icon} {title}
              </h1>
              <p className="text-sm text-[#6e7681] font-mono">{titleEn}</p>
            </header>

            {/* Overview */}
            <section className="mb-8">
              <p className="text-[#c9d1d9] text-sm leading-relaxed">{description}</p>
            </section>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((s, i) => (
                <section key={i} id={`section-${i}`}>
                  <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#6e7681] w-6">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  <p className="text-[#c9d1d9] text-sm leading-relaxed">{s.body}</p>
                </section>
              ))}
            </div>

            {/* Related topics */}
            <div className="mt-12 pt-8 border-t border-[#21262d]">
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">関連トピック</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedTopics.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="block p-4 border border-[#21262d] rounded-lg bg-[#161b22] hover:border-[#30363d] hover:bg-[#1c2128] transition-colors group"
                  >
                    <div className="text-sm font-medium text-[#e6edf3] group-hover:text-indigo-400 transition-colors mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6e7681]">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>

          </article>

          {/* Sidebar TOC */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20">
              <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-4">
                <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">目次</h3>
                <nav className="space-y-1">
                  {sections.map((s, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="flex items-start gap-2 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors py-1"
                    >
                      <span className="font-mono text-[#6e7681] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="leading-relaxed">{s.heading}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
