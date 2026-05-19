"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { time: 0, gold: 0 }, { time: 5, gold: 500 }, { time: 10, gold: 1200 },
  { time: 15, gold: 800 }, { time: 20, gold: -300 }, { time: 25, gold: -1500 },
  { time: 30, gold: -2500 }, { time: 35, gold: -1000 }, { time: 40, gold: 500 }
];

const GoldGraph = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-[280px] w-[1360px] h-[280px] bg-[#050507]/95 border-t border-amber-500/20 backdrop-blur-xl flex flex-col p-6 shadow-2xl"
    >
      {/* HEADER & LOGO CONTAINER */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
             <img src="https://245419842-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MX79G1LzC-L-GjX3Q4w%2Fuploads%2FzC3P3FkK3A8C6jZ5bN9f%2FTeam_Liquid_logo.png?alt=media" 
                  className="w-8 h-8 object-contain" alt="Blue Team" />
             <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-transparent" />
          </div>
          <h2 className="text-[10px] text-amber-500/50 font-bold tracking-[0.3em] uppercase -mt-4">Gold Advantage</h2>
        </div>
        
        <div className="flex flex-col items-center gap-1">
           <div className="w-1 h-8 bg-gradient-to-t from-rose-500 to-transparent" />
           <img src="https://images.vnggames.tech/esports/lol/teams/t1.png" 
                className="w-8 h-8 object-contain" alt="Red Team" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor="#3b82f6" stopOpacity={0.5}/>
              <stop offset={0.5} stopColor="#3b82f6" stopOpacity={0}/>
              <stop offset={0.5} stopColor="#f43f5e" stopOpacity={0}/>
              <stop offset={1} stopColor="#f43f5e" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid vertical={true} horizontal={false} stroke="#ffffff05" />
          
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={[0, 40]} 
            ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]} 
            stroke="#ffffff20"
            tick={{ fontSize: 10, fill: "#666" }}
          />
          
          <YAxis hide domain={['auto', 'auto']} />
          
          <ReferenceLine y={0} stroke="#ffffff40" strokeWidth={1} />

          <Area 
            type="stepAfter" 
            dataKey="gold" 
            stroke="#fff" 
            strokeWidth={2}
            fill="url(#splitColor)" 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default GoldGraph;