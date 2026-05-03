"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Terminal, 
  ChevronDown, 
  Activity, 
  History,
  Settings2,
  ShieldCheck
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  if (pathname?.startsWith("/overlay") || pathname?.startsWith("/hud/ingame")) return null;

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name] : !prev[name] }));
  };

  const navLinks = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={18} />,
      subLinks: [
        { name: "Analytics", href: "/dashboard/analytics", icon: <Activity size={12} /> },
        { name: "System Logs", href: "/dashboard/logs", icon: <Terminal size={12} /> },
      ]
    },
    { 
      name: "Tournament", 
      href: "/tournament", 
      icon: <Trophy size={18} />,
      subLinks: [
        { name: "Controller", href: "/tournament/controller", icon: <Settings2 size={12} /> },
        { name: "Match History", href: "/tournament/history", icon: <History size={12} /> },
      ]
    },
    { name: "Teams", href: "/team", icon: <Users size={18} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#050505] border-r border-emerald-500/10 flex flex-col font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* 🔮 LOGO SECTION: HEXAGON THEME */}
      <div className="p-8 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        <Link href="/" className="group block">
          <div className="flex items-center gap-3 mb-1">
            <div className="relative w-6 h-6 border border-emerald-500 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Tsunami<span className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">.ST</span>
            </span>
          </div>
          <p className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-[0.4em] ml-9">Protocol_v3.0</p>
        </Link>
      </div>

      {/* 🧭 NAVIGATION MODULES */}
      <div className="flex flex-col px-4 gap-2 flex-1 overflow-y-auto pt-4">
        {navLinks.map((link) => {
          const hasSubLinks = link.subLinks && link.subLinks.length > 0;
          const isParentActive = pathname.startsWith(link.href);
          const isOpen = openMenus[link.name] || isParentActive;

          return (
            <div key={link.name} className="flex flex-col">
              <div
                onClick={() => hasSubLinks && toggleMenu(link.name)}
                className={`group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border ${
                  isParentActive && !hasSubLinks
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                    : "border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 hover:border-zinc-800"
                }`}
              >
                {/* Active Accent */}
                {isParentActive && !hasSubLinks && (
                  <motion.div layoutId="nav-accent" className="absolute right-0 w-1 h-4 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                )}
                
                <span className={`transition-all duration-300 ${isParentActive ? "text-emerald-500 scale-110" : "opacity-50 group-hover:opacity-100"}`}>
                  {link.icon}
                </span>
                
                <span className="uppercase text-[11px] font-black tracking-widest flex-1">
                  {hasSubLinks ? link.name : <Link href={link.href}>{link.name}</Link>}
                </span>

                {hasSubLinks && (
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? "#10b981" : "#3f3f46" }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                )}
              </div>

              {/* SUB-NAV: BRANCHING DESIGN */}
              <AnimatePresence>
                {hasSubLinks && isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col ml-8 border-l border-emerald-500/10"
                  >
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`group flex items-center gap-3 py-3 px-6 text-[9px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                          pathname === sub.href 
                            ? "text-emerald-400 bg-emerald-500/5" 
                            : "text-zinc-600 hover:text-emerald-200 hover:bg-white/5"
                        }`}
                      >
                        {pathname === sub.href && (
                           <div className="absolute left-0 w-2 h-[1px] bg-emerald-500"></div>
                        )}
                        <span className="opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all">
                           {sub.icon}
                        </span>
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

      {/* 👤 ARCHITECT STATUS (FOOTER) */}
      <div className="p-6 mt-auto bg-emerald-500/[0.02] border-t border-emerald-500/10 relative overflow-hidden">
        {/* Decorative scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
        
        <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 border border-emerald-500/20 flex items-center justify-center bg-black">
               <ShieldCheck size={20} className="text-emerald-500/50" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-white uppercase tracking-tighter italic">
                ChuChu.Admin
              </span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                 <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">
                    Lead_Architect
                 </span>
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
}