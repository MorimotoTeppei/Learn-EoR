"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { IM } from "@/components/Math";

function IGMPhaseViz() {
  const [z, setZ] = useState(8);

  const phase =
    z > 15 ? { name: "宇宙暗黒時代", color: "text-[#8b949e]", desc: "中性水素100%。光を放つ天体なし。", neutral: 100 } :
    z > 12 ? { name: "電離開始前", color: "text-blue-400", desc: "最初の天体が誕生し始める直前。中性水素がほぼ支配的。", neutral: 98 } :
    z > 9  ? { name: "電離バブル形成期", color: "text-indigo-400", desc: "HII領域が成長・重なり合う時代。中性分率が急減。", neutral: Math.max(10, 98 - (12 - z) * 20) } :
    z > 6  ? { name: "再電離終盤", color: "text-purple-400", desc: "最後の中性領域が電離される。GPトラフが薄くなる。", neutral: Math.max(0, (z - 6) * 3) } :
             { name: "再電離完了後", color: "text-emerald-400", desc: "IGMほぼ完全電離。光学的に薄い低密度プラズマ。", neutral: 0.01 };

  return (
    <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-5">
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">インタラクティブ</span>
      <h3 className="text-sm font-semibold text-[#e6edf3] mt-1 mb-4">赤方偏移と IGM の状態</h3>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
          <span>z = 4（低赤方偏移）</span>
          <span>z = 20（高赤方偏移）</span>
        </div>
        <input
          type="range" min={4} max={20} step={0.1} value={z}
          onChange={(e) => setZ(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-3 text-center">
          <div className="text-xs text-[#6e7681] mb-1">赤方偏移</div>
          <div className="text-xl font-mono font-bold text-[#e6edf3]">z = {z.toFixed(1)}</div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-3 text-center">
          <div className="text-xs text-[#6e7681] mb-1">フェーズ</div>
          <div className={`text-sm font-bold ${phase.color}`}>{phase.name}</div>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 mb-4">
        <p className="text-xs text-[#8b949e] mb-3">{phase.desc}</p>
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
              <span>中性水素分率 <IM math="x_{\rm HI}" /></span>
              <span className="font-mono text-[#c9d1d9]">{phase.neutral.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 rounded bg-[#21262d]">
              <div className="h-full rounded bg-blue-500 transition-all duration-300" style={{ width: `${phase.neutral}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
              <span>電離分率 <IM math="x_{\rm HII}" /></span>
              <span className="font-mono text-[#c9d1d9]">{(100 - phase.neutral).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 rounded bg-[#21262d]">
              <div className="h-full rounded bg-indigo-500 transition-all duration-300" style={{ width: `${100 - phase.neutral}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "what", heading: "IGMとは" },
  { id: "phase", heading: "IGMの状態変化" },
  { id: "obs", heading: "IGMの観測方法" },
];

export default function IGMPage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[#6e7681] mb-6">
          <Link href="/" className="hover:text-[#e6edf3] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/topics" className="hover:text-[#e6edf3] transition-colors">トピック</Link>
          <span>/</span>
          <span className="text-[#8b949e]">銀河間物質（IGM）</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">

            <header className="mb-8 pb-6 border-b border-[#21262d]">
              <div className="mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">基礎</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e6edf3] mb-1">銀河間物質（IGM）</h1>
              <p className="text-sm text-[#6e7681] font-mono">Intergalactic Medium</p>
            </header>

            <section id="what" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">01</span>IGMとは
              </h2>
              <p className="text-[#c9d1d9] text-sm leading-relaxed mb-3">
                銀河間物質（Intergalactic Medium, IGM）は銀河と銀河の間に広がる極めて希薄なガスです。
                宇宙のバリオン（通常物質）の大部分は IGM に存在しています。
              </p>
              <p className="text-[#c9d1d9] text-sm leading-relaxed">
                EoR 以前の IGM は主に<strong className="text-[#e6edf3]">中性水素</strong>（<IM math="\rm HI" />）で構成されており、
                ライマンアルファ光子に対して光学的に厚く、クエーサーからの光を大きく吸収します。
                これが<strong className="text-[#e6edf3]">Gunn–Peterson 効果</strong>として観測されます。
              </p>
            </section>

            <section id="phase" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">02</span>IGMの状態変化
              </h2>
              <IGMPhaseViz />
            </section>

            <section id="obs" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">03</span>IGMの観測方法
              </h2>
              <div className="space-y-3">
                {[
                  {
                    method: "Lyman-α Forest",
                    z: "z < 4",
                    desc: "クエーサースペクトルの Ly-α 吸収線の系列。低赤方偏移では IGM の密度構造を反映する。",
                  },
                  {
                    method: "Gunn–Peterson トラフ",
                    z: "z > 6",
                    descEl: (
                      <>
                        IGM の中性分率が高い時（<IM math="x_{\rm HI} \gtrsim 10^{-3}" />）は
                        完全吸収となり Ly-α より短波長側が真っ黒になる。
                      </>
                    ),
                  },
                  {
                    method: "21cm 輝度温度",
                    z: "z ≈ 6–15",
                    desc: "中性水素 IGM を直接マッピングできる。EoR の3次元構造を調べる最有力手段。",
                  },
                  {
                    method: "CMB トムソン散乱光学的深さ",
                    z: "z = 0–∞",
                    descEl: (
                      <>
                        電離された IGM 中の自由電子が CMB を散乱する。
                        光学的深さ <IM math="\tau" /> の値が再電離の積分拘束を与える。
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.method} className="p-4 border border-[#21262d] rounded-lg bg-[#161b22]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-medium text-violet-400">{item.method}</span>
                      <span className="text-xs text-[#6e7681] font-mono shrink-0">{item.z}</span>
                    </div>
                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      {item.descEl ?? item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 border-t border-[#21262d]">
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">関連トピック</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "クエーサー吸収スペクトル", href: "/topics/quasar", desc: "GPトラフの詳細" },
                  { title: "21cm線", href: "/topics/21cm", desc: "直接マッピング" },
                  { title: "宇宙再電離とは", href: "/topics/reionization", desc: "基本概念" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="block p-4 border border-[#21262d] rounded-lg bg-[#161b22] hover:border-[#30363d] hover:bg-[#1c2128] transition-colors group"
                  >
                    <div className="text-sm font-medium text-[#e6edf3] group-hover:text-indigo-400 transition-colors mb-1">{item.title}</div>
                    <div className="text-xs text-[#6e7681]">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>

          </article>

          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20">
              <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-4">
                <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">目次</h3>
                <nav className="space-y-1">
                  {SECTIONS.map((s, i) => (
                    <a key={s.id} href={`#${s.id}`}
                      className="flex items-start gap-2 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors py-1"
                    >
                      <span className="font-mono text-[#6e7681] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.heading}</span>
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
