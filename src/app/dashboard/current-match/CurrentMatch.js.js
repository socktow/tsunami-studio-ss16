"use client";
import React from 'react';
import { 
  ArrowLeftRight, 
  RefreshCw, 
  Minus, 
  Plus, 
  Trophy,
  User,
  Activity
} from 'lucide-react';

const CurrentMatch = ({ currentMatch, updateScore, fetchData, handleSwap }) => {
  if (!currentMatch) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
        <Activity size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-500 italic font-mono text-sm uppercase tracking-widest">
          No Active Session Detected
        </p>
      </div>
    );
  }

  const { tournamentName, matchType, teamsData } = currentMatch;

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
            {tournamentName} • {matchType}
          </span>
        </div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter sm:text-5xl">
          Live <span className="text-blue-500">Control</span> Panel
        </h1>
      </div>

      {/* Main Grid: Team 1 - VS - Team 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Team 1 Section */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <TeamPanel 
            team={teamsData[0]} 
            index={0} 
            updateScore={updateScore} 
            isRight={false} 
          />
        </div>

        {/* Central Control Section */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center space-y-8">
          <div className="relative">
            <span className="text-9xl font-black italic opacity-5 text-white select-none">VS</span>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-16 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full max-w-[240px]">
            <button 
              onClick={handleSwap}
              className="group flex items-center justify-center gap-3 h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              <ArrowLeftRight size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Swap Sides
            </button>
            <button 
              onClick={fetchData}
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <RefreshCw size={14} />
              Sync Engine
            </button>
          </div>
        </div>

        {/* Team 2 Section */}
        <div className="lg:col-span-4 order-3">
          <TeamPanel 
            team={teamsData[1]} 
            index={1} 
            updateScore={updateScore} 
            isRight={true} 
          />
        </div>
      </div>
    </div>
  );
};

const TeamPanel = ({ team, index, updateScore, isRight }) => {
  const score = team.score || 0;

  return (
    <div className={`flex flex-col ${isRight ? 'lg:items-start' : 'lg:items-end'} space-y-8`}>
      {/* Identity */}
      <div className={`flex flex-col ${isRight ? 'items-start' : 'items-end'} gap-4 w-full`}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black border border-slate-800 p-4 rounded-2xl inline-block shadow-2xl">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
            ) : (
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center font-black text-2xl"
                style={{ backgroundColor: `${team.color}22`, color: team.color, border: `2px solid ${team.color}` }}
              >
                {team.tag || "T2"}
              </div>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate max-w-full">
          {team.name}
        </h2>
      </div>

      {/* Score Controller */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-2 flex items-center justify-between shadow-inner">
        <button 
          onClick={() => updateScore(index, Math.max(0, score - 1))}
          className="p-4 text-slate-500 hover:text-rose-500 transition-colors active:scale-90"
        >
          <Minus size={24} strokeWidth={3} />
        </button>
        
        <div className="text-center">
          <span className="text-7xl font-mono font-black text-white tracking-tighter">
            {score}
          </span>
        </div>

        <button 
          onClick={() => updateScore(index, score + 1)}
          className="p-4 text-slate-500 hover:text-emerald-500 transition-colors active:scale-90"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Lineup */}
      <div className="w-full">
        <div className={`flex items-center gap-2 mb-4 text-slate-600 ${!isRight ? 'justify-end' : ''}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Lineup</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>
        
        <div className="grid grid-cols-1 gap-2 w-full">
          {team.players?.map((p, pIdx) => (
            <div 
              key={pIdx} 
              className={`flex items-center gap-3 p-2 bg-slate-900/40 border border-slate-800/50 rounded-xl hover:bg-slate-800/50 transition-all ${!isRight ? 'flex-row-reverse text-right' : ''}`}
            >
              <div className="relative">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.nickname} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 font-bold text-xs truncate uppercase tracking-wide">{p.nickname}</p>
                <p className="text-[9px] font-black uppercase" style={{ color: team.color }}>{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentMatch;