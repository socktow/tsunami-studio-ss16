"use client";
import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";

const socket = io("http://localhost:3001");

export default function Dashboard() {
  const { showOverlay, showTop, showBottom, showLeft, setState, gameData } = useOverlayStore();

  useEffect(() => {
    socket.on("init", setState);
    socket.on("state", setState);
    return () => {
      socket.off("init");
      socket.off("state");
    };
  }, [setState]);

  const update = (data) => {
    socket.emit("update", data);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-zinc-100 p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">VCS BROADCAST <span className="text-blue-500">CONTROL</span></h1>
          <p className="text-zinc-500 text-sm">Quản lý hiển thị Overlay thời gian thực</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full animate-pulse ${showOverlay ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Status: {showOverlay ? 'Live' : 'Standby'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SECTION 1: MASTER CONTROLS */}
        <div className="bg-[#161925] p-6 rounded-xl border border-white/5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">Master Switches</h2>
          
          <button
            onClick={() => update({ showOverlay: !showOverlay })}
            className={`w-full py-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              showOverlay ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white" 
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            }`}
          >
            {showOverlay ? "DISABLE ALL OVERLAY" : "ENABLE ALL OVERLAY"}
          </button>

          <div className="grid grid-cols-1 gap-3 pt-2">
            <ControlButton 
              label="Top Scoreboard" 
              active={showTop} 
              onClick={() => update({ showTop: !showTop })}
              color="green"
            />
            <ControlButton 
              label="Objective Panel (Left)" 
              active={showLeft} 
              onClick={() => update({ showLeft: !showLeft })}
              color="orange"
            />
            <ControlButton 
              label="Bottom Panel" 
              active={showBottom} 
              onClick={() => update({ showBottom: !showBottom })}
              color="purple"
            />
          </div>
        </div>

        {/* SECTION 2: MATCH DATA (Sửa điểm Bo3/Bo5) */}
        <div className="bg-[#161925] p-6 rounded-xl border border-white/5 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-yellow-500 mb-6">Series Score Control</h2>
          
          <div className="space-y-8">
            {/* Team Blue */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Blue Team</p>
                <p className="text-xl font-black text-blue-400">T1</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreBtn label="-" onClick={() => {}} />
                <span className="text-3xl font-mono font-black w-8 text-center">2</span>
                <ScoreBtn label="+" onClick={() => {}} />
              </div>
            </div>

            <div className="h-[1px] bg-white/5 w-full" />

            {/* Team Red */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Red Team</p>
                <p className="text-xl font-black text-red-500">BLG</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreBtn label="-" onClick={() => {}} />
                <span className="text-3xl font-mono font-black w-8 text-center">1</span>
                <ScoreBtn label="+" onClick={() => {}} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: QUICK ACTIONS */}
        <div className="bg-[#161925] p-6 rounded-xl border border-white/5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Quick Presets</h2>
          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all text-left px-4">
            🎬 Intro Scene (Hide All)
          </button>
          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all text-left px-4">
            🎮 In-Game Standard
          </button>
          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all text-left px-4">
            🏆 Post-Game Analysis
          </button>
        </div>

      </div>
    </div>
  );
}

// Sub-components cho giao diện gọn gàng
function ControlButton({ label, active, onClick, color }) {
  const colors = {
    green: active ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "bg-zinc-800",
    orange: active ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-800",
    purple: active ? "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]" : "bg-zinc-800",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all border border-white/5 hover:scale-[1.02] active:scale-95 ${active ? 'bg-zinc-800/50' : 'bg-zinc-900/30'}`}
    >
      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</span>
      <div className={`h-3 w-3 rounded-full ${colors[color]} transition-all`} />
    </button>
  );
}

function ScoreBtn({ label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold hover:bg-white/20 active:bg-blue-600 transition-all"
    >
      {label}
    </button>
  );
}