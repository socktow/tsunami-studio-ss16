"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal as TerminalIcon, 
  Database, 
  ExternalLink, 
  Cpu, 
  Activity, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Box,
  Clock
} from "lucide-react";
import pkg from "../../package.json";

export default function IndustrialUI() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [latestVersions, setLatestVersions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("IDLE");
  const [logs, setLogs] = useState([
    { type: "sys", msg: "CORE_BOOT_SEQUENCE_COMPLETE" },
    { type: "sys", msg: "LOCAL_DB_LISTENING_ON_ROOT" }
  ]);
  
  const scrollRef = useRef(null);

  // Tự động cuộn terminal xuống dưới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('vi-VN', { hour12: false }));
    }, 1000);

    const fetchVersions = async () => {
      const deps = Object.keys(pkg.dependencies);
      const versionMap = {};
      try {
        await Promise.all(
          deps.map(async (name) => {
            try {
              const res = await fetch(`https://registry.npmjs.org/${name}/latest`);
              const data = await res.json();
              versionMap[name] = data.version;
            } catch (err) { versionMap[name] = "ERR"; }
          })
        );
        setLatestVersions(versionMap);
      } finally { setIsLoading(false); }
    };

    fetchVersions();
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg, type = "cmd") => {
    setLogs(prev => [...prev.slice(-15), { type, msg, time: new Date().toLocaleTimeString() }]);
  };

  const handleOpenPrisma = async () => {
    if (dbStatus === "CONNECTING") return;
    
    setDbStatus("CONNECTING");
    addLog("npx prisma studio --port 5555", "cmd");
    addLog("Attempting to bind instance...", "sys");

    try {
      const res = await fetch('/api/prisma-studio', { method: 'POST' });
      const data = await res.json();
      
      addLog("TCP_CONNECTION_ESTABLISHED: 127.0.0.1:5555", "success");
      window.open(data.url || 'http://localhost:5555', '_blank');
      setDbStatus("ACTIVE");
    } catch (error) {
      addLog("RUNTIME_ERROR: PORT_IN_USE_OR_REFUSED", "err");
      setDbStatus("IDLE");
    }
  };

  if (!mounted) return <div className="h-screen bg-[#09090b]" />;

  const libraries = Object.entries(pkg.dependencies);

  return (
    <div className="h-screen w-full bg-[#0b0b0d] text-zinc-400 p-4 lg:p-6 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-black tracking-[0.3em] text-zinc-100">SYSTEM_OPERATIONAL</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <Cpu size={12} className="text-zinc-600" />
            <span className="text-zinc-500">KERNEL: {pkg.version}</span>
          </div>
        </div>
        
        <div className="flex gap-8 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <Activity size={12} className={isLoading ? "animate-spin text-amber-500" : "text-emerald-500"} />
            <span className={isLoading ? "text-amber-500" : "text-emerald-500"}>
              {isLoading ? "REFRESHING_DEPS" : "SYNC_OK"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-zinc-500">
            <Clock size={12} />
            <span className="text-zinc-200 tabular-nums">{time}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* --- LEFT: MAIN MANIFEST --- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0">
          <header className="mb-4">
            <h1 className="text-6xl font-black tracking-tighter text-zinc-100 flex items-baseline gap-2">
              MANIFEST<span className="text-emerald-500 text-2xl">.</span>CORE
            </h1>
          </header>

          <div className="flex-1 min-h-0 flex flex-col bg-zinc-950/20 border border-zinc-800/60 rounded-sm overflow-hidden">
            <div className="bg-zinc-900/40 p-2 px-4 flex justify-between items-center border-b border-zinc-800/50">
              <div className="flex items-center gap-4">
                <Box size={12} className="text-zinc-500" />
                <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Registry_Entry_Table</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-[#0b0b0d] shadow-sm">
                  <tr className="text-[9px] text-zinc-600 uppercase font-black tracking-widest border-b border-zinc-800">
                    <th className="p-4 w-12 text-center">ID</th>
                    <th className="p-4">Module_Path</th>
                    <th className="p-4 w-24 text-right">Local</th>
                    <th className="p-4 w-24 text-right">Latest</th>
                    <th className="p-4 w-20 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-mono">
                  {libraries.map(([name, version], idx) => {
                    const latest = latestVersions[name];
                    const isOutdated = latest && latest !== "ERR" && version.replace(/[^0-9.]/g, "") < latest.replace(/[^0-9.]/g, "");
                    
                    return (
                      <tr key={name} className="border-b border-zinc-900/30 group hover:bg-emerald-500/[0.02] transition-colors">
                        <td className="p-4 text-zinc-800 text-center">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300 group-hover:text-emerald-400 transition-colors">{name}</span>
                            <a href={`https://www.npmjs.com/package/${name}`} target="_blank" className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-white transition-all">
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        </td>
                        <td className="p-4 text-right text-zinc-500 italic">{version.replace("^", "")}</td>
                        <td className="p-4 text-right font-bold text-zinc-400">{latest || "---"}</td>
                        <td className="p-4 text-center">
                          {isOutdated ? (
                            <AlertCircle size={14} className="text-amber-500 mx-auto animate-pulse" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-900/50 mx-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- RIGHT: DATABASE ENGINE --- */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
          
          {/* Identity Card */}
          <div className="bg-emerald-500 p-5 rounded-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[9px] font-black text-emerald-950/60 uppercase tracking-[0.2em] mb-1">Lead_Architect</p>
              <h3 className="text-4xl font-black text-[#09090b] italic tracking-tighter uppercase">ChuChu</h3>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">
              <Cpu size={120} color="#000" />
            </div>
          </div>

          {/* Terminal Console */}
          <div className="flex-1 bg-zinc-950 border border-zinc-800 flex flex-col min-h-0 shadow-2xl relative">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
              <div className="flex items-center gap-2">
                <TerminalIcon size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Database_Terminal_v1.0</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${dbStatus === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-800'}`} />
            </div>

            {/* Log Display */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar bg-black/40"
            >
              {logs.map((log, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <span className="text-zinc-700 shrink-0">[{log.time || '--:--'}]</span>
                  <span className={
                    log.type === "err" ? "text-red-500" : 
                    log.type === "success" ? "text-emerald-400 font-bold" : 
                    log.type === "cmd" ? "text-zinc-100" : "text-zinc-500 italic"
                  }>
                    {log.type === "cmd" && <ChevronRight size={10} className="inline mr-1 text-emerald-500" />}
                    {log.msg}
                  </span>
                </div>
              ))}
              {dbStatus === "CONNECTING" && (
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-emerald-500 inline-block ml-12"
                />
              )}
            </div>

            {/* Control Button */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/10">
              <button 
                onClick={handleOpenPrisma}
                disabled={dbStatus === "CONNECTING"}
                className={`w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 p-4 border transition-all ${
                  dbStatus === "CONNECTING" 
                  ? "border-amber-500/50 text-amber-500 cursor-wait" 
                  : "border-emerald-500/20 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-black"
                }`}
              >
                <Database size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  {dbStatus === "CONNECTING" ? "Opening_Port..." : "Launch_Prisma_Studio"}
                </span>
                
                {/* Scanline effect on hover */}
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              </button>
              <p className="text-[9px] mt-3 text-zinc-600 text-center font-mono uppercase tracking-tighter italic">
                Target: localhost:5555 // protocol: http
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
}