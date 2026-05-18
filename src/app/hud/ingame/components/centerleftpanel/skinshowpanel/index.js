"use client";

import React, {
  useState,
  useEffect,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useAllGameData,
} from "@/hooks/useallgamedata";

const EsportsCard = ({
  player,
  side,
  currentIndex,
  formatChampName,
}) => {
  if (!player) return null;

  const champ =
    formatChampName(
      player.championName
    );

  const finalUrl =
    `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_${player.imageSkinID}.jpg`;

  return (
    <motion.div
      key={`${player.summonerName}-${currentIndex}`}
      initial={{
        x:
          side === "left"
            ? -400
            : 400,

        opacity: 0,

        rotateY:
          side === "left"
            ? 20
            : -20,
      }}
      animate={{
        x: 0,
        opacity: 1,
        rotateY: 0,
      }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter:
          "blur(15px) brightness(1.5)",

        x:
          side === "left"
            ? -200
            : 200,

        transition: {
          duration: 1.2,
          ease: "easeIn",
        },
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`fixed top-[40%] -translate-y-1/2 ${
        side === "left"
          ? "left-12"
          : "right-12"
      } z-10`}
      style={{
        perspective: "1200px",
      }}
    >
      <div className="relative w-[260px] h-[460px] p-[3px] bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 shadow-[0_0_60px_rgba(0,0,0,0.9)] clip-path-hex">
        <div className="relative w-full h-full bg-[#050505] overflow-hidden clip-path-hex">

          <motion.img
            initial={{
              scale: 1.4,
            }}
            animate={{
              scale: 1.15,
              y: 15,
            }}
            transition={{
              duration: 8,
              ease: "linear",
            }}
            src={finalUrl}
            alt={player.displayName}
            onError={(e) => {
              e.target.src =
                `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_0.jpg`;
            }}
            className="w-full h-full object-cover"
          />

        </div>
      </div>
    </motion.div>
  );
};

const SkinShowPanel = () => {
  const {
    allPlayers,
    isReady,
    formatChampName,
  } = useAllGameData();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    showCards,
    setShowCards,
  ] = useState(true);

  useEffect(() => {
    let hideTimer;

    if (
      isReady &&
      allPlayers.length &&
      showCards
    ) {
      const timer =
        setInterval(() => {
          setCurrentIndex(
            (prev) => {
              if (prev >= 4) {
                clearInterval(
                  timer
                );

                hideTimer =
                  setTimeout(() => {
                    setShowCards(
                      false
                    );
                  }, 4000);

                return prev;
              }

              return prev + 1;
            }
          );
        }, 7000);

      return () => {
        clearInterval(timer);

        if (hideTimer) {
          clearTimeout(
            hideTimer
          );
        }
      };
    }
  }, [
    isReady,
    allPlayers.length,
    showCards,
  ]);

  if (!isReady) return null;

  const order =
    allPlayers.filter(
      (x) =>
        x.team === "ORDER"
    );

  const chaos =
    allPlayers.filter(
      (x) =>
        x.team === "CHAOS"
    );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">

      <AnimatePresence mode="wait">

        {showCards && (
          <>
            <EsportsCard
              player={
                order[
                  currentIndex
                ]
              }
              side="left"
              currentIndex={
                currentIndex
              }
              formatChampName={
                formatChampName
              }
            />

            <EsportsCard
              player={
                chaos[
                  currentIndex
                ]
              }
              side="right"
              currentIndex={
                currentIndex
              }
              formatChampName={
                formatChampName
              }
            />
          </>
        )}

      </AnimatePresence>

    </div>
  );
};

export default SkinShowPanel;