import React from 'react';

const TeamScoreboard = () => {
  return (
    /* WRAPPER: 
       - items-start: Căn nội dung lên trên cùng
       - pt-[10px]: Padding top 10px để cách mép trên đúng yêu cầu
    */
    <div className="fixed inset-0 flex justify-center items-start pt-[10px] bg-transparent pointer-events-none z-[999]">
      
      {/* SCOREBOARD CONTAINER: W-900, H-100 */}
      <div className="w-[900px] h-[100px] flex flex-col items-center select-none font-sans pointer-events-auto">
        
        {/* 1. CONTAINER CHÍNH (60px) */}
        <div className="w-full h-[60px] bg-[#0a0a0a]/95 border-b border-white/10 flex items-center relative overflow-hidden shadow-lg">
          {/* Border Blue Team */}
          <div className="absolute left-0 top-0 w-[4px] h-full bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.8)]" />
          
          {/* Team Left Content */}
          <div className="flex-1 flex items-center px-4 gap-3">
            <div className="size-10 bg-zinc-800 rounded-sm border border-white/5" /> 
            <div className="flex flex-col">
              <span className="text-white font-black text-xl leading-none italic uppercase">JDG</span>
              <span className="text-zinc-400 text-[10px] font-bold">7 - 4</span>
            </div>
            <div className="flex flex-col items-end ml-auto mr-4">
               <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-lg leading-none">68.5K</span>
                  <div className="size-4 bg-yellow-500/20 border border-yellow-500/50 rotate-45" />
               </div>
               <span className="text-blue-400 text-[10px] font-bold mt-1">+1.4K</span>
            </div>
          </div>

          {/* KILLS CENTER */}
          <div className="flex items-center justify-center gap-6 px-6 bg-gradient-to-b from-white/10 to-transparent h-full border-x border-white/5 shadow-inner">
            <span className="text-white text-3xl font-black italic tracking-tighter w-12 text-center">12</span>
            <div className="size-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-glow">
               <div className="size-4 bg-white/40 rotate-45" />
            </div>
            <span className="text-white text-3xl font-black italic tracking-tighter w-12 text-center">10</span>
          </div>

          {/* Team Right Content */}
          <div className="flex-1 flex flex-row-reverse items-center px-4 gap-3 text-right">
            <div className="size-10 bg-zinc-800 rounded-sm border border-white/5" />
            <div className="flex flex-col">
              <span className="text-white font-black text-xl leading-none italic uppercase">AL</span>
              <span className="text-zinc-400 text-[10px] font-bold">7 - 4</span>
            </div>
            <div className="flex flex-col items-start mr-auto ml-4">
               <div className="flex items-center gap-1 flex-row-reverse">
                  <span className="text-white font-bold text-lg leading-none">67.1K</span>
                  <div className="size-4 bg-yellow-500/20 border border-yellow-500/50 rotate-45" />
               </div>
               <span className="text-transparent text-[10px] mt-1">placeholder</span>
            </div>
          </div>

          {/* Border Red Team */}
          <div className="absolute right-0 top-0 w-[4px] h-full bg-yellow-500 shadow-[-2px_0_10px_rgba(234,179,8,0.8)]" />
        </div>

        {/* 2. OBJECTIVE BAR (40px) */}
        <div className="w-[88%] h-[40px] bg-zinc-950/85 flex items-center justify-between px-8 rounded-b-xl border-x border-b border-white/10 backdrop-blur-sm shadow-2xl">
          {/* Drakes Left */}
          <div className="flex gap-2.5">
             <div className="size-5 rounded-full bg-cyan-500/20 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
             <div className="size-5 rounded-full bg-green-500/20 border border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>

          {/* Time Center */}
          <div className="flex flex-col items-center">
            <span className="text-white font-mono font-black text-lg tracking-[0.2em]">38:09</span>
            <div className="w-12 h-[2px] bg-blue-500 mt-0.5 shadow-[0_0_5px_rgba(59,130,246,1)]" />
          </div>

          {/* Drakes Right */}
          <div className="flex gap-2.5 flex-row-reverse">
             <div className="size-5 rounded-full bg-purple-500/20 border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
             <div className="size-5 rounded-full bg-zinc-800 border border-white/10" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamScoreboard;