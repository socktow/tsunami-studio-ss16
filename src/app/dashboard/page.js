"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";
import { 
  Zap, Target, Skull, ShieldAlert, Layers, 
  BarChart3, Power, Cpu, Monitor, EyeOff, RotateCcw 
} from "lucide-react";

const socket = io("http://localhost:3001");

export default function CyberpunkDashboard() {
  const [activeTab, setActiveTab] = useState("ingame");
  const { 
    showOverlay, showTop, showBottom, showLeft, showSkin, 
    activeRankView, lastState, setState 
  } = useOverlayStore();

  useEffect(() => {
    socket.on("init", setState);
    socket.on("state", setState);
    return () => {
      socket.off("init");
      socket.off("state");
    };
  }, [setState]);

  // Hàm gửi dữ liệu lên server thông qua socket
  const update = (data) => {
    socket.emit("update", data);
  };

  // Logic ẩn/hiện toàn bộ overlay (STRIKE_MODE)
  const toggleCombatHideAll = () => {
    if (showTop || showBottom || showLeft || showSkin) {
      // Lưu lại trạng thái hiện tại trước khi ẩn hết
      update({ 
        lastState: { showTop, showBottom, showLeft, showSkin },
        showTop: false, 
        showBottom: false, 
        showLeft: false, 
        showSkin: false 
      });
    } else if (lastState) {
      // Khôi phục lại trạng thái từ lastState
      update({ ...lastState, lastState: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 p-6 font-mono selection:bg-emerald-500 selection:text-black">
      {/* Hiệu ứng Scanline nền */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* HEADER */}
      <header className="relative mb-10 border border-emerald-500/20 bg-emerald-500/[0.02] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/50">
              <Cpu size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                TSUNAMI<span className="text-emerald-500">.OS</span>
              </h1>
              <p className="text-[10px] font-bold text-emerald-500/40 mt-1 uppercase tracking-widest">Broadcast_System_v3.2</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <TabButton label="Ban/Pick" isActive={activeTab === "pregame"} onClick={() => setActiveTab("pregame")} />
            <TabButton label="Ingame" isActive={activeTab === "ingame"} onClick={() => setActiveTab("ingame")} />
            <TabButton label="Post-Game" isActive={activeTab === "endgame"} onClick={() => setActiveTab("endgame")} />
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
        {activeTab === "ingame" ? (
          <IngameView 
            showOverlay={showOverlay} 
            showTop={showTop} 
            showBottom={showBottom} 
            showLeft={showLeft} 
            showSkin={showSkin} 
            activeRankView={activeRankView} 
            lastState={lastState} 
            update={update} 
            toggleCombatHideAll={toggleCombatHideAll} 
          />
        ) : (
          <div className="lg:col-span-12 py-20 flex flex-col items-center justify-center border border-dashed border-emerald-500/20">
            <Monitor size={48} className="text-emerald-500/20 mb-4 animate-pulse" />
            <p className="text-emerald-500/40 text-sm tracking-widest uppercase italic">Module_Standby...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function IngameView({ showOverlay, showTop, showBottom, showLeft, showSkin, activeRankView, lastState, update, toggleCombatHideAll }) {
  // Kiểm tra xem có phải chỉ đang hiện mỗi bảng Top không
  const isTopFocusActive = showTop && !showBottom && !showLeft && !showSkin;

  return (
    <>
      {/* CỘT ĐIỀU KHIỂN BÊN TRÁI */}
      <div className="lg:col-span-4 space-y-6">
        {/* NÚT NGUỒN TỔNG */}
        <button
          onClick={() => update({ showOverlay: !showOverlay })}
          className={`w-full py-8 border-2 transition-all duration-500 relative group ${
            showOverlay 
              ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]" 
              : "bg-zinc-950 border-zinc-800 text-zinc-500"
          }`}
        >
          <Power className={`absolute top-2 right-2 ${showOverlay ? "animate-pulse" : ""}`} size={16} />
          <span className="text-xl font-black italic tracking-widest uppercase">
            {showOverlay ? "SYSTEM_ONLINE" : "INITIATE_LINK"}
          </span>
        </button>

        {/* CÁC MODULE CON */}
        <div className="border border-emerald-500/10 bg-zinc-950/40 p-5">
          <h2 className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Layers size={12} /> Elements_Control
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <CyberButton label="Scoreboard (Top)" active={showTop} onClick={() => update({ showTop: !showTop })} icon={<Target size={14}/>} />
            <CyberButton label="Rankings (Left)" active={showLeft} onClick={() => update({ showLeft: !showLeft })} icon={<BarChart3 size={14}/>} />
            <CyberButton label="KDA Stats (Bottom)" active={showBottom} onClick={() => update({ showBottom: !showBottom })} icon={<Skull size={14}/>} />
            <CyberButton label="Skin Spotlight" active={showSkin} onClick={() => update({ showSkin: !showSkin })} icon={<Zap size={14}/>} color="amber" />
          </div>
        </div>

        {/* TACTICAL OVERRIDES */}
        <div className="border border-orange-500/20 bg-orange-500/[0.02] p-5">
           <h2 className="text-[10px] font-black text-orange-500/40 uppercase tracking-[0.3em] mb-4">Tactical_Override</h2>
           <div className="space-y-3">
              <button 
                onClick={() => update({ showTop: true, showBottom: false, showLeft: false, showSkin: false })}
                className={`w-full py-4 text-xs font-black transition-all border ${
                    isTopFocusActive ? "bg-orange-500 text-black shadow-lg" : "border-orange-500/30 text-orange-500/60 hover:bg-orange-500/10"
                }`}
              >
                {isTopFocusActive ? "[ACTIVE] TOP_ONLY_MODE" : "FORCE_TOP_FOCUS"}
              </button>
              
              <button 
                onClick={toggleCombatHideAll}
                className={`w-full py-4 text-xs font-black transition-all border border-dashed ${
                  (!showTop && !showBottom && !showLeft && !showSkin && lastState) 
                  ? "bg-white text-black border-white" 
                  : "border-orange-500/20 text-orange-500/40 hover:border-orange-500"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                    <EyeOff size={14} />
                    {(!showTop && !showBottom && !showLeft && !showSkin && lastState) ? "RESTORE_INTERFACE" : "STRIKE_MODE (HIDE_UI)"}
                </div>
              </button>
           </div>
        </div>
      </div>

      {/* CỘT DỮ LIỆU CHI TIẾT BÊN PHẢI */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-emerald-500/10 bg-zinc-950/40 p-6 relative">
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
               <BarChart3 size={16} className="text-emerald-500" /> Comparison_Engine
            </h2>
            <div className="space-y-3">
               <RankOption label="Gold_Difference" active={activeRankView === 'gold'} onClick={() => update({ activeRankView: 'gold', showLeft: true })} />
               <RankOption label="XP_Performance" active={activeRankView === 'xp'} onClick={() => update({ activeRankView: 'xp', showLeft: true })} />
            </div>
          </div>

          <div className="border border-emerald-500/5 bg-emerald-500/[0.01] p-6 opacity-40 grayscale flex flex-col justify-center items-center text-center">
            <ShieldAlert size={24} className="mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI_Predictor</span>
            <span className="text-[8px] opacity-50 mt-1 italic">Under_Development...</span>
          </div>
        </div>

        {/* DANGER ZONE - EMERGENCY RESET */}
        <div className="mt-12 bg-rose-500/5 border border-rose-500/20 p-8 flex items-center justify-between group hover:border-rose-500 transition-all">
          <div>
            <h3 className="text-rose-500 font-black italic tracking-widest uppercase flex items-center gap-2">
                <RotateCcw size={16} /> Emergency_Purge
            </h3>
            <p className="text-[10px] text-rose-500/40 mt-1 uppercase">Kill all active layers and reset global state</p>
          </div>
          <button 
            onClick={() => update({ showTop: false, showBottom: false, showLeft: false, showSkin: false, lastState: null })}
            className="px-6 py-3 bg-rose-500/20 border border-rose-500 text-rose-500 text-xs font-black hover:bg-rose-500 hover:text-black transition-all"
          >
            EXECUTE_RESET
          </button>
        </div>
      </div>
    </>
  );
}

// --- CÁC COMPONENT GIAO DIỆN NHỎ ---

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] border ${
        isActive 
          ? "bg-emerald-500 text-black border-emerald-500" 
          : "bg-transparent text-emerald-500/40 border-emerald-500/10 hover:text-emerald-500"
      }`}
    >
      <span className="inline-block skew-x-[12deg]">{label}</span>
    </button>
  );
}

function CyberButton({ label, active, onClick, icon, color = "emerald" }) {
  const themes = {
    emerald: active ? "border-emerald-500 bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-emerald-500/20 text-emerald-500/40",
    amber: active ? "border-amber-500 bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-amber-500/20 text-amber-500/40"
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 border transition-all ${themes[color]} hover:border-white/50 active:scale-95 font-mono`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[11px] font-black uppercase tracking-tighter italic">{label}</span>
      </div>
      <div className={`h-1.5 w-1.5 ${active ? "bg-zinc-950 animate-pulse" : "bg-current opacity-20"}`} />
    </button>
  );
}

function RankOption({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border transition-all ${
        active ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-1 h-4 ${active ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-800"}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${active ? "text-white" : "text-zinc-600"}`}>
          {label}
        </span>
      </div>
      {active && <span className="text-[9px] font-black text-emerald-500 animate-pulse">LIVE_SYNC</span>}
    </button>
  );
}