import React from "react";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector"; 
import { formatGold } from "@/lib/league-utils";

const CT = () => {
  const data = useScoreboardBottomSelector();


  // Nếu chưa có dữ liệu hoặc chưa đủ 2 team thì không render
  if (!data || !data.teams || data.teams.length < 2) return null;

  return (
    <FixedInnerColumn
      width="w-[65px]"
      renderCell={(i) => {
        // Lấy thông tin player từ 2 team dựa trên index i (0-4)
        const bluePlayer = data.teams[0].players[i];
        const redPlayer = data.teams[1].players[i];

        const blueGold = bluePlayer?.totalGold || 0;
        const redGold = redPlayer?.totalGold || 0;
        
        const diff = blueGold - redGold;
        const absDiff = Math.abs(diff);

        // Định dạng hiển thị (ví dụ: 1200 -> 1.2k nếu dùng hàm formatGold của bạn)
        const formattedDiff = diff === 0 ? "0" : formatGold(absDiff);
        
        const isBlueLead = diff > 0;
        const isRedLead = diff < 0;

        return (
          <div className="relative w-full h-full flex items-center justify-center border-x border-white/5 bg-white/[0.01]">
            
            {/* INDICATOR BÊN TRÁI (BLUE TEAM) */}
            {isBlueLead && (
              <div className="absolute left-0 h-[70%] flex items-center">
                <div className="w-[3px] h-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                <div
                  className="w-0 h-0 
                    border-t-[5px] border-t-transparent 
                    border-b-[5px] border-b-transparent 
                    border-l-[6px] border-l-sky-400"
                />
              </div>
            )}

            {/* VALUE DISPLAY */}
            <span className={`text-[14px] font-black tracking-tighter tabular-nums ${
              isBlueLead ? "text-white" : isRedLead ? "text-rose-500" : "text-zinc-500"
            }`}>
              {isBlueLead ? `+${formattedDiff}` : isRedLead ? `-${formattedDiff}` : "0"}
            </span>

            {/* INDICATOR BÊN PHẢI (RED TEAM) */}
            {isRedLead && (
              <div className="absolute right-0 h-[70%] flex items-center flex-row-reverse">
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