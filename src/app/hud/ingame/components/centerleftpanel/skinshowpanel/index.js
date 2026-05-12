"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAllGameData } from "@/hooks/useallgamedata"; // Import hook vừa tạo

const SkinShowPanel = () => {
  const { allPlayers, isReady, formatChampName } = useAllGameData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCards, setShowCards] = useState(true);

  // Quản lý việc tự động chuyển card
  useEffect(() => {
    if (isReady && allPlayers.length > 0 && showCards) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= 4) {
            clearInterval(timer);
            setTimeout(() => setShowCards(false), 4000);
            return prev;
          }
          return prev + 1;
        });
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [isReady, allPlayers.length, showCards]);

  const EsportsCard = ({ player, side }) => {
    if (!player) return null;
    const champName = formatChampName(player.championName);
    const finalUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_${player.imageSkinID}.jpg`;

    return (
      <motion.div
        key={`${player.summonerName}-${currentIndex}`}
        initial={{
          x: side === "left" ? -400 : 400,
          opacity: 0,
          rotateY: side === "left" ? 20 : -20,
        }}
        animate={{ x: 0, opacity: 1, rotateY: 0 }}
        exit={{
          opacity: 0,
          scale: 1.1,
          filter: "blur(15px) brightness(1.5)",
          x: side === "left" ? -200 : 200,
          transition: { duration: 1.2, ease: "easeIn" },
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-[40%] -translate-y-1/2 ${side === "left" ? "left-12" : "right-12"} z-10`}
        style={{ perspective: "1200px" }}
      >
        <div className="relative w-[260px] h-[460px] p-[3px] bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 shadow-[0_0_60px_rgba(0,0,0,0.9)] clip-path-hex">
          <div className="relative w-full h-full bg-[#050505] overflow-hidden clip-path-hex">
            <motion.img
              initial={{ scale: 1.4 }}
              animate={{ scale: 1.15, y: 15 }}
              transition={{ duration: 8, ease: "linear" }}
              src={finalUrl}
              onError={(e) => {
                e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_0.jpg`;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5">
              <h2 className="text-yellow-400 font-black text-2xl uppercase tracking-tighter mb-1 leading-tight">
                {player.riotIdGameName || player.summonerName.split("#")[0]}
              </h2>
              <p className="text-white font-bold text-[11px] uppercase tracking-widest opacity-80 leading-snug">
                {player.displayName}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!isReady) return null;

  const orderTeam = allPlayers.filter((p) => p.team === "ORDER");
  const chaosTeam = allPlayers.filter((p) => p.team === "CHAOS");

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-transparent">
      <AnimatePresence mode="wait">
        {showCards && (
          <React.Fragment key="cards-container">
            <EsportsCard player={orderTeam[currentIndex]} side="left" />
            <EsportsCard player={chaosTeam[currentIndex]} side="right" />
          </React.Fragment>
        )}
      </AnimatePresence>

      <style jsx>{`
        .clip-path-hex {
          clip-path: polygon(12% 0, 100% 0, 100% 88%, 88% 100%, 0 100%, 0 12%);
        }
      `}</style>
    </div>
  );
};

export default SkinShowPanel;