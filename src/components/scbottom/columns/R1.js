import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";
import EventRight from "./EventRight";
import { motion } from "framer-motion";
const R1 = ({ tabs, boards }) => {
  const TEST_NAMES = ["Kiaya", "Draktharr", "Aress", "Artemis", "Taki"];

  return (
    <div className="relative flex-1 flex border border-gray-800">
      {/* STATS COLUMN */}
      <FixedInnerColumn
        renderCell={(i) => {
          const row = boards?.[i];
          if (!row) return null;

          return (
            <div className="h-full w-full flex items-center justify-center ">
              <StatsSection
                kills={row?.kills}
                deaths={row?.deaths}
                assists={row?.assists}
                creepScore={row?.creepScore}
                isLeft={false}
              />
            </div>
          );
        }}
      />

      {/* PLAYER COLUMN */}
      <Column
        renderCell={(i) => {
          const p = tabs?.[i];
          if (!p) return null;

          return (
            <div className="relative w-full h-full">
              {/* CONTENT LAYER */}
              <div className="absolute inset-0 overflow-hidden">
                {/* THANH TRẠNG THÁI BÊN PHẢI (XP, HP, MP) */}
                <div className="absolute inset-0 flex flex-col justify-end z-0 mr-[76px] py-1 gap-[1px]">
                  {/* XP Bar - Right Aligned */}
                  <div className="h-[4px] w-full bg-purple-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.xp?.pct || 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-700 via-purple-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    />
                  </div>

                  {/* HP Bar - Right Aligned */}
                  <div className="h-[7px] w-full bg-green-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.hp?.pct || 0}%` }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-green-700 via-green-500 to-green-300 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    >
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-white/10 w-full h-[1px] top-0" />
                    </motion.div>
                  </div>

                  {/* MP Bar - Right Aligned */}
                  <div className="h-[4px] w-full bg-blue-900/40 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.mp?.pct || 0}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>

                {/* ICONS LAYER */}
                <div className="relative z-10 flex items-center justify-end gap-[4px] h-full px-[2px]">
                  {/* SỬ DỤNG EVENTRIGHT TẠI ĐÂY */}
                  <EventRight
                    champ={p?.champ}
                    level={p?.level}
                    ulti={p?.ulti}
                    IMAGE_BASE_URL={IMAGE_BASE_URL}
                  />

                  {/* SPELLS (Phép bổ trợ) */}
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
                </div>
              </div>

              {/* NAME LAYER */}
              <div className="absolute inset-0 flex items-center justify-end z-30 pointer-events-none">
                <span className="mr-[92px] font-semibold text-[13px] text-white drop-shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] text-right mb-4 tracking-tighter">
                  {TEST_NAMES[i] || p?.name}
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default R1;
