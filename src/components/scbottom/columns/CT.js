import React, { useMemo } from "react";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { useLeagueData } from "@/app/overlay/layout";
import { AnimatePresence, motion } from "framer-motion";
import { getTeamData, formatGold } from "@/lib/league-utils";

const CT = () => {
  const { gameData } = useLeagueData();
  const teams = useMemo(() => getTeamData(gameData), [gameData]);

  if (!teams) return null;

  return (
    <FixedInnerColumn
      width="w-[65px]"
      renderCell={(i) => {
        const blueGold = teams.blue.board[i]?.totalGold || 0;
        const redGold = teams.red.board[i]?.totalGold || 0;
        const diff = blueGold - redGold;

        // Đảm bảo đầu ra là String và không có dấu âm
        const formattedDiff = String(formatGold(Math.abs(diff)));
        
        const isBlueLead = diff > 0;
        const isRedLead = diff < 0;
        const isEven = diff === 0;

        return (
          <div className="w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={diff}
                initial={{ opacity: 0, x: isBlueLead ? 5 : isRedLead ? -5 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-1 font-black italic tracking-tighter ${
                  isBlueLead ? "text-sky-400" : isRedLead ? "text-rose-400" : "text-zinc-500"
                }`}
              >
                {/* Mũi tên bên trái cho Đội Xanh */}
                {isBlueLead && (
                  <span className="text-[10px] translate-y-[0.5px]">◀</span>
                )}

                <span className="text-[14px] tabular-nums">
                  {isEven ? "0" : formattedDiff}
                </span>

                {/* Mũi tên bên phải cho Đội Đỏ */}
                {isRedLead && (
                  <span className="text-[10px] translate-y-[0.5px]">▶</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        );
      }}
    />
  );
};

export default CT;