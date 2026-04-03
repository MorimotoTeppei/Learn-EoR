import Link from "next/link";
import { TOPICS } from "@/data/topics";
import Navbar from "@/components/Navbar";

const DIFFICULTY_STYLES: Record<string, string> = {
  入門: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  基礎: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  応用: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  発展: "bg-red-500/10 text-red-400 border border-red-500/30",
};

export default function TopicsPage() {
  const grouped = (["入門", "基礎", "応用", "発展"] as const).map((d) => ({
    difficulty: d,
    topics: TOPICS.filter((t) => t.difficulty === d),
  }));

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <nav className="flex items-center gap-1.5 text-xs text-[#6e7681] mb-6">
          <Link href="/" className="hover:text-[#e6edf3] transition-colors">ホーム</Link>
          <span>/</span>
          <span className="text-[#8b949e]">トピック一覧</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">トピック一覧</h1>
          <p className="text-[#8b949e] text-sm">難易度別に整理された宇宙再電離の学習コンテンツ</p>
        </div>

        <div className="space-y-10">
          {grouped.map(({ difficulty, topics }) => (
            <div key={difficulty}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_STYLES[difficulty]}`}>
                  {difficulty}
                </span>
                <div className="flex-1 h-px bg-[#21262d]" />
                <span className="text-xs text-[#6e7681]">{topics.length} トピック</span>
              </div>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <Link key={topic.id} href={topic.href} className="group block">
                    <div className="px-5 py-4 border border-[#21262d] rounded-lg bg-[#161b22] hover:border-[#30363d] hover:bg-[#1c2128] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base text-[#6e7681]">{topic.icon}</span>
                            <h2 className="text-sm font-semibold text-[#e6edf3] group-hover:text-indigo-400 transition-colors">
                              {topic.title}
                            </h2>
                          </div>
                          <p className="text-xs text-[#6e7681] font-mono mb-2">{topic.titleEn}</p>
                          <p className="text-xs text-[#8b949e] leading-relaxed line-clamp-2">{topic.description}</p>
                        </div>
                        <div className="shrink-0 text-xs text-[#6e7681] group-hover:text-indigo-400 transition-colors pt-1">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
