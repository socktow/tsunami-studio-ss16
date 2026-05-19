"use client";
import React, { useState, useEffect } from 'react';
// Sửa lỗi Bundle Size: Chuyển sang dùng LazyMotion và m thay vì motion thông thường
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { IMAGE_BASE_URL } from "@/lib/constants";
import { useScoreboardData } from "@/hooks/useApiTeamData"; 

const sponsors = [
    { name: "Cieleta", brand: "Co-Stream", color: "#ff0000" },
    { name: "ChuChu", brand: "Developer", color: "#db1c24" },
    { name: "Tsunami Studio", brand: "PREMIUM E-SPORTS", color: "#00ff41" }
];

const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanBase = IMAGE_BASE_URL.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

// --- GIẢI PHÁP SỬA LỖI CORRECTNESS ---
// Di chuyển PlayerCard hoàn toàn ra khỏi BottomRightLeftPanel để tránh bị re-create ở mỗi lần render
const PlayerCard = ({ player, side }) => {
    if (!player) return <div style={{ width: '186px', height: '260px' }} className="bg-zinc-950/20" />;

    const displayName = player.nickname; 
    const apiAvatar = player.avatar;     
    const splash = player.championSplash; 
    const isLeft = side === 'left';

    return (
        <div style={{ width: '186px', height: '260px' }} className="relative bg-[#0a0a0c] overflow-hidden group border-y border-white/10">
            {/* Background Splash */}
            <div className="absolute inset-0 z-0 opacity-20 scale-150 blur-xl saturate-0">
                {/* Sửa lỗi Next.js/Accessibility: Thêm alt="" trống cho ảnh mang tính chất trang trí */}
                {splash && <img src={getFullImageUrl(splash)} className="w-full h-full object-cover" alt="" />}
            </div>

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
                        {/* Sửa lỗi Accessibility: Bổ sung thuộc tính alt có nghĩa từ tên người chơi */}
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
                            {/* Sửa lỗi Architecture: Hạ font-semibold xuống font-semibold để chữ kích thước lớn không bị khít nét */}
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

const BottomRightLeftPanel = () => {
    const { allPlayerNames } = useScoreboardData();
    
    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(5);
    const [sponsorIndex, setSponsorIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLeftIndex(Math.floor(Math.random() * 5));
            setRightIndex(Math.floor(Math.random() * 5) + 5);
            setSponsorIndex((prev) => (prev + 1) % sponsors.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    if (!allPlayerNames || allPlayerNames.length === 0) return null;

    return (
        // Bọc LazyMotion ở cấp độ component này để kích hoạt 'm' tối ưu bundle size
        <LazyMotion features={domAnimation}>
            <div className="fixed bottom-0 left-0 w-full flex justify-between items-end p-0 pointer-events-none z-50">
                {/* CỤM TRÁI */}
                <div className="flex items-end pointer-events-auto">
                    <div style={{ width: '280px', height: '115px' }} className="bg-[#050505] border-t border-r border-cyan-900/30 relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <m.div 
                                key={sponsors[sponsorIndex].name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                            >
                                 {/* Sửa lỗi Architecture: Hạ font-semibold của tiêu đề h2 xuống font-semibold */}
                                 <h2 className="text-white text-2xl font-semibold tracking-tighter italic">
                                    {sponsors[sponsorIndex].name}<span className="text-cyan-500 animate-pulse">_</span>
                                </h2>
                            </m.div>
                        </AnimatePresence>
                    </div>
                    {/* LOGIC FIX: Đổi side="right" thành side="left" vì đây là cụm bên trái màn hình */}
                    <PlayerCard
                        player={allPlayerNames[leftIndex]}
                        side="left"
                    />
                </div>

                {/* CỤM PHẢI */}
                <div className="flex items-end pointer-events-auto">
                    <PlayerCard
                        player={allPlayerNames[rightIndex]}
                        side="right"
                    />
                    <div style={{ width: '280px', height: '280px' }} className="relative flex items-center justify-center border-[7px] border-black">
                         <div style={{ width: '267px', height: '267px' }} className="relative bg-transparent overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[5px] z-30 bg-gradient-to-l from-[#FFE14D] to-black" />
                            <div className="absolute top-0 right-0 w-[5px] h-full z-30 bg-gradient-to-b from-[#FFE14D] to-black" />
                            <div className="absolute bottom-0 left-0 w-full h-[5px] z-30 bg-gradient-to-r from-cyan-500 to-black" />
                            <div className="absolute top-0 left-0 w-[5px] h-full z-30 bg-gradient-to-t from-cyan-500 to-black" />
                         </div>
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
};

export default BottomRightLeftPanel;