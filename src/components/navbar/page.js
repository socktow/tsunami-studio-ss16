"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  // Không hiển thị Navbar trên các trang Overlay đặc biệt
  if (pathname?.startsWith("/overlay") || pathname?.startsWith("/hud/ingame")) return null;

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navLinks = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: "📊",
      subLinks: [
        { name: "Analytics", href: "/dashboard/analytics" },
        { name: "System Logs", href: "/dashboard/logs" },
      ]
    },
    { 
      name: "Tournament", 
      href: "/tournament", 
      icon: "🏆",
      subLinks: [
        { name: "Controller", href: "/tournament/controller" },
        { name: "Match History", href: "/tournament/history" },
      ]
    },
    { name: "Teams", href: "/team", icon: "👥" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#09090b] border-r border-zinc-800 flex flex-col font-sans">
      
      {/* 🛠️ LOGO SECTION */}
      <div className="p-8 mb-4">
        <Link href="/" className="group block">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-emerald-500 rounded-sm group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-xl font-black tracking-tighter text-zinc-100 uppercase">
              Tsunami<span className="text-zinc-500">.ST</span>
            </span>
          </div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Industrial_Protocol</p>
        </Link>
      </div>

      {/* 🧭 NAVIGATION WITH SUB-NAV */}
      <div className="flex flex-col px-4 gap-1 flex-1 overflow-y-auto custom-sidebar-scrollbar">
        {navLinks.map((link) => {
          const hasSubLinks = link.subLinks && link.subLinks.length > 0;
          const isParentActive = pathname.startsWith(link.href);
          const isOpen = openMenus[link.name] || isParentActive;

          return (
            <div key={link.name} className="flex flex-col gap-1">
              <div
                onClick={() => hasSubLinks && toggleMenu(link.name)}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-sm text-[13px] font-bold cursor-pointer transition-all ${
                  isParentActive && !hasSubLinks
                    ? "bg-zinc-800/80 text-emerald-400 border border-zinc-700/50 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {/* Active Indicator Bar */}
                {isParentActive && !hasSubLinks && (
                  <motion.div layoutId="nav-glow" className="absolute left-0 w-[2px] h-4 bg-emerald-500" />
                )}
                
                <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                  {link.icon}
                </span>
                
                <span className="uppercase tracking-wider flex-1">
                  {hasSubLinks ? link.name : <Link href={link.href}>{link.name}</Link>}
                </span>

                {hasSubLinks && (
                  <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[9px] text-zinc-700 group-hover:text-zinc-400"
                  >
                    ▼
                  </motion.span>
                )}
              </div>

              {/* SUB-NAV ANIMATION */}
              <AnimatePresence>
                {hasSubLinks && isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col ml-10 border-l border-zinc-800/50"
                  >
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                          pathname === sub.href 
                            ? "text-emerald-500" 
                            : "text-zinc-600 hover:text-zinc-300"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 👤 BOTTOM PROFILE: NAME & ROLE ONLY */}
      <div className="p-8 mt-auto border-t border-zinc-800/50">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-black text-zinc-100 uppercase tracking-tighter leading-tight">
            ChuChu.Admin
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em]">
            Lead Architect
          </span>
        </div>
      </div>

    </nav>
  );
}