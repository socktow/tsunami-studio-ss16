import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

const L2 = ({ tabs, boards }) => {
  const TEST_NAMES = [
    "Pun",
    "Hizto",
    "Dire",
    "Eddie",
    "Bie",
  ];

  return (
    <div className="flex-1 flex border border-gray-800">

      {/* ===================== */}
      {/* PLAYER COLUMN */}
      {/* ===================== */}
      <Column
        renderCell={(i) => {
          const p = tabs?.[i];
          if (!p) return null;

          return (
            <div className="relative w-full h-full">

              {/* ===================== */}
              {/* CONTENT LAYER */}
              {/* ===================== */}
              <div className="absolute inset-0 overflow-hidden">

                {/* BARS */}
                <div className="absolute inset-0 flex flex-col justify-end z-0 ml-[76px] py-1">

                  {/* XP */}
                  <div className="h-[4px] w-full bg-purple-500/20 relative">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${p?.xp?.pct || 0}%` }}
                    />
                  </div>

                  {/* HP */}
                  <div className="h-[7px] w-full bg-green-500/20 relative">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${p?.hp?.pct || 0}%` }}
                    />
                  </div>

                  {/* MP */}
                  <div className="h-[4px] w-full bg-blue-500/20 relative">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${p?.mp?.pct || 0}%` }}
                    />
                  </div>

                </div>

                {/* ICONS */}
                <div className="relative z-10 flex items-center gap-[4px] h-full px-[2px]">

                  {/* spells */}
                  <div className="flex flex-col gap-[2px]">
                    {p?.spell1 && (
                      <img
                        className="w-[22px] h-[22px]"
                        src={`${IMAGE_BASE_URL}${p.spell1}`}
                      />
                    )}
                    {p?.spell2 && (
                      <img
                        className="w-[22px] h-[22px]"
                        src={`${IMAGE_BASE_URL}${p.spell2}`}
                      />
                    )}
                  </div>

                  {/* champ + ULT INDICATOR */}
                  <div className="relative w-[45px] h-[45px]">

                    <img
                      className="w-full h-full rounded"
                      src={`${IMAGE_BASE_URL}${p?.champ}`}
                    />

                    {/* ULT ICON (FROM DATA) */}
                    {p?.ulti && (
                      <img
                        src={`${IMAGE_BASE_URL}${p.ulti}`}
                        className="absolute top-0.5 -right-4.5 w-[25px] h-[25px] rounded-full border border-black shadow-[0_0_8px_rgba(34,197,94,0.9)] bg-black"
                      />
                    )}

                  </div>

                </div>
              </div>

              {/* ===================== */}
              {/* NAME LAYER */}
              {/* ===================== */}
              <div className="absolute inset-0 flex items-center justify-start z-30 pointer-events-none">
                <span className="ml-[92px] text-[12px] font-bold text-white drop-shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] text-right mb-4">
                  {TEST_NAMES[i] || p?.name}
                </span>
              </div>

            </div>
          );
        }}
      />

      {/* ===================== */}
      {/* STATS */}
      {/* ===================== */}
      <FixedInnerColumn
        renderCell={(i) => {
          const row = boards?.[i];
          if (!row) return null;

          return (
            <div className="h-full w-full flex items-center justify-center bg-black">
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