import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChampionAvatarLeft = ({
  champ,
  level,
  ulti,
  IMAGE_BASE_URL,
  hasBaron,
  hasElder,
  respawnAt,
  gameTime,
}) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const prevLevelRef = useRef(level);

  /**
   * respawnAt = thời điểm sẽ hồi sinh trong game
   * gameTime  = thời gian hiện tại của trận
   *
   * VD:
   * respawnAt = 298.56
   * gameTime  = 295.24
   * => còn 4s
   */
  const respawnLeft = Math.max(
    0,
    Math.ceil((respawnAt || 0) - (gameTime || 0)),
  );

  const isDead = respawnLeft > 0;
  const displayTimer = respawnLeft;
  const ultiCooldownLeft = Math.max(
    0,
    Math.ceil((ulti?.readyAt || 0) - (gameTime || 0)),
  );

  const isUltiOnCooldown = ulti?.level > 0 && ultiCooldownLeft > 0;
  useEffect(() => {
    if (prevLevelRef.current && level > prevLevelRef.current) {
      setIsLevelingUp(true);

      const timer = setTimeout(() => {
        setIsLevelingUp(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    prevLevelRef.current = level;
  }, [level]);

  const getBuffType = () => {
    if (hasBaron && hasElder) return "BOTH";
    if (hasBaron) return "BARON";
    if (hasElder) return "ELDER";
    return "NONE";
  };

  const buffType = getBuffType();

  return (
    <div className="relative w-[45px] h-[45px]">
      {/* CONTAINER */}
      <div
        className={`
          relative w-full h-full overflow-hidden rounded
          bg-zinc-900 border border-white/10
          transition-all duration-500
          ${isDead ? "border-zinc-700" : ""}
        `}
      >
        {/* CHAMPION IMAGE */}
        <img
          className={`
            relative z-0 w-full h-full object-cover
            transition-all duration-500
            ${
              isDead
                ? "grayscale opacity-30 scale-110"
                : "grayscale-0 opacity-100 scale-100"
            }
          `}
          src={`${IMAGE_BASE_URL}${champ}`}
          alt="champion"
        />

        {/* RESPAWN TIMER */}
        <AnimatePresence>
          {isDead && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/20"
            >
              <span className="text-[22px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] italic">
                {displayTimer}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BUFF EFFECTS */}
        <AnimatePresence>
          {!isDead && buffType !== "NONE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              {/* BORDER GLOW */}
              <motion.div
                className="absolute inset-0 border-[3px] rounded"
                style={{
                  borderColor:
                    buffType === "BOTH"
                      ? "#fbbf24"
                      : buffType === "BARON"
                        ? "#a855f7"
                        : "#22d3ee",

                  WebkitMaskImage:
                    "linear-gradient(to bottom, black, transparent, black), linear-gradient(to right, black, transparent, black)",

                  WebkitMaskComposite: "destination-in",
                  maskComposite: "intersect",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],

                  boxShadow: [
                    buffType === "BARON"
                      ? "inset 0 0 15px #a855f7"
                      : buffType === "ELDER"
                        ? "inset 0 0 15px #22d3ee"
                        : "inset 0 0 20px #fbbf24",

                    buffType === "BARON"
                      ? "inset 0 0 5px #a855f7"
                      : buffType === "ELDER"
                        ? "inset 0 0 5px #22d3ee"
                        : "inset 0 0 8px #fbbf24",

                    buffType === "BARON"
                      ? "inset 0 0 15px #a855f7"
                      : buffType === "ELDER"
                        ? "inset 0 0 15px #22d3ee"
                        : "inset 0 0 20px #fbbf24",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* SWEEP LIGHT */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    buffType === "BARON"
                      ? "linear-gradient(110deg, transparent 30%, rgba(168,85,247,0.4) 50%, transparent 70%)"
                      : buffType === "ELDER"
                        ? "linear-gradient(110deg, transparent 30%, rgba(103,232,249,0.4) 50%, transparent 70%)"
                        : "linear-gradient(110deg, transparent 30%, rgba(251,191,36,0.5) 50%, transparent 70%)",
                }}
                animate={{
                  x: ["-150%", "150%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEVEL BADGE */}
        {!isLevelingUp && level && !isDead && (
          <div className="absolute -bottom-1 left-0 w-[16px] h-[16px] bg-black flex items-center justify-center z-20 border-t border-r border-white/20">
            <span className="text-[11px] font-bold text-white leading-none">
              {level}
            </span>
          </div>
        )}

        {/* LEVEL UP EFFECT */}
        <AnimatePresence>
          {isLevelingUp && !isDead && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ y: "100%" }}
                animate={{ y: ["100%", "0%", "0%", "-100%"] }}
                transition={{
                  times: [0, 0.2, 0.8, 1],
                  duration: 3,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="relative z-40 flex items-baseline gap-[1px]"
                initial={{ y: 40, opacity: 0 }}
                animate={{
                  y: [40, 0, 0, -40],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  times: [0, 0.2, 0.8, 1],
                  duration: 3,
                  ease: "anticipate",
                }}
              >
                <span className="text-[14px] font-black text-white/80 leading-none">
                  ^
                </span>

                <span className="text-[20px] font-black text-white leading-none italic">
                  {level}
                </span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ULTI ICON */}
      <div
        className={`
    absolute top-0.5 -right-4.5
    w-[25px] h-[25px]
    rounded-full
    border
    overflow-hidden
    bg-black
    z-50
    transition-all duration-500
    ${
      isDead
        ? "grayscale opacity-40 scale-75 border-zinc-700"
        : "grayscale-0 opacity-100 scale-100 border-white/15"
    }
  `}
      >
        {/* COOLDOWN OVERLAY */}
        {isUltiOnCooldown && (
          <div className="absolute inset-0 z-30 bg-black/65 flex items-center justify-center">
            <span className="text-[10px] font-black text-white drop-shadow">
              {ultiCooldownLeft}
            </span>
          </div>
        )}

        {ulti && ulti.level > 0 ? (
          <img
            src={`${IMAGE_BASE_URL}${ulti.assets?.iconAsset || ulti}`}
            className={`
        w-full h-full
        object-cover
        rounded-full
        transition-all duration-300
        ${isUltiOnCooldown ? "grayscale brightness-[0.55]" : "brightness-100"}
      `}
            alt="ultimate"
          />
        ) : (
          <div
            className="
        w-full h-full
        rounded-full
        bg-zinc-950
        border border-white/10
      "
          />
        )}
      </div>
    </div>
  );
};

export default ChampionAvatarLeft;
