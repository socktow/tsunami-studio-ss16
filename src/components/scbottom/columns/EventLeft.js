import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChampionAvatarLeft = ({ champ, level, ulti, IMAGE_BASE_URL }) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const prevLevelRef = useRef(level);

  useEffect(() => {
    // Chỉ kích hoạt khi level cũ tồn tại và thấp hơn level mới
    if (prevLevelRef.current && level > prevLevelRef.current) {
      setIsLevelingUp(true);
      const timer = setTimeout(() => setIsLevelingUp(false), 3000); // Chạy 3s
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = level;
  }, [level]);

  return (
    <div className="relative w-[45px] h-[45px]">
      {/* KHUNG CHỨA AVATAR VÀ HIỆU ỨNG TRƯỢT (Phải có overflow-hidden ở đây) */}
      <div className="relative w-full h-full overflow-hidden rounded bg-zinc-900 border border-white/10">
        {/* ẢNH CHAMPION */}
        <img
          className="w-full h-full object-cover"
          src={`${IMAGE_BASE_URL}${champ}`}
          alt="champion"
        />

        {/* BADGE LEVEL BÌNH THƯỜNG */}
        {!isLevelingUp && level && (
          <div className="absolute -bottom-1 -left-1 w-[16px] h-[16px] bg-black border border-zinc-500 rounded-full flex items-center justify-center z-10">
            <span className="text-[10px] font-bold text-white leading-none">
              {level}
            </span>
          </div>
        )}

        {/* HIỆU ỨNG LEVEL UP */}
        <AnimatePresence>
          {isLevelingUp && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              {/* Lớp nền đen trượt lên xuyên suốt */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ y: "100%" }}
                animate={{
                  y: ["100%", "0%", "0%", "-100%"],
                }}
                transition={{
                  times: [0, 0.2, 0.8, 1],
                  duration: 3,
                  ease: "easeInOut",
                }}
              />

              {/* Số Level trượt lên Center rồi trượt tiếp lên trên */}
              <motion.span
                className="relative z-40 text-[22px] font-black text-white italic"
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
                {level}
              </motion.span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ICON ULTIMATE (Nằm ngoài khung overflow nên luôn hiển thị cố định) */}
      {ulti && (
        <img
          src={`${IMAGE_BASE_URL}${ulti}`}
          className="absolute top-0.5 -right-4.5 w-[25px] h-[25px] rounded-full border border-black shadow-[0_0_8px_rgba(34,197,94,0.9)] bg-black z-50"
          alt="ultimate"
        />
      )}
    </div>
  );
};

export default ChampionAvatarLeft;
