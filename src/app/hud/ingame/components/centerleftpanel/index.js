"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useRankingSelector } from "@/hooks/useLeagueSelector";
import { formatGold } from "@/lib/utils";
import { IMAGE_BASE_URL } from "@/lib/constants";
import { useOverlayStore } from "@/store/overlayStore"; // Import store

const CenterLeftPanel = () => {
    // Lấy state từ global store
    const { showLeft, activeRankView } = useOverlayStore();
    
    // Sử dụng activeRankView (gold hoặc xp) để lấy dữ liệu tương ứng
    const rankedPlayers = useRankingSelector(activeRankView || 'level');

    // Chỉ hiển thị khi showLeft được bật và có dữ liệu
    if (!showLeft || rankedPlayers.length === 0) return null;

    const getXPPercent = (exp) => {
        if (!exp || exp.nextLevel === exp.previousLevel) return 0;
        return Math.min(Math.max(((exp.current - exp.previousLevel) / (exp.nextLevel - exp.previousLevel)) * 100, 0), 100);
    };

    return (
        <div className="absolute left-3 top-[42%] -translate-y-1/2 flex flex-col pointer-events-none select-none z-40 w-[250px]">
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="relative bg-zinc-900/90 backdrop-blur-2xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
            >
                {/* HEADER */}
                <div className="relative overflow-hidden border-b border-white/10">
                    <div className={`flex items-center justify-between px-4 py-3 ${
                        activeRankView === 'gold'
                            ? 'bg-gradient-to-r from-amber-500/20 to-transparent'
                            : 'bg-gradient-to-r from-cyan-500/20 to-transparent'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-4 rounded-full ${
                                activeRankView === 'gold' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                            }`} />
                            <span className="text-white font-black text-[10px] uppercase tracking-widest">
                                {activeRankView === 'gold' ? 'Economy Leader' : 'Level Ranking'}
                            </span>
                        </div>
                        <div className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-white/50 uppercase">Live</div>
                    </div>
                </div>

                {/* PLAYERS LIST */}
                <div className="p-2 flex flex-col gap-1.5">
                    <AnimatePresence mode="popLayout">
                        {rankedPlayers.slice(0, 10).map((player, index) => (
                            <motion.div
                                key={`${player.teamSide}-${player.displayName}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative h-10 overflow-hidden rounded-lg border border-white/5 bg-zinc-800/40"
                            >
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={`${IMAGE_BASE_URL}${player.splash}`}
                                        className="absolute w-full h-full object-cover opacity-90 object-[50%_25%]" 
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-transparent" />
                                    <div className={`absolute inset-y-0 left-0 w-1 ${player.teamSide === 'blue' ? 'bg-blue-500 shadow-[2px_0_8px_#3b82f6]' : 'bg-red-500 shadow-[2px_0_8px_#ef4444]'}`} />
                                </div>

                                <div className="relative z-10 flex items-center h-full px-3 justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-black italic w-4 ${index === 0 ? 'text-white' : 'text-zinc-500'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-white font-extrabold text-[10px] uppercase truncate max-w-[90px]">
                                            {player.displayName}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[70px]">
                                        {activeRankView === 'gold' ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className={`font-mono font-black text-xs ${index === 0 ? 'text-amber-400' : 'text-amber-100/90'}`}>
                                                    {formatGold(player.totalGold)}
                                                </span>
                                                <div className="size-1 rounded-full bg-amber-500 shadow-[0_0_4px_#f59e0b]" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[8px] font-black text-cyan-400 opacity-70 uppercase">Lv</span>
                                                    <span className="font-mono font-black text-sm text-white">{player.level}</span>
                                                </div>
                                                <div className="w-16 h-1 bg-zinc-950/40 rounded-full border border-white/5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${getXPPercent(player.experience)}%` }}
                                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="px-4 py-1.5 bg-zinc-950/20 flex justify-center border-t border-white/5">
                    <span className="text-[7px] text-white/20 font-bold uppercase tracking-[0.4em]">VCS Official System</span>
                </div>
            </motion.div>
        </div>
    );
};

export default CenterLeftPanel;