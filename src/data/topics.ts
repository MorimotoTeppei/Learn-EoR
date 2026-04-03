export type Difficulty = "入門" | "基礎" | "応用" | "発展";

export interface Topic {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  tags: string[];
  difficulty: Difficulty;
  icon: string;
  color: string;
  href: string;
  keywords: string[];
}

export const TOPICS: Topic[] = [
  {
    id: "reionization",
    title: "宇宙再電離とは",
    titleEn: "Epoch of Reionization",
    description:
      "宇宙誕生後約3.8億年から10億年の間に起きた、中性水素ガスが電離された時代。ビッグバン後の宇宙の歴史における最後の相転移。",
    tags: ["EoR", "基本概念", "宇宙史"],
    difficulty: "入門",
    icon: "◎",
    color: "from-indigo-900/40 to-purple-900/20",
    href: "/topics/reionization",
    keywords: ["再電離", "reionization", "EoR", "電離", "宇宙史", "相転移"],
  },
  {
    id: "dark-ages",
    title: "宇宙の暗黒時代",
    titleEn: "Cosmic Dark Ages",
    description:
      "宇宙再結合後（z~1100）から最初の天体が生まれるまでの期間。光を放つ天体がなく、宇宙は中性水素で満ちていた。",
    tags: ["暗黒時代", "再結合", "中性水素"],
    difficulty: "入門",
    icon: "◑",
    color: "from-slate-900/40 to-gray-900/20",
    href: "/topics/dark-ages",
    keywords: ["暗黒時代", "dark ages", "再結合", "中性水素", "宇宙背景放射"],
  },
  {
    id: "first-stars",
    title: "ファーストスター・初期銀河",
    titleEn: "First Stars & Galaxies",
    description:
      "再電離の主な電離源と考えられる最初の大質量星（Population III星）と初期銀河。紫外線光子を大量に放出し電離を進める。",
    tags: ["Pop III", "初期銀河", "電離源"],
    difficulty: "基礎",
    icon: "★",
    color: "from-yellow-900/40 to-orange-900/20",
    href: "/topics/first-stars",
    keywords: ["Population III", "ファーストスター", "初期銀河", "電離光子", "UV"],
  },
  {
    id: "21cm",
    title: "21cm線",
    titleEn: "21cm Hydrogen Line",
    description:
      "中性水素の超微細構造遷移から放出される波長21cmの電波。EoRを直接観測できる唯一の手段として注目される。",
    tags: ["21cm", "電波観測", "HI線"],
    difficulty: "基礎",
    icon: "≋",
    color: "from-cyan-900/40 to-blue-900/20",
    href: "/topics/21cm",
    keywords: ["21cm", "水素21cm線", "HI", "電波", "超微細構造", "スピン温度"],
  },
  {
    id: "quasar",
    title: "クエーサー吸収スペクトル",
    titleEn: "Quasar Absorption Spectra",
    description:
      "遠方クエーサーのライマンアルファ吸収線（ガンピーターソントラフ）は中性水素ガスの存在を示し、EoRの終端を制約する。",
    tags: ["クエーサー", "Ly-α", "観測的証拠"],
    difficulty: "応用",
    icon: "⊙",
    color: "from-red-900/40 to-pink-900/20",
    href: "/topics/quasar",
    keywords: ["クエーサー", "quasar", "ライマンアルファ", "Lyman-alpha", "Gunn-Peterson", "吸収線"],
  },
  {
    id: "cmb",
    title: "宇宙マイクロ波背景放射",
    titleEn: "CMB & Thomson Scattering",
    description:
      "CMBの偏極（Eモード）はトムソン散乱の光学的深さτを制約し、再電離の時期や期間に関する情報を含む。",
    tags: ["CMB", "偏極", "τ"],
    difficulty: "応用",
    icon: "〜",
    color: "from-teal-900/40 to-emerald-900/20",
    href: "/topics/cmb",
    keywords: ["CMB", "宇宙マイクロ波背景放射", "トムソン散乱", "光学的深さ", "偏極", "WMAP", "Planck"],
  },
  {
    id: "igm",
    title: "銀河間物質（IGM）",
    titleEn: "Intergalactic Medium",
    description:
      "銀河と銀河の間に広がる希薄なガス。EoR中は中性水素が支配的で、電離が進むにつれてHII領域（電離バブル）が形成・成長する。",
    tags: ["IGM", "電離バブル", "HII領域"],
    difficulty: "基礎",
    icon: "⬡",
    color: "from-violet-900/40 to-fuchsia-900/20",
    href: "/topics/igm",
    keywords: ["IGM", "銀河間物質", "電離バブル", "HII", "中性分率", "電離分率"],
  },
  {
    id: "simulations",
    title: "数値シミュレーション",
    titleEn: "Numerical Simulations",
    description:
      "N体シミュレーション・輻射輸送コードを用いてEoRを再現する。代表的コード：21cmFAST、GADGET、CODEXなど。",
    tags: ["シミュレーション", "輻射輸送", "N体"],
    difficulty: "発展",
    icon: "⚙",
    color: "from-gray-900/40 to-zinc-900/20",
    href: "/topics/simulations",
    keywords: ["シミュレーション", "simulation", "21cmFAST", "N体", "輻射輸送", "数値計算"],
  },
  {
    id: "power-spectrum",
    title: "パワースペクトル解析",
    titleEn: "Power Spectrum Analysis",
    description:
      "21cm輝度温度のパワースペクトルは中性水素の空間分布の統計を表す。SKAやHERAによる観測の主要ターゲット。",
    tags: ["パワースペクトル", "統計", "SKA"],
    difficulty: "発展",
    icon: "∿",
    color: "from-blue-900/40 to-indigo-900/20",
    href: "/topics/power-spectrum",
    keywords: ["パワースペクトル", "power spectrum", "SKA", "HERA", "輝度温度", "フーリエ"],
  },
];

export function searchTopics(query: string): Topic[] {
  if (!query.trim()) return TOPICS;
  const q = query.toLowerCase();
  return TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.titleEn.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
}
