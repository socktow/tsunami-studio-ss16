"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

// Cấu trúc icon role tương tự trang Player để đồng bộ
const ROLE_ICONS = {
  TOP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png",
  JUNGLE: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png",
  MID: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png",
  ADC: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png",
  SUP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png",
};

export default function TeamDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        const res = await fetch(`/api/teams/${id}`);
        if (!res.ok) throw new Error("NODE_NOT_FOUND");
        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono">
      <div className="text-emerald-500 animate-pulse tracking-[0.5em] text-sm">INITIALIZING_DECRYPT_PROTOCOL...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-4 md:p-10 selection:bg-emerald-500 selection:text-black">
      {/* 🟦 CYBER GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        
        {/* 🛰️ NAV SYSTEM */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 hover:text-white transition-all group"
        >
          <span className="border border-emerald-500/30 px-2 py-1 group-hover:border-emerald-500 transition-colors">{"<<"}</span> 
          Return_to_Main_Frame
        </button>

        {/* 🛡️ COMMAND CENTER (HEADER) */}
        <header className="relative border border-emerald-500/30 bg-black/90 p-1 md:p-1 mb-16 shadow-[0_0_60px_rgba(16,185,129,0.05)]">
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          
          <div className="flex flex-col xl:flex-row border border-emerald-500/10">
            {/* Logo Section */}
            <div className="xl:w-80 p-8 flex items-center justify-center border-b xl:border-b-0 xl:border-r border-emerald-500/20 bg-emerald-500/[0.02] relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-48 w-48 transition-transform duration-500 group-hover:scale-110">
                  <img src={team?.logo} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]" alt="Team Logo" />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 relative overflow-hidden">
               {/* Background Watermark */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[18rem] font-black text-white/[0.02] italic pointer-events-none uppercase select-none">
                {team?.tagName}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[2px] w-12 bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60">Division_Established</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                  {team?.name} <span className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">.{team?.tagName}</span>
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
                  <div className="bg-white/[0.03] border-l-2 border-emerald-500 p-4">
                    <span className="block text-[9px] text-emerald-500/40 uppercase tracking-widest mb-1">Coach</span>
                    <span className="text-lg font-black text-white uppercase italic">{team?.coach || "CLASSIFIED"}</span>
                  </div>
                  <div className="bg-white/[0.03] border-l-2 border-emerald-500/20 p-4">
                    <span className="block text-[9px] text-emerald-500/40 uppercase tracking-widest mb-1">Player_Active</span>
                    <span className="text-lg font-black text-white uppercase italic">{team?.players?.length || 0} Player </span>
                  </div>
                  <div className="bg-white/[0.03] border-l-2 border-emerald-500/20 p-4">
                    <span className="block text-[9px] text-emerald-500/40 uppercase tracking-widest mb-1">Division_Color</span>
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-12 border border-white/20 shadow-lg" style={{ backgroundColor: team?.color }}></div>
                        <span className="text-[10px] text-white/40 uppercase">{team?.color}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 🧬 OPERATIVES GRID (BENTO NODES) */}
        <div className="mb-8 flex items-end gap-6 border-b border-emerald-500/10 pb-6">
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] italic">Active_Roster_Manifest</h3>
            <div className="flex-1 h-[1px] bg-emerald-500/10 mb-2"></div>
            <span className="text-[10px] text-emerald-500/40 font-bold">TOTAL_RECORDS: {team?.players?.length || 0}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {team?.players?.length > 0 ? (
              team.players.map((p, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p.id}
                  className="relative group bg-[#080808] border border-emerald-500/10 p-5 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 clip-path-corner pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

                  <div className="flex gap-6 relative z-10">
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0">
                      <div className="h-24 w-24 bg-black border border-emerald-500/20 p-1 relative group-hover:border-emerald-500/60 transition-colors">
                        <img src={p.avatar} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        
                        {/* Role Indicator Overlay */}
                        <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-black p-1 shadow-lg">
                           <img src={ROLE_ICONS[p.role]} className="w-5 h-5 invert" alt={p.role} />
                        </div>
                      </div>
                    </div>

                    {/* Data Section */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[8px] text-emerald-500/40 uppercase tracking-widest font-bold">Operative_ID: {p.id.toString().padStart(3, '0')}</span>
                         <div className="h-[1px] w-6 bg-emerald-500/20"></div>
                      </div>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors mb-2">
                        {p.nickname}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 text-emerald-300 font-bold uppercase">{p.role}</span>
                        <div className="flex gap-1">
                           {[1,2,3].map(i => <div key={i} className="h-1 w-3 bg-emerald-500/40 group-hover:bg-emerald-500 transition-colors" style={{ transitionDelay: `${i*50}ms` }}></div>)}
                        </div>
                      </div>
                    </div>

                    {/* Side Action/Status */}
                    <div className="flex flex-col justify-between items-end">
                       <div className="w-1 h-8 bg-emerald-500/20 group-hover:bg-emerald-500 group-hover:animate-pulse"></div>
                       <span className="text-[8px] text-emerald-500/20 group-hover:text-emerald-500 font-black uppercase transform -rotate-90 origin-right transition-colors">Verified</span>
                    </div>
                  </div>

                  {/* Hover Scanline Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_3px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 border border-dashed border-emerald-500/20 flex flex-col items-center justify-center bg-emerald-500/[0.01]">
                  <div className="w-16 h-16 border border-emerald-500/20 flex items-center justify-center mb-6 animate-spin">
                    <div className="w-8 h-8 bg-emerald-500/20"></div>
                  </div>
                  <p className="text-[10px] tracking-[0.5em] text-emerald-500/40 uppercase font-black">Data_Node_Empty: No_Operatives_Found</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 📊 SYSTEM FOOTER */}
        <footer className="mt-24 pt-12 border-t border-emerald-500/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-[9px] text-emerald-500/30 uppercase tracking-[0.2em] leading-relaxed font-bold">
               {">>"} CORE_SYNC_COMPLETED...<br/>
               {">>"} ALL_OPERATIVES_ACCOUNTED_FOR...<br/>
               {">>"} SYSTEM_LOG: DIVISION_{id}_STABLE.
            </div>
            <div className="flex justify-end items-center gap-8">
                <div className="hidden md:block text-right">
                    <span className="block text-[8px] text-emerald-500/40 uppercase mb-1">Terminal_Security</span>
                    <span className="text-xs font-black text-white bg-emerald-500/10 px-3 py-1 border border-emerald-500/30">LEVEL_04_ENCRYPTION</span>
                </div>
                <div className="h-12 w-12 border border-emerald-500/30 flex items-center justify-center relative group cursor-crosshair">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="w-3 h-3 bg-emerald-500 animate-ping"></div>
                </div>
            </div>
        </footer>
      </div>

      <style jsx>{`
        .clip-path-corner {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
      `}</style>
    </div>
  );
}