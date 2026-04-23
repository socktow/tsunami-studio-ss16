import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "./StatsSection";
import EventRight from "./EventRight";
import { motion } from "framer-motion";

const R1 = () => {
  const TEST_NAMES = ["Kiaya", "Draktharr", "Aress", "Artemis", "Taki"];

  return (
    <div className="relative flex-1 flex border border-gray-800 bg-zinc-950/50">

      {/* STATS COLUMN (MOCK) */}
      <FixedInnerColumn
        renderCell={(i) => {
          return (
            <div className="h-full w-full flex items-center justify-center text-white text-[10px]">
              STATS
            </div>
          );
        }}
      />

      {/* PLAYER COLUMN */}
      <Column
        renderCell={(i) => {
          return (
            <div className="relative w-full h-full">

              {/* BARS MOCK */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-end z-0 mr-[76px] py-1 gap-[1px]">
                  <div className="h-[4px] w-full bg-purple-700/40" />
                  <div className="h-[7px] w-full bg-green-700/40" />
                  <div className="h-[4px] w-full bg-blue-700/40" />
                </div>
              </div>

              {/* ICONS LAYER MOCK */}
              <div className="relative z-10 flex items-center justify-end gap-[4px] h-full px-[2px]">

                {/* Avatar mock */}
                <div className="w-[40px] h-[40px] bg-zinc-700 rounded" />

                {/* spells mock */}
                <div className="flex flex-col gap-[2px]">
                  <div className="w-[22px] h-[22px] bg-zinc-800 rounded-sm" />
                  <div className="w-[22px] h-[22px] bg-zinc-800 rounded-sm" />
                </div>

              </div>

              {/* NAME */}
              <div className="absolute inset-0 flex items-center justify-end z-30 pointer-events-none">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-[92px] text-white text-[13px]"
                >
                  {TEST_NAMES[i] || "Player"}
                </motion.span>
              </div>

            </div>
          );
        }}
      />
    </div>
  );
};

export default R1;