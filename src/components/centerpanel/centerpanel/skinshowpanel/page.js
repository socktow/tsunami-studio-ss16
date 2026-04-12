"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkinShowPanel = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const cachedImages = useRef({});

  // 1. Khởi tạo dữ liệu và Pre-load ảnh để tránh giật lag khi chuyển skin
  useEffect(() => {
    const initData = async () => {
      try {
        const res = await fetch('/api/game-data');
        const data = await res.json();
        
        if (data.allPlayers?.length > 0) {
          const players = data.allPlayers;
          const imagePromises = players.map(player => {
            return new Promise((resolve) => {
              const champName = formatChampName(player.championName);
              const skinUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_${player.skinID}.jpg`;
              const defaultUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_0.jpg`;
              
              const img = new Image();
              img.src = skinUrl;
              img.onload = () => { cachedImages.current[skinUrl] = skinUrl; resolve(true); };
              img.onerror = () => {
                const fb = new Image(); fb.src = defaultUrl;
                fb.onload = () => { cachedImages.current[skinUrl] = defaultUrl; resolve(true); };
                fb.onerror = () => resolve(false);
              };
            });
          });
          
          await Promise.all(imagePromises);
          setAllPlayers(players);
          // Delay nhẹ để đảm bảo mọi thứ sẵn sàng
          setTimeout(() => setIsReady(true), 500);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu game:", err);
      }
    };
    initData();
  }, []);

  // 2. Timer chuyển đổi giữa 5 vị trí (Top, Jug, Mid, Adc, Sup)
  useEffect(() => {
    if (isReady && allPlayers.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % 5);
      }, 7000); // 7 giây mỗi lần chuyển để kịp xem hiệu ứng
      return () => clearInterval(timer);
    }
  }, [isReady, allPlayers.length]);

  const formatChampName = (name) => {
    let f = name.replace(/[\s'.]/g, '');
    if (f === "Wukong") return "MonkeyKing";
    if (f === "LeBlanc") return "Leblanc";
    return f;
  };

  if (!isReady) return null;

  const orderTeam = allPlayers.filter(p => p.team === "ORDER");
  const chaosTeam = allPlayers.filter(p => p.team === "CHAOS");

  // Component Card con sử dụng Framer Motion
  const EsportsCard = ({ player, side }) => {
    if (!player) return null;

    const champName = formatChampName(player.championName);
    const originalUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_${player.skinID}.jpg`;
    const finalUrl = cachedImages.current[originalUrl] || `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_0.jpg`;

    // Cấu hình hoạt ảnh cho Card
    const cardVariants = {
      initial: { 
        x: side === 'left' ? -400 : 400, 
        opacity: 0, 
        rotateY: side === 'left' ? 25 : -25,
        scale: 0.9 
      },
      animate: { 
        x: 0, 
        opacity: 1, 
        rotateY: 0, 
        scale: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
      },
      exit: { 
        x: side === 'left' ? -200 : 200, 
        opacity: 0, 
        filter: "brightness(0.2) blur(8px)",
        transition: { duration: 0.6 } 
      }
    };

    return (
      <motion.div
        key={`${player.skinID}-${currentIndex}`} // Key thay đổi để trigger AnimatePresence
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`fixed top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-12' : 'right-12'} z-10`}
        style={{ perspective: "1200px" }}
      >
        {/* Khung viền kim loại Hextech */}
        <div className="relative w-[260px] h-[460px] p-[3px] bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 shadow-[0_0_60px_rgba(0,0,0,0.9)] clip-path-hex">
          
          <div className="relative w-full h-full bg-[#050505] overflow-hidden clip-path-hex">
            
            {/* Ảnh Tướng - Chuyển động Zoom chậm (Ken Burns effect) */}
            <motion.img 
              initial={{ scale: 1.4, y: 0 }}
              animate={{ scale: 1.2, y: 20 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity, repeatType: "alternate" }}
              src={finalUrl} 
              className="w-full h-full object-cover brightness-110"
              style={{ objectPosition: 'center 15%' }}
            />

            {/* Lớp phủ màu theo Team */}
            <div className={`absolute inset-0 opacity-20 ${side === 'left' ? 'bg-blue-500' : 'bg-red-600'} mix-blend-color`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Vùng thông tin - Tự động giãn theo độ dài tên skin */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/95 to-transparent min-h-[140px] flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {/* Tên Player */}
                <h2 className="text-yellow-400 font-black text-2xl uppercase tracking-tighter leading-[0.95] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
                  {player.riotIdGameName || player.summonerName.split('#')[0]}
                </h2>
                
                {/* Divider Line */}
                <div className={`h-[2px] w-12 bg-yellow-500 mb-3 ${side === 'right' ? 'ml-auto' : ''}`} />
                
                {/* Tên Skin - Xuống dòng tự nhiên, không bị cắt */}
                <p className={`text-white font-bold text-[11px] uppercase tracking-[0.2em] italic leading-snug whitespace-normal break-words ${side === 'right' ? 'text-right' : 'text-left'}`}>
                  {player.skinName}
                </p>
              </motion.div>
            </div>

            {/* Hiệu ứng tia sáng quét ngang (Flare) */}
            <motion.div 
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-25 pointer-events-none"
            />
          </div>

          {/* Glow nền mờ phía sau góc viền */}
          <div className="absolute -inset-[1px] blur-[2px] opacity-30 bg-yellow-400 -z-10" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden font-sans">
      {/* Team Xanh */}
      <AnimatePresence mode="wait">
        <EsportsCard key={`left-${currentIndex}`} player={orderTeam[currentIndex]} side="left" />
      </AnimatePresence>

      {/* Team Đỏ */}
      <AnimatePresence mode="wait">
        <EsportsCard key={`right-${currentIndex}`} player={chaosTeam[currentIndex]} side="right" />
      </AnimatePresence>

      <style jsx>{`
        .clip-path-hex {
          /* Cắt góc kiểu Hextech: top-left và bottom-right */
          clip-path: polygon(12% 0, 100% 0, 100% 88%, 88% 100%, 0 100%, 0 12%);
        }
      `}</style>
    </div>
  );
};

export default SkinShowPanel;