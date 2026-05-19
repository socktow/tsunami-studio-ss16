import React from "react";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector"; 
import { formatGold } from "@/lib/league-utils";
import { useScoreboardData } from "@/hooks/useApiTeamData"; // Import hook của bạn

const CT = () => {
  const data = useScoreboardBottomSelector();
  const { matchInfo } = useScoreboardData(); // Lấy thông tin match từ API

  // Nếu chưa có dữ liệu hoặc chưa đủ 2 team thì không render
  if (!data || !data.teams || data.teams.length < 2) return null;

  // Lấy màu từ API teamsData (có fallback nếu API chưa load xong)
  const blueTeamColor = matchInfo?.teamsData?.[0]?.color || "#38bdf8"; // Mặc định sky-400
  const redTeamColor = matchInfo?.teamsData?.[1]?.color || "#f43f5e";  // Mặc định rose-500

  return (
    <FixedInnerColumn
      width="w-[65px]"
      renderCell={(i) => {
        const bluePlayer = data.teams[0].players[i];
        const redPlayer = data.teams[1].players[i];

        const blueGold = bluePlayer?.totalGold || 0;
        const redGold = redPlayer?.totalGold || 0;
        
        const diff = blueGold - redGold;
        const absDiff = Math.abs(diff);
        const formattedDiff = diff === 0 ? "0" : formatGold(absDiff);
        
        const isBlueLead = diff > 0;
        const isRedLead = diff < 0;

        return (
          <div className="relative w-full h-full flex items-center justify-center border-x border-white/5 bg-white/[0.01]">
            
            {/* INDICATOR BÊN TRÁI (BLUE TEAM) */}
            {isBlueLead && (
              <div className="absolute left-0 h-[70%] flex items-center">
                {/* Thay bg-sky-400 bằng màu từ API */}
                <div 
                    className="w-[3px] h-full" 
                    style={{ 
                        backgroundColor: blueTeamColor,
                        filter: `drop-shadow(0 0 4px ${blueTeamColor}99)` // Đổ bóng theo màu (99 là độ alpha)
                    }} 
                />
                <div
                  className="size-0 
                    border-t-[5px] border-t-transparent 
                    border-b-[5px] border-b-transparent"
                  style={{ borderLeft: `6px solid ${blueTeamColor}` }} // Mũi tên màu Blue Team
                />
              </div>
            )}

            {/* VALUE DISPLAY */}
            <span className="text-[14px] font-semibold tracking-tighter tabular-nums text-white">
              {isBlueLead ? `${formattedDiff}` : isRedLead ? `${formattedDiff}` : "0"}
            </span>

            {/* INDICATOR BÊN PHẢI (RED TEAM) */}
            {isRedLead && (
              <div className="absolute right-0 h-[70%] flex items-center flex-row-reverse">
                {/* Thay bg-rose-500 bằng màu từ API */}
                <div 
                    className="w-[3px] h-full" 
                    style={{ 
                        backgroundColor: redTeamColor,
                        filter: `drop-shadow(0 0 4px ${redTeamColor}99)` 
                    }} 
                />
                <div
                  className="size-0 
                    border-t-[5px] border-t-transparent 
                    border-b-[5px] border-b-transparent"
                  style={{ borderRight: `6px solid ${redTeamColor}` }} // Mũi tên màu Red Team
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