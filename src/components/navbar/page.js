"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  // Ẩn hoàn toàn Sidebar nếu đường dẫn bắt đầu bằng /overlay
  if (pathname?.startsWith("/overlay")) return null;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Tournament", href: "/tournament", icon: "🏆" },
    { name: "Teams", href: "/teams", icon: "👥" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black p-6">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="mb-10 px-2">
          <Link href="/" className="text-xl font-black tracking-tighter text-blue-600">
            TSUNAMI <span className="block text-xs font-medium text-zinc-500 tracking-widest">STUDIO</span>
          </Link>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-400"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section (Tùy chọn) */}
        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600" />
            <div className="flex flex-col">
              <p className="text-xs font-bold">Admin</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Live Controller</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}