"use client";
import React, { useState, useEffect } from 'react';
// Tối ưu Bundle Size bằng LazyMotion và m thay vì motion thông thường
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { IMAGE_BASE_URL } from "@/lib/constants";
import { useScoreboardData } from "@/hooks/useApiTeamData"; 

const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanBase = IMAGE_BASE_URL.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

const PlayerCardItem = ({ player, side }) => {
    if (!player) return <div style={{ width: '186px', height: '260px' }} className="bg-zinc-950/20" />;

    const displayName = player.nickname; 
    const apiAvatar = player.avatar;     
    const splash = player.championSplash; 
    const isLeft = side === 'left';

    return (
        <div style={{ width: '186px', height: '260px' }} className="relative bg-[#0a0a0c] overflow-hidden group border-y border-white/10">
            {/* Background Splash mang tính chất trang trí */}
            <div className="absolute inset-0 z-0 opacity-20 scale-150 blur-xl saturate-0">
                {splash && <img src={getFullImageUrl(splash)} className="w-full h-full object-cover" alt="" />}
            </div>

            {/* Chi tiết hiệu ứng đèn quét nhỏ ở góc */}
            <div className={`absolute top-2 ${isLeft ? 'left-2' : 'right-2'} z-40 flex gap-1`}>
                <div className="size-1 bg-cyan-500 rounded-full animate-pulse" />
                <div className="w-8 h-[1px] bg-cyan-500/30 mt-0.5" />
            </div>

            <AnimatePresence mode="popLayout">
                <m.div
                    key={`${player.gameName}-${displayName}`}
                    className="absolute inset-0 z-10"
                    initial={{ x: isLeft ? "-100%" : "100%", skewX: isLeft ? -10 : 10, opacity: 0 }}
                    animate={{ x: 0, skewX: 0, opacity: 1 }}
                    exit={{ x: isLeft ? "100%" : "-100%", skewX: isLeft ? 10 : -10, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="relative w-full h-full">
                        <img 
                            src={apiAvatar ? getFullImageUrl(apiAvatar) : getFullImageUrl(splash)} 
                            alt={`Ảnh đại diện của ${displayName}`} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full z-30">
                        <m.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                        <div className="bg-zinc-950/80 backdrop-blur-md py-3 px-2 flex flex-col items-center">
                            <span className="text-white text-[15px] font-semibold tracking-widest uppercase italic">
                                {displayName}
                            </span>
                        </div>
                    </div>
                </m.div>
            </AnimatePresence>
            <div className="absolute inset-0 border border-white/5 pointer-events-none z-50" />
        </div>
    );
};

const PlayerCard = () => {
    const { allPlayerNames } = useScoreboardData();
    
    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(5);

    // Vòng lặp đổi nhân vật ngẫu nhiên mỗi 12 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setLeftIndex(Math.floor(Math.random() * 5));
            setRightIndex(Math.floor(Math.random() * 5) + 5);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    if (!allPlayerNames || allPlayerNames.length === 0) return null;

    return (
        <LazyMotion features={domAnimation}>
            <div className="fixed bottom-0 left-0 w-full flex justify-between items-end p-0 pointer-events-none z-50">
                
                {/* CỤM TRÁI: Dịch card vào trong, nhường khoảng trống 280px ban đầu cho HUD/Sponsor */}
                <div style={{ paddingLeft: '280px' }} className="pointer-events-auto">
                    <PlayerCardItem
                        player={allPlayerNames[leftIndex]}
                        side="left"
                    />
                </div>

                {/* CỤM PHẢI: Dịch card vào trong, nhường khoảng trống 280px ban đầu cho Bản đồ nhỏ (Minimap) */}
                <div style={{ paddingRight: '280px' }} className="pointer-events-auto">
                    <PlayerCardItem
                        player={allPlayerNames[rightIndex]}
                        side="right"
                    />
                </div>

            </div>
        </LazyMotion>
    );
};

export default PlayerCard;