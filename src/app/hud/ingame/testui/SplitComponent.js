"use client";
import React from 'react';
import { ICONS, OBJECTIVE_ICONS } from '@/lib/constants';

const SplitComponent = ({ isRightSide = false, teamData, statsData, matchType }) => {
  if (!teamData || !statsData) return <div className="w-[400px] h-[100px] bg-black/50 animate-pulse" />;

  // 1. Logic xử lý số lượng ô hiển thị dựa trên matchType
  const getTotalSlots = (type) => {
    if (type === "BO3") return 2;
    if (type === "BO5") return 3;
    return 0;
  };

  const totalSlots = getTotalSlots(matchType);

  // --- MỚI: Logic tính chiều cao ô Score Indicator ---
  const getIndicatorHeight = (type) => {
    if (type === "BO3") return "20px";
    if (type === "BO5") return "10px";
    return "15px";
  };
  const indicatorHeight = getIndicatorHeight(matchType);

  const formatGold = (gold) => {
    if (!gold) return "0K";
    return (gold / 1000).toFixed(1) + "K";
  };

  const statsFontStyle = {
    fontFamily: "'Chakra Petch', sans-serif",
    letterSpacing: "-0.02em",
  };

  return (
    <div className="w-[400px] h-[100px] flex flex-col flex-none select-none overflow-hidden shadow-lg">

      {/* --- TẦNG TRÊN (H60) --- */}
      <div className={`h-[60px] bg-black flex items-center justify-between relative overflow-hidden ${isRightSide ? 'flex-row-reverse pl-4' : 'pr-4'}`}>

        <div
          className={`absolute top-0 bottom-0 w-[70%] z-0 pointer-events-none opacity-20 ${isRightSide ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'}`}
          style={{
            background: `linear-gradient(${isRightSide ? 'to left' : 'to right'}, ${teamData.color}, transparent)`
          }}
        />

        <div className={`z-10 flex items-center gap-3 h-full ${isRightSide ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center h-full ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-[4px] h-[45px] shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              style={{ backgroundColor: teamData.color }}
            />

            {/* Hệ thống ô Score Indicator */}
            {totalSlots > 0 && (
              <div className="flex flex-col gap-1 px-1.5">
                {Array.from({ length: totalSlots }).map((_, i) => {
                  const isWin = i < teamData.score;
                  return (
                    <div
                      key={i}
                      className={`w-[8px] border transition-all duration-500 ${isWin ? 'border-transparent' : 'border-white/20 bg-transparent'}`}
                      style={{
                        height: indicatorHeight, // Áp dụng chiều cao linh hoạt ở đây
                        backgroundColor: isWin ? teamData.color : 'transparent',
                        boxShadow: isWin ? `0 0 8px ${teamData.color}` : 'none'
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <img src={teamData.logo} alt="logo" className="h-12 w-12 object-contain brightness-110" />
          <span className="text-white text-[30px] font-black tracking-tighter uppercase leading-none">
            {teamData.tag}
          </span>
        </div>

        {/* Trụ & Vàng */}
        <div className={`z-10 flex items-center gap-5 ${isRightSide ? 'flex-row-reverse pl-6' : 'pr-4'}`}>
          <div className={`flex items-center gap-1.5 ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <img src={ICONS.TOWER} alt="T" className="h-4 w-4 grayscale brightness-200" />
            <span style={statsFontStyle} className="text-white text-[22px] font-bold tabular-nums">
              {statsData.towers}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <img src={ICONS.GOLD} alt="G" className="h-4 w-4 grayscale brightness-150" />
            <span style={statsFontStyle} className="text-white text-[22px] font-bold tabular-nums">
              {formatGold(statsData.gold)}
            </span>
          </div>
        </div>
      </div>

      {/* --- TẦNG DƯỚI (H40) --- */}
      <div className="h-[40px] relative">
        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm border-t border-white/10" />
        <div className={`relative h-full flex items-center justify-between px-4 ${isRightSide ? 'flex-row-reverse' : ''}`}>

          <div className={`flex items-center ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center opacity-50 grayscale transition-all duration-500">
              <img
                src={OBJECTIVE_ICONS.RIFTHERALD}
                alt="Herald"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className={`flex items-center opacity-90 ${isRightSide ? 'flex-row-reverse' : ''}`}>
              <img
                src={OBJECTIVE_ICONS.GRUB}
                alt="S"
                className="h-8 w-8 object-contain brightness-110"
              />
              <span className={`text-white font-mono text-[14px] font-bold ${isRightSide ? 'mr-1' : 'ml-1'}`}>
                {statsData.grubs || 0}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-1 ${isRightSide ? 'flex-row-reverse' : ''}`}>
            {statsData.dragons?.map((dragonKey, i) => (
              <img
                key={i}
                src={OBJECTIVE_ICONS.DRAGONS[dragonKey]}
                className="h-6 w-6 object-contain brightness-110"
                alt={dragonKey}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitComponent;