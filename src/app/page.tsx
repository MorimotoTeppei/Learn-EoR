"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { searchArticles, type Article, type Difficulty } from "@/data/articles";

const DIFFICULTY_STYLES: Record<Difficulty, { label: string; className: string }> = {
  入門: { label: "入門", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" },
  基礎: { label: "基礎", className: "bg-blue-500/10 text-blue-400 border border-blue-500/30" },
  応用: { label: "応用", className: "bg-amber-500/10 text-amber-400 border border-amber-500/30" },
  発展: { label: "発展", className: "bg-red-500/10 text-red-400 border border-red-500/30" },
};

function ArticleCard({ article }: { article: Article }) {
  const diff = DIFFICULTY_STYLES[article.difficulty];
  return (
    <Link
      href={article.href}
      className="group block rounded-xl border border-[#21262d] bg-[#0d1117] hover:border-[#30363d] hover:bg-[#161b22] transition-colors p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-[15px] font-semibold text-[#e6edf3] group-hover:text-white leading-snug">
          {article.title}
        </h2>
        <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${diff.className}`}>
          {diff.label}
        </span>
      </div>
      <p className="text-[13px] text-[#8b949e] leading-relaxed mb-3">
        {article.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e]"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function Page() {
  const [query, setQuery] = useState("");
  const results = searchArticles(query);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">Learn EoR</h1>
          <p className="text-[14px] text-[#8b949e]">
            宇宙再電離（Epoch of Reionization）をインタラクティブに学ぶための記事集
          </p>
        </div>

        <div className="relative mb-6">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10.9 10.9L14 14M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事を検索…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] placeholder-[#484f58] text-[14px] focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-[12px] text-[#484f58] mb-4">
          {results.length} 件
        </div>

        {results.length > 0 ? (
          <div className="flex flex-col gap-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#484f58] text-[14px]">
            「{query}」に一致する記事が見つかりませんでした
          </div>
        )}
      </main>
    </>
  );
}
