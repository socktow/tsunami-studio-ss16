"use client";
import React, { useMemo } from 'react';
import { useLeagueData } from "@/app/overlay/layout";
import { useOverlayStore } from "@/store/overlayStore";
import { motion, AnimatePresence } from "framer-motion";

const DynamicRankingPanel = () => {
    const { gameData } = useLeagueData();
    const { activeRankView, showLeft, showOverlay } = useOverlayStore();
    
    const view = activeRankView || 'gold'; 
    const API_BASE = "http://localhost:58869/";

    const rankedPlayers = useMemo(() => {
        const teams = gameData?.scoreboardBottom?.teams || [];
        const tabs = gameData?.tabs;
        if (!tabs) return [];

        const all = [
            ...(tabs.Order?.players || []).map(p => ({ ...p, teamSide: 'blue' })), 
            ...(tabs.Chaos?.players || []).map(p => ({ ...p, teamSide: 'red' }))
        ];

        const combined = all.map((player) => {
            const teamIndex = player.teamSide === 'blue' ? 0 : 1;
            const scorePlayer = teams[teamIndex]?.players?.find(p => p.champion?.name === player.championAssets?.name);
            return {
                ...player,
                displayName: player.playerName || player.championAssets?.name,
                totalGold: scorePlayer?.totalGold || 0,
                splash: player.championAssets?.splashCenteredImg
            };
        });

        return [...combined].sort((a, b) => {
            if (view === 'gold') return b.totalGold - a.totalGold;
            if (b.level !== a.level) return (b.level || 0) - (a.level || 0);
            return (b.experience?.current || 0) - (a.experience?.current || 0);
        });
    }, [gameData, view]);

    if (!showOverlay || !showLeft || rankedPlayers.length === 0) return null;

    const formatGold = (gold) => ((gold || 0) / 1000).toFixed(1) + "k";
    
    const getXPPercent = (exp) => {
        if (!exp || exp.nextLevel === exp.previousLevel) return 0;
        return Math.min(Math.max(((exp.current - exp.previousLevel) / (exp.nextLevel - exp.previousLevel)) * 100, 0), 100);
    };

    return (
        <div className="absolute top-1/2 -translate-y-1/2 left-8 flex flex-col pointer-events-none select-none z-50 w-[260px]">
            <motion.div 
                layout
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative bg-zinc-900/90 backdrop-blur-2xl rounded-2xl border border-white/20 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
            >
                <div className="relative overflow-hidden border-b border-white/10">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={view}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className={`flex items-center justify-between px-4 py-3 ${
                                view === 'gold' 
                                ? 'bg-gradient-to-r from-amber-500/20 to-transparent' 
                                : 'bg-gradient-to-r from-cyan-500/20 to-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${view === 'gold' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                                <span className="text-white font-black text-xs uppercase tracking-widest drop-shadow-md">
                                    {view === 'gold' ? 'Economy Leader' : 'Level Ranking'}
                                </span>
                            </div>
                            <div className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-white/70 uppercase">
                                Live
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="p-2 flex flex-col gap-1.5">
                    <AnimatePresence mode="popLayout">
                        {rankedPlayers.slice(0, 10).map((player, index) => (
                            <motion.div
                                key={`${player.teamSide}-${player.displayName}`}
                                layout
                                className="relative h-12 overflow-hidden rounded-lg border border-white/5 bg-zinc-800/40"
                            >
                                <div className="absolute inset-0 z-0">
                                    <img src={`${API_BASE}${player.splash}`} className="absolute inset-0 w-full h-full object-cover object-[50%_20%] opacity-60" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-900/60 to-zinc-900" />
                                    <div className={`absolute inset-y-0 left-0 w-1 ${player.teamSide === 'blue' ? 'bg-blue-500 shadow-[2px_0_10px_rgba(59,130,246,0.5)]' : 'bg-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.5)]'}`} />
                                </div>

                                <div className="relative z-10 flex items-center h-full px-3 justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black italic italic-extra w-5 ${index === 0 ? 'text-white scale-110' : 'text-zinc-500'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-white font-extrabold text-[11px] uppercase tracking-wide drop-shadow-md truncate max-w-[90px]">
                                            {player.displayName}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[70px]">
                                        {view === 'gold' ? (
                                            <div className="flex items-center gap-1">
                                                <span className={`font-mono font-black text-sm tabular-nums ${index === 0 ? 'text-amber-400' : 'text-amber-200/90'}`}>
                                                    {formatGold(player.totalGold)}
                                                </span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]" />
                                            </div>
                                        ) : (
                                            <div className="w-full flex flex-col items-end gap-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[9px] font-black text-cyan-400/70 uppercase">Lv</span>
                                                    <span className="font-mono font-black text-base leading-none text-white tabular-nums drop-shadow-md">
                                                        {player.level}
                                                    </span>
                                                </div>
                                                <div className="w-16 h-1.5 bg-black/40 rounded-full border border-white/5 overflow-hidden">
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

                {/* FOOTER */}
                <div className="px-4 py-2 bg-white/5 flex items-center justify-between border-t border-white/10">
                    <span className="text-[8px] text-white/30 font-black uppercase tracking-[0.3em]">VCS Official</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DynamicRankingPanel;