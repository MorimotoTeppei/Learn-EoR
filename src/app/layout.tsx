import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Learn EoR — 宇宙再電離を学ぶ",
  description: "宇宙再電離（Epoch of Reionization）をインタラクティブに学ぶための学習ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-gray-200">
        {children}
      </body>
    </html>
  );
}
