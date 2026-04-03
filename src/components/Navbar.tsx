"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "ホーム" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0f1117] border-b border-[#21262d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            E
          </div>
          <span className="font-semibold text-[#e6edf3] text-sm">
            Learn EoR
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  active
                    ? "text-indigo-400 bg-indigo-500/10"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
