import React from "react";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";
import { useScoreboardData } from "@/hooks/useApiTeamData"; // Import hook API
import L1 from "./columns/L1";
import L2 from "./columns/L2";
import CT from "./columns/CT";
import R1 from "./columns/R1";
import R2 from "./columns/R2";

const ScBottom = () => {
    const data = useScoreboardBottomSelector();
    const { matchInfo } = useScoreboardData(); // Lấy dữ liệu match (bao gồm color)

    if (!data) return null;

    const teamKills = data.teams.map(team =>
        team.players.reduce((sum, player) => sum + player.kills, 0)
    );

    // Lấy màu từ API teamsData (Fallback về màu mặc định nếu chưa có dữ liệu)
    const blueColor = matchInfo?.teamsData?.[0]?.color || "#2563eb"; // Mặc định xanh blue-600
    const redColor = matchInfo?.teamsData?.[1]?.color || "#dc2626";  // Mặc định đỏ red-600

    return (
        <div className="min-h-screen flex items-end justify-center">
            <div className="relative w-[990px] h-[260px] flex border border-white/10 overflow-hidden  ">

                {/* BACKGROUND DYNAMIC */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[#050505]/90" />
                    
                    {/* Gradient bên trái (Blue Team) */}
                    <div 
                        className="absolute inset-y-0 left-0 w-[40%]" 
                        style={{
                            background: `linear-gradient(to right, ${blueColor}4D, ${blueColor}1A, transparent)`
                            // 4D tương đương opacity 30%, 1A tương đương 10%
                        }}
                    />
                    
                    {/* Gradient bên phải (Red Team) */}
                    <div 
                        className="absolute inset-y-0 right-0 w-[40%]" 
                        style={{
                            background: `linear-gradient(to left, ${redColor}4D, ${redColor}1A, transparent)`
                        }}
                    />

                    {/* Vùng sáng ở giữa */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at center, 
                                rgba(234, 179, 8, 0.2) 0%, 
                                rgba(234, 179, 8, 0.05) 30%, 
                                transparent 70%)`,
                        }}
                    />

                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10 flex w-full h-full">
                    <L1 />
                    <L2 />
                    <CT
                        blueKills={teamKills[0]}
                        redKills={teamKills[1]}
                        gameTime={data.gameTime}
                    />
                    <R1 />
                    <R2 />
                </div>
            </div>
        </div>
    );
};

export default ScBottom;