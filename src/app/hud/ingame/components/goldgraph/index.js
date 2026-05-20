"use client";
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useGoldTracker } from '@/hooks/useGoldTracker'; 
import { useScoreboardData } from "@/hooks/useApiTeamData";
import { IMAGE_BASE_URL } from "@/lib/constants";

const formatUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const GoldGraph = ({ show = false }) => {
  const { matchInfo } = useScoreboardData();
  const { goldHistory, exactCurrentTime, currentGoldDiff } = useGoldTracker();

  const blueTeamMeta = useMemo(() => matchInfo?.teamsData?.[0], [matchInfo]);
  const redTeamMeta = useMemo(() => matchInfo?.teamsData?.[1], [matchInfo]);

  const blueColor = blueTeamMeta?.color || "#3b82f6";
  const redColor = redTeamMeta?.color || "#f43f5e";
  const blueLogo = formatUrl(blueTeamMeta?.logo || "");
  const redLogo = formatUrl(redTeamMeta?.logo || "");

  const formattedGameTime = useMemo(() => {
    const totalSeconds = Math.floor(exactCurrentTime * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [exactCurrentTime]);

  const renderChartData = useMemo(() => {
    if (!goldHistory || goldHistory.length === 0) return [{ time: 0, gold: 0 }];
    const lastStoredPoint = goldHistory[goldHistory.length - 1];
    if (exactCurrentTime > lastStoredPoint.time) {
      return [...goldHistory, { time: exactCurrentTime, gold: currentGoldDiff }];
    }
    return goldHistory;
  }, [goldHistory, exactCurrentTime, currentGoldDiff]);

  // 🔴 ĐÃ SỬA: Lấy mốc tối đa của trục X khớp khít với thời gian hiện tại 
  // (Đặt tối thiểu là 5 phút để đồ thị không bị co rúm ở 1-2 phút đầu game)
  const maxAxisTime = useMemo(() => Math.max(5, exactCurrentTime), [exactCurrentTime]);

  // 🔴 ĐÃ SỬA: Chỉ sinh ra các vạch chia chẵn (0, 5, 10...) đã và đang trải qua
  const axisTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= maxAxisTime; i += 5) {
      ticks.push(i);
    }
    return ticks;
  }, [maxAxisTime]);

  const yAxisTicks = useMemo(() => {
    const golds = renderChartData.map(d => d.gold);
    const maxVal = Math.max(...golds, 0);
    const minVal = Math.min(...golds, 0);
    const absoluteMax = Math.max(maxVal, Math.abs(minVal), 1000);

    const ticks = [0];
    const maxLimit = Math.ceil(absoluteMax / 500) * 500;

    for (let i = 500; i <= maxLimit; i += 500) {
      if (i % 1000 === 0 || i === maxLimit || absoluteMax <= 3000) {
        ticks.push(i);
        ticks.push(-i);
      }
    }
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
  }, [renderChartData]);

  const yAxisDomain = useMemo(() => [yAxisTicks[0], yAxisTicks[yAxisTicks.length - 1]], [yAxisTicks]);

  const gradientOffset = useMemo(() => {
    const dataMax = Math.max(...renderChartData.map(d => d.gold), 0);
    const dataMin = Math.min(...renderChartData.map(d => d.gold), 0);
    if (dataMax === 0 && dataMin === 0) return 0.5;
    if (dataMax === dataMin) return 0.5;
    return dataMax / (dataMax - dataMin);
  }, [renderChartData]);

  const formatGoldLabel = (gold) => {
    const absGold = Math.abs(gold);
    if (absGold === 0) return "0";
    return gold > 0 ? `+${(absGold / 1000).toFixed(1)}k` : `-${(absGold / 1000).toFixed(1)}k`;
  };

  return (
    <motion.div 
      initial={{ y: 280, opacity: 0 }}
      animate={{ y: show ? 0 : 280, opacity: show ? 1 : 0 }} 
      transition={{ type: "spring", damping: 30, stiffness: 150 }}
      className="fixed bottom-0 left-[280px] w-[1360px] h-[280px] bg-[#050507]/95 border-t border-white/10 backdrop-blur-xl flex flex-col p-6 shadow-2xl select-none pointer-events-auto z-50"
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-2 z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
             {blueLogo ? <img src={blueLogo} className="w-9 h-9 object-contain filter drop-shadow-md" alt="Blue" /> : <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-white">B</div>}
             <div className="w-[2px] h-6" style={{ backgroundImage: `linear-gradient(to bottom, ${blueColor}, transparent)` }} />
          </div>
          <div className="flex flex-col -mt-1">
            <h2 className="text-[10px] text-amber-500/50 font-bold tracking-[0.3em] uppercase">Gold Advantage</h2>
            {currentGoldDiff > 0 && <span className="text-sm font-sans font-black" style={{ color: blueColor }}>{blueTeamMeta?.tag || "BLUE"} LEADS {formatGoldLabel(currentGoldDiff)}</span>}
          </div>
        </div>

        {currentGoldDiff === 0 && <span className="text-xs font-mono font-bold text-zinc-500 tracking-widest uppercase bg-zinc-900/80 px-3 py-1 rounded border border-white/5">EVEN GOLD</span>}
        
        <div className="flex items-center gap-4 flex-row-reverse text-right">
          <div className="flex flex-col items-center gap-1">
             <div className="w-[2px] h-6" style={{ backgroundImage: `linear-gradient(to top, ${redColor}, transparent)` }} />
             {redLogo ? <img src={redLogo} className="w-9 h-9 object-contain filter drop-shadow-md" alt="Red" /> : <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-white">R</div>}
          </div>
          <div className="flex flex-col -mt-1">
            <h2 className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] uppercase">Match Time: {formattedGameTime}</h2>
            {currentGoldDiff < 0 && <span className="text-sm font-sans font-black" style={{ color: redColor }}>{redTeamMeta?.tag || "RED"} LEADS {formatGoldLabel(currentGoldDiff)}</span>}
          </div>
        </div>
      </div>

      {/* CHART GRAPH */}
      <div className="w-full flex-1 relative mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={renderChartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={gradientOffset} stopColor={blueColor} stopOpacity={0.35} />
                <stop offset={gradientOffset} stopColor={blueColor} stopOpacity={0.00} />
                <stop offset={gradientOffset} stopColor={redColor} stopOpacity={0.00} />
                <stop offset={1} stopColor={redColor} stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={true} horizontal={true} stroke="#ffffff03" strokeDasharray="3 3" />
            
            {/* Trục X lúc này sẽ co giãn hoàn hảo theo maxAxisTime thời gian thực */}
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={[0, maxAxisTime]} 
              ticks={axisTicks} 
              stroke="#ffffff10" 
              tick={{ fontSize: 10, fill: "#52525b", fontFamily: "monospace" }} 
              dy={10} 
            />
            
            <YAxis 
              domain={yAxisDomain}
              ticks={yAxisTicks}
              stroke="#ffffff10"
              tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }}
              tickFormatter={formatGoldLabel}
              width={50}
            />

            <ReferenceLine y={0} stroke="#ffffff25" strokeWidth={1} strokeDasharray="3 3" />
            <Area type="monotone" dataKey="gold" stroke="url(#splitColor)" strokeWidth={2} fill="url(#splitColor)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GoldGraph;