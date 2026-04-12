"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";

const socket = io("http://localhost:3001");

export default function Dashboard() {
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

  const update = (data) => {
    socket.emit("update", data);
  };

  const toggleCombatHideAll = () => {
    if (showTop || showBottom || showLeft || showSkin) {
      update({ 
        lastState: { showTop, showBottom, showLeft, showSkin },
        showTop: false, showBottom: false, showLeft: false, showSkin: false 
      });
    } else if (lastState) {
      update({ ...lastState, lastState: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-8 font-sans">
      
      {/* HEADER & TAB NAVIGATION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              VCS <span className="text-indigo-600">STUDIO</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live Broadcast Workflow</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <div className={`h-2.5 w-2.5 rounded-full ${showOverlay ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              {showOverlay ? 'System Live' : 'System Standby'}
            </span>
          </div>
        </div>

        {/* TABS MENU */}
        <div className="flex px-6 bg-slate-50/50">
          <TabButton label="Pre-game (Ban/Pick)" isActive={activeTab === "pregame"} onClick={() => setActiveTab("pregame")} />
          <TabButton label="Ingame Control" isActive={activeTab === "ingame"} onClick={() => setActiveTab("ingame")} />
          <TabButton label="End-of-Game" isActive={activeTab === "endgame"} onClick={() => setActiveTab("endgame")} />
        </div>
      </div>

      {/* RENDER CONTENT BASED ON TAB */}
      <div className="transition-all duration-300">
        {activeTab === "ingame" && (
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
        )}
        
        {activeTab === "pregame" && <DevelopmentPlaceholder title="Ban/Pick Phase" description="Hệ thống điều khiển cấm chọn, hiển thị tướng và tỷ lệ thắng của tuyển thủ." icon="🎮" color="indigo" />}
        
        {activeTab === "endgame" && <DevelopmentPlaceholder title="Post-Game Analysis" description="Bảng tổng kết thông số trận đấu, biểu đồ sát thương và vinh danh MVP." icon="🏆" color="emerald" />}
      </div>
    </div>
  );
}

// --- TRANG MẪU ĐANG PHÁT TRIỂN ---
function DevelopmentPlaceholder({ title, description, icon, color }) {
  const colors = {
    indigo: "bg-indigo-600 shadow-indigo-200",
    emerald: "bg-emerald-600 shadow-emerald-200"
  };

  return (
    <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200/60 min-h-[500px] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
      <div className={`w-24 h-24 ${colors[color]} rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl mb-8 animate-bounce`}>
        {icon}
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
        {description}
      </p>
      
      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 opacity-20 select-none pointer-events-none">
        <div className="h-32 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center font-bold">WIDGET_L</div>
        <div className="h-32 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center font-bold">WIDGET_R</div>
        <div className="h-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 col-span-2 flex items-center justify-center font-bold">BOTTOM_DOCK</div>
      </div>
      
      <div className="mt-12 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
        Feature under construction
      </div>
    </div>
  );
}

// --- INGAME VIEW COMPONENT ---
function IngameView({ showOverlay, showTop, showBottom, showLeft, showSkin, activeRankView, lastState, update, toggleCombatHideAll }) {
  
  // Logic kiểm tra xem có đang ở chế độ "Chỉ hiện Top" hay không
  const isNormalCombatActive = showTop && !showBottom && !showLeft && !showSkin;

  const handleNormalCombatToggle = () => {
    if (isNormalCombatActive) {
      // Nếu đang bật -> Tắt đi và MỞ LẠI Bottom KDA
      update({ 
        showTop: true, 
        showBottom: true, 
        showLeft: false, 
        showSkin: false 
      });
    } else {
      // Nếu chưa bật -> Bật chế độ chỉ hiện Top
      update({ 
        showTop: true, 
        showBottom: false, 
        showLeft: false, 
        showSkin: false 
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/50">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Master Control</h2>
          <button
            onClick={() => update({ showOverlay: !showOverlay })}
            className={`w-full py-5 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-3 mb-6 shadow-sm ${
              showOverlay 
                ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-lg"
            }`}
          >
            {showOverlay ? "STOP BROADCAST" : "START BROADCAST"}
          </button>
          <div className="space-y-3">
            <ControlButton label="Top Scoreboard" active={showTop} onClick={() => update({ showTop: !showTop })} color="indigo" />
            <ControlButton label="Left Ranking" active={showLeft} onClick={() => update({ showLeft: !showLeft })} color="indigo" />
            <ControlButton label="Bottom KDA" active={showBottom} onClick={() => update({ showBottom: !showBottom })} color="indigo" />
            <ControlButton label="Skin Preview" active={showSkin} onClick={() => update({ showSkin: !showSkin })} color="pink" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-3xl shadow-sm border border-orange-100">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 mb-6">Combat Mode</h2>
          <div className="space-y-3">
            <button 
              onClick={handleNormalCombatToggle}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all border-2 shadow-sm ${
                isNormalCombatActive
                  ? "bg-orange-500 border-orange-500 text-white" 
                  : "bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
              }`}
            >
              {isNormalCombatActive ? "Normal Combat (Active)" : "Normal Combat (Top Only)"}
            </button>
            <button 
              onClick={toggleCombatHideAll}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all border-2 ${
                (!showTop && !showBottom && !showLeft && !showSkin && lastState)
                ? "bg-orange-500 border-orange-500 text-white shadow-lg"
                : "bg-white border-dashed border-orange-200 text-orange-400 hover:border-orange-400"
              }`}
            >
              {(!showTop && !showBottom && !showLeft && !showSkin && lastState) ? "RESTORE PANELS" : "COMBAT VIEW (HIDE ALL)"}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/50">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Data Visualization</h2>
            <div className="space-y-4">
              <button
                onClick={() => update({ activeRankView: 'gold', showLeft: true })}
                className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between border-2 ${
                  activeRankView === 'gold' && showLeft
                    ? "bg-amber-50 border-amber-200 text-amber-700" 
                    : "bg-white border-slate-50 text-slate-400 hover:border-slate-100"
                }`}
              >
                <span>Gold Comparison</span>
                <span className="text-[10px] font-mono opacity-60 px-2 py-1 bg-slate-100 rounded">LIVE</span>
              </button>
              <button
                onClick={() => update({ activeRankView: 'xp', showLeft: true })}
                className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between border-2 ${
                  activeRankView === 'xp' && showLeft
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                    : "bg-white border-slate-50 text-slate-400 hover:border-slate-100"
                }`}
              >
                <span>Experience (XP)</span>
                <span className="text-[10px] font-mono opacity-60 px-2 py-1 bg-slate-100 rounded">LIVE</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 border-dashed relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm border text-[10px] font-bold text-slate-400 uppercase">Coming Soon</span>
            </div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 opacity-50">Advanced Graphs</h2>
            <div className="space-y-3 opacity-30">
              <div className="w-full p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold">Gold Graph</span>
                <div className="w-4 h-4 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 flex items-center justify-between">
          <div className="max-w-md">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">Emergency Reset</h2>
            <p className="text-slate-400 text-sm">Xóa toàn bộ các panel đang hiển thị ngay lập tức.</p>
          </div>
          <button 
            onClick={() => update({ showTop: false, showBottom: false, showLeft: false, showSkin: false, lastState: null })}
            className="px-8 py-4 bg-white/10 border border-white/10 rounded-2xl text-white text-sm font-black hover:bg-rose-500 hover:border-rose-500 transition-all shadow-lg"
          >
            CLEAR ALL PANELS
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-8 py-4 text-xs font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
        isActive 
          ? "text-indigo-600 border-indigo-600 bg-white" 
          : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-100/50"
      }`}
    >
      {label}
    </button>
  );
}

function ControlButton({ label, active, onClick, color }) {
  const activeStyles = {
    indigo: "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm",
    pink: "border-pink-500 bg-pink-50 text-pink-700 shadow-sm",
  };
  const dotColors = { indigo: "bg-indigo-600", pink: "bg-pink-500" };

  return (
    <button onClick={onClick} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all border-2 active:scale-[0.98] w-full ${active ? activeStyles[color] || activeStyles.indigo : "bg-white border-slate-50 text-slate-400 hover:border-slate-200"}`}>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      <div className={`h-4 w-4 rounded-full border-4 border-white shadow-sm transition-all ${active ? dotColors[color] || dotColors.indigo : "bg-slate-200"}`} />
    </button>
  );
}