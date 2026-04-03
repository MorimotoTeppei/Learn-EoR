"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { IM, BM } from "@/components/Math";

function SpinTempViz() {
  const [Ts, setTs] = useState(10);
  const TCMB = 2.73;
  const z = 8;
  const Tcmb8 = TCMB * (1 + z);
  const deltaT = 27 * (1 - Tcmb8 / Ts) * Math.sqrt((1 + z) / 10);
  const emission = deltaT > 0;

  return (
    <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-5">
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">インタラクティブ</span>
      <h3 className="text-sm font-semibold text-[#e6edf3] mt-1 mb-1">スピン温度と輝度温度</h3>
      <p className="text-xs text-[#6e7681] mb-4">
        <IM math="z = 8" /> における21cm輝度温度 <IM math="\delta T_b" /> の符号
      </p>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
          <span><IM math={`T_S = ${Ts}\\,\\text{K}`} /></span>
          <span><IM math={`T_{\\rm CMB}(z=8) = ${Tcmb8.toFixed(1)}\\,\\text{K}`} /></span>
        </div>
        <input
          type="range" min={1} max={200} step={1} value={Ts}
          onChange={(e) => setTs(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-[#8b949e]">
            <IM math={`T_S = ${Ts}\\,\\text{K}`} />
          </div>
          <div className={`text-xs font-medium px-2.5 py-1 rounded border ${
            Ts < Tcmb8
              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
              : Ts > Tcmb8
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-[#21262d] text-[#8b949e] border-[#30363d]"
          }`}>
            {Ts < Tcmb8
              ? <span>吸収 (<IM math="T_S < T_{\rm CMB}" />)</span>
              : Ts > Tcmb8
              ? <span>輝線放出 (<IM math="T_S > T_{\rm CMB}" />)</span>
              : "コントラストなし"}
          </div>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 text-center mb-4">
        <div className="text-2xl font-bold mb-1" style={{ color: emission ? "#fbbf24" : "#60a5fa" }}>
          <IM math={`\\delta T_b \\approx ${deltaT > 0 ? "+" : ""}${deltaT.toFixed(1)}\\,\\text{mK}`} />
        </div>
        <div className="text-xs text-[#6e7681]">
          {emission ? "輝線（明るい）: 21cm放出が観測される" : "吸収線（暗い）: CMBを背景に吸収"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { math: "T_S \\ll T_{\\rm CMB}", sub: "吸収\n暗黒時代", color: "text-blue-400" },
          { math: "T_S = T_{\\rm CMB}", sub: "信号なし\n結合解除", color: "text-[#8b949e]" },
          { math: "T_S \\gg T_{\\rm CMB}", sub: "輝線放出\n加熱後", color: "text-amber-400" },
        ].map((item) => (
          <div key={item.math} className="border border-[#21262d] rounded p-2.5 text-center bg-[#0d1117]">
            <div className={`font-medium mb-1 ${item.color}`}><IM math={item.math} /></div>
            <div className="text-[#6e7681] whitespace-pre-line leading-relaxed">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WavelengthViz() {
  const [z, setZ] = useState(8);
  const restFreq = 1420.4;
  const obsFreq = restFreq / (1 + z);
  const obsWavelength = (3e8 / (obsFreq * 1e6) * 100).toFixed(1);

  return (
    <div className="border border-[#21262d] rounded-lg bg-[#161b22] p-5">
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">インタラクティブ</span>
      <h3 className="text-sm font-semibold text-[#e6edf3] mt-1 mb-4">赤方偏移による観測周波数の変化</h3>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#6e7681] mb-1.5">
          <span>z = 4（近い宇宙）</span>
          <span>z = 20（遠い宇宙）</span>
        </div>
        <input
          type="range" min={4} max={20} step={0.1} value={z}
          onChange={(e) => setZ(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        {[
          { label: "赤方偏移", value: `z = ${z.toFixed(1)}`, color: "text-cyan-400" },
          { label: "観測周波数", value: `${obsFreq.toFixed(0)} MHz`, color: "text-[#e6edf3]" },
          { label: "観測波長", value: `${obsWavelength} cm`, color: "text-[#e6edf3]" },
        ].map((item) => (
          <div key={item.label} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-3">
            <div className="text-xs text-[#6e7681] mb-1">{item.label}</div>
            <div className={`text-lg font-mono font-bold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#6e7681] text-center mb-3">
        静止系周波数: {restFreq} MHz（波長: 21.1 cm）
        <IM math="\nu_{\rm obs} = \nu_{21} / (1+z)" />
      </p>

      <div>
        <div className="flex justify-between text-xs text-[#6e7681] mb-1">
          <span>50 MHz</span>
          <span>1420 MHz</span>
        </div>
        <div className="h-2.5 bg-[#21262d] rounded-full relative overflow-hidden">
          <div
            className="absolute inset-y-0 w-3 bg-cyan-400 rounded-full transition-all duration-300"
            style={{ left: `${((obsFreq - 50) / (1420 - 50)) * 100}%`, transform: "translateX(-50%)" }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#30363d] mt-1">
          <span>SKA-Low帯域</span>
          <span>静止系</span>
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "what", heading: "21cm線とは" },
  { id: "wavelength", heading: "観測周波数の変化" },
  { id: "spintemp", heading: "スピン温度と輝度温度" },
  { id: "instruments", heading: "主要な観測装置" },
];

export default function TwentyOneCmPage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[#6e7681] mb-6">
          <Link href="/" className="hover:text-[#e6edf3] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/topics" className="hover:text-[#e6edf3] transition-colors">トピック</Link>
          <span>/</span>
          <span className="text-[#8b949e]">21cm線</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">

            <header className="mb-8 pb-6 border-b border-[#21262d]">
              <div className="mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">基礎</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e6edf3] mb-1">21cm線</h1>
              <p className="text-sm text-[#6e7681] font-mono">21cm Hydrogen Line</p>
            </header>

            <section id="what" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">01</span>21cm線とは
              </h2>
              <p className="text-[#c9d1d9] text-sm leading-relaxed mb-3">
                中性水素原子（HI）の電子は、陽子のスピンと平行（三重項）または反平行（一重項）の2状態をとります。
                この<strong className="text-[#e6edf3]">超微細構造遷移</strong>に伴い、波長
                <strong className="text-[#e6edf3]">21.1 cm（周波数 1420.4 MHz）</strong>の電波が放出・吸収されます。
              </p>
              <p className="text-[#c9d1d9] text-sm leading-relaxed">
                遠方の EoR 天体から放たれた 21cm 線は赤方偏移を受け、観測周波数が低くなります
                （<IM math="z=8" /> なら約 158 MHz）。
                この信号を検出することで、宇宙の中性水素の分布を3次元的にマッピングできます。
              </p>
            </section>

            <section id="wavelength" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">02</span>観測周波数の変化
              </h2>
              <WavelengthViz />
            </section>

            <section id="spintemp" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">03</span>スピン温度と輝度温度
              </h2>
              <p className="text-[#c9d1d9] text-sm leading-relaxed mb-4">
                21cm 信号の強さは CMB 温度 <IM math="T_{\rm CMB}" /> とスピン温度 <IM math="T_S" /> の差で決まります。
                <IM math="T_S > T_{\rm CMB}" /> のとき輝線放出、<IM math="T_S < T_{\rm CMB}" /> のとき吸収線として観測されます。
              </p>

              <div className="p-4 border border-[#21262d] rounded-lg bg-[#161b22] mb-5">
                <p className="text-xs text-indigo-400 font-semibold mb-2">輝度温度（近似式）</p>
                <BM math="\delta T_b \approx 27\, x_{\rm HI} \left(1 - \frac{T_{\rm CMB}}{T_S}\right) \sqrt{\frac{1+z}{10}}\;\;[\mathrm{mK}]" />
              </div>

              <SpinTempViz />
            </section>

            <section id="instruments" className="mb-8">
              <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e7681] w-6">04</span>主要な観測装置
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "SKA-Low", loc: "オーストラリア", freq: "50–350 MHz", desc: "次世代電波干渉計。EoRの21cmイメージングが主目標。" },
                  { name: "HERA", loc: "南アフリカ", freq: "50–250 MHz", desc: "Hydrogen Epoch of Reionization Array。パワースペクトル測定に特化。" },
                  { name: "MWA", loc: "オーストラリア", freq: "70–300 MHz", desc: "Murchison Widefield Array。SKA前駆機として稼働中。" },
                  { name: "LOFAR", loc: "オランダ（欧州）", freq: "10–250 MHz", desc: "現在最も感度の高い低周波電波干渉計の一つ。" },
                ].map((inst) => (
                  <div key={inst.name} className="p-4 border border-[#21262d] rounded-lg bg-[#161b22]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-cyan-400">{inst.name}</span>
                      <span className="text-xs text-[#6e7681] font-mono">{inst.freq}</span>
                    </div>
                    <div className="text-xs text-[#6e7681] mb-1.5">{inst.loc}</div>
                    <div className="text-xs text-[#8b949e]">{inst.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 border-t border-[#21262d]">
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">関連トピック</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "宇宙再電離とは", href: "/topics/reionization", desc: "基本概念" },
                  { title: "パワースペクトル解析", href: "/topics/power-spectrum", desc: "統計的手法" },
                  { title: "銀河間物質", href: "/topics/igm", desc: "観測対象" },
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
