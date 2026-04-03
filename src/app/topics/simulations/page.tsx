import TopicStub from "@/components/TopicStub";

export default function SimulationsPage() {
  return (
    <TopicStub
      icon="⚙"
      title="数値シミュレーション"
      titleEn="Numerical Simulations"
      difficulty="発展"
      difficultyColor="bg-red-900/50 text-red-300 border-red-800/60"
      description="EoRを再現するには、重力的構造形成（N体/SPH）と輻射輸送（Radiative Transfer）を組み合わせた数値シミュレーションが不可欠です。計算コストの違いから、様々なアプローチが使われています。"
      accentColor="#9ca3af"
      sections={[
        {
          heading: "主要なシミュレーションコード",
          body: "21cmFAST: 摂動論的近似で高速に21cm信号を生成する半数値的コード。統計的解析に広く利用。GADGET/AREPO: SPH/メッシュレス流体力学コード。輻射輸送を組み合わせてEoRシミュレーションに使われる。RAMSES, ENZO: AMR(適応的メッシュ細分化)を使った宇宙論シミュレーション。",
        },
        {
          heading: "輻射輸送の課題",
          body: "輻射輸送（Radiative Transfer, RT）は光子の伝播・吸収・散乱を解きます。EoR規模の宇宙論的シミュレーションでRTを完全に解くのは計算コストが非常に高いため、モーメント法・レイトレーシング・確率的手法など様々な近似が使われます。",
        },
        {
          heading: "シミュレーションと観測の比較",
          body: "シミュレーションの出力（21cm輝度温度マップ・パワースペクトル）を観測（SKA、HERA）と比較することで、再電離モデルのパラメータ（電離光子脱出確率 f_esc、再結合密度クランプ因子 C など）を制約します。機械学習を用いたエミュレーターも近年活発に開発されています。",
        },
      ]}
      relatedTopics={[
        { title: "パワースペクトル解析", href: "/topics/power-spectrum", desc: "統計的比較" },
        { title: "21cm線", href: "/topics/21cm", desc: "観測量" },
        { title: "銀河間物質", href: "/topics/igm", desc: "シミュレーション対象" },
      ]}
    />
  );
}
