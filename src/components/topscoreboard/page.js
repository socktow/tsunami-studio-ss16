"use client";
import React from "react";
import { useLeagueData } from "@/app/overlay/layout";
import { motion, AnimatePresence } from "framer-motion";

export default function TopScoreboard() {
  const { gameData } = useLeagueData();
  const scoreboard = gameData?.scoreboard;

  if (!scoreboard || !scoreboard.teams || scoreboard.teams.length < 2) return null;

  const blueTeam = scoreboard.teams[0];
  const redTeam = scoreboard.teams[1];
  const gameTime = gameData.gameTime || scoreboard.gameTime || 0;
  const bestOf = scoreboard.bestOf || 3;

  const teamAWin = blueTeam?.seriesScore?.wins || 0;
  const teamBWin = redTeam?.seriesScore?.wins || 0;

  const formatGold = (gold) => (!gold ? "0.0k" : (gold / 1000).toFixed(1) + "k");
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getDragonIcon = (type) => {
    const icons = {
      air: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_clouddrake.png",
      earth: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_mountaindrake.png",
      fire: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_infernaldrake.png",
      water: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_oceandrake.png",
      hextech: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_hextechdrake.png",
      chemtech: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_chemtechdrake.png",
      elder: "https://raw.communitydragon.org/latest/game/assets/ux/scoreboard/_elderdrake.png"
    };
    return icons[type?.toLowerCase()] || "";
  };

  const goldIcon = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/icon_gold.png";
  const towerIcon = "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower.png";
  const grubsicon = "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png";
  const blueplates = "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower_blue_bounty.png";
  const redpplates = "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower_red_bounty.png";

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-0 left-0 w-full flex flex-col items-center pointer-events-none mt-1 font-sans select-none origin-top"
      >
        <div className="flex flex-col items-center drop-shadow-2xl overflow-visible">
          
          {/* UPPER PART: MAIN SCOREBOARD */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center bg-black/70 text-white h-13 relative overflow-hidden rounded-t-lg px-2 z-10 border-b border-white/5"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[2px_0_10px_#3b82f6]" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 shadow-[-2px_0_10px_#ef4444]" />

            {/* BLUE SIDE */}
            <div className="flex items-center px-2 gap-4">
              <div className="flex flex-col gap-1 w-3">
                {[...Array(bestOf === 5 ? 3 : 2)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-full rounded-sm ${i < teamAWin ? "bg-white shadow-[0_0_5px_#ffffff]" : "bg-zinc-800"}`} />
                ))}
              </div>
              <div className="w-14 h-14 p-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1280px-T1_esports_logo.svg.png" className="w-full h-full object-contain" alt="blue-logo" />
              </div>
              <div className="w-16 text-center">
                <span className="text-xl font-black uppercase tracking-tighter text-white">T1</span>
              </div>
              <div className="flex items-center gap-4 pr-2">
                <div className="flex items-center gap-1.5">
                  <img src={goldIcon} className="w-5 h-5" alt="gold" />
                  <span className="text-base font-bold text-white tabular-nums w-10">{formatGold(blueTeam.gold)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src={towerIcon} className="w-5 h-5 opacity-80" alt="tower" />
                  <span className="text-base font-bold text-white tabular-nums">{blueTeam.towers}</span>
                </div>
              </div>
            </div>

            {/* CENTER: KILLS */}
            <div className="flex items-center justify-center px-8 h-full gap-4 border-x border-white/5 shadow-inner relative overflow-visible">
              <span className="text-3xl font-black tabular-nums w-12 text-right text-white leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {blueTeam.kills}
              </span>

              <div className="relative flex items-center justify-center h-full px-2">
                <motion.img
                  animate={{ 
                    filter: ["brightness(1) contrast(1)", "brightness(1.5) contrast(1.2)", "brightness(1) contrast(1)"],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  src="https://roadtovcs.vnggames.com/api/images/team_2_logo_1744360408217/png"
                  className="relative z-10 w-12 h-12 object-contain invert grayscale"
                  alt="vcs-logo"
                />
                <motion.div 
                   animate={{ opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-white/20 blur-xl rounded-full"
                />
              </div>

              <span className="text-3xl font-black tabular-nums w-12 text-left text-white leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {redTeam.kills}
              </span>
            </div>

            {/* RED SIDE */}
            <div className="flex items-center px-2 gap-4 flex-row-reverse">
              <div className="flex flex-col gap-1 w-3">
                {[...Array(bestOf === 5 ? 3 : 2)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-full rounded-sm ${i < teamBWin ? "bg-white shadow-[0_0_5px_#ffffff]" : "bg-zinc-800"}`} />
                ))}
              </div>
              <div className="w-14 h-14 p-2">
                <img src="https://upload.wikimedia.org/wikipedia/vi/6/66/Bilibili_Gaming_logo_%282021%29.png" className="w-full h-full object-contain" alt="red-logo" />
              </div>
              <div className="w-16 text-center">
                <span className="text-xl font-black uppercase tracking-tighter text-white">BLG</span>
              </div>
              <div className="flex items-center gap-4 pl-2 flex-row-reverse">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <img src={goldIcon} className="w-5 h-5" alt="gold" />
                  <span className="text-base font-bold text-white tabular-nums w-10 text-right">{formatGold(redTeam.gold)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <img src={towerIcon} className="w-5 h-5 opacity-80" alt="tower" />
                  <span className="text-base font-bold text-white tabular-nums">{redTeam.towers}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LOWER PART: SUB-SCOREBOARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            className="relative w-full h-8 flex items-center rounded-b-lg border-t border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-950/90 to-transparent backdrop-blur-sm" />
            
            <div className="relative z-20 flex w-full h-full items-center">
              {/* Rồng bên trái */}
              <div className="flex-[1.2] flex items-center justify-start pl-10 gap-2.5 overflow-visible">
                {blueTeam.dragons?.map((drag, i) => (
                  <motion.img
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    key={i}
                    src={getDragonIcon(drag)}
                    className="w-7 h-7 object-contain drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] brightness-125"
                    alt="dragon"
                  />
                ))}
              </div>

              {/* Blue Stats */}
              <div className="flex-1 flex items-center justify-end gap-5">
                <div className="flex items-center gap-1.5">
                  <img src={blueplates} className="w-4 h-4" alt="p" />
                  <span className="text-sm font-black text-white tabular-nums">{blueTeam.towerPlates}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src={grubsicon} className="w-4 h-4" alt="g" />
                  <span className="text-sm font-black text-white tabular-nums">{blueTeam.grubs}</span>
                </div>
              </div>

              {/* Game Time */}
              <div className="w-28 flex items-center justify-center">
                <div className="px-3 py-0.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
                  <span className="text-base font-bold font-mono tracking-widest text-white">
                    {formatTime(gameTime)}
                  </span>
                </div>
              </div>

              {/* Red Stats */}
              <div className="flex-1 flex items-center justify-start gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white tabular-nums">{redTeam.grubs}</span>
                  <img src={grubsicon} className="w-4 h-4" alt="g" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white tabular-nums">{redTeam.towerPlates}</span>
                  <img src={redpplates} className="w-4 h-4" alt="p" />
                </div>
              </div>

              {/* Rồng bên phải */}
              <div className="flex-[1.2] flex items-center justify-end pr-10 gap-2.5 overflow-visible">
                {redTeam.dragons?.map((drag, i) => (
                  <motion.img
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    key={i}
                    src={getDragonIcon(drag)}
                    className="w-7 h-7 object-contain drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] brightness-125"
                    alt="dragon"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}