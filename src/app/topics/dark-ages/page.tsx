import TopicStub from "@/components/TopicStub";

export default function DarkAgesPage() {
  return (
    <TopicStub
      icon="◑"
      title="宇宙の暗黒時代"
      titleEn="Cosmic Dark Ages"
      difficulty="入門"
      difficultyColor="bg-green-900/50 text-green-300 border-green-800/60"
      description="宇宙再結合（z ≈ 1100）後、最初の天体が誕生するまでの期間を「宇宙の暗黒時代（Cosmic Dark Ages）」と呼びます。この時代は光を放つ天体が存在せず、宇宙は中性水素ガスで満ちていました。"
      accentColor="#9ca3af"
      sections={[
        {
          heading: "始まりと終わり",
          body: "宇宙の暗黒時代はビッグバン後約38万年（宇宙再結合: z ≈ 1100）に始まり、最初の星（Population III星）が誕生する z ≈ 20〜30（約1〜2億年後）に終わります。この間、宇宙は電磁波を放出する天体を持ちませんでした。",
        },
        {
          heading: "中性水素の状態",
          body: "暗黒時代の宇宙はほぼ純粋な中性水素・ヘリウムガスで満ちていました。温度はCMB温度に追従して低下し、やがてガス温度がCMB温度より低くなります（T_gas < T_CMB）。この時代の21cm線は吸収として観測されるはずです。",
        },
        {
          heading: "暗黒物質と密度揺らぎ",
          body: "暗黒時代を通じて、暗黒物質は重力によって密度揺らぎを成長させていました。この密度揺らぎが後のファーストスター・初期銀河形成の種になります。バリオン物質も暗黒物質ハローに降着し始めます。",
        },
      ]}
      relatedTopics={[
        { title: "宇宙再電離とは", href: "/topics/reionization", desc: "暗黒時代の後に来る時代" },
        { title: "ファーストスター", href: "/topics/first-stars", desc: "暗黒時代を終わらせた天体" },
        { title: "21cm線", href: "/topics/21cm", desc: "暗黒時代の観測手段" },
      ]}
    />
  );
}
