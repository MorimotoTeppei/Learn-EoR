import TopicStub from "@/components/TopicStub";

export default function CMBPage() {
  return (
    <TopicStub
      icon="〜"
      title="宇宙マイクロ波背景放射とEoR"
      titleEn="CMB & Thomson Scattering"
      difficulty="応用"
      difficultyColor="bg-orange-900/50 text-orange-300 border-orange-800/60"
      description="CMBの偏極（特にEモード）はトムソン散乱の積分光学的深さτを与え、再電離が起きた時期と期間に関する制約を提供します。PlanckによるτはEoRが比較的急速に起きたことを示しています。"
      accentColor="#2dd4bf"
      sections={[
        {
          heading: "トムソン散乱光学的深さ τ",
          body: "再電離後のIGMに存在する自由電子はCMB光子をトムソン散乱します。この効果を積分したτはCMB偏極の大角度スケールのパワーを増加させます。Planck 2018の測定値はτ = 0.054 ± 0.007 で、これに対応する再電離の中間赤方偏移はz_re ≈ 7–8 とされています。",
        },
        {
          heading: "kSZ効果（動的スニャエフ=ゼルドヴィッチ効果）",
          body: "再電離期の電離バブルはIGMの速度場によってCMBに温度揺らぎをもたらします（kSZ効果）。この信号のパワースペクトルは再電離の持続時間（Δz）に依存するため、SPT・ACT・CMB-S4などの高分解能CMB実験でEoRの詳細な制約が可能になりつつあります。",
        },
        {
          heading: "21cm線とCMBの相補性",
          body: "CMBはEoRの積分的な情報を与えますが、21cm線観測は赤方偏移ごとの3次元情報を提供します。両者を組み合わせることで、再電離のタイミング・速さ・空間構造を同時に制約できます。",
        },
      ]}
      relatedTopics={[
        { title: "宇宙再電離とは", href: "/topics/reionization", desc: "基本概念" },
        { title: "21cm線", href: "/topics/21cm", desc: "相補的な観測" },
        { title: "パワースペクトル解析", href: "/topics/power-spectrum", desc: "統計的手法" },
      ]}
    />
  );
}
