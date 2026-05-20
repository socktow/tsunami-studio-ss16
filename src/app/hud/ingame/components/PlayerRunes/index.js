"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScoreboardData } from "@/hooks/useApiTeamData";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector"; 
import { IMAGE_BASE_URL } from "@/lib/constants";

// Hàm helper chuyển đổi path tương đối thành URL tuyệt đối chuẩn chỉnh
const formatUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const PlayerRunes = () => {
  // 1. Lấy dữ liệu trận đấu tổng quan từ API (Database)
  const { matchInfo } = useScoreboardData();
  const blueTeamMeta = useMemo(() => matchInfo?.teamsData?.[0], [matchInfo]);
  const redTeamMeta = useMemo(() => matchInfo?.teamsData?.[1], [matchInfo]);

  const blueColor = blueTeamMeta?.color || "#3b82f6";
  const redColor = redTeamMeta?.color || "#f43f5e";

  // 2. Lấy dữ liệu trực tiếp (Live Data) thời gian thực từ Game Client
  const scoreboardBottom = useScoreboardBottomSelector();
  const liveBlueTeam = useMemo(() => scoreboardBottom?.teams?.[0], [scoreboardBottom]);
  const liveRedTeam = useMemo(() => scoreboardBottom?.teams?.[1], [scoreboardBottom]);

  // Hàm bóc tách ngọc tái tổ hợp và ảnh nền tướng
  const parsePlayerRunes = (player) => {
    const getImgUrl = (item) => {
      if (!item) return "";
      const rawUrl = typeof item === 'string' ? item : (item.iconUrl || item.img || item.url || "");
      return formatUrl(rawUrl);
    };

    const rawPerks = player?.perks || [];
    const perkUrls = rawPerks.map(getImgUrl).filter((url) => url !== "");

    return {
      name: player?.name || "PLAYER",
      champion: formatUrl(player?.splash || player?.champion || ""),
      primaryRune: perkUrls[0] || "",
      primaryBranch: perkUrls.slice(1, 4),
      secondaryBranch: perkUrls.slice(4, 6),
      statsShards: perkUrls.slice(6, 9),
    };
  };

  // Build danh sách 5 người chơi
  const bluePlayersData = useMemo(() => {
    return Array(5).fill(null).map((_, idx) => parsePlayerRunes(liveBlueTeam?.players?.[idx]));
  }, [liveBlueTeam]);

  const redPlayersData = useMemo(() => {
    return Array(5).fill(null).map((_, idx) => parsePlayerRunes(liveRedTeam?.players?.[idx]));
  }, [liveRedTeam]);

  // Framer Motion Animations
  const panelVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      style={{ width: '1360px', height: '280px', originY: 1 }} 
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-[280px] bg-[#020204]/98 border-t border-white/10 flex flex-col justify-between pointer-events-auto select-none shadow-[0_-40px_80px_rgba(0,0,0,0.98)]"
    >
      {/* ĐƯỜNG CHỈ LED PHÁT SÁNG THEO MÀU TEAM */}
      <div className="absolute top-0 left-0 w-full h-[2px] flex">
        <div className="flex-1 transition-colors duration-500" style={{ backgroundColor: blueColor }} />
        <div className="w-40 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-40" />
        <div className="flex-1 transition-colors duration-500" style={{ backgroundColor: redColor }} />
      </div>

      {/* GIẢI ĐẤU HEADER HUB */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
        <div className="bg-[#0b0c10] border border-white/10 px-6 py-1 rounded-full shadow-2xl">
          <span className="text-[10px] text-amber-400 font-bold tracking-[0.4em] font-sans uppercase">
            {matchInfo?.tournamentName || "LCP 2026"}
          </span>
        </div>
      </div>

      {/* CONTAINER CHÍNH */}
      <div className="w-full flex-1 flex items-stretch justify-between px-6 pt-5 pb-3">
        
        {/* ================= BLUE SIDE ================= */}
        <motion.div variants={containerVariants} className="flex gap-2.5 w-[620px]">
          {bluePlayersData.map((player, idx) => (
            <motion.div
              key={`b-card-${idx}`}
              variants={cardVariants}
              className="flex-1 border border-white/5 rounded-md relative overflow-hidden flex flex-col justify-end p-2 shadow-lg"
              style={{ background: `linear-gradient(to bottom, ${blueColor}25 0%, #06080d 55%, #030406 100%)` }}
            >
              {/* Ảnh nền tướng */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {player.champion && (
                  <div 
                    className="w-full h-[58%] bg-cover bg-center filter saturate-100 brightness-[70%]"
                    style={{ 
                      backgroundImage: `url(${player.champion})`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-transparent" />
              </div>

              {/* Ngọc Tái Tổ Hợp Box */}
              <div className="z-10 w-full bg-[#04060a]/90 border border-white/5 p-1.5 rounded flex flex-col items-center gap-2 backdrop-blur-md shadow-md">
                
                {/* TẦNG 1: Ngọc Siêu Cấp */}
                <div 
                  className="w-10 h-10 rounded-full bg-black/60 border flex items-center justify-center p-1 relative shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                  style={{ borderColor: `${blueColor}70` }}
                >
                  {player.primaryRune && (
                    <div className="w-full h-full bg-contain bg-center bg-no-repeat filter brightness-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                  )}
                </div>

                {/* TẦNG 2: Nhánh Chính */}
                <div className="flex justify-center items-center gap-1.5 w-full border-t border-white/5 pt-1.5">
                  {player.primaryBranch.map((url, i) => (
                    <div key={`b-p-branch-${i}`} className="w-4 h-4 bg-contain bg-center bg-no-repeat filter brightness-125 contrast-115" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 3: Nhánh Phụ */}
                <div className="flex justify-center items-center gap-2 w-full">
                  {player.secondaryBranch.map((url, i) => (
                    <div key={`b-s-branch-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat filter brightness-115 opacity-100" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 4: Mảnh Chỉ Số */}
                <div className="flex justify-center items-center gap-1 w-full border-t border-white/5 pt-1.5">
                  {player.statsShards.map((url, i) => (
                    <div key={`b-stats-${i}`} className="w-3 h-3 bg-contain bg-center bg-no-repeat filter saturate-100 brightness-125 opacity-95" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ================= PHẦN VS TRUNG TÂM ================= */}
        <div className="w-12 flex flex-col items-center justify-center relative">
          <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent relative" />
          <div className="absolute z-20 w-8 h-8 rounded-full bg-[#07080c] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <span className="font-sans font-black text-[11px] bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tighter">
              VS
            </span>
          </div>
          <div className="absolute w-6 h-6 rounded-full bg-amber-500/10 blur-sm z-10" />
        </div>

        {/* ================= RED SIDE ================= */}
        <motion.div variants={containerVariants} className="flex gap-2.5 w-[620px] flex-row-reverse">
          {[...redPlayersData].reverse().map((player, idx) => (
            <motion.div
              key={`r-card-${idx}`}
              variants={cardVariants}
              className="flex-1 border border-white/5 rounded-md relative overflow-hidden flex flex-col justify-end p-2 shadow-lg"
              style={{ background: `linear-gradient(to bottom, ${redColor}25 0%, #0d0608 55%, #060304 100%)` }}
            >
              {/* Ảnh nền tướng */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {player.champion && (
                  <div 
                    className="w-full h-[58%] bg-cover bg-center filter saturate-100 brightness-[70%]"
                    style={{ 
                      backgroundImage: `url(${player.champion})`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 85%)'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0608] via-transparent to-transparent" />
              </div>

              {/* Ngọc Tái Tổ Hợp Box */}
              <div className="z-10 w-full bg-[#0a0406]/90 border border-white/5 p-1.5 rounded flex flex-col items-center gap-2 backdrop-blur-md shadow-md">
                
                {/* TẦNG 1: Ngọc Siêu Cấp */}
                <div 
                  className="w-10 h-10 rounded-full bg-black/60 border flex items-center justify-center p-1 relative shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                  style={{ borderColor: `${redColor}70` }}
                >
                  {player.primaryRune && (
                    <div className="w-full h-full bg-contain bg-center bg-no-repeat filter brightness-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                  )}
                </div>

                {/* TẦNG 2: Nhánh Chính */}
                <div className="flex justify-center items-center gap-1.5 w-full border-t border-white/5 pt-1.5 flex-row-reverse">
                  {player.primaryBranch.map((url, i) => (
                    <div key={`r-p-branch-${i}`} className="w-4 h-4 bg-contain bg-center bg-no-repeat filter brightness-125 contrast-115" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 3: Nhánh Phụ */}
                <div className="flex justify-center items-center gap-2 w-full flex-row-reverse">
                  {player.secondaryBranch.map((url, i) => (
                    <div key={`r-s-branch-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat filter brightness-115 opacity-100" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 4: Mảnh Chỉ Số */}
                <div className="flex justify-center items-center gap-1 w-full border-t border-white/5 pt-1.5 flex-row-reverse">
                  {player.statsShards.map((url, i) => (
                    <div key={`r-stats-${i}`} className="w-3 h-3 bg-contain bg-center bg-no-repeat filter saturate-100 brightness-125 opacity-95" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* FOOTER BAR: HIỂN THỊ TAG & TÊN ĐẦY ĐỦ CỦA TEAM TỪ DATABASE */}
      <div className="w-full h-7 bg-[#050508] border-t border-white/5 px-8 flex justify-between items-center text-[10px] font-mono tracking-widest">
        {/* Blue Team Info */}
        <div className="flex items-center gap-3">
          <span style={{ color: blueColor }} className="font-black text-xs drop-shadow-[0_0_8px_rgba(232,226,38,0.4)]">
            {blueTeamMeta?.tag || liveBlueTeam?.tag || "BLUE"}
          </span>
          <span className="text-white/80 font-bold tracking-normal uppercase">
            {blueTeamMeta?.name || liveBlueTeam?.name || "BLUE TEAM"}
          </span>
        </div>
        
        {/* Red Team Info */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <span style={{ color: redColor }} className="font-black text-xs drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]">
            {redTeamMeta?.tag || liveRedTeam?.tag || "RED"}
          </span>
          <span className="text-white/80 font-bold tracking-normal uppercase">
            {redTeamMeta?.name || liveRedTeam?.name || "RED TEAM"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerRunes;