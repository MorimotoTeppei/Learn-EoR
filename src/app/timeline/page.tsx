"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Event {
  id: string;
  z?: string;
  time: string;
  title: string;
  titleEn: string;
  description: string;
  color: string;
  size: "sm" | "md" | "lg";
  href?: string;
}

const EVENTS: Event[] = [
  {
    id: "bigbang",
    time: "t = 0",
    title: "ビッグバン",
    titleEn: "Big Bang",
    description: "宇宙誕生。極めて高温高密度の状態から膨張が始まる。",
    color: "bg-yellow-400",
    size: "lg",
  },
  {
    id: "nucleosynthesis",
    time: "t ≈ 3分",
    title: "ビッグバン元素合成",
    titleEn: "BBN",
    description: "水素・ヘリウム・リチウムなどの軽元素が合成される。",
    color: "bg-orange-400",
    size: "sm",
  },
  {
    id: "recombination",
    z: "z ≈ 1100",
    time: "t ≈ 38万年",
    title: "宇宙再結合",
    titleEn: "Recombination",
    description: "宇宙が冷却し電子と陽子が結合。宇宙は中性水素で満たされ透明になる。CMBが放出される。",
    color: "bg-blue-400",
    size: "md",
  },
  {
    id: "dark-ages",
    z: "z ≈ 1100 〜 30",
    time: "t ≈ 38万年 〜 1億年",
    title: "宇宙の暗黒時代",
    titleEn: "Cosmic Dark Ages",
    description: "光を放つ天体が存在せず、宇宙は暗黒の中性ガスで満ちていた時代。",
    color: "bg-gray-500",
    size: "md",
    href: "/topics/dark-ages",
  },
  {
    id: "first-stars",
    z: "z ≈ 20〜30",
    time: "t ≈ 1〜2億年",
    title: "ファーストスター誕生",
    titleEn: "First Stars (Pop III)",
    description: "最初の大質量星（Pop III星）が誕生。大量の紫外線光子を放出し、周囲のガスを電離し始める。",
    color: "bg-yellow-300",
    size: "lg",
    href: "/topics/first-stars",
  },
  {
    id: "reionization-start",
    z: "z ≈ 12〜15",
    time: "t ≈ 3〜4億年",
    title: "再電離の開始",
    titleEn: "Reionization Begins",
    description: "HII領域（電離バブル）が銀河周囲に形成され始める。中性分率が低下し始める。",
    color: "bg-indigo-400",
    size: "md",
    href: "/topics/reionization",
  },
  {
    id: "reionization-mid",
    z: "z ≈ 7〜10",
    time: "t ≈ 5〜7億年",
    title: "再電離の進行",
    titleEn: "Reionization Progresses",
    description: "電離バブルが成長・合体しながら宇宙全体に広がる。21cm線信号が最大化される時期。",
    color: "bg-indigo-500",
    size: "lg",
    href: "/topics/21cm",
  },
  {
    id: "reionization-end",
    z: "z ≈ 5.5〜6",
    time: "t ≈ 9〜10億年",
    title: "再電離の完了",
    titleEn: "Reionization Complete",
    description: "IGMの中性水素がほぼ完全に電離。クエーサースペクトルのGP効果が消える。",
    color: "bg-purple-400",
    size: "md",
    href: "/topics/quasar",
  },
  {
    id: "now",
    z: "z = 0",
    time: "t ≈ 138億年",
    title: "現在",
    titleEn: "Today",
    description: "宇宙は電離されたプラズマで満ちている。銀河・恒星・惑星が存在する現代宇宙。",
    color: "bg-emerald-400",
    size: "sm",
  },
];

export default function TimelinePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">宇宙の歴史タイムライン</h1>
          <p className="text-[#8b949e] text-sm">ビッグバンから現在まで。各イベントをクリックして詳細を確認できます。</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#21262d] -translate-x-1/2" />

          <div className="space-y-6">
            {EVENTS.map((event, i) => {
              const isLeft = i % 2 === 0;
              const isSelected = selected === event.id;
              const dotSize = event.size === "lg" ? "w-3.5 h-3.5" : event.size === "md" ? "w-2.5 h-2.5" : "w-2 h-2";

              return (
                <div
                  key={event.id}
                  className={`relative flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-[calc(50%-20px)] ${isLeft ? "pr-5" : "pl-5"}`}>
                    <button
                      onClick={() => setSelected(isSelected ? null : event.id)}
                      className={`w-full text-left rounded-lg border p-4 transition-colors ${
                        isSelected
                          ? "border-indigo-500/50 bg-indigo-500/10"
                          : "border-[#21262d] bg-[#161b22] hover:border-[#30363d] hover:bg-[#1c2128]"
                      }`}
                    >
                      <div className={`text-xs font-mono mb-1 ${isSelected ? "text-indigo-400" : "text-[#6e7681]"}`}>
                        {event.z && <span className="mr-2">{event.z}</span>}
                        {event.time}
                      </div>
                      <div className="text-sm font-semibold text-[#e6edf3]">{event.title}</div>
                      <div className="text-xs text-[#6e7681] font-mono">{event.titleEn}</div>
                      {isSelected && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#21262d]">
                          <p className="text-xs text-[#8b949e] leading-relaxed mb-2">{event.description}</p>
                          {event.href && (
                            <Link
                              href={event.href}
                              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              詳しく学ぶ →
                            </Link>
                          )}
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className={`${dotSize} rounded-full ${event.color} ring-2 ring-[#0f1117] transition-all duration-200 ${isSelected ? "scale-125" : ""}`} />
                  </div>

                  <div className="w-[calc(50%-20px)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 border border-[#21262d] rounded-lg bg-[#161b22] p-5">
          <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">再電離時代のハイライト</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#8b949e]">
            {[
              { color: "bg-indigo-400", title: "開始: z ≈ 12–15", desc: "最初の電離バブルが形成。ファーストスターや初期銀河が電離源。" },
              { color: "bg-indigo-500", title: "進行中: z ≈ 7–10", desc: "バブルが重なり合い、21cm線のパワースペクトルが特徴的な形状を示す。" },
              { color: "bg-purple-400", title: "完了: z ≈ 5.5–6", desc: "クエーサーのLy-α吸収線（GPトラフ）が消え、IGMが完全電離。" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color} mt-0.5 shrink-0`} />
                <div>
                  <div className="text-[#c9d1d9] font-medium mb-1">{item.title}</div>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
