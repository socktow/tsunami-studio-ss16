"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useObjectivesData } from "@/hooks/useLeagueSelector";
import { formatTime, getDragonType } from "@/lib/utils";
import { OBJECTIVE_ICONS } from "@/lib/constants";

const TopLeftPanel = () => {
  const objectivesData = useObjectivesData();

  if (!objectivesData) return null;

  const { baron, dragon } = objectivesData;
  const currentDragonType = getDragonType(dragon.type);

  // Chuẩn bị mảng để map (giống logic cũ nhưng sạch hơn)
  const objectives = [
    {
      id: 'baron',
      timeLeft: baron.timeLeft,
      icon: baron.type === "GRUB" ? OBJECTIVE_ICONS.GRUB : OBJECTIVE_ICONS.BARON,
      accent: "#A855F7",
      shadow: "0px 0px 20px rgba(168, 85, 247, 0.4)"
    },
    {
      id: 'dragon',
      timeLeft: dragon.timeLeft,
      icon: OBJECTIVE_ICONS.DRAGONS[currentDragonType] || OBJECTIVE_ICONS.DRAGONS.air,
      accent: "#EF4444",
      shadow: "0px 0px 20px rgba(239, 68, 68, 0.4)"
    }
  ];

  return (
    <div className="absolute top-6 left-6 flex flex-row gap-4 pointer-events-none select-none items-center">
      <AnimatePresence mode="popLayout">
        {objectives.map((obj) => {
          const isSpawned = obj.timeLeft <= 0;
          const timeDisplay = formatTime(obj.timeLeft);

          return (
            <motion.div
              key={obj.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative flex items-stretch h-10 shadow-2xl overflow-hidden rounded-sm"
              style={isSpawned ? { boxShadow: obj.shadow } : {}}
            >
              {/* ICON BOX */}
              <div className="relative z-20 flex items-center justify-center w-10 bg-black border border-white/20 overflow-hidden shrink-0">
                {isSpawned && (
                  <motion.div 
                    animate={{ opacity: [0.1, 0.5, 0.1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0"
                    style={{ backgroundColor: obj.accent }}
                  />
                )}
                
                <motion.img 
                  src={obj.icon} 
                  className="w-7 h-7 object-contain z-10"
                  animate={isSpawned ? { 
                    scale: [1, 1.2, 1],
                    filter: ["brightness(1) saturate(1)", "brightness(1.6) saturate(1.4)", "brightness(1) saturate(1)"]
                  } : { opacity: 0.8 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>

              {/* TIME CONTAINER */}
              <AnimatePresence mode="wait">
                {!isSpawned && (
                  <motion.div
                    key="timer-container"
                    initial={{ x: -10, opacity: 0, width: 0 }}
                    animate={{ x: 0, opacity: 1, width: "auto" }}
                    exit={{ x: -10, opacity: 0, width: 0 }}
                    className="relative flex items-center px-4 min-w-[70px] justify-center bg-black/40 backdrop-blur-md border border-l-0 border-white/10"
                  >
                    <span className="text-xl font-black font-mono tracking-tighter text-white tabular-nums drop-shadow-md">
                      {timeDisplay}
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                      <motion.div 
                        className="h-full"
                        style={{ backgroundColor: obj.accent }}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: Math.max(0, obj.timeLeft), ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spawned Glow Border */}
              {isSpawned && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 border-2 z-30 pointer-events-none rounded-sm"
                  style={{ borderColor: obj.accent }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TopLeftPanel;