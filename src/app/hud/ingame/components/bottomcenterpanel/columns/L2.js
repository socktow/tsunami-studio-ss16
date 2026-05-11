import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "./StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";
import { motion } from "framer-motion";
import ChampionAvatar from "./EventLeft";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

const L2 = () => {
  const data = useScoreboardBottomSelector();
  const blueTeam = data?.teams?.[0];
  const gameTime = data?.gameTime || 0;
  const TEST_NAMES = ["Pun", "Hizto", "Dire", "Eddie", "Bie"];

  return (
    <div className="flex-1 flex border border-gray-800 bg-zinc-950/50">
      <Column
        renderCell={(i) => {
          const p = blueTeam?.players?.[i];
          if (!p) return null;

          const isDead = (p?.respawnAt || 0) > 0;
          const hasBaron = p?.hasBaron || p?.baronBuff;
          const hasElder = p?.hasElder || p?.elderBuff;
          const roundedShutdown = Math.round(p?.shutdown || 0);

          return (
            <div
              className={`relative w-full h-full flex items-center transition-all duration-500 ${isDead ? "opacity-60" : "opacity-100"}`}
            >
              {/* THANH TRẠNG THÁI (HP/MP/XP) */}
              <div className="absolute inset-0 flex flex-col justify-end z-0 ml-[76px] py-1 gap-[1px]">
                <div className="h-[4px] w-full bg-purple-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p?.xp?.pct || 0}%` }}
                    style={{ originX: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  />
                </div>

                <div className="h-[7px] w-full bg-green-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isDead ? "0%" : `${p?.hp?.pct || 100}%` }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                  />
                </div>

                <div className="h-[4px] w-full bg-blue-900/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p?.mp?.pct || 0}%` }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                  />
                </div>
              </div>

              {/* AVATAR & SPELLS */}
              <div
                className={`relative z-10 flex items-center gap-[4px] h-full px-[2px] ml-1 transition-all duration-700 ${isDead ? "grayscale" : "grayscale-0"}`}
              >
                {/* Spells Column */}
                <div className="flex flex-col gap-[2px]">
                  {[p?.spell1, p?.spell2].map((spell, idx) => {
                    const icon = spell?.assets?.iconAsset;
                    const totalCD = spell?.totalCooldown || 1; // Tránh chia cho 0
                    const cdLeft = Math.max(
                      0,
                      (spell?.readyAt || 0) - gameTime,
                    );
                    const isOnCooldown = cdLeft > 0;

                    // Tính phần trăm cooldown còn lại (từ 0 đến 100)
                    const cdPercent = Math.min(100, (cdLeft / totalCD) * 100);

                    if (!icon)
                      return (
                        <div
                          key={idx}
                          className="w-[22px] h-[22px] bg-zinc-900/50 rounded-sm"
                        />
                      );

                    return (
                      <div
                        key={idx}
                        className="relative w-[22px] h-[22px] rounded-sm overflow-hidden border border-white/10 bg-black"
                      >
                        {/* Icon chính */}
                        <img
                          className="w-full h-full object-cover"
                          src={`${IMAGE_BASE_URL}${icon}`}
                          alt="spell"
                        />

                        {/* Hiệu ứng Cooldown Sweep */}
                        {isOnCooldown && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              // ĐẢO NGƯỢC:
                              // Từ 0% đến cdPercent% là TRONG SUỐT (lộ icon sáng)
                              // Từ cdPercent% đến 100% là MÀU TỐI (phần chưa hồi)
                              background: `conic-gradient(transparent ${100 - cdPercent}%, rgba(0,0,0,0.7) 0%)`,
                            }}
                          />
                        )}

                        {/* Text đếm ngược: Chỉ hiện khi <= 10s */}
                        {isOnCooldown && cdLeft <= 10 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className="text-[15px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
                              style={{
                                textShadow: `0 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000,0 0 8px rgba(0,0,0,1)`,
                              }}
                            >
                              {Math.ceil(cdLeft)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

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
                    gameTime={gameTime}
                    respawnAt={p?.respawnAt}
                    shutdown={roundedShutdown}
                    hasBaron={hasBaron}
                    hasElder={hasElder}
                  />
                </motion.div>
              </div>

              {/* TÊN NGƯỜI CHƠI */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`absolute ml-[100px] text-[13px] font-semibold drop-shadow-md z-30 mb-4 tracking-tighter transition-colors ${isDead ? "text-zinc-500" : "text-white"}`}
              >
                {TEST_NAMES[i] || p?.name}
              </motion.div>
            </div>
          );
        }}
      />

      <FixedInnerColumn
        renderCell={(i) => {
          const p = blueTeam?.players?.[i];
          if (!p) return null;
          const isDead = (p?.respawnAt || 0) > 0;

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
                isLeft={true}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default L2;
