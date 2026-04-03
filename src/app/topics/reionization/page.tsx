"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { IM, BM } from "@/components/Math";

function NeutralFractionViz() {
  const [redshift, setRedshift] = useState(8);

  const xHI = (z: number) => {
    if (z > 15) return 1.0;
    if (z < 5.5) return 0.0;
    return Math.min(1, Math.max(0, (z - 5.5) / 9.5));
  };

  const neutral = xHI(redshift);
  const ionized = 1 - neutral;

  const phase =
    redshift > 12 ? "再電離前（暗黒時代）" :
    redshift > 7  ? "再電離の進行中" :
    redshift > 5.5 ? "再電離の終盤" : "再電離完了";

  const phaseColor =
    redshift > 12 ? "text-[#8b949e]" :
    redshift > 7  ? "text-indigo-400" :
    redshift > 5.5 ? "text-purple-400" : "text-emerald-400";

  return (
    <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-5">
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">インタラクティブ</span>
      <h3 className="text-sm font-semibold text-[#e6edf3] mt-1 mb-4">
        中性水素分率 <IM math="x_{\rm HI}(z)" />
      </h3>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-[#6e7681] mb-2">
          <span>z = 20（高赤方偏移）</span>
          <span>z = 4（低赤方偏移）</span>
        </div>
        <input
          type="range" min={4} max={20} step={0.1} value={redshift}
          onChange={(e) => setRedshift(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-mono font-bold text-[#e6edf3]">z = {redshift.toFixed(1)}</span>
          <span className={`text-sm font-medium ${phaseColor}`}>{phase}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
            <span>中性水素 <IM math="x_{\rm HI}" /></span>
            <span className="font-mono text-[#c9d1d9]">{(neutral * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded bg-[#21262d] overflow-hidden">
            <div className="h-full rounded bg-blue-500 transition-all duration-300" style={{ width: `${neutral * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
            <span>電離水素 <IM math="x_{\rm HII}" /></span>
            <span className="font-mono text-[#c9d1d9]">{(ionized * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded bg-[#21262d] overflow-hidden">
            <div className="h-full rounded bg-indigo-500 transition-all duration-300" style={{ width: `${ionized * 100}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#6e7681]">
        ※ 概念的なモデルです。実際の中性分率の進化は観測・シミュレーションで制約されます。
      </p>
    </div>
  );
}

function BubbleViz() {
  const [ionFrac, setIonFrac] = useState(0.3);
  const bubbles = Math.floor(ionFrac * 20) + 1;
  const size = 20 + ionFrac * 60;

  return (
    <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-5">
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">インタラクティブ</span>
      <h3 className="text-sm font-semibold text-[#e6edf3] mt-1 mb-4">電離バブルの成長</h3>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#6e7681] mb-2">
          <span>電離分率 0%</span>
          <span>100%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={ionFrac}
          onChange={(e) => setIonFrac(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="text-center mt-2 font-mono text-lg font-bold text-indigo-400">
          電離分率: {(ionFrac * 100).toFixed(0)}%
        </div>
      </div>
      <div className="relative h-44 rounded bg-[#0d1117] border border-[#21262d] overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-xs text-[#30363d] select-none pointer-events-none">
          中性水素 IGM
        </span>
        {Array.from({ length: bubbles }).map((_, i) => {
          const x = (i * 137.5) % 100;
          const y = (i * 73.1) % 100;
          const s = size * (0.5 + (i % 3) * 0.3);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-indigo-500/15 border border-indigo-500/30 transition-all duration-500"
              style={{ left: `${x}%`, top: `${y}%`, width: `${s}px`, height: `${s}px`, transform: "translate(-50%, -50%)" }}
            />
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[#6e7681]">
        電離バブル（HII領域）は電離源（銀河・クエーサー）周囲に形成され、成長・合体しながら宇宙全体に広がる。
      </p>
    </div>
  );
}

const SECTIONS = [
  { id: "what", heading: "宇宙再電離とは何か" },
  { id: "why", heading: "なぜ重要か" },
  { id: "viz1", heading: "中性分率のインタラクティブViz" },
  { id: "viz2", heading: "電離バブルのインタラクティブViz" },
  { id: "eq", heading: "基本的な式" },
];

export default function ReionizationPage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <nav className="flex items-center gap-1.5 text-xs text-[#6e7681] mb-6">
          <Link href="/" className="hover:text-[#e6edf3] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/topics" className="hover:text-[#e6edf3] transition-colors">トピック</Link>
          <span>/</span>
          <span className="text-[#8b949e]">宇宙再電離とは</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">

            <header className="mb-8 pb-6 border-b border-[#21262d]">
              <div className="mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  入門
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e6edf3] mb-1">
                宇宙再電離とは
              </h1>
              <p className="text-sm text-[#6e7681] font-mono">Epoch of Reionization (EoR)</p>
            </header>

            <section id="what" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">01</span>
                宇宙再電離とは何か
              </h2>
              <p className="text-[#c9d1d9] text-sm leading-relaxed mb-3">
                宇宙再電離（Epoch of Reionization, EoR）とは、ビッグバン後約
                <strong className="text-[#e6edf3]">3.8億年〜10億年</strong>（赤方偏移{" "}
                <IM math="z \approx 6\text{〜}15" />）の間に
                起きた現象で、それまで中性だった宇宙の水素ガスが再び電離された時代です。
              </p>
              <p className="text-[#c9d1d9] text-sm leading-relaxed mb-3">
                「再」電離と呼ばれるのは、ビッグバン直後の宇宙が高温のプラズマ（電離状態）だったためです。
                宇宙が冷却して再結合（<IM math="z \approx 1100" />）で中性化したのち、
                最初の天体が誕生することで再び電離が起きました。
              </p>
              <p className="text-[#c9d1d9] text-sm leading-relaxed">
                EoRはビッグバン以後の宇宙における<strong className="text-[#e6edf3]">最後の相転移</strong>とも呼ばれ、
                宇宙論・銀河形成の両面で極めて重要な時代です。
              </p>
            </section>

            <section id="why" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">02</span>
                なぜ重要か
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "初期宇宙の構造形成", desc: "最初の銀河・クエーサーの性質と進化を理解する手がかり" },
                  { title: "銀河間物質の物理", desc: "IGMの温度・電離状態・金属汚染の歴史を追う" },
                  { title: "暗黒物質ハロー", desc: "再電離フィードバックが小質量ハローの星形成を抑制する" },
                  { title: "宇宙論的制約", desc: "CMB偏極・クエーサースペクトルで宇宙論パラメータを制約" },
                ].map((item) => (
                  <div key={item.title} className="p-4 border border-[#21262d] rounded-lg bg-[#161b22]">
                    <div className="text-sm font-medium text-indigo-400 mb-1">{item.title}</div>
                    <div className="text-xs text-[#6e7681] leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section id="viz1" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">03</span>
                中性分率の変化
              </h2>
              <NeutralFractionViz />
            </section>

            <section id="viz2" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">04</span>
                電離バブルの成長
              </h2>
              <BubbleViz />
            </section>

            <section id="eq" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">05</span>
                基本的な式
              </h2>

              <div className="space-y-5">
                {/* Ionization balance */}
                <div className="p-4 border border-[#21262d] rounded-lg bg-[#161b22]">
                  <p className="text-xs text-indigo-400 font-semibold mb-3">電離バランス方程式</p>
                  <BM math="\frac{dn_{\rm HII}}{dt} = \Gamma \cdot n_{\rm HI} - \alpha_B \cdot n_e \cdot n_{\rm HII}" />
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#6e7681]">
                    <span><IM math="\Gamma" /> : 光電離率 [s⁻¹]</span>
                    <span><IM math="\alpha_B" /> : Case B 再結合係数</span>
                    <span><IM math="n_{\rm HI},\, n_e,\, n_{\rm HII}" /> : 数密度</span>
                  </div>
                </div>

                {/* Strömgren sphere */}
                <div className="p-4 border border-[#21262d] rounded-lg bg-[#161b22]">
                  <p className="text-xs text-indigo-400 font-semibold mb-3">Strömgren 球半径</p>
                  <BM math="R_S = \left(\frac{3\,Q_{\rm ion}}{4\pi\,\alpha_B\,\langle n_H^2 \rangle}\right)^{1/3}" />
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6e7681]">
                    <span><IM math="Q_{\rm ion}" /> : 電離光子放出率 [s⁻¹]</span>
                    <span><IM math="\langle n_H^2 \rangle" /> : 密度の二乗平均</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-8 border-t border-[#21262d]">
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">次に学ぶべきトピック</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "宇宙の暗黒時代", href: "/topics/dark-ages", desc: "再電離前の宇宙" },
                  { title: "21cm線", href: "/topics/21cm", desc: "主要な観測手段" },
                  { title: "銀河間物質", href: "/topics/igm", desc: "電離の舞台" },
                ].map((item) => (
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
