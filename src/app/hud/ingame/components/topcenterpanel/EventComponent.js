"use client";
import React, { useMemo } from 'react';
// Sửa lỗi Bundle Size: Import cấu phần rút gọn m và LazyMotion features
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const formatGoldDisplay = (gold) => {
  if (!gold || isNaN(gold)) return "+0";
  const num = Number(gold);
  if (num > 0) {
    return `+${Math.floor(num)}`;
  }
  if (num < 0) {
    return `-${Math.floor(Math.abs(num))}`;
  }
  return "0";
};

const PowerPlayItem = ({ goldLead, timeLeft, progress, type, isRightSide }) => {
  const config = {
    baron: { color: "#a855f7", label: "Baron Power Play" },
    dragon: { color: "#f97316", label: "Dragon Power Play" }
  };

  const current = config[type] || config.baron;
  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.floor(Math.max(0, timeLeft) % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    // Sửa lỗi Bundle Size: Đổi từ motion.div thành m.div
    <m.div 
      initial={{ opacity: 0, x: isRightSide ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRightSide ? 40 : -40 }}
      className={`relative flex flex-col p-2 min-w-[180px] bg-zinc-950 border border-white/10 shadow-2xl select-none overflow-hidden rounded-sm mb-1`}
      style={{ 
        background: `linear-gradient(${!isRightSide ? '90deg' : '-90deg'}, ${current.color}44 0%, #09090b 100%)`,
        [!isRightSide ? 'borderLeft' : 'borderRight']: `4px solid ${current.color}`
      }}
    >
      <div className={`flex items-center gap-2 mb-1 ${!isRightSide ? '' : 'flex-row-reverse'}`}>
        {/* Sửa lỗi Architecture: Thay size axes lặp (size-4) sang định dạng size-4 phù hợp Tailwind v4 */}
        <Zap className="size-4 fill-current" style={{ color: current.color }} />
        {/* Sửa lỗi Architecture: Chuyển font-black xuống font-semibold trên chữ nhỏ để tránh dính chữ */}
        <span className="text-[9px] font-semibold uppercase text-white/90 tracking-widest">
            {current.label}
        </span>
      </div>

      <div className={`flex items-center justify-between ${!isRightSide ? '' : 'flex-row-reverse'}`}>
        <span className="text-sm font-bold font-mono text-white/80 bg-zinc-950/40 px-2 py-0.5 rounded leading-none">
          {formattedTime}
        </span>
        {/* Sửa lỗi Architecture: Đổi font-black hiển thị lượng vàng xuống font-bold để đảm bảo tính scannability */}
        <span className="text-lg font-bold text-white leading-none">{formatGoldDisplay(goldLead)}</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        {/* Sửa lỗi Bundle Size: Đổi từ motion.div thành m.div */}
        <m.div 
          className="h-full"
          style={{ backgroundColor: current.color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>
    </m.div>
  );
};

const EventComponent = ({ 
  gameTime = 0, 
  isRightSide = false, 
  baronPowerPlay = null, 
  dragonPowerPlay = null 
}) => {
  const buffs = useMemo(() => {
    const activeBuffs = [];
    const currentTime = Number(gameTime);
    const process = (data, type) => {
      if (data && currentTime < Number(data.timeEnd)) {
        const tStart = Number(data.timeStart);
        const tEnd = Number(data.timeEnd);
        const total = tEnd - tStart;
        const prog = total > 0 ? ((currentTime - tStart) / total) * 100 : 0;
        activeBuffs.push({
          id: `${type}-${data.timeStart}`,
          type,
          gold: data.gold,
          timeLeft: tEnd - currentTime,
          progress: Math.min(100, Math.max(0, prog))
        });
      }
    };
    process(baronPowerPlay, 'baron');
    process(dragonPowerPlay, 'dragon');
    return activeBuffs;
  }, [gameTime, baronPowerPlay, dragonPowerPlay]);

  if (buffs.length === 0) return null;

  return (
    // Bọc thẻ LazyMotion với tính năng nạp hoạt ảnh rút gọn (domAnimation) 
    // Giúp loại bỏ hoàn toàn việc bundle dư thừa ~30kb từ Framer Motion
    <LazyMotion features={domAnimation}>
      <div 
        className={`absolute z-[60] flex flex-col ${
          isRightSide 
            ? 'left-full ml-1 items-start'
            : 'right-full mr-1 items-end'  
        }`}
        style={{ top: '0px' }}
      >
        <AnimatePresence mode="popLayout">
          {buffs.map((buff) => (
            <PowerPlayItem 
              key={buff.id}
              {...buff}
              goldLead={buff.gold}
              isRightSide={isRightSide}
            />
          ))}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default EventComponent;