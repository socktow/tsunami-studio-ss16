"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
import { useScoreboardData } from "@/hooks/useApiTeamData";

const sponsors = [
    {
        name: "Cieleta",
        brand: "Co-Stream",
        color: "#ff0000"
    },
    {
        name: "ChuChu",
        brand: "Developer",
        color: "#db1c24"
    },
    {
        name: "Tsunami Studio",
        brand: "PREMIUM E-SPORTS",
        color: "#00ff41"
    }
];

const MiniMapSponsor = () => {
    const [sponsorIndex, setSponsorIndex] = useState(0);

    // 1. Trích xuất dữ liệu màu của 2 Team từ Database API
    const { matchInfo } = useScoreboardData();
    const blueColor = useMemo(() => matchInfo?.teamsData?.[0]?.color || "#3b82f6", [matchInfo]);
    const redColor = useMemo(() => matchInfo?.teamsData?.[1]?.color || "#f43f5e", [matchInfo]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSponsorIndex(prev => (prev + 1) % sponsors.length);
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    const currentSponsor = sponsors[sponsorIndex];

    return (
        <LazyMotion features={domAnimation}>
            <div
                className="
                    fixed
                    bottom-0
                    left-0
                    w-full
                    flex
                    justify-between
                    items-end
                    z-50
                    pointer-events-none
                "
            >
                {/* SPONSOR PANEL */}
                <div
                    style={{
                        width: "280px",
                        height: "115px"
                    }}
                    className="
                        bg-zinc-950/95
                        border-t border-r border-cyan-500/20
                        relative
                        overflow-hidden
                        flex
                        flex-col
                        justify-center
                        px-6
                        pointer-events-auto
                        backdrop-blur-sm
                    "
                >
                    {/* Góc trang trí HUD điện tử */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500/50" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-500/20 rounded-full animate-pulse" />

                    <AnimatePresence mode="wait">
                        <m.div
                            key={currentSponsor.name}
                            initial={{ opacity: 0, x: -15, filter: "blur(4px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: 15, filter: "blur(4px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full flex flex-col gap-0.5"
                        >
                            {/* Dòng chữ nhỏ Brand phụ phía trên */}
                            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500/70 uppercase">
                                // {currentSponsor.brand}
                            </span>

                            {/* Tên Sponsor lớn chính giữa */}
                            <h2 className="text-white text-2xl font-black italic tracking-tight uppercase leading-none flex items-center gap-1">
                                {currentSponsor.name}
                                <span 
                                    className="inline-block w-1.5 h-4 animate-pulse"
                                    style={{ backgroundColor: currentSponsor.color || '#00f0ff' }}
                                />
                            </h2>
                        </m.div>
                    </AnimatePresence>

                    {/* Thanh timeline đếm ngược chạy ngầm phía dưới đáy panel */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900">
                        <m.div 
                            key={sponsorIndex}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 12, ease: "linear" }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                        />
                    </div>
                </div>

                {/* MINIMAP CHUẨN (ĐÃ CẬP NHẬT ĐẦY ĐỦ DYNAMIC GRADIENT THEO MÀU TEAM) */}
                <div 
                    style={{ width: '280px', height: '280px' }} 
                    className="relative flex items-center justify-center border-[7px] border-black pointer-events-auto"
                >
                    <div style={{ width: '267px', height: '267px' }} className="relative bg-transparent overflow-hidden">
                        
                        {/* 1. CẠNH TRÊN (Top Line) - Đổ dốc từ Màu Red Team sang Đen */}
                        <div 
                            style={{ backgroundImage: `linear-gradient(to left, ${redColor}, black)` }} 
                            className="absolute top-0 left-0 w-full h-[5px] z-30" 
                        />
                        
                        {/* 2. CẠNH PHẢI (Right Line) - Đổ dốc từ Màu Red Team xuống Đen */}
                        <div 
                            style={{ backgroundImage: `linear-gradient(to bottom, ${redColor}, black)` }} 
                            className="absolute top-0 right-0 w-[5px] h-full z-30" 
                        />
                        
                        {/* 3. CẠNH DƯỚI (Bottom Line) - Đổ dốc từ Màu Blue Team sang Đen */}
                        <div 
                            style={{ backgroundImage: `linear-gradient(to right, ${blueColor}, black)` }} 
                            className="absolute bottom-0 left-0 w-full h-[5px] z-30" 
                        />
                        
                        {/* 4. CẠNH TRÁI (Left Line) - Đổ dốc từ Màu Blue Team lên Đen */}
                        <div 
                            style={{ backgroundImage: `linear-gradient(to top, ${blueColor}, black)` }} 
                            className="absolute top-0 left-0 w-[5px] h-full z-30" 
                        />
                        
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
};

export default MiniMapSponsor;