import React, { useMemo } from 'react';
import { useLeagueData } from "@/app/overlay/layout";
import { motion, AnimatePresence } from "framer-motion";
import { getTeamData, formatGold } from "@/lib/league-utils";
import { PlayerRow } from "./PlayerRow";

export default function PremiumScoreboardUI() {
  const { gameData } = useLeagueData();
  const teams = useMemo(() => getTeamData(gameData), [gameData]);

  if (!teams) return null;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="fixed bottom-0 left-0 w-full flex justify-center z-50 scale-[0.90] origin-bottom"
    >
      <div className="relative flex items-stretch bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] overflow-hidden rounded-t-xl">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 flex opacity-30 pointer-events-none">
           <div className="flex-1 bg-gradient-to-r from-sky-900 via-transparent to-transparent" />
           <div className="flex-1 bg-gradient-to-l from-rose-900 via-transparent to-transparent" />
        </div>

        {/* TEAM BLUE */}
        <div className="flex flex-col w-[515px] relative z-10">
          {teams.blue.tabs.map((p, i) => (
            <PlayerRow key={`b-${i}`} side="left" playerTab={p} playerBoard={teams.blue.board[i]} />
          ))}
        </div>

        {/* GOLD SPINE (Cột giữa) */}
        <div className="flex flex-col w-14 relative z-10 border-x border-white/[0.05] bg-black/20">
          {teams.blue.board.map((p, i) => {
            const diff = Math.round(p.totalGold - teams.red.board[i].totalGold);
            const formattedDiff = formatGold(diff);
            return (
              <div key={i} className="h-[60px] flex items-center justify-center border-b border-white/[0.03]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={diff}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`font-bold text-[15px] ${diff > 0 ? 'text-sky-400' : diff < 0 ? 'text-rose-400' : 'text-zinc-600'}`}
                  >
                    {diff > 0 && '< '}{formattedDiff}{diff < 0 && ' >'}
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* TEAM RED */}
        <div className="flex flex-col w-[515px] relative z-10">
          {teams.red.tabs.map((p, i) => (
            <PlayerRow key={`r-${i}`} side="right" playerTab={p} playerBoard={teams.red.board[i]} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}