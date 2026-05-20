"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScoreboardData } from "@/hooks/useApiTeamData"; 

const Matchup = () => {
    const { matchInfo } = useScoreboardData();
    const [phase, setPhase] = useState("init"); 

    useEffect(() => {
        if (matchInfo && matchInfo.teamsData?.length >= 2) {
            setPhase("phase1");
            const timerToPhase2 = setTimeout(() => setPhase("phase2"), 2000);
            const timerToPhase3 = setTimeout(() => setPhase("phase3"), 7000);
            const timerToHidden = setTimeout(() => setPhase("hidden"), 9000);
            return () => {
                clearTimeout(timerToPhase2);
                clearTimeout(timerToPhase3);
                clearTimeout(timerToHidden);
            };
        }
    }, [matchInfo]);

    if (!matchInfo || !matchInfo.teamsData || matchInfo.teamsData.length < 2 || phase === "hidden" || phase === "init") {
        return null;
    }

    const teamLeft = matchInfo.teamsData[0];
    const teamRight = matchInfo.teamsData[1];
    const currentGame = (teamLeft.score || 0) + (teamRight.score || 0) + 1;
    const springTransition = { type: "spring", stiffness: 50, damping: 14, mass: 1 };

    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {phase !== "phase3" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, y: -30, filter: "blur(15px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-[1370px] h-[130px] relative flex items-center justify-between px-24 bg-zinc-950/90 border border-zinc-800/80 rounded-xl pointer-events-auto backdrop-blur-xl shadow-[0_35px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-between z-0">
                            <div
                                className="w-[300px] h-full opacity-25 blur-[60px] transition-all duration-1000"
                                style={{ background: `radial-gradient(circle, ${teamLeft.color || "#fff"} 0%, transparent 70%)` }}
                            />
                            <div
                                className="w-[300px] h-full opacity-25 blur-[60px] transition-all duration-1000"
                                style={{ background: `radial-gradient(circle, ${teamRight.color || "#fff"} 0%, transparent 70%)` }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4px] opacity-30 pointer-events-none z-0" />
                        <motion.div
                            className="z-10 flex items-center gap-6 w-[35%] justify-start"
                            animate={{ x: phase === "phase1" ? 275 : 0 }}
                            transition={springTransition}
                        >
                            <div className="relative group">
                                <div
                                    className="absolute inset-0 blur-md opacity-40 rounded-full transition-all duration-500"
                                    style={{ backgroundColor: teamLeft.color || "#fff" }}
                                />
                                <img
                                    src={teamLeft.logo}
                                    alt={teamLeft.name}
                                    className="relative h-18 w-18 object-contain"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-5xl font-black tracking-tight uppercase text-zinc-100 leading-none">
                                    {teamLeft.tag}
                                </span>
                                <span
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase mt-2 opacity-80"
                                    style={{ color: teamLeft.color || "#fff" }}
                                >
                                    {teamLeft.name || "BLUE SIDE"}
                                </span>
                            </div>
                        </motion.div>
                        <div className="w-[30%] h-full flex items-center justify-center z-10">
                            <AnimatePresence>
                                {phase === "phase2" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="flex flex-col items-center justify-center text-center select-none"
                                    >
                                        <span className="text-xs font-black tracking-[0.6em] text-amber-500 uppercase ml-[0.6em]">
                                            {matchInfo.matchType}
                                        </span>
                                        <span className="text-3xl font-black tracking-[0.2em] text-white mt-2.5 uppercase ml-[0.2em]">
                                            GAME {currentGame}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <motion.div
                            className="z-10 flex items-center gap-6 w-[35%] justify-end text-right"
                            animate={{ x: phase === "phase1" ? -275 : 0 }}
                            transition={springTransition}
                        >
                            <div className="flex flex-col justify-center items-end">
                                <span className="text-5xl font-black tracking-tight uppercase text-zinc-100 leading-none">
                                    {teamRight.tag}
                                </span>
                                <span
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase mt-2 opacity-80"
                                    style={{ color: teamRight.color || "#fff" }}
                                >
                                    {teamRight.name || "RED SIDE"}
                                </span>
                            </div>
                            <div className="relative group">
                                <div
                                    className="absolute inset-0 blur-md opacity-40 rounded-full transition-all duration-500"
                                    style={{ backgroundColor: teamRight.color || "#fff" }}
                                />
                                <img
                                    src={teamRight.logo}
                                    alt={teamRight.name}
                                    className="relative h-18 w-18 object-contain"
                                />
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Matchup;