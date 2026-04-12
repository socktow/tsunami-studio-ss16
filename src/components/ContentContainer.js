"use client";

import { usePathname } from "next/navigation";

export default function ContentContainer({ children }) {
  const pathname = usePathname();
  const isOverlay = pathname?.startsWith("/overlay");

  return (
    <main className={`flex-1 transition-all duration-300 ${isOverlay ? "pl-0" : "pl-64"}`}>
      <div className="min-h-screen">
        {children}
      </div>
    </main>
  );
}