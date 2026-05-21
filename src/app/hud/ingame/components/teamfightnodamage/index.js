"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScoreboardBottomSelector } from '@/hooks/useLeagueSelector';
import { IMAGE_BASE_URL } from "@/lib/constants";

const formatUrl = (url) => {
  if (!url) return "";
  if (typeof url !== 'string') url = String(url);
  if (url.startsWith('http')) return url;
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const PlayerCell = ({ player }) => {
  if (!player) return null;

  const champImg = formatUrl(player.champ);
  const sp1Img = formatUrl(player.spell1?.iconAsset);
  const sp2Img = formatUrl(player.spell2?.iconAsset);
  const ultImg = formatUrl(player.ulti?.iconAsset);
  
  const isUltReady = player.ulti?.readyAt === 0 || player.ulti?.cooldown === 0 || player.ulti?.cooldown === undefined;

  return (
    <div className="w-[76px] flex flex-col items-center bg-zinc-950/60 p-1 rounded-md border border-zinc-900/50">
      
      {/* PHẦN TRÊN: ULTI (TRÁI) & SPELLS (PHẢI) */}
      <div className="flex gap-1 mb-1.5 w-full justify-center">
        {/* Ulti - Ô vàng bên trái */}
        <div className={`w-[34px] h-[34px] rounded-sm border-2 flex items-center justify-center overflow-hidden bg-zinc-900 transition-all ${
          isUltReady ? "border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "border-zinc-700"
        }`}>
          {ultImg ? (
            <img src={ultImg} alt="R" className={`w-full h-full object-cover ${!isUltReady ? "grayscale opacity-50" : ""}`} />
          ) : (
            <div className={`w-3 h-3 rounded-full ${isUltReady ? "bg-amber-400" : "bg-zinc-700"}`} />
          )}
        </div>
        
        {/* Spells - Xếp dọc bên phải */}
        <div className="flex flex-col gap-0.5">
          <div className="w-[16px] h-[16px] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            {sp1Img && <img src={sp1Img} alt="D" className="w-full h-full object-cover" />}
          </div>
          <div className="w-[16px] h-[16px] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            {sp2Img && <img src={sp2Img} alt="F" className="w-full h-full object-cover" />}
          </div>
        </div>
      </div>

      {/* ẢNH TƯỚNG */}
      <div className="relative w-[56px] h-[56px] bg-zinc-900 border border-zinc-800 rounded overflow-hidden mb-1">
        {champImg ? (
          <img src={champImg} alt={player.name} className={`w-full h-full object-cover ${player.respawnAt > 0 ? "grayscale brightness-[0.2]" : ""}`} />
        ) : <div className="w-full h-full bg-zinc-800" />}
        
        {player.respawnAt > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[14px] font-black text-rose-500 bg-black/50">
            {Math.ceil(player.respawnAt)}
          </div>
        )}
      </div>

      {/* TÊN & THANH CHỈ SỐ */}
      <div className="text-[8px] text-zinc-400 font-medium truncate w-full text-center mb-0.5">{player.name}</div>
      <div className="flex items-center gap-1 w-full bg-black/50 p-0.5 border border-zinc-800 rounded-sm">
        <div className="text-[9px] font-bold text-zinc-100 min-w-[12px] text-center">{player.level}</div>
        <div className="flex-1 flex flex-col gap-[1px]">
          <div className="w-full h-[4px] bg-black rounded-sm overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${player.hp?.pct}%` }} /></div>
          <div className="w-full h-[2px] bg-black rounded-sm overflow-hidden"><div className="h-full bg-sky-500" style={{ width: `${player.mp?.pct}%` }} /></div>
        </div>
      </div>
    </div>
  );
};

const TeamFightNoDamage = () => {
  const selectorData = useScoreboardBottomSelector();
  const blueTeam = selectorData?.teams?.[0];
  const redTeam = selectorData?.teams?.[1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[988px] h-[170px] flex items-center justify-between px-4 z-[9999] bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800"
    >
      <div className="flex gap-1.5 items-center">
        {blueTeam?.tag && <div className="text-[10px] font-black text-cyan-400 [writing-mode:vertical-lr] rotate-180 opacity-50">{blueTeam.tag}</div>}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <PlayerCell key={`b-${i}`} player={blueTeam?.players?.[i]} />)}
        </div>
      </div>

      <div className="text-[10px] text-zinc-600 font-bold tracking-widest italic">VS</div>

      <div className="flex gap-1.5 items-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <PlayerCell key={`r-${i}`} player={redTeam?.players?.[i]} />)}
        </div>
        {redTeam?.tag && <div className="text-[10px] font-black text-amber-500 [writing-mode:vertical-lr] opacity-50">{redTeam.tag}</div>}
      </div>
    </motion.div>
  );
};

export default TeamFightNoDamage;