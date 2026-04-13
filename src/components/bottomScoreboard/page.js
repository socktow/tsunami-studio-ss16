import React from 'react';

const PlayerRow = ({ side, index }) => {
  const isLeft = side === "left";
  const rowBg = index % 2 === 0 ? 'bg-zinc-900/40' : 'bg-transparent';

  return (
    <div className={`flex items-center ${rowBg} h-[54px] border-b border-zinc-800/60 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      
      {/* 1. ITEMS & RUNES - Cố định width để không đè phần khác */}
      <div className={`w-[200px] flex items-center gap-1.5 px-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex gap-[1px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[22px] h-[22px] bg-zinc-950 border border-zinc-800 rounded-sm" />
          ))}
        </div>
        <div className="w-[22px] h-[22px] bg-zinc-900 border border-zinc-700/50 rounded-sm flex-shrink-0" />
        
        <div className="flex flex-col gap-[1px] justify-center items-center px-1">
          <div className="w-[18px] h-[18px] bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-full border border-yellow-500/30" />
          <div className="w-[14px] h-[14px] bg-zinc-800 rounded-full border border-zinc-700" />
        </div>
      </div>

      {/* SEPARATOR | */}
      <div className="relative w-[1px] h-9 bg-zinc-700/50 flex-shrink-0" />

      {/* 2. CỤM TRUNG TÂM (Spells + Avatar + Name/Bars) - Cố định width trung tâm */}
      <div className={`w-[210px] flex items-center gap-2 px-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Spells */}
        <div className="flex flex-col gap-[1.5px] flex-shrink-0">
          <div className="w-[17px] h-[17px] bg-yellow-500 rounded-sm shadow-sm" />
          <div className="w-[17px] h-[17px] bg-blue-600 rounded-sm shadow-sm" />
        </div>

        {/* Avatar */}
        <div className="relative w-10 h-10 border border-zinc-700 bg-zinc-900 flex-shrink-0 shadow-lg">
          <div className={`absolute -bottom-1 ${isLeft ? '-left-1' : '-right-1'} bg-black text-[9px] px-1 border border-zinc-600 z-10 font-black text-white`}>12</div>
          <div className={`absolute -top-0.5 ${isLeft ? '-right-0.5' : '-left-0.5'} w-2.5 h-2.5 bg-green-500 border border-black z-20`} />
          <div className="w-full h-full bg-zinc-800" />
        </div>

        {/* Name & Bars sát Avatar */}
        <div className={`flex flex-col justify-center flex-1 ${isLeft ? 'items-start text-left' : 'items-end text-right'}`}>
          <span className="text-[9px] font-black text-zinc-100 uppercase tracking-tighter mb-1 leading-none truncate w-full">Player Name</span>
          <div className="flex flex-col gap-[2px] w-full">
            <div className="h-1.5 w-full bg-zinc-950 rounded-[1px] border border-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-400 w-full" />
            </div>
            <div className="h-1 w-full bg-zinc-950 rounded-[1px] border border-white/5 overflow-hidden">
              <div className="h-full bg-blue-500 w-full" />
            </div>
            {/* XP Bar Fixed Logic */}
            <div className={`h-[2px] w-[80%] bg-zinc-950 rounded-full border border-white/5 overflow-hidden flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
              <div className="h-full bg-purple-500 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ECONOMY & COMBAT - Cố định width phần cuối */}
      <div className={`w-[100px] flex flex-col justify-center px-4 ${isLeft ? 'items-end' : 'items-start'}`}>
        <div className="text-[13px] font-bold text-yellow-500 font-mono leading-none tracking-tight">185</div>
        <div className={`flex items-center gap-1 whitespace-nowrap text-[12px] font-black tracking-tighter mt-1`}>
          <span className="text-zinc-100">2</span>
          <span className="text-zinc-600 opacity-50">/</span>
          <span className="text-zinc-100">0</span>
          <span className="text-zinc-600 opacity-50">/</span>
          <span className="text-zinc-100">4</span>
        </div>
      </div>
    </div>
  );
};

const GoldIndicator = ({ diff }) => {
  const isBlueLeading = diff > 0;
  const isRedLeading = diff < 0;
  const absDiff = Math.abs(diff);

  return (
    <div className="h-[54px] w-20 flex items-center justify-center relative bg-zinc-950 border-b border-zinc-800/50">
      <div className={`absolute inset-0 ${isBlueLeading ? 'bg-cyan-500/5' : isRedLeading ? 'bg-rose-500/5' : ''}`} />
      
      {isBlueLeading && (
        <div className="absolute left-1.5 animate-pulse text-cyan-400">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 10 2 6 6 2" /></svg>
        </div>
      )}

      <div className={`text-[11px] font-black italic tracking-tighter z-10 ${isBlueLeading ? 'text-cyan-400' : isRedLeading ? 'text-rose-500' : 'text-zinc-500'}`}>
        {absDiff !== 0 ? absDiff : "-"}
      </div>

      {isRedLeading && (
        <div className="absolute right-1.5 animate-pulse text-rose-500">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 2 6 6 2 10" /></svg>
        </div>
      )}
    </div>
  );
};

export default function ScoreboardOverlayFinal() {
  const positions = [
    { id: 0, diff: 450 },
    { id: 1, diff: 120 },
    { id: 2, diff: -300 },
    { id: 3, diff: 0 },
    { id: 4, diff: -15}
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center select-none font-sans scale-[0.95] origin-bottom pb-2">
      <div className="flex items-stretch bg-black/95 border-t border-x border-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden rounded-t-xl">
        
        {/* TEAM LEFT - Tổng 510px */}
        <div className="flex flex-col w-[510px]">
          {positions.map((pos, idx) => <PlayerRow key={`blue-${pos.id}`} side="left" index={idx} />)}
        </div>

        {/* GOLD CENTER - 80px */}
        <div className="flex flex-col border-x border-zinc-800 bg-zinc-950">
          {positions.map((pos) => <GoldIndicator key={`gold-${pos.id}`} diff={pos.diff} />)}
        </div>

        {/* TEAM RIGHT - Tổng 510px */}
        <div className="flex flex-col w-[510px]">
          {positions.map((pos, idx) => <PlayerRow key={`red-${pos.id}`} side="right" index={idx} />)}
        </div>

      </div>
    </div>
  );
}