"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TOPICS, searchTopics, type Topic, type Difficulty } from "@/data/topics";
import Navbar from "@/components/Navbar";

const DIFFICULTY_STYLES: Record<Difficulty, { label: string; className: string }> = {
  入門: { label: "入門", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" },
  基礎: { label: "基礎", className: "bg-blue-500/10 text-blue-400 border border-blue-500/30" },
  応用: { label: "応用", className: "bg-amber-500/10 text-amber-400 border border-amber-500/30" },
  発展: { label: "発展", className: "bg-red-500/10 text-red-400 border border-red-500/30" },
};

const FILTER_TABS: Array<Difficulty | "すべて"> = ["すべて", "入門", "基礎", "応用", "発展"];

function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

function TopicRow({ topic, query }: { topic: Topic; query: string }) {
  const diff = DIFFICULTY_STYLES[topic.difficulty];
  return (
    <Link href={topic.href} className="group block">
      <article className="px-5 py-4 border border-[#21262d] rounded-lg bg-[#161b22] hover:border-[#30363d] hover:bg-[#1c2128] transition-colors duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2
              className="text-[#e6edf3] font-semibold text-base group-hover:text-indigo-400 transition-colors duration-300 leading-snug mb-1"
              dangerouslySetInnerHTML={{ __html: highlight(topic.title, query) }}
            />
            <p className="text-xs text-[#6e7681] font-mono mb-2">{topic.titleEn}</p>
            <p
              className="text-sm text-[#8b949e] leading-relaxed line-clamp-2 mb-3"
              dangerouslySetInnerHTML={{ __html: highlight(topic.description, query) }}
            />
            <div className="flex flex-wrap gap-1.5">
              {topic.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.className}`}>
              {diff.label}
            </span>
            <span className="text-xs text-[#6e7681] group-hover:text-indigo-400 transition-colors whitespace-nowrap">
              読む →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Difficulty | "すべて">("すべて");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = searchTopics(query).filter(
    (t) => activeFilter === "すべて" || t.difficulty === activeFilter
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">
            Learn EoR
          </h1>
          <p className="text-[#8b949e] text-sm">
            宇宙再電離（Epoch of Reionization）をインタラクティブに学ぶ学習プラットフォーム
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main column */}
          <div className="flex-1 min-w-0">

            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7681] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="トピックを検索..."
                className="w-full pl-9 pr-12 py-2.5 bg-[#161b22] border border-[#30363d] rounded-lg text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-sm transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center px-1.5 py-0.5 rounded border border-[#30363d] text-[#6e7681] text-xs font-mono">
                /
              </kbd>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-[#21262d] pb-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 text-sm rounded-t transition-colors duration-300 ${
                    activeFilter === tab
                      ? "text-indigo-400 border-b-2 border-indigo-500 -mb-[1px]"
                      : "text-[#8b949e] hover:text-[#e6edf3]"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <span className="ml-auto text-xs text-[#6e7681]">
                {filtered.length} 件
              </span>
            </div>

            {/* Topic list */}
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} query={query} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-[#6e7681]">
                <p className="text-4xl mb-3">🔭</p>
                <p className="text-sm">&quot;{query}&quot; に一致するトピックはありません</p>
                <button
                  onClick={() => { setQuery(""); setActiveFilter("すべて"); }}
                  className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  リセット
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-20 space-y-4">

              {/* Timeline CTA */}
              <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-4">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-2">宇宙の歴史タイムライン</h3>
                <p className="text-xs text-[#8b949e] mb-3 leading-relaxed">
                  ビッグバンから現在まで。再電離時代がどこに位置するか確認できます。
                </p>
                <Link
                  href="/timeline"
                  className="block text-center text-sm py-2 px-3 rounded border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 transition-colors duration-300"
                >
                  タイムラインを見る
                </Link>
              </div>

              {/* Difficulty guide */}
              <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-4">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">難易度の目安</h3>
                <div className="space-y-2">
                  {(["入門", "基礎", "応用", "発展"] as const).map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[d].className}`}>
                        {d}
                      </span>
                      <span className="text-xs text-[#6e7681]">
                        {d === "入門" ? "前提知識不要" : d === "基礎" ? "高校物理程度" : d === "応用" ? "大学物理程度" : "専門的な数理"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics count */}
              <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-4">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">トピック数</h3>
                <div className="space-y-1.5">
                  {(["入門", "基礎", "応用", "発展"] as const).map((d) => {
                    const count = TOPICS.filter((t) => t.difficulty === d).length;
                    return (
                      <div key={d} className="flex items-center justify-between text-xs">
                        <span className="text-[#8b949e]">{d}</span>
                        <span className="text-[#e6edf3] font-mono">{count}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between text-xs border-t border-[#21262d] pt-1.5 mt-1.5">
                    <span className="text-[#8b949e]">合計</span>
                    <span className="text-indigo-400 font-mono font-semibold">{TOPICS.length}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
