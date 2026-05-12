"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGE_BASE_URL } from "@/lib/constants";
import { useScoreboardData } from "@/hooks/useApiTeamData"; 

const BottomRightLeftPanel = () => {
    // Lấy dữ liệu đã được mapping từ API
    const { allPlayerNames } = useScoreboardData();
    
    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(5);
    const [sponsorIndex, setSponsorIndex] = useState(0);

    const sponsors = [
        { name: "Cieleta", brand: "Co-Stream", color: "#ff0000" },
        { name: "ChuChu", brand: "Developer", color: "#db1c24" },
        { name: "Tsunami Studio", brand: "PREMIUM E-SPORTS", color: "#00ff41" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLeftIndex(Math.floor(Math.random() * 5));
            setRightIndex(Math.floor(Math.random() * 5) + 5);
            setSponsorIndex((prev) => (prev + 1) % sponsors.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    // Nếu chưa có dữ liệu từ hook thì không render
    if (!allPlayerNames || allPlayerNames.length === 0) return null;

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanBase = IMAGE_BASE_URL.replace(/\/$/, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    const PlayerCard = ({ player, side }) => {
        if (!player) return <div style={{ width: '186px', height: '260px' }} className="bg-black/20" />;

        // --- Cập nhật logic lấy thông tin từ Object mới ---
        const displayName = player.nickname; // Nickname từ API
        const role = player.role;           // Role từ API
        const apiAvatar = player.avatar;     // Avatar từ API
        const splash = player.championSplash; // Splash art từ Game
        // -------------------------------------------------

        const isLeft = side === 'left';

        return (
            <div style={{ width: '186px', height: '260px' }} className="relative bg-[#0a0a0c] overflow-hidden group border-y border-white/10">
                {/* Background Splash */}
                <div className="absolute inset-0 z-0 opacity-20 scale-150 blur-xl saturate-0">
                    {splash && <img src={getFullImageUrl(splash)} className="w-full h-full object-cover" alt="" />}
                </div>

                <div className={`absolute top-2 ${isLeft ? 'left-2' : 'right-2'} z-40 flex gap-1`}>
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                    <div className="w-8 h-[1px] bg-cyan-500/30 mt-0.5" />
                </div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`${player.gameName}-${displayName}`}
                        className="absolute inset-0 z-10"
                        initial={{ x: isLeft ? "-100%" : "100%", skewX: isLeft ? -10 : 10, opacity: 0 }}
                        animate={{ x: 0, skewX: 0, opacity: 1 }}
                        exit={{ x: isLeft ? "100%" : "-100%", skewX: isLeft ? 10 : -10, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative w-full h-full">
                            {/* Ưu tiên hiển thị Avatar API, nếu không có thì dùng Splash */}
                            <img 
                                src={apiAvatar ? getFullImageUrl(apiAvatar) : getFullImageUrl(splash)} 
                                alt={displayName} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full z-30">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            <div className="bg-black/80 backdrop-blur-md py-3 px-2 flex flex-col items-center">
                                {/* Hiển thị Role thay cho chữ Authenticated mặc định hoặc giữ nguyên tùy ý */}
                                <span className="text-white text-[15px] font-black tracking-widest uppercase italic">
                                    {displayName}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 border border-white/5 pointer-events-none z-50" />
            </div>
        );
    };

    return (
        <div className="fixed bottom-0 left-0 w-full flex justify-between items-end p-0 pointer-events-none z-50">
            {/* CỤM TRÁI */}
            <div className="flex items-end pointer-events-auto">
                <div style={{ width: '280px', height: '115px' }} className="bg-[#050505] border-t border-r border-cyan-900/30 relative overflow-hidden flex items-center justify-center">
                    {/* Sponsor content... */}
                    <AnimatePresence mode="wait">
                        <motion.div key={sponsors[sponsorIndex].name} /* ... */ >
                             <h2 className="text-white text-2xl font-black tracking-tighter italic">
                                {sponsors[sponsorIndex].name}<span className="text-cyan-500 animate-pulse">_</span>
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <PlayerCard
                    player={allPlayerNames[leftIndex]}
                    side="right"
                />
            </div>

            {/* CỤM PHẢI */}
            <div className="flex items-end pointer-events-auto">
                <PlayerCard
                    player={allPlayerNames[rightIndex]}
                    side="left"
                />
                <div style={{ width: '280px', height: '280px' }} className="relative flex items-center justify-center border-[7px] border-black">
                     {/* Minimap borders... */}
                     <div style={{ width: '267px', height: '267px' }} className="relative bg-transparent overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[5px] z-30 bg-gradient-to-l from-[#FFE14D] to-black" />
                        <div className="absolute top-0 right-0 w-[5px] h-full z-30 bg-gradient-to-b from-[#FFE14D] to-black" />
                        <div className="absolute bottom-0 left-0 w-full h-[5px] z-30 bg-gradient-to-r from-cyan-500 to-black" />
                        <div className="absolute top-0 left-0 w-[5px] h-full z-30 bg-gradient-to-t from-cyan-500 to-black" />
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BottomRightLeftPanel;