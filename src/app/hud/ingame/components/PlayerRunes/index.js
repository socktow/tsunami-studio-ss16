"use client";
import React from 'react';
import { motion } from 'framer-motion';

const PlayerRunes = () => {
  // Mock data giữ nguyên cấu trúc của bạn
  const demoBlueTeam = Array(5).fill({
    logoTeam: "https://vnggames.gitbook.io/~gitbook/image?url=https%3A%2F%2F245419842-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-MX79G1LzC-L-GjX3Q4w%252Fuploads%252FzC3P3FkK3A8C6jZ5bN9f%252FTeam_Liquid_logo.png%3Falt%3Dmedia%26token%3D1234&width=320&compression=1", 
    champion: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kante_0.jpg",
    primaryRune: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
    subRunes: [
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Demolish/Demolish.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Conditioning/Conditioning.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png"
    ],
    minorRunes: [
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png"
    ]
  });

  const demoRedTeam = Array(5).fill({
    logoTeam: "https://images.vnggames.tech/esports/lol/teams/t1.png", 
    champion: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jayce_0.jpg",
    primaryRune: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
    subRunes: [
      "https://images.vnggames.tech/esports/lol/teams/t1.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Transcendence/Transcendence.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png"
    ],
    minorRunes: [
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png"
    ]
  });

  // Khung cha kích hoạt hiệu ứng gối nhau (Stagger) cho các ô ngọc bên dưới
  const teamContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08, // Khoảng thời gian delay giữa các thẻ (tăng/giảm tùy ý bạn)
      }
    }
  };

  const panelVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Các thẻ xuất hiện sẽ bay nhẹ từ dưới lên và phóng to từ gốc 0.95 lên 1
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } }
  };

  return (
    <motion.div 
      style={{ width: '1360px', height: '280px' }} 
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-[280px] bg-[#050507] border-t border-amber-500/10 flex flex-col justify-between pointer-events-auto select-none shadow-[0_-30px_70px_rgba(0,0,0,0.95)]"
    >
      
      {/* 1. PRESTIGE HEADER BAR WITH TEAM LOGOS */}
      <div className="w-full h-12 border-b border-white/5 flex items-center justify-between px-10 relative bg-[#09090c]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* Blue Team Crest Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-950/20 border border-blue-500/30 rounded rotate-45 flex items-center justify-center p-1 shadow-[0_0_8px_rgba(59,130,246,0.15)]">
            <img src={demoBlueTeam[0]?.logoTeam} className="-rotate-45 w-full h-full object-contain filter brightness-110 drop-shadow-md" alt="" />
          </div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        </div>

        {/* Center Title */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[9px] text-amber-500/60 font-medium tracking-[0.5em] uppercase font-serif">THE RUNE MASTERPIECE</span>
        </div>

        {/* Red Team Crest Logo */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-7 h-7 bg-rose-950/20 border border-rose-500/30 rounded rotate-45 flex items-center justify-center p-1 shadow-[0_0_8px_rgba(244,63,94,0.15)]">
            <img src={demoRedTeam[0]?.logoTeam} className="-rotate-45 w-full h-full object-contain filter brightness-110 drop-shadow-md" alt="" />
          </div>
          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 2. RUNE PANEL MATRIX */}
      <div className="w-full flex-1 flex items-center justify-between px-8 bg-gradient-to-b from-[#050507] to-[#0a0a0d]">
        
        {/* --- BLUE TEAM (Quét từ trái sang phải -> từ ngoài vào trong tâm) --- */}
        <motion.div 
          variants={teamContainerVariants}
          className="flex gap-3 w-[570px] justify-between"
        >
          {demoBlueTeam.map((player, idx) => (
            <motion.div 
              key={`blue-royal-${idx}`}
              variants={itemVariants}
              whileHover={{ scale: 1.03, borderColor: "rgba(59, 130, 246, 0.4)" }}
              className="w-[102px] h-[195px] bg-gradient-to-b from-[#09152e]/50 via-[#0c0c10] to-[#0c0c10] border border-blue-500/20 rounded-lg relative overflow-hidden group transition-all duration-300 shadow-lg"
            >
              {/* Champion Portrait */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-cover bg-center grayscale-[40%] opacity-40 group-hover:opacity-60 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url(${player.champion})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/40 to-transparent" />
              </div>

              {/* Khung chứa ngọc thiết kế dạng Khay Cổ Điển */}
              <div className="absolute inset-x-1.5 bottom-2 z-10 flex flex-col items-center bg-[#07070a]/90 border border-amber-500/10 rounded-md p-2 backdrop-blur-md">
                {/* Ngọc Siêu Cấp */}
                <div className="w-12 h-12 rounded-full bg-[#050507] border border-amber-400/60 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] group-hover:border-amber-400 transition-all duration-300">
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                </div>

                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent my-2" />

                {/* Ngọc Phụ */}
                <div className="flex gap-1.5 justify-center items-center w-full mb-1.5">
                  {player.subRunes.slice(0, 3).map((url, i) => (
                    <div key={`sub-${i}`} className="w-[17px] h-[17px] bg-contain bg-center bg-no-repeat filter brightness-90 hover:scale-110 transition-transform" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* Mảnh Chỉ Số */}
                <div className="flex gap-1 justify-center items-center w-full">
                  {player.minorRunes.slice(0, 2).map((url, i) => (
                    <div key={`min-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat opacity-50 border border-amber-500/10 rounded-full bg-black/40" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- CROWN DIVIDER --- */}
        <div className="w-10 h-full flex items-center justify-center relative">
          <div className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
          <div className="z-10 w-6 h-6 rounded-full bg-[#050507] border border-amber-500/30 flex items-center justify-center shadow-xl">
            <div className="w-1.5 h-1.5 bg-amber-400 rotate-45" />
          </div>
        </div>

        {/* --- RED TEAM (Quét từ phải sang trái -> từ ngoài vào trong tâm) --- */}
        <motion.div 
          variants={teamContainerVariants}
          className="flex gap-3 w-[570px] justify-between flex-row-reverse"
        >
          {/* Mẹo logic: Thêm [...demoRedTeam].reverse() kết hợp với flex-row-reverse 
              để ép Framer Motion chạy hiệu ứng từ ngoài rìa màn hình tiến dần vào trung tâm */}
          {[...demoRedTeam].reverse().map((player, idx) => (
            <motion.div 
              key={`red-royal-${idx}`}
              variants={itemVariants}
              whileHover={{ scale: 1.03, borderColor: "rgba(244, 63, 94, 0.4)" }}
              className="w-[102px] h-[195px] bg-gradient-to-b from-[#2d0b13]/50 via-[#0c0c10] to-[#0c0c10] border border-rose-500/20 rounded-lg relative overflow-hidden group transition-all duration-300 shadow-lg"
            >
              {/* Champion Portrait */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-cover bg-center grayscale-[40%] opacity-40 group-hover:opacity-60 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: `url(${player.champion})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/40 to-transparent" />
              </div>

              {/* Khung chứa ngọc */}
              <div className="absolute inset-x-1.5 bottom-2 z-10 flex flex-col items-center bg-[#07070a]/90 border border-amber-500/10 rounded-md p-2 backdrop-blur-md">
                {/* Ngọc Siêu Cấp */}
                <div className="w-12 h-12 rounded-full bg-[#050507] border border-amber-400/60 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] group-hover:border-amber-400 transition-all duration-300">
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ backgroundImage: `url(${player.primaryRune})` }} />
                </div>

                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent my-2" />

                {/* Ngọc Phụ */}
                <div className="flex gap-1.5 justify-center items-center w-full mb-1.5 flex-row-reverse">
                  {player.subRunes.slice(0, 3).map((url, i) => (
                    <div key={`sub-${i}`} className="w-[17px] h-[17px] bg-contain bg-center bg-no-repeat filter brightness-90 hover:scale-110 transition-transform" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>

                {/* Mảnh Chỉ Số */}
                <div className="flex gap-1 justify-center items-center w-full flex-row-reverse">
                  {player.minorRunes.slice(0, 2).map((url, i) => (
                    <div key={`min-${i}`} className="w-3.5 h-3.5 bg-contain bg-center bg-no-repeat opacity-50 border border-amber-500/10 rounded-full bg-black/40" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* 3. BASELINE CHROME */}
      <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </motion.div>
  );
};

export default PlayerRunes;