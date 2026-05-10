"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGE_BASE_URL } from "@/lib/constants";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

const BottomRightLeftPanel = () => {
    const data = useScoreboardBottomSelector();
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

    if (!data || !data.teams) return null;

    const allPlayers = [
        ...(data.teams[0]?.players || []),
        ...(data.teams[1]?.players || [])
    ];

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanBase = IMAGE_BASE_URL.replace(/\/$/, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    const PlayerCard = ({ player, side }) => {
        if (!player) return <div style={{ width: '200px', height: '260px' }} className="bg-black/20" />;
        const name = player?.playerName || player?.name || "Unknown";
        const splash = player?.championAssets?.splashCenteredImg || player?.splash || player?.champion?.splashCenteredImg;
        const isLeft = side === 'left';

        return (
            <div style={{ width: '186px', height: '260px' }} className="relative bg-[#0a0a0c] overflow-hidden group border-y border-white/10">
                <div className="absolute inset-0 z-0 opacity-20 scale-150 blur-xl saturate-0">
                    {splash && <img src={getFullImageUrl(splash)} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className={`absolute top-2 ${isLeft ? 'left-2' : 'right-2'} z-40 flex gap-1`}>
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                    <div className="w-8 h-[1px] bg-cyan-500/30 mt-0.5" />
                </div>
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`${player?.id || "unknown"}-${name}`}
                        className="absolute inset-0 z-10"
                        initial={{ x: isLeft ? "-100%" : "100%", skewX: isLeft ? -10 : 10, opacity: 0 }}
                        animate={{ x: 0, skewX: 0, opacity: 1 }}
                        exit={{ x: isLeft ? "100%" : "-100%", skewX: isLeft ? 10 : -10, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative w-full h-full">
                            <img src={getFullImageUrl(splash)} alt={name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full z-30">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            <div className="bg-black/80 backdrop-blur-md py-3 px-2 flex flex-col items-center">
                                <span className="text-[10px] text-cyan-400 font-mono tracking-[0.3em] uppercase opacity-60 mb-1">Authenticated</span>
                                <span className="text-white text-[15px] font-black tracking-widest uppercase italic">{name}</span>
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

            {/* CỤM TRÁI: SPONSOR TERMINAL */}
            <div className="flex items-end pointer-events-auto">
                <div
                    style={{ width: '280px', height: '115px' }}
                    className="bg-[#050505] border-t border-r border-cyan-900/30 relative overflow-hidden flex items-center justify-center"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[repeating-linear-gradient(0deg,#fff,#fff_1px,transparent_1px,transparent_10px)]" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={sponsors[sponsorIndex].name}
                            initial={{ y: 20, opacity: 0, skewY: 2 }}
                            animate={{ y: 0, opacity: 1, skewY: 0 }}
                            exit={{ y: -20, opacity: 0, skewY: -2 }}
                            transition={{ duration: 0.5, ease: "backOut" }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rotate-45 border border-cyan-500/50" />
                                <span className="text-cyan-500/40 text-[8px] font-mono tracking-[0.4em] uppercase">Global Partner</span>
                                <div className="w-2 h-2 rotate-45 border border-cyan-500/50" />
                            </div>
                            <h2 className="text-white text-2xl font-black tracking-tighter italic">
                                {sponsors[sponsorIndex].name}<span className="text-cyan-500 animate-pulse">_</span>
                            </h2>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="h-[1px] w-4 bg-white/10" />
                                <span className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase">{sponsors[sponsorIndex].brand}</span>
                                <div className="h-[1px] w-4 bg-white/10" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />
                </div>
                <PlayerCard
                    player={allPlayers[leftIndex] || null}
                    side="right"
                />
            </div>

            {/* CỤM PHẢI: Minimap Terminal (OBS Overlay Ready) */}
            <div className="flex items-end pointer-events-auto">
                <PlayerCard
                    player={allPlayers[rightIndex] || null}
                    side="left"
                />


                <div
                    style={{ width: '280px', height: '280px' }}
                    className="relative flex items-center justify-center border-[7px] border-black"
                >

                    {/* --- Ô TRỐNG OVERLAY (267x267) --- */}
                    <div
                        style={{ width: '267px', height: '267px' }}
                        className="relative bg-transparent overflow-hidden minimap-gradient-border"
                    >

                        {/* ========================= */}
                        {/* GÓC VÀNG (TOP + RIGHT) */}
                        {/* ========================= */}

                        {/* TOP */}
                        <div
                            className="
                absolute
                top-0
                left-0
                w-full
                h-[5px]
                z-30

                bg-gradient-to-l
                from-[#FFE14D]
                to-black
            "
                        />

                        {/* RIGHT */}
                        <div
                            className="
                absolute
                top-0
                right-0
                w-[5px]
                h-full
                z-30

                bg-gradient-to-b
                from-[#FFE14D]
                to-black
            "
                        />



                        {/* ========================= */}
                        {/* GÓC CYAN (BOTTOM + LEFT) */}
                        {/* ========================= */}

                        {/* BOTTOM */}
                        <div
                            className="
                absolute
                bottom-0
                left-0
                w-full
                h-[5px]
                z-30

                bg-gradient-to-r
                from-cyan-500
                to-black
            "
                        />

                        {/* LEFT */}
                        <div
                            className="
                absolute
                top-0
                left-0
                w-[5px]
                h-full
                z-30

                bg-gradient-to-t
                from-cyan-500
                to-black
            "
                        />

                    </div>

                </div>
            </div>

        </div>
    );
};

export default BottomRightLeftPanel;