"use client";

import React from 'react';
import { formatTime } from "@/lib/utils";

// Icon nên để trong file constants hoặc giữ ở đây nếu chỉ dùng cho Center
export const ICONS = {
  LOGOS: {
    VCS: "https://roadtovcs.vnggames.com/api/images/team_2_logo_1744360408217/png"
  }
};

const CenterComponent = ({ blueKills = 0, redKills = 0, gameTime = 0 }) => {
  return (
    <div className="w-[150px] h-[100px] flex flex-col flex-none select-none overflow-hidden shadow-2xl">

      {/* PHẦN TRÊN H60: Hiển thị Kills & Logo giải đấu */}
      <div className="w-full h-[60px] bg-black flex items-center justify-between px-1 relative z-10">

        {/* Chỉ số hạ gục Đội Xanh */}
        <div className="w-2/5 text-center">
          <span className="text-white text-4xl font-black tabular-nums tracking-tight ">
            {blueKills}
          </span>
        </div>

        {/* Logo Trung tâm (VCS) */}
        <div className="w-1/5 flex justify-center items-center">
          <img
            src={ICONS.LOGOS.VCS}
            alt="VCS"
            className="h-8 w-auto object-contain brightness-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Chỉ số hạ gục Đội Đỏ */}
        <div className="w-2/5 text-center">
          <span className="text-white text-4xl font-black tabular-nums tracking-tight ">
            {redKills}
          </span>
        </div>

      </div>

      {/* PHẦN DƯỚI H40: Game Time */}
      <div className="w-full h-[40px] relative">
        {/* Nền trong suốt có độ mờ và blur để trông hiện đại hơn */}
        <div className="absolute inset-0 bg-zinc-900/40" />

        <div className="relative h-full flex items-center justify-center">
          <span className="text-[22px] font-black text-white font-mono leading-none drop-shadow-md">
            {formatTime(gameTime)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default CenterComponent;