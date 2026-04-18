import React, { useMemo } from "react";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { useLeagueData } from "@/app/overlay/layout";
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

        const formattedDiff = String(formatGold(Math.abs(diff)));
        const isBlueLead = diff > 0;
        const isRedLead = diff < 0;

        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* INDICATOR BÊN TRÁI (ĐỘI XANH - SKY) */}
            {isBlueLead && (
              <div className="absolute left-0 h-[80%] flex items-center">
                <div className="w-[3px] h-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                <div 
                  className="w-0 h-0 
                    border-t-[5px] border-t-transparent 
                    border-b-[5px] border-b-transparent 
                    border-l-[6px] border-l-sky-400" 
                />
              </div>
            )}

            {/* CON SỐ CHÊNH LỆCH - MÀU TRẮNG */}
            <span className={`text-[15px] font-semibold tracking-tighter tabular-nums ${
              diff === 0 ? "text-zinc-500" : "text-white"
            }`}>
              {diff === 0 ? "0" : formattedDiff}
            </span>

            {/* INDICATOR BÊN PHẢI (ĐỘI ĐỎ - ROSE/RED) */}
            {isRedLead && (
              <div className="absolute right-0 h-[80%] flex items-center flex-row-reverse">
                {/* Đã sửa từ bg-red-400 sang rose-500 để màu đỏ sâu và đẹp hơn */}
                <div className="w-[3px] h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <div 
                  className="w-0 h-0 
                    border-t-[5px] border-t-transparent 
                    border-b-[5px] border-b-transparent 
                    border-r-[6px] border-r-rose-500" 
                />
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default CT;