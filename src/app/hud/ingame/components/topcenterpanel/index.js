"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScoreboardSelector } from "@/hooks/useLeagueSelector";
import { formatGold, formatTime, getDragonIcon } from "@/lib/utils";
import { ICONS } from "@/lib/constants";

const TopCenterPanel = () => {
  const data = useScoreboardSelector();

  // Nếu chưa có dữ liệu, không hiển thị gì cả
  if (!data) return null;

  const { blueTeam, redTeam, gameTime, bestOf } = data;

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-0 left-0 w-full flex flex-col items-center pointer-events-none mt-1 font-sans select-none origin-top z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col items-center drop-shadow-2xl">
          
          {/* MAIN BAR: Logo, Gold, Kills */}
          <motion.div className="flex items-center bg-black/70 text-white h-13 relative overflow-hidden rounded-t-lg px-2 border-b border-white/5 backdrop-blur-md">
            <div className="flex items-center px-2 gap-4">
               <SeriesScore wins={blueTeam?.seriesScore?.wins} bestOf={bestOf} />
               <TeamLogo src={ICONS.LOGOS.T1} name="T1" />
               <TeamStats gold={blueTeam.gold} towers={blueTeam.towers} side="blue" />
            </div>

            <div className="flex items-center justify-center px-8 h-full gap-4 border-x border-white/5 bg-white/5">
              <span className="text-3xl font-black tabular-nums">{blueTeam.kills}</span>
              <VCSLogo />
              <span className="text-3xl font-black tabular-nums">{redTeam.kills}</span>
            </div>

            <div className="flex items-center px-2 gap-4 flex-row-reverse">
               <SeriesScore wins={redTeam?.seriesScore?.wins} bestOf={bestOf} />
               <TeamLogo src={ICONS.LOGOS.BLG} name="BLG" />
               <TeamStats gold={redTeam.gold} towers={redTeam.towers} side="red" />
            </div>
          </motion.div>

          {/* SUB BAR: Dragons, Grubs, Timer */}
          <motion.div className="relative w-full h-8 flex items-center rounded-b-lg border-t border-white/5 bg-zinc-950/90 backdrop-blur-sm">
            {/* Blue Side Items */}
            <div className="flex-1 flex items-center justify-between px-4">
              <div className="flex gap-1">
                {blueTeam.dragons?.map((d, i) => <Dragon key={i} type={d} />)}
              </div>
              <div className="flex gap-3">
                <MiniStat icon={ICONS.BLUE_PLATES} value={blueTeam.towerPlates} />
                <MiniStat icon={ICONS.GRUBS} value={blueTeam.grubs} />
              </div>
            </div>

            {/* Timer Central */}
            <div className="w-24 text-center bg-white/10 rounded-full px-2 border border-white/10 mx-2">
              <span className="font-mono font-bold text-white">{formatTime(gameTime)}</span>
            </div>

            {/* Red Side Items */}
            <div className="flex-1 flex items-center justify-between px-4 flex-row-reverse">
              <div className="flex gap-1">
                {redTeam.dragons?.map((d, i) => <Dragon key={i} type={d} />)}
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <MiniStat icon={ICONS.RED_PLATES} value={redTeam.towerPlates} />
                <MiniStat icon={ICONS.GRUBS} value={redTeam.grubs} />
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- SUB COMPONENTS (Giữ nguyên logic của bạn nhưng tối ưu CSS) ---

const TeamLogo = ({ src, name }) => (
  <div className="flex items-center gap-2">
    <img src={src} className="w-9 h-9 object-contain" alt={name} />
    <span className="text-xl font-black italic tracking-tighter">{name}</span>
  </div>
);

const TeamStats = ({ gold, towers, side }) => (
  <div className={`flex items-center gap-3 ${side === 'red' ? 'flex-row-reverse' : ''}`}>
    <div className="flex items-center gap-1">
      <img src={ICONS.GOLD} className="w-3.5 h-3.5" alt="gold" />
      <span className="font-bold tabular-nums text-sm">{formatGold(gold)}</span>
    </div>
    <div className="flex items-center gap-1">
      <img src={ICONS.TOWER} className="w-3.5 h-3.5 opacity-70" alt="towers" />
      <span className="font-bold text-sm">{towers}</span>
    </div>
  </div>
);

const Dragon = ({ type }) => (
  <img src={getDragonIcon(type)} className="w-5 h-5 object-contain brightness-110 drop-shadow-sm" alt="dragon" />
);

const MiniStat = ({ icon, value }) => (
  <div className="flex items-center gap-1">
    <img src={icon} className="w-3.5 h-3.5" alt="stat" />
    <span className="text-[10px] font-black">{value}</span>
  </div>
);

const SeriesScore = ({ wins = 0, bestOf = 3 }) => (
  <div className="flex flex-col gap-1 w-1.5">
    {[...Array(bestOf === 5 ? 3 : 2)].map((_, i) => (
      <div 
        key={i} 
        className={`h-1 w-full rounded-full transition-colors duration-500 ${i < wins ? "bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]" : "bg-zinc-800"}`} 
      />
    ))}
  </div>
);

const VCSLogo = () => (
  <div className="relative group">
    <img src={ICONS.LOGOS.VCS} className="w-8 h-8 object-contain" alt="VCS" />
    <motion.div 
      className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ repeat: Infinity, duration: 3 }}
    />
  </div>
);

export default TopCenterPanel;