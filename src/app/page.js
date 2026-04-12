"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import pkg from "../../package.json"; 

export default function Home() {
  const [ping, setPing] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 10) + 5);
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const libraries = Object.entries(pkg.dependencies).slice(0, 12);

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-800 p-6 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Background Decor: Quầng sáng nhẹ nhàng cho nền trắng */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[100px] pointer-events-none" />
      
      <div className="h-full max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* HEADER: HIỆN ĐẠI & RÕ RÀNG */}
        <header className="flex justify-between items-center bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
              TSUNAMI <span className="text-blue-600">MANIFEST</span>
            </h1>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Project Repository</p>
              <p className="text-sm font-mono font-bold text-slate-600">{pkg.name} — v{pkg.version}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10 font-mono">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-black text-slate-400 uppercase">API Latency</span>
              <span className="text-xl font-bold text-green-500 tracking-tighter">{ping}ms</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-black text-slate-400 uppercase">System Clock</span>
              <span className="text-xl font-bold text-slate-900 tracking-tighter">{time}</span>
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* CORE STACK: THƯ VIỆN ĐƯỢC HIGHLIGHT MẠNH KHI HOVER */}
          <section className="col-span-12 lg:col-span-8 flex flex-col min-h-0 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Core Dependencies</h2>
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black rounded-full border border-blue-100 uppercase tracking-widest">
                Latest Stack
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
              {libraries.map(([name, version], i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={name} 
                  className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent 
                             hover:bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 
                             cursor-default transition-all duration-300"
                >
                  <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{name}</span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100">
                    {version.replace("^", "")}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ASIDE: ARCHITECT & LOGS */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
            
            {/* AUTHOR CARD */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-500/20">
              <div className="absolute -top-6 -right-6 text-white/10 text-[12rem] font-black italic pointer-events-none">C</div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-100/70 mb-2">Lead Architect</p>
                <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic">ChuChu</h3>
              </div>
              <div className="mt-12 flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Tsunami Studio verified</p>
              </div>
            </div>

            {/* SYSTEM LOGS */}
            <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Environment Logs</h3>
                <div className="space-y-4">
                  <MetaRow label="Platform" value="Vercel Edge" />
                  <MetaRow label="Environment" value="Production" />
                  <MetaRow label="Security" value="AES-256" />
                </div>
              </div>

              {/* Visual Decorative (Waveform) */}
              <div className="mt-auto h-12 flex items-end gap-1.5 justify-center">
                {[...Array(24)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [8, Math.random() * 32 + 8, 8] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05 }}
                    className="w-[3px] bg-blue-200 rounded-full group-hover:bg-blue-500 transition-colors"
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="flex justify-between items-center bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
            POWERED BY <span className="text-blue-600">TSUNAMI STUDIO</span>
          </p>
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase italic">
            © 2026 Author: <span className="text-slate-900 underline decoration-blue-500 decoration-2">ChuChu</span>
          </p>
        </footer>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-mono font-bold text-slate-900 italic">{value}</span>
    </div>
  );
}