"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";
import {
  Activity, Swords, Award, TrendingUp, Flame, Shield, 
  Layers, Power, Terminal, EyeOff, RefreshCw, Lock, CheckCircle2
} from "lucide-react";

const socket = io("http://localhost:3001");

export default function MinimalistDashboard() {
  const [activeTab, setActiveTab] = useState("ingame");
  const {
    showOverlay, showTop, showBottom, showLeft, showSkin, showplayercard, showplayerRunes,
    showGoldGraph, showkillfeedcustom, activeRankView, lastState, setState
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
    const isAnyActive = showTop || showBottom || showLeft || showSkin || showplayercard || showplayerRunes || showGoldGraph || showkillfeedcustom;
    
    if (isAnyActive) {
      update({
        lastState: { showTop, showBottom, showLeft, showSkin, showplayercard, showplayerRunes, showGoldGraph, showkillfeedcustom },
        showTop: false,
        showBottom: false,
        showLeft: false,
        showSkin: false,
        showplayercard: false,
        showplayerRunes: false,
        showGoldGraph: false,
        showkillfeedcustom: false
      });
    } else if (lastState) {
      update({ ...lastState, lastState: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-200 p-6 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900">
      <header className="mb-8 border border-slate-800/60 bg-[#161f2c] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shadow-inner">
            <Activity size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase leading-none">
              TSUNAMI<span className="text-cyan-400 font-medium">.ENGINE</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">Broadcast Hub v4.0</p>
          </div>
        </div>

        <nav className="flex bg-[#0b0f17] p-1.5 rounded-xl border border-slate-800/80">
          <TabButton label="PRE-GAME" isActive={activeTab === "pregame"} onClick={() => setActiveTab("pregame")} />
          <TabButton label="IN-GAME" isActive={activeTab === "ingame"} onClick={() => setActiveTab("ingame")} />
          <TabButton label="POST-GAME" isActive={activeTab === "endgame"} onClick={() => setActiveTab("endgame")} />
        </nav>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === "ingame" ? (
          <IngameView
            showOverlay={showOverlay}
            showTop={showTop}
            showBottom={showBottom}
            showLeft={showLeft}
            showSkin={showSkin}
            showplayercard={showplayercard}
            showplayerRunes={showplayerRunes}
            showGoldGraph={showGoldGraph}
            showkillfeedcustom={showkillfeedcustom}
            activeRankView={activeRankView}
            lastState={lastState}
            update={update}
            toggleCombatHideAll={toggleCombatHideAll}
          />
        ) : (
          <div className="lg:col-span-12 py-28 flex flex-col items-center justify-center bg-[#161f2c] border border-slate-800/40 rounded-2xl shadow-inner">
            <Terminal size={36} className="text-slate-600 mb-4 animate-bounce" />
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Module Standby Mode</p>
          </div>
        )}
      </main>
    </div>
  );
}

function IngameView({
  showOverlay, showTop, showBottom, showLeft, showSkin, showplayercard, 
  showplayerRunes, showGoldGraph, showkillfeedcustom, activeRankView, lastState, update, toggleCombatHideAll
}) {
  const isInterfaceHidden = !showTop && !showBottom && !showLeft && !showSkin && !showplayercard && !showplayerRunes && !showGoldGraph && !showkillfeedcustom && lastState;

  return (
    <>
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => update({ showOverlay: !showOverlay })}
            className={`md:col-span-2 p-5 border rounded-xl transition-all duration-300 flex items-center justify-between relative group overflow-hidden shadow-lg ${
              showOverlay ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-cyan-950/50" : "bg-[#161f2c] border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="flex flex-col text-left z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Main Stream Link</span>
              <span className="text-md font-black tracking-wide mt-1">{showOverlay ? "CORE ONLINE" : "CORE DISCONNECTED"}</span>
            </div>
            <Power size={22} className={showOverlay ? "text-white animate-pulse" : "text-slate-600"} />
          </button>

          <button
            onClick={toggleCombatHideAll}
            className={`p-5 text-xs font-bold rounded-xl transition-all border flex flex-col justify-center items-center gap-2 shadow-lg ${
              isInterfaceHidden ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-[#161f2c] border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <EyeOff size={18} />
            <span className="tracking-wider uppercase text-[10px]">{isInterfaceHidden ? "RESTORE UI" : "STRIKE MODE"}</span>
          </button>
        </div>

        <div className="border border-slate-800 bg-[#161f2c] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
              <Layers size={14} className="text-cyan-400" /> Overlay Elements Registry
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <CyberButton label="Scoreboard (Top)" active={showTop} onClick={() => update({ showTop: !showTop })} icon={<Swords size={16} />} />
            <CyberButton label="Rankings (Left)" active={showLeft} onClick={() => update({ showLeft: !showLeft })} icon={<Award size={16} />} />
            <CyberButton label="KDA Stats (Bottom)" active={showBottom} onClick={() => update({ showBottom: !showBottom, ...(!showBottom && { showplayerRunes: false }) })} icon={<Flame size={16} />} />
            <CyberButton label="Custom Killfeed" active={showkillfeedcustom} onClick={() => update({ showkillfeedcustom: !showkillfeedcustom })} icon={<Shield size={16} />} theme="cyan" />
            <CyberButton label="Player Cards" active={showplayercard} onClick={() => update({ showplayercard: !showplayercard, ...(!showplayercard && { showplayerRunes: false }) })} icon={<Layers size={16} />} />
            <CyberButton label="Player Runes" active={showplayerRunes} onClick={() => update({ showplayerRunes: !showplayerRunes, ...(!showplayerRunes && { showBottom: false, showplayercard: false }) })} icon={<Terminal size={16} />} />
            <div className="sm:col-span-2 my-1 border-t border-slate-800/60" />
            <CyberButton label="Gold Graph" active={showGoldGraph} onClick={() => update({ showGoldGraph: !showGoldGraph })} icon={<TrendingUp size={16} />} theme="amber" />
            <CyberButton label="Skin Spotlight" active={showSkin} onClick={() => update({ showSkin: !showSkin })} icon={<Flame size={16} />} theme="purple" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="border border-slate-800 bg-[#161f2c] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2.5">
            <TrendingUp size={14} className="text-cyan-400" /> Analytical Engines
          </h2>
          <div className="space-y-3">
            <RankOption label="Net Worth / Gold Delta" active={activeRankView === 'gold'} onClick={() => update({ activeRankView: 'gold', showLeft: true })} />
            <RankOption label="Experience Performance" active={activeRankView === 'xp'} onClick={() => update({ activeRankView: 'xp', showLeft: true })} />
            <RankOption label="Creep Score Dynamics" active={activeRankView === 'cs'} onClick={() => { }} disabled={true} />
            <RankOption label="Active Objective Quests" active={activeRankView === 'quest'} onClick={() => { }} disabled={true} />
          </div>
        </div>

        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 shadow-lg">
          <h3 className="text-red-400 text-xs font-black tracking-widest uppercase flex items-center gap-2">
            <RefreshCw size={14} /> Safety Override Purge
          </h3>
          <button
            onClick={() => update({ showTop: false, showBottom: false, showLeft: false, showSkin: false, showplayercard: false, showplayerRunes: false, showGoldGraph: false, showkillfeedcustom: false, lastState: null })}
            className="w-full mt-4 py-3 bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all"
          >
            Force Purge System
          </button>
        </div>
      </div>
    </>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-[10px] font-black tracking-wider rounded-lg transition-all ${isActive ? "bg-cyan-500 text-slate-950" : "bg-transparent text-slate-500 hover:text-slate-300"}`}>
      {label}
    </button>
  );
}

function CyberButton({ label, active, onClick, icon, theme = "cyan" }) {
  const themes = {
    cyan: "border-cyan-500 bg-cyan-500/10 text-cyan-400",
    amber: "border-amber-500 bg-amber-500/10 text-amber-400",
    purple: "border-purple-500 bg-purple-500/10 text-purple-400"
  };
  return (
    <button onClick={onClick} className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-xs font-bold ${active ? themes[theme] : "border-slate-800 bg-[#0b0f17] text-slate-400 hover:border-slate-700"}`}>
      <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
      <div className={`h-1.5 w-1.5 rounded-full ${active ? "bg-current" : "bg-slate-800"}`} />
    </button>
  );
}

function RankOption({ label, active, onClick, disabled = false }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs font-bold ${disabled ? "border-dashed border-slate-800 bg-slate-900/30 text-slate-600" : active ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-400" : "border-slate-800 bg-[#0b0f17] text-slate-400"}`}>
      <div className="flex items-center gap-3">{disabled ? <Lock size={12} /> : <div className={`w-1 h-3.5 rounded-full ${active ? "bg-cyan-400" : "bg-slate-700"}`} />}<span>{label}</span></div>
      {active && !disabled && <span className="text-[9px] font-black text-cyan-400">LIVE</span>}
      {disabled && <span className="text-[9px] font-black text-slate-600 uppercase">LOCKED</span>}
    </button>
  );
}