import React, { useMemo } from "react";
import { useLeagueData } from "@/app/overlay/layout";
import { getTeamData, mapTabsToL2 } from "@/lib/league-utils";

import L1 from "./columns/L1";
import L2 from "./columns/L2";
import CT from "./columns/CT";
import R1 from "./columns/R1";
import R2 from "./columns/R2";

const ScBottom = () => {
  const { gameData } = useLeagueData();
  const teams = useMemo(() => getTeamData(gameData), [gameData]);

  const l2Data = useMemo(() => {
    if (!gameData?.tabs) return null;
    return mapTabsToL2(gameData.tabs);
  }, [gameData]);

  if (!teams) return null;

  return (
    <div className="min-h-screen flex items-end justify-center">
      <div className="relative w-[990px] h-[260px] flex border border-white/10 overflow-hidden shadow-2xl rounded-sm">
        {/* ===================== */}
        {/* GRADIENT + OPACITY BACKGROUND */}
        {/* ===================== */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* 1. Base Layer: Màu tối sâu nhưng không đặc (opacity 90%) */}
          <div className="absolute inset-0 bg-[#050505]/90" />

          {/* 2. Blue Side Gradient (Trái): Chuyển từ Xanh sang Trong suốt (Opacity loang) */}
          <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-blue-600/30 via-blue-900/10 to-transparent" />

          {/* 3. Red Side Gradient (Phải): Chuyển từ Đỏ sang Trong suốt (Opacity loang) */}
          <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-red-600/30 via-red-900/10 to-transparent" />

          {/* 4. Center Flare: Vừa Gradient màu Vàng Đồng vừa điều chỉnh Opacity theo tâm */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, 
                rgba(234, 179, 8, 0.2) 0%,    /* Vàng đồng mờ ở tâm */
                rgba(234, 179, 8, 0.05) 30%,  /* Giảm cực thấp opacity ở khoảng cách 30% */
                transparent 70%               /* Biến mất hoàn toàn ở 70% */
              )`,
            }}
          />

          {/* 5. Các đường quét ngang (Scanlines) tạo hiệu ứng công nghệ */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
        </div>

        {/* ===================== */}
        {/* CONTENT LAYER */}
        {/* ===================== */}
        <div className="relative z-10 flex w-full h-full">
          {/* Giữ nguyên các component L1, L2, CT, R1, R2 */}
          <L1 tabs={l2Data?.order} boards={teams.blue.board} />
          <L2 tabs={l2Data?.order} boards={teams.blue.board} />
          <CT />
          <R1 tabs={l2Data?.chaos} boards={teams.red.board} />
          <R2 tabs={l2Data?.chaos} boards={teams.red.board} />
        </div>

        {/* Hiệu ứng bóng gương ở viền trên */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-transparent h-[2px]" />
      </div>
    </div>
  );
};

export default ScBottom;
