export type Difficulty = "入門" | "基礎" | "応用" | "発展";

export interface Article {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: Difficulty;
  href: string;
  keywords: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "visibility",
    title: "電波干渉計 Visibility とフーリエ変換の直感的理解",
    description:
      "MWA（基線長 55m）のデータを例に、visibilityの物理的意味とCNNの周波数方向への畳み込みがなぜ不適切かを視覚的に解説します。",
    tags: ["Visibility", "フーリエ変換", "干渉計", "MWA"],
    difficulty: "基礎",
    href: "/articles/visibility",
    keywords: ["visibility", "フーリエ", "干渉計", "u-v平面", "CNN", "MWA", "基線", "van Cittert-Zernike"],
  },
];

export function searchArticles(query: string): Article[] {
  if (!query.trim()) return ARTICLES;
  const q = query.toLowerCase();
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      a.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
}
