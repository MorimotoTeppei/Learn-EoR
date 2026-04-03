import TopicStub from "@/components/TopicStub";

export default function QuasarPage() {
  return (
    <TopicStub
      icon="⊙"
      title="クエーサー吸収スペクトル"
      titleEn="Quasar Absorption Spectra"
      difficulty="応用"
      difficultyColor="bg-orange-900/50 text-orange-300 border-orange-800/60"
      description="遠方クエーサーのスペクトルに見られるライマンアルファ吸収線（特にガンピーターソントラフ）は、中性水素IGMの存在を示し、宇宙再電離の終端時期を制約する最も直接的な観測的証拠の一つです。"
      accentColor="#f87171"
      sections={[
        {
          heading: "ライマンアルファ吸収とGPトラフ",
          body: "クエーサーの光は宇宙を旅する途中で中性水素に吸収されます。ライマンアルファ（Ly-α: 121.6 nm）より短波長側が完全吸収される「ガンピーターソントラフ（GP Trough）」は、IGMの中性水素分率が x_HI > 10^-3 のとき観測されます。z ≈ 6 以上のクエーサーで顕著なGPトラフが発見され、EoRが z ≈ 6 付近で終わった証拠とされています。",
        },
        {
          heading: "Lyman-α近傍領域（Near Zone）",
          body: "クエーサー近傍のIGMはクエーサー自身の放射で電離されており、スペクトルの透明な領域（near zone）として現れます。near zoneのサイズは周囲のIGMの中性分率に依存するため、高赤方偏移クエーサーのnear zone解析はEoRの終端制約に使われます。",
        },
        {
          heading: "観測的制約とその限界",
          body: "GP効果はx_HI > 10^-3 で既に飽和するため、中性分率が非常に小さい場合でも区別できません（1%でも100%でも見た目が同じ）。より詳細な制約には、near zone解析・ダンピングウィング解析・Lyman-α emitter(LAE)の観測頻度などを組み合わせる必要があります。",
        },
      ]}
      relatedTopics={[
        { title: "銀河間物質", href: "/topics/igm", desc: "吸収の舞台" },
        { title: "宇宙再電離とは", href: "/topics/reionization", desc: "基本概念" },
        { title: "CMB", href: "/topics/cmb", desc: "別の観測的制約" },
      ]}
    />
  );
}
