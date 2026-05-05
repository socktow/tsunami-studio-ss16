"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Swords, 
  Clock, 
  Calendar,
  Hash,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// 🟦 MOCK DATA: Theo dõi từng Match đấu (Game đơn)
const MOCK_MATCHES = [
  {
    game_id: "49203185", // Giả lập GameID
    tournament: "VCS Spring 2026",
    teamA: { 
      name: "GAM", 
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8a/GAM_Esportslogo_square.png", 
      score: 1, 
      result: "WIN" 
    },
    teamB: { 
      name: "VKE", 
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/69/MVK_Esportslogo_profile.png/", 
      score: 0, 
      result: "LOSS" 
    },
    date: "2026-05-04",
    duration: "28:45",
    blue_side: "GAM",
    red_side: "VKE"
  },
  {
    game_id: "49203192",
    tournament: "VCS Spring 2026",
    teamA: { 
      name: "TS", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTXYz3bWaPWhzrJYK9pmMWmjBdOfpQMaD_fA&s", 
      score: 0, 
      result: "LOSS" 
    },
    teamB: { 
      name: "TW", 
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/19/Team_Whales_2022logo_square.png", 
      score: 1, 
      result: "WIN" 
    },
    date: "2026-05-04",
    duration: "32:10",
    blue_side: "TW",
    red_side: "TS"
  },
  {
    game_id: "49203205",
    tournament: "Tsunami Masters",
    teamA: { 
      name: "T1", 
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/7b/T1logo_without_Partner.png", 
      score: 1, 
      result: "WIN" 
    },
    teamB: { 
      name: "GEN", 
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e3/Gen.Glogo_square.png", 
      score: 0, 
      result: "LOSS" 
    },
    date: "2026-05-03",
    duration: "25:15",
    blue_side: "GEN",
    red_side: "T1"
  }
];

const MatchHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-4 md:p-10 relative">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* 📟 HEADER SYSTEM */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <History size={24} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/40 font-sans">Operation_Archive</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
              MATCH_<span className="text-emerald-500">LOGS</span>
            </h1>
          </div>

          <div className="flex flex-col gap-2">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="FILTER_BY_GAME_ID..."
                  className="bg-black border border-emerald-500/20 py-3 pl-10 pr-4 text-[11px] w-full md:w-80 outline-none focus:border-emerald-500/60 transition-all text-emerald-400 placeholder:text-emerald-900"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex justify-between items-center px-2">
                <span className="text-[8px] text-emerald-500/20 uppercase font-black tracking-widest leading-none">Live_Sync: Active</span>
                <span className="text-[8px] text-emerald-500/20 uppercase font-black tracking-widest leading-none">Nodes: {MOCK_MATCHES.length}</span>
             </div>
          </div>
        </header>

        {/* 📑 MATCH LIST */}
        <div className="space-y-4">
          <AnimatePresence>
            {MOCK_MATCHES.map((match, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={match.game_id}
                className="group relative bg-[#080808] border border-emerald-500/5 hover:border-emerald-500/30 transition-all"
              >
                {/* Win/Loss Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${match.teamA.result === 'WIN' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500/50'}`}></div>

                <div className="flex flex-col lg:flex-row items-center p-5 gap-6">
                  
                  {/* Game ID & Info */}
                  <div className="flex flex-col w-full lg:w-56 border-r border-emerald-500/10 pr-6">
                    <div className="flex items-center gap-2 mb-2">
                       <Hash size={12} className="text-emerald-500/40" />
                       <span className="text-[12px] text-white font-black tracking-widest group-hover:text-emerald-400 transition-colors">{match.game_id}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500/40 font-bold uppercase mb-4">{match.tournament}</span>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 uppercase">Timestamp</span>
                            <span className="text-[10px] text-zinc-300 font-bold">{match.date}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 uppercase">Duration</span>
                            <span className="text-[10px] text-zinc-300 font-bold">{match.duration}</span>
                        </div>
                    </div>
                  </div>

                  {/* Battle Center */}
                  <div className="flex-1 flex items-center justify-between gap-2 w-full px-4">
                    
                    {/* Team A */}
                    <div className="flex items-center gap-6 flex-1 justify-end">
                      <div className="text-right flex flex-col">
                        <span className={`text-2xl font-black italic tracking-tighter ${match.teamA.result === 'WIN' ? 'text-white' : 'text-zinc-700'}`}>
                           {match.teamA.name}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${match.teamA.result === 'WIN' ? 'text-emerald-500' : 'text-red-900'}`}>
                           {match.teamA.result === 'WIN' ? 'Victory' : 'Defeat'}
                        </span>
                      </div>
                      <div className={`h-16 w-16 bg-black border p-2 relative ${match.teamA.result === 'WIN' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-zinc-800 opacity-40'}`}>
                         <img src={match.teamA.logo} className="w-full h-full object-contain grayscale-0 group-hover:scale-110 transition-transform" />
                         {match.blue_side === match.teamA.name && <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] px-1 font-bold">BLUE</div>}
                      </div>
                    </div>

                    {/* Score VS */}
                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                       <div className="text-3xl font-black italic text-white flex items-center gap-1">
                          <span className={match.teamA.result === 'WIN' ? 'text-emerald-500' : 'text-zinc-700'}>{match.teamA.score}</span>
                          <span className="text-zinc-800">-</span>
                          <span className={match.teamB.result === 'WIN' ? 'text-emerald-500' : 'text-zinc-700'}>{match.teamB.score}</span>
                       </div>
                       <Swords size={14} className="text-emerald-500/20" />
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-6 flex-1 justify-start">
                      <div className={`h-16 w-16 bg-black border p-2 relative ${match.teamB.result === 'WIN' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-zinc-800 opacity-40'}`}>
                         <img src={match.teamB.logo} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                         {match.blue_side === match.teamB.name && <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] px-1 font-bold">BLUE</div>}
                      </div>
                      <div className="text-left flex flex-col">
                        <span className={`text-2xl font-black italic tracking-tighter ${match.teamB.result === 'WIN' ? 'text-white' : 'text-zinc-700'}`}>
                           {match.teamB.name}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${match.teamB.result === 'WIN' ? 'text-emerald-500' : 'text-red-900'}`}>
                           {match.teamB.result === 'WIN' ? 'Victory' : 'Defeat'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-4">
                    <button className="flex flex-col items-center gap-1 group/btn p-3 border border-emerald-500/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                       <ExternalLink size={16} className="text-emerald-500/40 group-hover/btn:text-emerald-500" />
                       <span className="text-[7px] font-black text-emerald-500/20 group-hover/btn:text-emerald-500">DATA_RECAP</span>
                    </button>
                    <button className="h-16 w-10 flex items-center justify-center bg-emerald-500/5 hover:bg-emerald-500 hover:text-black transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                </div>

                {/* Grid Scanline Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_3px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🛠️ FOOTER STATUS */}
        <footer className="mt-16 py-8 border-t border-emerald-500/5 flex justify-between items-center">
           <div className="flex gap-10">
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] text-zinc-600 uppercase font-black">Central_Server</span>
                 <span className="text-[10px] text-emerald-500/40 font-bold">STABLE // DA NANG NODE</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] text-zinc-600 uppercase font-black">Last_Sync</span>
                 <span className="text-[10px] text-emerald-500/40 font-bold italic">2026-05-04 05:07:07</span>
              </div>
           </div>
           <div className="text-[10px] font-black text-emerald-500/10 tracking-[0.5em] uppercase">
              Tsunami_Industrial_System
           </div>
        </footer>

      </div>
    </div>
  );
};

export default MatchHistory;