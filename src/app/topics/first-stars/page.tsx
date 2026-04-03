import TopicStub from "@/components/TopicStub";

export default function FirstStarsPage() {
  return (
    <TopicStub
      icon="★"
      title="ファーストスター・初期銀河"
      titleEn="First Stars & Galaxies"
      difficulty="基礎"
      difficultyColor="bg-blue-900/50 text-blue-300 border-blue-800/60"
      description="宇宙最初の星（Population III星）と初期銀河は、宇宙再電離の主要な電離源と考えられています。金属を含まない純粋な水素・ヘリウムガスから生まれたこれらの天体は、非常に大質量で高温であったと予想されます。"
      accentColor="#fbbf24"
      sections={[
        {
          heading: "Population III星の特徴",
          body: "Pop III星はビッグバン元素合成で生成された水素・ヘリウムのみから形成され、金属（重元素）を含みません。現在の星形成理論では質量が10〜1000 M☉と非常に大きく、表面温度が10万K以上と高温で大量の電離光子（E > 13.6 eV）を放出したと考えられています。",
        },
        {
          heading: "電離光子放出と電離源",
          body: "EoRを電離するには十分な数の電離光子が必要です。電離光子脱出確率（f_esc）は小さい銀河ほど高いとされますが、まだ不確定性が大きいです。大質量星はLyman-Werner帯域の光子も放出し、周囲のH₂分子を解離させることで次世代の星形成を抑制します。",
        },
        {
          heading: "初期銀河と再電離",
          body: "現在のモデルでは、多数の小さな銀河（フェイント銀河）が再電離のバジェットの大部分を担うと考えられています。JWSTによる高赤方偏移銀河の観測は、これらの銀河の紫外線光度関数を制約し始めています。クエーサーは少数ですが、高赤方偏移でも重要な電離源になり得ます。",
        },
      ]}
      relatedTopics={[
        { title: "宇宙再電離とは", href: "/topics/reionization", desc: "電離の全体像" },
        { title: "銀河間物質", href: "/topics/igm", desc: "電離される対象" },
        { title: "数値シミュレーション", href: "/topics/simulations", desc: "形成を再現する" },
      ]}
    />
  );
}
