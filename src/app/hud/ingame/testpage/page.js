"use client";

import React, { useEffect } from "react";
import { useScoreboardData } from "@/hooks/useApiTeamData";

const TestPage = () => {
  const { allPlayerNames, matchInfo } = useScoreboardData();

  useEffect(() => {
    if (allPlayerNames.length > 0) {
      // Log theo yêu cầu của bạn
      console.log("🔥 All Player Detailed Data:", allPlayerNames);
    }
  }, [allPlayerNames]);

  return (
    <div className="p-10 text-white bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8">
        
        {/* Render danh sách Blue và Red */}
        {[0, 5].map((startIndex) => (
          <div key={startIndex} className="space-y-4">
            <h2 className={`text-2xl font-black italic ${startIndex === 0 ? 'text-blue-500' : 'text-red-500 text-right'}`}>
              {startIndex === 0 ? 'BLUE SIDE' : 'RED SIDE'}
            </h2>
            
            <div className="space-y-2">
              {allPlayerNames.slice(startIndex, startIndex + 5).map((player, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-4 p-3 bg-slate-900 border border-white/5 rounded-lg ${startIndex === 5 ? 'flex-row-reverse' : ''}`}
                >
                  {/* Hiển thị Avatar từ API */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-black">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.nickname} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px]">NO IMG</div>
                    )}
                  </div>

                  <div className={`flex-1 ${startIndex === 5 ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1 justify-start overflow-hidden">
                       <span className="text-[10px] font-mono text-slate-500">[{player.gameName}]</span>
                    </div>
                    <div className="text-xl font-bold text-white uppercase leading-none">
                      {player.nickname}
                    </div>
                    <div className={`text-[10px] font-black tracking-widest ${startIndex === 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {player.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TestPage;