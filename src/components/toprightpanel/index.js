"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

const FALLBACK_PLAYERS = {
  "T1 Faker": { name: "T1 Faker", champ: "/game/champion/Azir.png", team: "blue" },
  "Chovy": { name: "Chovy", champ: "/game/champion/Yone.png", team: "red" },
  "Gumayusi": { name: "Gumayusi", champ: "/game/champion/Varus.png", team: "blue" },
  "ShowMaker": { name: "ShowMaker", champ: "/game/champion/Syndra.png", team: "red" },
  "Keria": { name: "Keria", champ: "/game/champion/Bard.png", team: "blue" },
};

const KillFeed = ({ gameData }) => {
  const [events, setEvents] = useState([]);

  const allPlayers = useMemo(() => {
    const playersMap = {};
    if (gameData?.Order?.players || gameData?.Chaos?.players) {
      const processTeam = (players, teamColor) => {
        players?.forEach((p) => {
          let imgPath = p.championAssets?.squareImg || "";
          if (imgPath && !imgPath.startsWith("/")) imgPath = "/" + imgPath;
          playersMap[p.playerName] = { name: p.playerName, champ: imgPath, team: teamColor };
        });
      };
      processTeam(gameData.Order?.players, "blue");
      processTeam(gameData.Chaos?.players, "red");
      return playersMap;
    }
    return FALLBACK_PLAYERS;
  }, [gameData]);

  useEffect(() => {
    const playerNames = Object.keys(allPlayers);
    if (playerNames.length < 2) return;

    const createMockEvent = () => {
      const killerName = playerNames[Math.floor(Math.random() * playerNames.length)];
      const victimName = playerNames.filter(n => n !== killerName)[Math.floor(Math.random() * (playerNames.length - 1))];
      
      // Tạo danh sách hỗ trợ ngẫu nhiên (0-3 người)
      const possibleAssistants = playerNames.filter(n => n !== killerName && n !== victimName);
      const assistants = possibleAssistants
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3));

      const streaks = ["DOUBLE KILL", "TRIPLE KILL", "QUADRA KILL", "PENTA KILL"];
      
      const newEvent = {
        id: Date.now(),
        KillerName: killerName,
        VictimName: victimName,
        AssistantNames: assistants, // Thêm danh sách trợ thủ
        Streak: Math.random() > 0.8 ? streaks[Math.floor(Math.random() * streaks.length)] : null
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 4));
    };

    createMockEvent();
    const interval = setInterval(createMockEvent, 4500);
    return () => clearInterval(interval);
  }, [allPlayers]);

  return (
    <div className="fixed top-12 right-6 z-[9999] flex flex-col items-end gap-6 w-[480px] pointer-events-none font-sans">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => {
          const killer = allPlayers[event.KillerName];
          const victim = allPlayers[event.VictimName];
          if (!killer) return null;

          const isLatest = index === 0;
          const baseUrl = IMAGE_BASE_URL?.replace(/\/$/, "") || "http://localhost:58869";
          
          const teamColor = killer.team === "red" ? "#ff4655" : "#00f2ff";
          const teamGradient = killer.team === "red" 
            ? "from-red-950/60 via-zinc-950/95 to-zinc-950/95" 
            : "from-cyan-950/60 via-zinc-950/95 to-zinc-950/95";

          const getImgUrl = (p) => {
            if (p?.champ?.includes("champion/")) return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${p.champ.split('/').pop()}`;
            return `${baseUrl}/cache${p?.champ}`;
          };

          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: 50, skewX: -15, scale: 0.8 }}
              animate={{ 
                opacity: isLatest ? 1 : 0.4, 
                x: 0, 
                scale: isLatest ? 1 : 0.85,
                filter: isLatest ? "none" : "blur(0.5px) brightness(0.6)",
              }}
              exit={{ opacity: 0, scale: 0.5, x: 100 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`relative flex items-center bg-gradient-to-r ${teamGradient} border-l-[4px] py-1.5 px-4 shadow-2xl origin-right`}
              style={{ borderColor: teamColor }}
            >
              {/* STREAK BADGE */}
              {event.Streak && (
                <div 
                  className="absolute -top-4 left-0 bg-white text-black text-[9px] font-black px-2 py-0.5 skew-x-[15deg] italic border-b-2"
                  style={{ borderColor: teamColor }}
                >
                  {event.Streak}
                </div>
              )}

              {/* KILLER & ASSISTANTS */}
              <div className="flex items-center gap-3 z-10 skew-x-[15deg]">
                <div className="relative border-2 w-10 h-10 overflow-hidden shadow-lg bg-black" style={{ borderColor: teamColor }}>
                  <img src={getImgUrl(killer)} className="w-full h-full object-cover" alt="k" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[14px] font-black italic tracking-tighter text-white uppercase leading-none">
                    {killer.name}
                  </span>
                  
                  {/* Assistant Portraits - Mini Icons */}
                  {event.AssistantNames?.length > 0 && (
                    <div className="flex mt-1 -space-x-1.5">
                      {event.AssistantNames.map((name, i) => (
                        <div key={i} className="w-5 h-5 border border-white/20 overflow-hidden bg-black shadow-sm">
                          <img 
                            src={getImgUrl(allPlayers[name])} 
                            className="w-full h-full object-cover opacity-80" 
                            alt="a" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* VS ICON */}
              <div className="mx-6 z-10 skew-x-[15deg] flex flex-col items-center opacity-40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 3L3 21" stroke={teamColor} strokeWidth="4"/>
                  <path d="M3 3L21 21" stroke="white" strokeWidth="2" strokeDasharray="3 3"/>
                </svg>
              </div>

              {/* VICTIM */}
              <div className="flex items-center gap-3 z-10 skew-x-[15deg] ml-auto">
                <span className="text-[13px] font-black italic tracking-tighter text-zinc-400 uppercase text-right leading-none">
                  {victim.name}
                </span>
                <div className="relative border border-white/10 w-8 h-8 overflow-hidden bg-zinc-900 flex-shrink-0">
                  <img 
                    src={getImgUrl(victim)} 
                    className="w-full h-full object-cover grayscale brightness-[0.3]" 
                    alt="v"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-60">
                    <div className="w-full h-[1.5px] bg-red-600 rotate-45 absolute" />
                  </div>
                </div>
              </div>

              {/* GLOW SCANLINE (Latest only) */}
              {isLatest && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white animate-pulse" />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default KillFeed;