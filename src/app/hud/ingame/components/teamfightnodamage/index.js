"use client";
import React from 'react';
import { motion } from 'framer-motion';

const TeamFightNoDamage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[988px] h-[200px] flex items-center justify-center px-4 z-[9999]"
    >
      {/* CẠNH DƯỚI BÊN TRÁI: CYAN */}
      <div className="absolute bottom-0 left-0 w-[50%] h-[5px] z-30 bg-gradient-to-r from-cyan-500 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[5px] h-[70%] z-30 bg-gradient-to-t from-cyan-500 to-transparent" />

      {/* CẠNH DƯỚI BÊN PHẢI: GOLD */}
      <div className="absolute bottom-0 right-0 w-[50%] h-[5px] z-30 bg-gradient-to-l from-[#FFE14D] to-transparent" />
      <div className="absolute bottom-0 right-0 w-[5px] h-[70%] z-30 bg-gradient-to-t from-[#FFE14D] to-transparent" />

      {/* Blue Team Players */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={`blue-${i}`} className="w-[70px] h-[70px] border border-cyan-500/20 bg-zinc-900 flex items-center justify-center">
            <span className="text-[10px] text-cyan-400 font-bold">P{i+1}</span>
          </div>
        ))}
      </div>

      {/* VS & Logo Section */}
      <div className="flex flex-col items-center justify-center mx-8">
        <div className="w-[2px] h-[40px] bg-white/20 mb-2" />
        <div className="text-[8px] text-white/50 font-bold uppercase mb-2">VS</div>
        <div className="w-[50px] h-[50px] bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] text-white/30 mb-2">
          LOGO
        </div>
        <div className="w-[2px] h-[40px] bg-white/20 mt-1" />
      </div>

      {/* Red Team Players */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={`red-${i}`} className="w-[70px] h-[70px] border border-yellow-500/20 bg-zinc-900 flex items-center justify-center">
            <span className="text-[10px] text-yellow-500 font-bold">P{i+6}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamFightNoDamage;