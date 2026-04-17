import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

const R1 = ({ tabs, boards }) => {
  const TEST_NAMES = [
    "Kiaya",
    "Draktharr",
    "Aress",
    "Artemis",
    "Taki",
  ];

  return (
    <div className="relative flex-1 flex border border-gray-800">

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
                isLeft={false}
              />
            </div>
          );
        }}
      />

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
              {/* CONTENT LAYER (CLIPPED) */}
              {/* ===================== */}
              <div className="absolute inset-0 overflow-hidden">

                {/* BARS */}
                <div className="absolute inset-0 flex flex-col justify-end z-0 mr-[76px] py-1">

                  {/* XP */}
                  <div className="h-[4px] w-full bg-purple-500/20 relative">
                    <div
                      className="absolute right-0 top-0 h-full bg-purple-500"
                      style={{ width: `${p?.xp?.pct || 0}%` }}
                    />
                  </div>

                  {/* HP */}
                  <div className="h-[7px] w-full bg-green-500/20 relative">
                    <div
                      className="absolute right-0 top-0 h-full bg-green-500"
                      style={{ width: `${p?.hp?.pct || 0}%` }}
                    />
                  </div>

                  {/* MP */}
                  <div className="h-[4px] w-full bg-blue-500/20 relative">
                    <div
                      className="absolute right-0 top-0 h-full bg-blue-500"
                      style={{ width: `${p?.mp?.pct || 0}%` }}
                    />
                  </div>

                </div>

                {/* ICONS */}
                <div className="relative z-10 flex items-center justify-end gap-[4px] h-full px-[2px]">

                  {/* ===================== */}
                  {/* CHAMP + ULT INDICATOR */}
                  {/* ===================== */}
                  <div className="relative w-[45px] h-[45px]">

                    {/* champ */}
                    <img
                      className="w-full h-full"
                      src={`${IMAGE_BASE_URL}${p?.champ}`}
                    />

                    {/* ULT INDICATOR (TOP-RIGHT) */}
                    {p?.ulti && (
                      <img
                        src={`${IMAGE_BASE_URL}${p.ulti}`}
                        className="absolute top-0.5 -left-4.5 w-[25px] h-[25px] rounded-full border border-black shadow-[0_0_8px_rgba(34,197,94,0.9)] bg-black"
                      />
                    )}
                  </div>

                  {/* ===================== */}
                  {/* SPELLS */}
                  {/* ===================== */}
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
              </div>

              {/* ===================== */}
              {/* NAME LAYER (NOT CLIPPED) */}
              {/* ===================== */}
              <div className="absolute inset-0 flex items-center justify-end z-30 pointer-events-none">
                <span className="mr-[92px] text-[12px] font-bold text-white drop-shadow whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] text-right mb-4">
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