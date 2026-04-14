"use client";
import React from "react";
import { useLeagueData } from "@/app/overlay/layout"; 
import { motion, AnimatePresence } from "framer-motion";
import { formatGold, formatTime, getDragonIcon } from "@/lib/utils";
import { ICONS } from "@/lib/constants";

export default function TopScoreboard() {
  const { gameData } = useLeagueData();
  const scoreboard = gameData?.scoreboard;

  if (!scoreboard || !scoreboard.teams || scoreboard.teams.length < 2) return null;

  const blueTeam = scoreboard.teams[0];
  const redTeam = scoreboard.teams[1];
  const gameTime = gameData.gameTime || scoreboard.gameTime || 0;
  const bestOf = scoreboard.bestOf || 3;

  return (
    <AnimatePresence>
      <motion.div className="absolute top-0 left-0 w-full flex flex-col items-center pointer-events-none mt-1 font-sans select-none origin-top">
        <div className="flex flex-col items-center drop-shadow-2xl overflow-visible">
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="flex items-center bg-black/70 text-white h-13 relative overflow-hidden rounded-t-lg px-2 z-10 border-b border-white/5"
          >
            <div className="flex items-center px-2 gap-4">
               <SeriesScore wins={blueTeam?.seriesScore?.wins} bestOf={bestOf} />
               <TeamLogo src={ICONS.LOGOS.T1} name="T1" />
               <TeamStats gold={blueTeam.gold} towers={blueTeam.towers} side="blue" />
            </div>

            <div className="flex items-center justify-center px-8 h-full gap-4 border-x border-white/5">
              <span className="text-3xl font-black tabular-nums">{blueTeam.kills}</span>
              <VCSLogo />
              <span className="text-3xl font-black tabular-nums">{redTeam.kills}</span>
            </div>
            <div className="flex items-center px-2 gap-4 flex-row-reverse">
               <SeriesScore wins={redTeam?.seriesScore?.wins} bestOf={bestOf} side="red" />
               <TeamLogo src={ICONS.LOGOS.BLG} name="BLG" />
               <TeamStats gold={redTeam.gold} towers={redTeam.towers} side="red" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-8 flex items-center rounded-b-lg border-t border-white/5 bg-gradient-to-r from-transparent via-zinc-950/90 to-transparent"
          >
            {/* Blue Dragons & Plates */}
            <div className="flex-1 flex items-center justify-between px-4">
              <div className="flex gap-1">{blueTeam.dragons?.map((d, i) => <Dragon key={i} type={d} />)}</div>
              <div className="flex gap-3">
                <MiniStat icon={ICONS.BLUE_PLATES} value={blueTeam.towerPlates} />
                <MiniStat icon={ICONS.GRUBS} value={blueTeam.grubs} />
              </div>
            </div>

            {/* Timer */}
            <div className="w-24 text-center bg-white/5 rounded-full px-2 border border-white/10">
              <span className="font-mono font-bold">{formatTime(gameTime)}</span>
            </div>

            {/* Red Dragons & Plates */}
            <div className="flex-1 flex items-center justify-between px-4 flex-row-reverse">
              <div className="flex gap-1">{redTeam.dragons?.map((d, i) => <Dragon key={i} type={d} />)}</div>
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
}
const TeamLogo = ({ src, name }) => (
  <div className="flex items-center gap-2">
    <img src={src} className="w-10 h-10 object-contain" alt={name} />
    <span className="text-xl font-black">{name}</span>
  </div>
);

const TeamStats = ({ gold, towers, side }) => (
  <div className={`flex items-center gap-3 ${side === 'red' ? 'flex-row-reverse' : ''}`}>
    <div className="flex items-center gap-1">
      <img src={ICONS.GOLD} className="w-4 h-4" />
      <span className="font-bold tabular-nums">{formatGold(gold)}</span>
    </div>
    <div className="flex items-center gap-1">
      <img src={ICONS.TOWER} className="w-4 h-4 opacity-70" />
      <span className="font-bold">{towers}</span>
    </div>
  </div>
);

const Dragon = ({ type }) => (
  <img src={getDragonIcon(type)} className="w-6 h-6 object-contain brightness-125 drop-shadow-md" />
);

const MiniStat = ({ icon, value }) => (
  <div className="flex items-center gap-1">
    <img src={icon} className="w-4 h-4" />
    <span className="text-xs font-black">{value}</span>
  </div>
);

const SeriesScore = ({ wins, bestOf }) => (
  <div className="flex flex-col gap-1 w-2">
    {[...Array(bestOf === 5 ? 3 : 2)].map((_, i) => (
      <div key={i} className={`h-1 w-full rounded-full ${i < wins ? "bg-white shadow-[0_0_5px_white]" : "bg-zinc-800"}`} />
    ))}
  </div>
);

const VCSLogo = () => (
  <motion.div className="relative">
    <img src={ICONS.LOGOS.VCS} className="w-10 h-10 object-contain invert grayscale" />
    <div className="absolute inset-0 bg-white/10 blur-lg rounded-full" />
  </motion.div>
);