import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

const R1 = ({ tabs, boards }) => {
  return (
    <div className="flex-1 flex">

      {/* ===================== */}
      {/* STATS (LEFT SIDE FOR R1) */}
      {/* ===================== */}
      <FixedInnerColumn
        renderCell={(i) => {
          const row = boards?.[i];

          if (!row) return null;

          return (
            <div className="h-full w-full min-h-0 flex items-center justify-center bg-black">
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

      {/* ===================== */}
      {/* PLAYER COLUMN (MIRRORED L2) */}
      {/* ===================== */}
      <Column
        renderCell={(i) => {
          const p = tabs?.[i];
          if (!p) return null;

          return (
            <div className="relative w-full h-full  overflow-hidden">

              {/* ===================== */}
              {/* LAYER 1: BARS (REVERSED) */}
              {/* ===================== */}
<div className="absolute inset-0 flex flex-col justify-end z-0 mr-19 py-1">

  {/* XP */}
  <div className="h-[4px] w-full bg-purple-500/20 relative overflow-hidden">
    <div
      className="absolute right-0 top-0 h-full bg-purple-500"
      style={{ width: `${p?.xp?.pct || 0}%` }}
    />
  </div>

  {/* HP */}
  <div className="h-[7px] w-full bg-green-500/20 relative overflow-hidden">
    <div
      className="absolute right-0 top-0 h-full bg-green-500"
      style={{ width: `${p?.hp?.pct || 0}%` }}
    />
  </div>

  {/* MP */}
  <div className="h-[4px] w-full bg-blue-500/20 relative overflow-hidden">
    <div
      className="absolute right-0 top-0 h-full bg-blue-500"
      style={{ width: `${p?.mp?.pct || 0}%` }}
    />
  </div>

</div>

              {/* ===================== */}
              {/* LAYER 2: ICONS (REVERSED ROW) */}
              {/* ===================== */}
              <div className="relative z-10 flex items-center justify-end gap-[4px] h-full px-[2px]">

                {/* champ */}
                <img
                  className="w-[45px] h-[45px]  "
                  src={`${IMAGE_BASE_URL}${p?.champ}`}
                />

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

              </div>

              {/* ===================== */}
              {/* LAYER 3: NAME OVERLAY */}
              {/* ===================== */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mb-4 mr-12">
                <span className="text-[13px] font-bold text-white drop-shadow">
                  {p?.name}
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