"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeagueData } from "@/app/overlay/layout";

const TopLeftPanel = () => {
  const { gameData } = useLeagueData();

  if (!gameData || typeof gameData.gameTime === 'undefined') return null;

  const formatTime = (seconds) => {
    if (seconds <= 0) return null;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const baronDiff = (gameData.baronPitTimer?.timeAlive || 0) - gameData.gameTime;
  const dragonDiff = (gameData.dragonPitTimer?.timeAlive || 0) - gameData.gameTime;

  const rawObjectives = [
    { 
      id: 'baron',
      timeLeft: baronDiff,
      icon: gameData.baronPitTimer?.type === "GRUB" 
            ? "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png"
            : "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/rewards-modal/epic-monster-icon.png",
      gradient: "from-purple-600/40 to-purple-900/10",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
    },
    { 
      id: 'dragon',
      timeLeft: dragonDiff,
      icon: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_infernaldrake.png",
      gradient: "from-red-600/40 to-red-900/10",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]"
    }
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-4 left-2 flex flex-row gap-4 pointer-events-none select-none items-center"
    >
      <AnimatePresence mode="popLayout">
        {rawObjectives.map((obj) => {
          const isSpawned = obj.timeLeft <= 0;
          const timeDisplay = formatTime(obj.timeLeft);

          return (
            <motion.div 
              key={obj.id} 
              layout 
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex items-center ${isSpawned ? obj.glow : ""}`}
            >
              <motion.div
                layout
                className="flex items-stretch bg-black/40 backdrop-blur-xl -skew-x-12 border-l-2 border-white/10 overflow-hidden h-9 shadow-2xl"
              >
                <motion.div
                  layout
                  className={`flex items-center justify-center relative bg-gradient-to-br ${obj.gradient} ${!isSpawned ? 'w-10' : 'w-9'}`}
                >
                  <div className="skew-x-12 w-6 h-6 flex items-center justify-center relative z-10">
                    <img 
                      src={obj.icon} 
                      className={`w-full h-full object-contain drop-shadow-[0_0_3px_rgba(255,255,255,0.4)] ${isSpawned ? 'scale-110' : 'scale-90'}`} 
                      alt={obj.id} 
                    />
                  </div>
                  
                  {isSpawned && (
                    <motion.div
                      animate={{ opacity: [0, 0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-white/10"
                    />
                  )}
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isSpawned && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center px-3 pr-4 overflow-hidden border-l border-white/5"
                    >
                      <span className="skew-x-12 text-lg font-mono font-black text-white italic tracking-tighter tabular-nums">
                        {timeDisplay}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopLeftPanel;