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
        const diff =
          teams.blue.board[i].totalGold -
          teams.red.board[i].totalGold;

        const formattedDiff = formatGold(diff);

        return (
          <div className="w-full h-full  flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={diff}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-bold text-[14px] ${
                  diff > 0
                    ? "text-sky-400"
                    : diff < 0
                    ? "text-rose-400"
                    : "text-zinc-500"
                }`}
              >
                {diff > 0 && "< "}
                {formattedDiff}
                {diff < 0 && " >"}
              </motion.div>
            </AnimatePresence>
          </div>
        );
      }}
    />
  );
};

export default CT;