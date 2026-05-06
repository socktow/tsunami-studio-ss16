import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventRight = ({ champ, level, ulti, IMAGE_BASE_URL }) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (prevLevelRef.current && level > prevLevelRef.current) {
      setIsLevelingUp(true);
      const timer = setTimeout(() => setIsLevelingUp(false), 3000);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = level;
  }, [level]);

  return (
    <div className="relative w-[45px] h-[45px]">
      <div className="relative w-full h-full overflow-hidden rounded bg-zinc-900 border border-white/10">
        <img
          className="w-full h-full object-cover"
          src={`${IMAGE_BASE_URL}${champ}`}
          alt="champion"
        />

        {/* BADGE LEVEL BÌNH THƯỜNG - Đổi sang bên PHẢI */}
        {!isLevelingUp && level && (
          <div className="absolute -bottom-1 right-0.25 w-[16px] h-[16px] bg-black flex items-center justify-center z-10">
            <span className="text-[13px] font-bold text-white leading-none">
              {level}
            </span>
          </div>
        )}

        {/* HIỆU ỨNG LEVEL UP */}
        <AnimatePresence>
          {isLevelingUp && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ y: "100%" }}
                animate={{ y: ["100%", "0%", "0%", "-100%"] }}
                transition={{ times: [0, 0.2, 0.8, 1], duration: 3, ease: "easeInOut" }}
              />

              <motion.div
                className="relative z-40 flex items-baseline gap-[1px]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ 
                  y: [40, 0, 0, -40], 
                  opacity: [0, 1, 1, 0] 
                }}
                transition={{ times: [0, 0.2, 0.8, 1], duration: 3, ease: "anticipate" }}
              >
                <span className="text-[14px] font-black text-white/80 leading-none">^</span>
                <span className="text-[20px] font-black text-white leading-none italic">{level}</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ICON ULTIMATE - Đổi sang bên TRÁI để đối xứng */}
      {ulti && (
        <img
          src={`${IMAGE_BASE_URL}${ulti}`}
          className="absolute top-0.5 -left-4.5 w-[25px] h-[25px] rounded-full border border-black shadow-[0_0_8px_rgba(34,197,94,0.9)] bg-black z-50"
          alt="ultimate"
        />
      )}
    </div>
  );
};

export default EventRight;