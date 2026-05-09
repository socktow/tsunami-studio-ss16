import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "./StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";
import { motion } from "framer-motion";
import ChampionAvatar from "./EventRight"; 
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

const R1 = () => {
  const data = useScoreboardBottomSelector();
  const redTeam = data?.teams?.[1];

  return (
    <div className="flex-1 flex border border-gray-800 bg-zinc-950/50 flex-row-reverse">
      
      {/* RIGHT MAIN COLUMN: Hiển thị Avatar, Bars và Tên */}
      <Column
        renderCell={(i) => {
          const p = redTeam?.players?.[i];
          if (!p) return null;

          // 1. KIỂM TRA TRẠNG THÁI HỒI SINH
          const isDead = p?.respawnAt > 0;
          const hasBaron = p?.hasBaron || p?.baronBuff; 
          const hasElder = p?.hasElder || p?.elderBuff;

          return (
            <div className={`relative w-full h-full flex items-center flex-row-reverse transition-all duration-500 ${isDead ? "opacity-60" : "opacity-100"}`}>

              {/* THANH TRẠNG THÁI (HP/MP/XP) - Đảo lề phải */}
              <div className="absolute inset-0 flex flex-col justify-end z-0 mr-[76px] py-1 gap-[1px]">
                {/* XP Bar */}
                <div className="h-[4px] w-full bg-purple-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p?.xp?.pct || 0}%` }}
                    style={{ originX: 1 }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-l from-purple-700 via-purple-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)] ml-auto"
                  />
                </div>

                {/* HP Bar */}
                <div className="h-[7px] w-full bg-green-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isDead ? "0%" : `${p?.hp?.pct || 100}%` }}
                    style={{ originX: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-gradient-to-l from-green-700 via-green-500 to-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)] ml-auto"
                  />
                </div>

                {/* MP Bar */}
                <div className="h-[4px] w-full bg-blue-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p?.mp?.pct || 0}%` }}
                    style={{ originX: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full bg-gradient-to-l from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.4)] ml-auto"
                  />
                </div>
              </div>

              {/* AVATAR & SPELLS */}
              <div className={`relative z-10 flex items-center flex-row-reverse gap-[4px] h-full px-[2px] mr-1 transition-all duration-700 ${isDead ? "grayscale" : "grayscale-0"}`}>
                {/* Spells */}
                <div className="flex flex-col gap-[2px]">
                  {p?.spell1 && (
                    <img className="w-[22px] h-[22px] rounded-sm border border-white/10" src={`${IMAGE_BASE_URL}${p.spell1}`} alt="s1" />
                  )}
                  {p?.spell2 && (
                    <img className="w-[22px] h-[22px] rounded-sm border border-white/10" src={`${IMAGE_BASE_URL}${p.spell2}`} alt="s2" />
                  )}
                </div>

                {/* Champion Avatar với hiệu ứng bùa lợi */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="no-level-border"
                >
                  <ChampionAvatar
                    champ={p?.champ || p?.champion}
                    level={p?.level}
                    ulti={p?.ulti}
                    IMAGE_BASE_URL={IMAGE_BASE_URL}
                    respawnAt={p?.respawnAt}
                    hasBaron={hasBaron} 
                    hasElder={hasElder} 
                  />
                </motion.div>
              </div>

              {/* TÊN NGƯỜI CHƠI */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`absolute mr-[100px] text-[13px] font-semibold drop-shadow-md z-30 mb-4 tracking-tighter text-right transition-colors ${isDead ? "text-zinc-500" : "text-white"}`}
              >
                {p?.name || "Player"}
              </motion.div>

            </div>
          );
        }}
      />

      {/* STATS COLUMN: KDA */}
      <FixedInnerColumn
        renderCell={(i) => {
          const p = redTeam?.players?.[i];
          if (!p) return null;
          const isDead = p?.respawnAt > 0;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`h-full w-full flex items-center justify-center transition-all ${isDead ? "grayscale opacity-50" : ""}`}
            >
              <StatsSection
                kills={p?.kills}
                deaths={p?.deaths}
                assists={p?.assists}
                creepScore={p?.creepScore}
                isLeft={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default R1;