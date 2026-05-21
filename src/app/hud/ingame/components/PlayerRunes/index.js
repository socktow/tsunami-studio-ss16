"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScoreboardData } from "@/hooks/useApiTeamData";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector"; 
import { IMAGE_BASE_URL } from "@/lib/constants";

const formatUrl = (url) => {
  if (!url) return "";
  if (typeof url !== 'string') url = String(url);
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const PlayerRunes = () => {
  const { matchInfo } = useScoreboardData();
  const blueTeamMeta = useMemo(() => matchInfo?.teamsData?.[0], [matchInfo]);
  const redTeamMeta = useMemo(() => matchInfo?.teamsData?.[1], [matchInfo]);

  const blueColor = blueTeamMeta?.color || "#3b82f6";
  const redColor = redTeamMeta?.color || "#f43f5e";

  const scoreboardBottom = useScoreboardBottomSelector();
  const liveBlueTeam = useMemo(() => scoreboardBottom?.teams?.[0], [scoreboardBottom]);
  const liveRedTeam = useMemo(() => scoreboardBottom?.teams?.[1], [scoreboardBottom]);

  const parsePlayerRunes = (player) => {
    const getImgUrl = (item) => {
      if (!item) return "";
      if (typeof item === 'string' || typeof item === 'number') {
        return formatUrl(item);
      }
      const rawUrl = item.iconPath || item.iconUrl || item.icon || item.img || item.url || item.image || "";
      return formatUrl(rawUrl);
    };

    let rawPerks = [];
    if (Array.isArray(player?.perks)) {
      rawPerks = player.perks;
    } else if (player?.perks?.perkIds) {
      rawPerks = player?.perks?.perkIds;
    } else if (player?.perks) {
      rawPerks = Object.values(player.perks);
    }

    const perkUrls = rawPerks.map(getImgUrl);

    return {
      name: player?.name || "",
      champion: formatUrl(player?.splash || player?.champion || ""),
      primaryRune: perkUrls[0] || "",
      primaryBranch: perkUrls.slice(1, 4).filter(Boolean),
      secondaryBranch: perkUrls.slice(4, 6).filter(Boolean),
      statsShards: perkUrls.slice(6, 9).filter(Boolean),
    };
  };

  const bluePlayersData = useMemo(() => {
    return Array(5).fill(null).map((_, idx) => parsePlayerRunes(liveBlueTeam?.players?.[idx]));
  }, [liveBlueTeam]);

  const redPlayersData = useMemo(() => {
    return Array(5).fill(null).map((_, idx) => parsePlayerRunes(liveRedTeam?.players?.[idx]));
  }, [liveRedTeam]);

  // Animations
  const panelVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      style={{ width: '1360px', height: '280px', originY: 1 }} 
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-[280px] bg-[#020204]/95 border-t border-white/10 flex flex-col justify-between pointer-events-auto select-none shadow-[0_-40px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl"
    >
      {/* ĐƯỜNG CHỈ LED */}
      <div className="absolute top-0 left-0 w-full h-[2px] flex z-40">
        <div className="flex-1 transition-colors duration-500 shadow-[0_0_10px_currentcolor]" style={{ backgroundColor: blueColor }} />
        <div className="w-40 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="flex-1 transition-colors duration-500 shadow-[0_0_10px_currentcolor]" style={{ backgroundColor: redColor }} />
      </div>

      {/* GIẢI ĐẤU HEADER HUB */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
        <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/10 px-8 py-1.5 rounded-full shadow-2xl">
          <span className="text-[10px] text-amber-400 font-bold tracking-[0.4em] font-sans uppercase drop-shadow-md">
            {matchInfo?.tournamentName || "LCP 2026"}
          </span>
        </div>
      </div>

      {/* CONTAINER CHÍNH */}
      <div className="w-full flex-1 flex items-stretch justify-between px-6 pt-6 pb-3">
        
        {/* ================= BLUE SIDE ================= */}
        <motion.div variants={containerVariants} className="flex gap-3 w-[620px]">
          {bluePlayersData.map((player, idx) => (
            <motion.div
              key={`b-card-${idx}`}
              variants={cardVariants}
              className="flex-1 rounded-xl relative overflow-hidden flex flex-col justify-between pb-2 shadow-xl ring-1 ring-white/5"
            >
              {/* Ảnh nền tướng - ĐÃ ĐIỀU CHỈNH BG-TOP LÊN CAO ĐỂ HIỂN THỊ KHUÔN MẶT RÕ HƠN */}
              <div className="absolute top-[-15%] inset-0 z-0">
                {player.champion && (
                  <div 
                    className="w-full h-full bg-cover filter saturate-125 brightness-[0.85] transition-transform duration-700 hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${player.champion})`,
                      backgroundPosition: 'center -12%' // Đẩy khuôn mặt lên cao hơn 12% so với đỉnh container
                    }}
                  />
                )}
                {/* Lớp mờ màu team siêu nhẹ */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundColor: blueColor }} />
                {/* Gradient dưới lên để làm nổi chữ */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/60 to-transparent" />
              </div>

              {/* Ngọc Tái Tổ Hợp Box - DẠNG KÍNH MỜ (GLASSMORPHISM) */}
              <div className="z-10 mx-2 mt-auto bg-black/30 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative">
                
                {/* Highlight line top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] opacity-50" style={{ backgroundImage: `linear-gradient(to right, transparent, ${blueColor}, transparent)` }} />

                {/* TẦNG 1: Ngọc Siêu Cấp */}
                <div 
                  className="w-11 h-11 rounded-full bg-black/50 border flex items-center justify-center p-1 relative shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-1"
                  style={{ borderColor: `${blueColor}60` }}
                >
                  {player.primaryRune && (
                    <div className="w-full h-full bg-contain bg-center bg-no-repeat filter brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                  )}
                </div>

                {/* TẦNG 2: Nhánh Chính */}
                <div className="flex justify-center items-center gap-1.5 w-full">
                  {player.primaryBranch.map((url, i) => (
                    <div key={`b-p-branch-${i}`} className="w-4 h-4 bg-contain bg-center bg-no-repeat filter brightness-125 contrast-115 drop-shadow-md" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* Đường chia cắt mảnh */}
                <div className="w-3/4 h-[1px] bg-white/10 my-0.5 rounded-full" />

                {/* TẦNG 3: Nhánh Phụ */}
                <div className="flex justify-center items-center gap-2 w-full">
                  {player.secondaryBranch.map((url, i) => (
                    <div key={`b-s-branch-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat filter brightness-115 opacity-100 drop-shadow-sm" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 4: Mảnh Chỉ Số */}
                <div className="flex justify-center items-center gap-1 w-full pt-0.5">
                  {player.statsShards.map((url, i) => (
                    <div key={`b-stats-${i}`} className="w-3 h-3 bg-contain bg-center bg-no-repeat filter saturate-100 brightness-125 opacity-90" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ================= PHẦN VS TRUNG TÂM ================= */}
        <div className="w-12 flex flex-col items-center justify-center relative z-20">
          <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent relative" />
          <div className="absolute z-20 w-8 h-8 rounded-full bg-[#050508] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <span className="font-sans font-black text-[11px] bg-gradient-to-br from-amber-300 to-orange-600 bg-clip-text text-transparent tracking-tighter">
              VS
            </span>
          </div>
          <div className="absolute w-12 h-12 rounded-full bg-amber-500/5 blur-xl z-10" />
        </div>

        {/* ================= RED SIDE ================= */}
        <motion.div variants={containerVariants} className="flex gap-3 w-[620px] flex-row-reverse">
          {[...redPlayersData].reverse().map((player, idx) => (
            <motion.div
              key={`r-card-${idx}`}
              variants={cardVariants}
              className="flex-1 rounded-xl relative overflow-hidden flex flex-col justify-between pb-2 shadow-xl ring-1 ring-white/5"
            >
              {/* Ảnh nền tướng - ĐÃ ĐIỀU CHỈNH BG-TOP LÊN CAO ĐỂ HIỂN THỊ KHUÔN MẶT RÕ HƠN */}
              <div className="absolute top-[-15%] inset-0 z-0">
                {player.champion && (
                  <div 
                    className="w-full h-full bg-cover filter saturate-125 brightness-[0.85] transition-transform duration-700 hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${player.champion})`,
                      backgroundPosition: 'center -12%' // Đẩy khuôn mặt lên cao hơn 12% so với đỉnh container
                    }}
                  />
                )}
                {/* Lớp mờ màu team siêu nhẹ */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundColor: redColor }} />
                {/* Gradient dưới lên để làm nổi chữ */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/60 to-transparent" />
              </div>

              {/* Ngọc Tái Tổ Hợp Box - DẠNG KÍNH MỜ (GLASSMORPHISM) */}
              <div className="z-10 mx-2 mt-auto bg-black/30 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative">
                
                {/* Highlight line top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] opacity-50" style={{ backgroundImage: `linear-gradient(to left, transparent, ${redColor}, transparent)` }} />

                {/* TẦNG 1: Ngọc Siêu Cấp */}
                <div 
                  className="w-11 h-11 rounded-full bg-black/50 border flex items-center justify-center p-1 relative shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-1"
                  style={{ borderColor: `${redColor}60` }}
                >
                  {player.primaryRune && (
                    <div className="w-full h-full bg-contain bg-center bg-no-repeat filter brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                  )}
                </div>

                {/* TẦNG 2: Nhánh Chính */}
                <div className="flex justify-center items-center gap-1.5 w-full flex-row-reverse">
                  {player.primaryBranch.map((url, i) => (
                    <div key={`r-p-branch-${i}`} className="w-4 h-4 bg-contain bg-center bg-no-repeat filter brightness-125 contrast-115 drop-shadow-md" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* Đường chia cắt mảnh */}
                <div className="w-3/4 h-[1px] bg-white/10 my-0.5 rounded-full" />

                {/* TẦNG 3: Nhánh Phụ */}
                <div className="flex justify-center items-center gap-2 w-full flex-row-reverse">
                  {player.secondaryBranch.map((url, i) => (
                    <div key={`r-s-branch-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat filter brightness-115 opacity-100 drop-shadow-sm" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* TẦNG 4: Mảnh Chỉ Số */}
                <div className="flex justify-center items-center gap-1 w-full pt-0.5 flex-row-reverse">
                  {player.statsShards.map((url, i) => (
                    <div key={`r-stats-${i}`} className="w-3 h-3 bg-contain bg-center bg-no-repeat filter saturate-100 brightness-125 opacity-90" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* FOOTER BAR */}
      <div className="w-full h-7 bg-[#020204] border-t border-white/5 px-8 flex justify-between items-center text-[10px] font-mono tracking-widest z-10">
        {/* Blue Team Info */}
        <div className="flex items-center gap-3">
          <span style={{ color: blueColor }} className="font-black text-xs drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
            {blueTeamMeta?.tag || liveBlueTeam?.tag || "BLUE"}
          </span>
          <span className="text-white/80 font-bold tracking-normal uppercase">
            {blueTeamMeta?.name || liveBlueTeam?.name || "BLUE TEAM"}
          </span>
        </div>
        
        {/* Red Team Info */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <span style={{ color: redColor }} className="font-black text-xs drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
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