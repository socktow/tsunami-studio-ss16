"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import pkg from "../../package.json";

export default function IndustrialUI() {
  const [mounted, setMounted] = useState(false);
  const [ping, setPing] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 10) + 5);
      setTime(new Date().toLocaleTimeString('vi-VN', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-screen bg-[#09090b]" />;

  const libraries = Object.entries(pkg.dependencies).slice(0, 12);

  return (
    <div className="h-screen w-full bg-[#09090b] text-zinc-400 p-4 lg:p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 🛠️ TOP UTILITY BAR */}
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
            System_Operational // {pkg.version}
          </span>
        </div>
        <div className="flex gap-8 font-mono text-[11px]">
          <div className="flex gap-2">
            <span className="text-zinc-600">LATENCY:</span>
            <span className="text-emerald-500">{ping}ms</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-600">LOCAL_TIME:</span>
            <span className="text-zinc-200">{time}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 h-[calc(100%-80px)]">
        
        {/* 📑 MAIN CONTENT AREA */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <header>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-100 mb-2">
              TSUNAMI<span className="text-zinc-500">.MANIFEST</span>
            </h1>
            <p className="text-sm text-zinc-500 max-w-md">
              Cấu trúc tài liệu kỹ thuật và quản lý tài nguyên hệ thống cho dự án truyền thông tích hợp.
            </p>
          </header>

          <section className="flex-1 overflow-hidden flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-sm p-1">
            <div className="bg-zinc-800/50 p-3 flex justify-between items-center border-b border-zinc-800">
              <span className="text-[10px] font-bold tracking-widest uppercase">Dependency_Registry</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                <div className="w-2 h-2 bg-zinc-700 rounded-full" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-zinc-600 border-b border-zinc-800 uppercase tracking-widest">
                    <th className="pb-3 font-bold">Package Name</th>
                    <th className="pb-3 font-bold text-right">Version</th>
                    <th className="pb-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {libraries.map(([name, version]) => (
                    <tr key={name} className="border-b border-zinc-800/50 group hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 text-zinc-300 group-hover:text-emerald-400 transition-colors">{name}</td>
                      <td className="py-4 text-right text-zinc-500">{version.replace("^", "")}</td>
                      <td className="py-4 text-right">
                        <span className="text-[9px] px-2 py-0.5 border border-emerald-500/30 text-emerald-500 rounded-sm">STABLE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 🧬 SIDEBAR INFO */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* PROFILE CARD */}
          <div className="bg-zinc-100 p-8 flex flex-col justify-between h-48 rounded-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Architect</p>
              <h3 className="text-4xl font-black text-zinc-950 uppercase italic tracking-tighter">ChuChu</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-950 border-b-2 border-zinc-950">VERIFIED OPERATOR</span>
            </div>
          </div>

          {/* SYSTEM LOGS */}
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500" /> Environment_Logs
            </h3>
            <div className="space-y-4 font-mono text-[12px]">
              <div className="flex justify-between">
                <span className="text-zinc-600">HOSTNAME</span>
                <span className="text-zinc-300">TSUNAMI-V3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">NODE_ENV</span>
                <span className="text-zinc-300">PRODUCTION</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">REGION</span>
                <span className="text-zinc-300">SEA-VN</span>
              </div>
            </div>

            {/* MINIMAL DATA WAVE */}
            <div className="mt-auto pt-8 border-t border-zinc-800">
              <div className="flex items-end gap-1 h-12">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, (i % 3 === 0 ? 30 : 12), 4] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                    className="flex-1 bg-zinc-800 group-hover:bg-emerald-500 transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button className="w-full bg-zinc-800 hover:bg-emerald-600 text-white py-4 font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-[0.98]">
            Deploy Manifest
          </button>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}