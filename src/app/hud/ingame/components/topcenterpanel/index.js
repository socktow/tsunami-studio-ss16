"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScoreboardSelector } from "@/hooks/useLeagueSelector";
import { useScoreboardData } from "@/hooks/useApiTeamData";
import { formatGold, formatTime, getDragonIcon } from "@/lib/utils";
import { ICONS } from "@/lib/constants";
import { Timer, Zap } from "lucide-react";

const TopCenterPanel = () => {
  const data = useScoreboardSelector();
  const { matchInfo } = useScoreboardData();

  if (!data) return null;

  const { blueTeam, redTeam, gameTime } = data;
  const blueApi = matchInfo?.teamsData?.[0];
  const redApi = matchInfo?.teamsData?.[1];
  const matchType = matchInfo?.matchType || "BO3";

  const blueColor = blueApi?.color || "#2563eb";
  const redColor = redApi?.color || "#dc2626";

  const bluePP = blueTeam.baronPowerPlay || blueTeam.dragonPowerPlay;
  const redPP = redTeam.baronPowerPlay || redTeam.dragonPowerPlay;

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-0.5 left-0 w-full flex justify-center pointer-events-none z-50 select-none"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="flex flex-col items-center gap-1.5">
          
          {/* LAYER 1: MAIN SCOREBOARD & POWERPLAYS */}
          <div className="flex items-start gap-1 relative">
            
            {/* POWER PLAY TRÁI (Blue) */}
            <div className="w-[220px] flex justify-end pt-1">
              <SidePowerPlay data={bluePP} color={blueColor} side="left" gameTime={gameTime} />
            </div>

            {/* SCOREBOARD CHÍNH */}
            <div className="flex items-center h-[60px] bg-zinc-950 rounded-md border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden relative">
              {/* Blue Side */}
              <div 
                className="flex items-center px-6 gap-5 h-full min-w-[300px] justify-end relative"
                style={{ background: `linear-gradient(135deg, ${blueColor}55 0%, transparent 70%)` }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-tighter">Net Gold</span>
                  <span className="text-xl font-black text-white">{formatGold(blueTeam.gold)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white uppercase leading-none">{blueApi?.tag}</span>
                  <div className="w-10 h-10 bg-zinc-900 border border-white/10 p-1 rounded-sm">
                    <img src={blueApi?.logo} className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                <SeriesScore wins={blueApi?.score || 0} matchType={matchType} color={blueColor} />
              </div>

              {/* Center Info */}
              <div className="flex items-center px-8 h-full bg-zinc-900 border-x border-white/10 relative z-10 shadow-2xl">
                <span className="text-4xl font-black text-white w-14 text-center tabular-nums">{blueTeam.kills}</span>
                <div className="flex flex-col items-center justify-center px-4 min-w-[100px]">
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-0.5">Live</span>
                  <span className="text-xl font-black text-white font-mono leading-none">{formatTime(gameTime)}</span>
                </div>
                <span className="text-4xl font-black text-white w-14 text-center tabular-nums">{redTeam.kills}</span>
              </div>

              {/* Red Side */}
              <div 
                className="flex items-center px-6 gap-5 h-full min-w-[300px] justify-start relative flex-row-reverse"
                style={{ background: `linear-gradient(-135deg, ${redColor}55 0%, transparent 70%)` }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-tighter">Net Gold</span>
                  <span className="text-xl font-black text-white">{formatGold(redTeam.gold)}</span>
                </div>
                <div className="flex items-center gap-3 flex-row-reverse">
                  <span className="text-2xl font-black text-white uppercase leading-none">{redApi?.tag}</span>
                  <div className="w-10 h-10 bg-zinc-900 border border-white/10 p-1 rounded-sm">
                    <img src={redApi?.logo} className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                <SeriesScore wins={redApi?.score || 0} matchType={matchType} color={redColor} />
              </div>
            </div>

            {/* POWER PLAY PHẢI (Red) */}
            <div className="w-[220px] flex justify-start pt-1">
              <SidePowerPlay data={redPP} color={redColor} side="right" gameTime={gameTime} />
            </div>
          </div>

          {/* LAYER 2: OBJECTIVE BARS (Gradient & Symmetry) */}
          <div className="flex justify-center gap-24 w-full">
            <ObjectiveStrip 
                dragons={blueTeam.dragons} 
                towers={blueTeam.towers} 
                grubs={blueTeam.grubs} 
                side="left" 
                color={blueColor} 
            />
            <ObjectiveStrip 
                dragons={redTeam.dragons} 
                towers={redTeam.towers} 
                grubs={redTeam.grubs} 
                side="right" 
                color={redColor} 
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- COMPONENT POWER PLAY ---
const SidePowerPlay = ({ data, color, side, gameTime }) => {
  if (!data || gameTime > data.timeEnd) return null;

  const timeLeft = data.timeEnd - gameTime;
  const isBaron = data.type?.includes('BARON');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: side === 'left' ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative flex flex-col p-2 min-w-[190px] bg-zinc-950 border border-white/10 rounded shadow-2xl`}
      style={{ 
        background: `linear-gradient(${side === 'left' ? '90deg' : '-90deg'}, ${color}44 0%, #09090b 100%)`,
        [side === 'left' ? 'borderLeft' : 'borderRight']: `4px solid ${color}`
      }}
    >
      <div className={`flex items-center gap-2 mb-1 ${side === 'left' ? '' : 'flex-row-reverse'}`}>
        <Zap className={`w-3 h-3 fill-current ${isBaron ? 'text-purple-400' : 'text-orange-400'}`} />
        <span className="text-[10px] font-black uppercase text-white/90 tracking-widest">
            {isBaron ? 'Dragon' : 'Baron'} Power Play
        </span>
      </div>
      <div className={`flex items-center justify-between ${side === 'left' ? '' : 'flex-row-reverse'}`}>
        <span className="text-xl font-black text-white">+{Math.floor(data.gold)}</span>
        <span className="text-sm font-bold font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded">{formattedTime}</span>
      </div>
    </motion.div>
  );
};

// --- COMPONENT OBJECTIVE (Symmetry & Gradient) ---
const ObjectiveStrip = ({ dragons, towers, grubs, side, color }) => {
  // Đảo ngược mảng rồng nếu là bên phải để hiển thị từ phải qua trái
  const displayDragons = side === 'right' ? [...(dragons || [])].reverse() : dragons;

  return (
    <div className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Dragons Group */}
      <div 
        className="flex gap-1 p-1 bg-zinc-950 border border-white/5 rounded-sm shadow-lg"
        style={{ background: `linear-gradient(${side === 'left' ? '90deg' : '-90deg'}, ${color}33 0%, #09090b 100%)` }}
      >
        {(side === 'left' ? [0, 1, 2, 3] : [3, 2, 1, 0]).map((idx) => {
          const type = dragons?.[idx];
          return (
            <div key={`${side}-d-${idx}`} className="w-7 h-7 rounded-sm bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                {type && (
                  <motion.img 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    src={getDragonIcon(type)} 
                    className="w-5 h-5 object-contain" 
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Buildings Stats */}
      <div 
        className={`flex items-center gap-4 px-4 py-1.5 bg-zinc-950 border border-white/5 rounded-sm ${side === 'right' ? 'flex-row-reverse' : ''}`}
        style={{ background: `linear-gradient(${side === 'left' ? '-90deg' : '90deg'}, ${color}22 0%, #09090b 100%)` }}
      >
        <div className="flex items-center gap-2">
          <img src={ICONS.TOWER} className="w-4 h-4 brightness-200" alt="" />
          <span className="text-base font-black text-white tabular-nums">{towers}</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <img src={ICONS.GRUBS} className="w-4 h-4 brightness-200" alt="" />
          <span className="text-base font-black text-white tabular-nums">{grubs}</span>
        </div>
      </div>
    </div>
  );
};

// --- SERIES SCORE DOTS ---
const SeriesScore = ({ wins, matchType, color }) => {
  const dots = matchType === "BO5" ? 3 : (matchType === "BO7" ? 4 : 2);
  return (
    <div className="flex gap-1">
      {[...Array(dots)].map((_, i) => (
        <div key={`dot-${i}`} className="w-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full" 
            initial={{ width: 0 }}
            animate={{ width: i < wins ? '100%' : '0%' }}
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        </div>
      ))}
    </div>
  );
};

export default TopCenterPanel;