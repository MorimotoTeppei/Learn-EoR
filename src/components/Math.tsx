"use client";
import { InlineMath, BlockMath } from "react-katex";

/** インライン数式: <IM math="x_{\rm HI}" /> */
export function IM({ math }: { math: string }) {
  return <InlineMath math={math} />;
}

/** ブロック数式（中央揃え・独立行): <BM math="\frac{a}{b}" /> */
export function BM({ math }: { math: string }) {
  return (
    <div className="my-4 px-4 py-3 bg-[#161b22] border border-[#21262d] rounded-lg overflow-x-auto">
      <BlockMath math={math} />
    </div>
  );
}
