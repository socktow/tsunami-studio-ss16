import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { motion } from "framer-motion";

const TEST_NAMES = ["Pun", "Hizto", "Dire", "Eddie", "Bie"];

const L2 = () => {
  return (
    <div className="flex-1 flex border border-gray-800 bg-zinc-950/50">

      {/* LEFT MAIN COLUMN */}
      <Column
        renderCell={(i) => {
          return (
            <div className="relative w-full h-full flex items-center">
              
              {/* fake bars */}
              <div className="absolute inset-0 flex flex-col justify-end ml-[76px] py-1 gap-[1px]">
                <div className="h-[4px] bg-purple-700/40 w-full" />
                <div className="h-[7px] bg-green-700/40 w-full" />
                <div className="h-[4px] bg-blue-700/40 w-full" />
              </div>

              {/* avatar mock */}
              <div className="flex gap-[4px] z-10 ml-1">
                <div className="w-[22px] h-[44px] bg-zinc-800 rounded" />
                <div className="w-[40px] h-[40px] bg-zinc-700 rounded" />
              </div>

              {/* name */}
              <div className="absolute ml-[92px] text-white text-[13px]">
                {TEST_NAMES[i] || "Player"}
              </div>

            </div>
          );
        }}
      />

      {/* STATS COLUMN */}
      <FixedInnerColumn
        renderCell={(i) => {
          return (
            <div className="h-full w-full flex items-center justify-center text-white text-[10px]">
              K/D/A
            </div>
          );
        }}
      />

    </div>
  );
};

export default L2;