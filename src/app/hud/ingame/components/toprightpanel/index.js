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
      
      // Logic mới cho Assistants:
      // 1. Random số lượng người hỗ trợ từ 0 đến 4
      // 2. Nếu random ra 0 thì là Solo Kill
      const numAssistants = Math.floor(Math.random() * 5); // 0, 1, 2, 3, 4
      
      const assistants = playerNames
        .filter(n => n !== killerName && n !== victimName)
        .sort(() => 0.5 - Math.random())
        .slice(0, numAssistants);
      
      const newEvent = {
        id: Date.now(),
        KillerName: killerName,
        VictimName: victimName,
        AssistantNames: assistants,
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 5));
    };

    createMockEvent();
    const interval = setInterval(createMockEvent, 4500);
    return () => clearInterval(interval);
  }, [allPlayers]);

  const getImgUrl = (p) => {
    if (!p) return "";
    if (p.champ?.includes("champion/")) return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${p.champ.split('/').pop()}`;
    const baseUrl = IMAGE_BASE_URL?.replace(/\/$/, "") || "http://localhost:58869";
    return `${baseUrl}/cache${p.champ}`;
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-2 w-[320px] pointer-events-none font-sans">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => {
          const killer = allPlayers[event.KillerName];
          const victim = allPlayers[event.VictimName];
          if (!killer || !victim) return null;

          const teamColor = killer.team === "red" ? "#ff4655" : "#00f2ff";

          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: index === 0 ? 1 : 0.4, x: 0, scale: index === 0 ? 1 : 0.85 }}
              exit={{ opacity: 0, scale: 0.8, x: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex items-center bg-[#0a0c10]/90 backdrop-blur-md border border-white/5 py-1.5 px-3 shadow-2xl overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: teamColor }} />

              {/* Killer */}
              <div className="flex items-center gap-2">
                <div className="size-7 overflow-hidden bg-zinc-900 border border-white/10">
                  <img src={getImgUrl(killer)} className="w-full h-full object-cover" alt="k" />
                </div>
                <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate max-w-[70px]">
                  {killer.name}
                </span>
              </div>

              {/* Assists */}
              {event.AssistantNames?.length > 0 && (
                <div className="flex -space-x-1.5 mx-2">
                  {event.AssistantNames.map((name, i) => (
                    <div key={i} className="size-5 rounded-full border border-zinc-900 overflow-hidden opacity-80">
                      <img src={getImgUrl(allPlayers[name])} className="w-full h-full object-cover" alt="a" />
                    </div>
                  ))}
                </div>
              )}

              {/* Victim */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight truncate max-w-[70px]">
                  {victim.name}
                </span>
                <div className="size-7 overflow-hidden bg-zinc-900 border border-white/10 grayscale opacity-70">
                  <img src={getImgUrl(victim)} className="w-full h-full object-cover" alt="v" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default KillFeed;