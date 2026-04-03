import TopicStub from "@/components/TopicStub";

export default function PowerSpectrumPage() {
  return (
    <TopicStub
      icon="∿"
      title="パワースペクトル解析"
      titleEn="Power Spectrum Analysis"
      difficulty="発展"
      difficultyColor="bg-red-900/50 text-red-300 border-red-800/60"
      description="21cm輝度温度のパワースペクトル Δ²(k) は中性水素分布の空間統計を表し、SKAやHERAが目指す主要な観測量です。EoRの段階（電離分率・バブルサイズ・温度構造）に応じた特徴的な形状を持ちます。"
      accentColor="#6366f1"
      sections={[
        {
          heading: "パワースペクトルの定義",
          body: "輝度温度場 δT_b(x) のフーリエ変換 δT̃_b(k) を用いて、パワースペクトルは ⟨|δT̃_b(k)|²⟩ = (2π)³ P(k) δ^D(k+k') で定義されます。次元付きパワースペクトルは Δ²(k) = k³P(k)/(2π²) で表されます。",
        },
        {
          heading: "EoR各段階での特徴",
          body: "再電離初期（x_HI ≈ 1）では大スケールに電離バブルが形成され、パワーが大スケールで増加します。再電離中期（x_HI ≈ 0.5）ではバブルサイズの特徴的スケールがパワーのピーク位置に現れます。再電離後期（x_HI ≈ 0）ではパワーが急減します。この進化を観測することがEoR研究の核心です。",
        },
        {
          heading: "前景放射汚染と観測上の課題",
          body: "21cm観測の最大の障壁は前景放射（銀河・銀河外電波源）で、21cm信号の10^4〜10^5倍の強度があります。前景放射は周波数的に滑らかな成分が多いため、周波数方向のフィルタリング（「前景回避」または「前景除去」）で分離を試みます。前景汚染が少ないフーリエ空間の「EoRウィンドウ」を活用する手法も重要です。",
        },
      ]}
      relatedTopics={[
        { title: "21cm線", href: "/topics/21cm", desc: "観測量の基礎" },
        { title: "数値シミュレーション", href: "/topics/simulations", desc: "理論予測" },
        { title: "宇宙再電離とは", href: "/topics/reionization", desc: "全体像" },
      ]}
    />
  );
}
