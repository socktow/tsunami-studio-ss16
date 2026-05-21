"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSkinSpotlight } from "@/hooks/useSkinSpotlight";
import { useScoreboardData } from "@/hooks/useApiTeamData";

const EsportsCard = ({ player, side, currentIndex }) => {
  if (!player) return null;

  const finalUrl = player.loadingImgUrl;
  const isLeft = side === "left";

  // --- LOGIC TỰ ĐỘNG TÁCH SKIN & ĐA SẮC (CHROMA) ---
  let skinTitle = player.skinName || "";
  let chromaTitle = "";
  if (skinTitle.includes(" (") && skinTitle.endsWith(")")) {
    const parts = skinTitle.split(" (");
    skinTitle = parts[0];
    chromaTitle = "(" + parts[1];
  }

  return (
    <motion.div
      key={`${player.nickname}-${currentIndex}`}
      initial={{
        x: isLeft ? -600 : 600,
        opacity: 0,
        skewX: isLeft ? -4 : 4,
        scale: 0.95,
      }}
      animate={{
        x: 0,
        opacity: 1,
        skewX: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: "blur(15px) brightness(1.4)",
        x: isLeft ? -400 : 400,
        transition: { duration: 0.7, ease: "easeInOut" },
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 15,
      }}
      className={`fixed top-[45%] -translate-y-1/2 ${
        isLeft ? "left-20" : "right-20"
      } z-10`}
    >
      {/* HIỆU ỨNG ĐÈN LED NEON NỀN TỰ ĐỘNG THEO MÀU ĐỘI */}
      <div 
        className="absolute inset-0 -z-10 blur-[60px] opacity-25 transition-all duration-500"
        style={{ backgroundColor: player.teamColor }}
      />

      <div className="flex flex-col gap-5">
        {/* KHUNG THẺ ẢNH ĐỐI XỨNG GƯƠNG */}
        <div 
          className={`relative w-[300px] h-[520px] p-[2px] transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ${
            isLeft ? "rounded-bl-3xl rounded-tr-3xl" : "rounded-br-3xl rounded-tl-3xl"
          }`}
          style={{ 
            background: `linear-gradient(${isLeft ? "135deg" : "225deg"}, ${player.teamColor} 0%, #111424 50%, #020617 100%)`,
            boxShadow: `0 0 35px ${player.teamColor}20`
          }}
        >
          <div className={`relative w-full h-full bg-[#040712] overflow-hidden ${
            isLeft ? "rounded-bl-[22px] rounded-tr-[22px]" : "rounded-br-[22px] rounded-tl-[22px]"
          }`}>
            
            {/* Ảnh nền trang phục lớn */}
            <motion.img
              initial={{ scale: 1.25, x: isLeft ? -12 : 12 }}
              animate={{ scale: 1.1, x: 0 }}
              transition={{ duration: 6, ease: "easeOut" }}
              src={finalUrl}
              alt={player.nickname}
              onError={(e) => {
                if (player.championName) {
                  const cleanChamp = player.championName.replace(/[\s'.]/g, "");
                  e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${cleanChamp}_0.jpg`;
                }
              }}
              className="w-full h-full object-cover object-top"
            />

            {/* Mặt nạ bóng tối */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#02040a] via-[#02040a]/90 to-transparent z-10" />

            {/* LOGO IN CHÌM ĐỐI XỨNG HAI BÊN ĐÁY THẺ */}
            {player.teamLogo && (
              <img 
                src={player.teamLogo} 
                alt="team-watermark" 
                className={`absolute -bottom-6 w-44 h-44 object-contain opacity-15 pointer-events-none z-10 select-none grayscale invert ${
                  isLeft ? "-right-6" : "-left-6"
                }`}
              />
            )}

            {/* KHỐI THÔNG TIN ĐỐI XỨNG HOÀN HẢO */}
            <div className={`absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end h-full pointer-events-none ${
              isLeft ? "items-start text-left" : "items-end text-right"
            }`}>
              
              {/* BRANDING ĐỘI TUYỂN (Đảo vị trí text/badge dựa theo bên trái/phải) */}
              <motion.div 
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center gap-2 mb-1.5 ${!isLeft && "flex-row-reverse"}`}
              >
                {player.teamLogo && (
                  <img src={player.teamLogo} alt={player.teamTag} className="w-5 h-5 object-contain" />
                )}
                <span 
                  className="text-[11px] font-black tracking-widest uppercase"
                  style={{ color: player.teamColor }}
                >
                  {player.teamName}
                </span>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                  {player.role}
                </span>
              </motion.div>

              {/* NICKNAME TUYỂN THỦ (Đã giảm size xuống text-2xl tinh tế) */}
              <div className="overflow-hidden w-full">
                <motion.h3 
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                  className="text-2xl font-black text-white uppercase tracking-wide font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                >
                  {player.nickname}
                </motion.h3>
              </div>

              {/* THANH LINE CÔNG NGHỆ KHỚP THEO HƯỚNG TEXT */}
              <div className="w-full flex mt-2 mb-2.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="h-[3px] rounded-full"
                  style={{ 
                    backgroundColor: player.teamColor,
                    marginLeft: isLeft ? "0" : "auto",
                    marginRight: isLeft ? "auto" : "0"
                  }}
                />
              </div>
              
              {/* TÊN TRANG PHỤC CHÍNH */}
              <div className="overflow-hidden w-full">
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                  className="text-[14px] font-bold text-slate-200 tracking-wide line-clamp-1 leading-tight drop-shadow"
                >
                  {skinTitle}
                </motion.p>
              </div>

              {/* DÒNG ĐA SẮC (CHROMA) ĐỐI XỨNG CỰC ĐẸP */}
              {chromaTitle && (
                <div className="overflow-hidden w-full mt-1">
                  <motion.p 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.4, ease: "easeOut" }}
                    className={`text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5 ${
                      !isLeft && "justify-end"
                    }`}
                  >
                    {isLeft ? (
                      <><span className="text-amber-400/90 font-medium normal-case">{chromaTitle}</span></>
                    ) : (
                      <><span className="text-amber-400/90 font-medium normal-case">{chromaTitle}</span></>
                    )}
                  </motion.p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SkinShowPanel = () => {
  const { allPlayers, isReady: isSpotlightReady } = useSkinSpotlight();
  const { matchInfo } = useScoreboardData(); // Chỉ cần lột data giải đấu gốc trực tiếp từ đây

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCards, setShowCards] = useState(true);

  // --- LOGIC TRỘN DATA SỬA ĐỔI: ĐỌC THEO VỊ TRÍ ROLE CỦA SPOTLIGHT KHỚP THẲNG VÀO API VÌ ĐÃ CÙNG THỨ TỰ ---
  const mergedPlayers = useMemo(() => {
    if (!allPlayers.length) return [];

    // Khai báo mảng vị trí cố định từ client (0 -> 4 ứng với TOP -> SUP)
    const standardRoles = ["TOP", "JUNGLE", "MID", "ADC", "SUP"];

    return allPlayers.map((spotlightPlayer, index) => {
      const side = index < 5 ? "BLUE" : "RED";
      const teamIndex = side === "BLUE" ? 0 : 1;
      
      // Xác định tuyển thủ đang ở vị trí role nào dựa vào vị trí index (0 đến 4)
      const currentRole = standardRoles[index % 5];
      const teamApiInfo = matchInfo?.teamsData?.[teamIndex];

      // Tìm trực tiếp object player trong API của Đội tương ứng dựa theo đúng Role!
      const realEsportsPlayer = teamApiInfo?.players?.find(
        (p) => p.role?.toUpperCase() === currentRole
      );

      return {
        ...spotlightPlayer,
        // Thay thế hoàn toàn tên custom phòng máy thành tên Tuyển thủ chuyên nghiệp (Levi, Kiaya, Faker,...)
        nickname: realEsportsPlayer?.nickname || spotlightPlayer.riotIdGameName,
        role: currentRole,
        side: side,
        teamName: teamApiInfo?.name || (side === "BLUE" ? "BLUE TEAM" : "RED TEAM"),
        teamTag: teamApiInfo?.tag || (side === "BLUE" ? "BLU" : "RED"),
        teamColor: teamApiInfo?.color || (side === "BLUE" ? "#3b82f6" : "#ef4444"),
        teamLogo: teamApiInfo?.logo || null
      };
    });
  }, [allPlayers, matchInfo]);

  useEffect(() => {
    let hideTimer;

    if (isSpotlightReady && mergedPlayers.length && showCards) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= 4) {
            clearInterval(timer);
            hideTimer = setTimeout(() => {
              setShowCards(false);
            }, 4000);
            return prev;
          }
          return prev + 1;
        });
      }, 7000);

      return () => {
        clearInterval(timer);
        if (hideTimer) clearTimeout(hideTimer);
      };
    }
  }, [isSpotlightReady, mergedPlayers.length, showCards]);

  if (!isSpotlightReady || !mergedPlayers.length) return null;

  const blueTeamLineup = mergedPlayers.filter(p => p.side === "BLUE");
  const redTeamLineup = mergedPlayers.filter(p => p.side === "RED");

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-slate-950/10 backdrop-blur-[2px]">
      <AnimatePresence mode="wait">
        {showCards && (
          <>
            {/* THẺ BÊN TRÁI - ĐỘI XANH */}
            <EsportsCard
              player={blueTeamLineup[currentIndex]}
              side="left"
              currentIndex={currentIndex}
            />

            {/* THẺ BÊN PHẢI - ĐỘI ĐỎ */}
            <EsportsCard
              player={redTeamLineup[currentIndex]}
              side="right"
              currentIndex={currentIndex}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkinShowPanel;