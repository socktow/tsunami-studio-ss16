import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";
import { motion } from "framer-motion";
import ChampionAvatar from "./EventLeft";

const L2 = ({ tabs, boards }) => {
  const TEST_NAMES = ["Pun", "Hizto", "Dire", "Eddie", "Bie"];

  return (
    <div className="flex-1 flex border border-gray-800">
      {/* ===================== */}
      {/* PLAYER COLUMN (LEFT)  */}
      {/* ===================== */}
      <Column
        renderCell={(i) => {
          const p = tabs?.[i];
          if (!p) return null;

          return (
            <div className="relative w-full h-full">
              {/* CONTENT LAYER */}
              <div className="absolute inset-0 overflow-hidden">
                {/* THANH TRẠNG THÁI (XP, HP, MP) */}
                <div className="absolute inset-0 flex flex-col justify-end z-0 ml-[76px] py-1 gap-[1px]">
                  {/* XP Bar - Purple Gradient */}
                  <div className="h-[4px] w-full bg-purple-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.xp?.pct || 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    />
                  </div>

                  {/* HP Bar - Green Gradient */}
                  <div className="h-[7px] w-full bg-green-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.hp?.pct || 0}%` }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-300 shadow-[0_0_10px_rgba(34,197,94,0.4)] relative"
                    >
                      {/* Hiệu ứng tia sáng nhỏ chạy dọc thanh máu (tùy chọn) */}
                      <div className="absolute inset-0 bg-white/10 w-full h-[1px] top-0" />
                    </motion.div>
                  </div>

                  {/* MP Bar - Blue Gradient */}
                  <div className="h-[4px] w-full bg-blue-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.mp?.pct || 0}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>

                {/* ICONS LAYER (Spells + Champion) */}
                <div className="relative z-10 flex items-center gap-[4px] h-full px-[2px]">
                  {/* Phép bổ trợ (Summoner Spells) */}
                  <div className="flex flex-col gap-[2px]">
                    {p?.spell1 && (
                      <img
                        className="w-[22px] h-[22px] rounded-sm"
                        src={`${IMAGE_BASE_URL}${p.spell1}`}
                        alt="spell1"
                      />
                    )}
                    {p?.spell2 && (
                      <img
                        className="w-[22px] h-[22px] rounded-sm"
                        src={`${IMAGE_BASE_URL}${p.spell2}`}
                        alt="spell2"
                      />
                    )}
                  </div>

                  {/* Ảnh đại diện tướng + Level Up Popup + Ulti Indicator */}
                  <ChampionAvatar
                    champ={p?.champ}
                    level={p?.level}
                    ulti={p?.ulti}
                    IMAGE_BASE_URL={IMAGE_BASE_URL}
                  />
                </div>
              </div>

              {/* TÊN NGƯỜI CHƠI (NAME LAYER) */}
              <div className="absolute inset-0 flex items-center justify-start z-30 pointer-events-none">
                <span className="ml-[92px] text-[13px] font-semibold text-white drop-shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] mb-4 tracking-tighter">
                  {TEST_NAMES[i] || p?.name}
                </span>
              </div>
            </div>
          );
        }}
      />

      {/* ===================== */}
      {/* STATS COLUMN (KDA/CS) */}
      {/* ===================== */}
      <FixedInnerColumn
        renderCell={(i) => {
          const row = boards?.[i];
          if (!row) return null;

          return (
            <div className="h-full w-full flex items-center justify-center">
              <StatsSection
                kills={row?.kills}
                deaths={row?.deaths}
                assists={row?.assists}
                creepScore={row?.creepScore}
                isLeft={true}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default L2;
