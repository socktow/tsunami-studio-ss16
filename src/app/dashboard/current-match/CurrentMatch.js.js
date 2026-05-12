import React from 'react';
import { RefreshCw, Minus, Plus, ArrowLeftRight } from 'lucide-react';

const CurrentMatch = ({ currentMatch, updateScore, fetchData, handleSwap }) => {
  if (!currentMatch) {
    return (
      <div className="py-20 text-slate-500 italic text-center">
        Không có trận đấu nào đang kích hoạt. Hãy tạo ở tab Setting.
      </div>
    );
  }

  const { tournamentName, matchType, teamsData } = currentMatch;

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 text-white bg-slate-900 rounded-xl shadow-2xl border border-slate-800">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-block px-6 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
          {tournamentName} • {matchType}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Team 1 (Left) - Dùng teamsData[0] */}
        <TeamSection 
          team={teamsData[0]} 
          index={0} 
          updateScore={updateScore} 
          alignment="items-end"
          textColor="text-blue-400"
        />

        {/* Center Controls */}
        <div className="flex flex-col items-center justify-center self-center space-y-6 py-10">
          <div className="text-5xl font-black italic text-slate-700 tracking-tighter select-none">VS</div>
          
          <div className="flex flex-col gap-3 w-full max-w-[150px]">
            {/* Nút SWAP mới */}
            <button 
              onClick={handleSwap}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all duration-200 group"
            >
              <ArrowLeftRight size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Swap Side</span>
            </button>

            {/* Nút REFRESH */}
            <button 
              onClick={fetchData} 
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
            >
              <RefreshCw size={14} /> 
              <span className="text-[10px] font-bold uppercase tracking-wider">Refresh</span>
            </button>
          </div>
        </div>

        {/* Team 2 (Right) - Dùng teamsData[1] */}
        <TeamSection 
          team={teamsData[1]} 
          index={1} 
          updateScore={updateScore} 
          alignment="items-start"
          textColor="text-red-400"
        />
      </div>
    </div>
  );
};

// ... Sub-component TeamSection giữ nguyên như cũ ...
const TeamSection = ({ team, index, updateScore, alignment, textColor }) => {
  const currentScore = team.score || 0;

  return (
    <div className={`flex flex-col ${alignment} space-y-6`}>
      <div className={`flex flex-col ${alignment} gap-3`}>
        <div 
          className="w-28 h-28 rounded-2xl bg-slate-800 flex items-center justify-center p-4 border-b-4 transition-transform hover:scale-105 shadow-lg"
          style={{ borderColor: team.color }}
        >
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-3xl font-bold">{team.tag}</span>
          )}
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">{team.name}</h2>
      </div>

      <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-inner">
        <button 
          onClick={() => updateScore(index, Math.max(0, currentScore - 1))}
          className="p-3 hover:bg-slate-700 rounded-md transition text-slate-400 hover:text-white"
        >
          <Minus size={20} />
        </button>
        <span className={`text-6xl font-mono px-8 font-bold min-w-[120px] text-center ${textColor}`}>
          {currentScore}
        </span>
        <button 
          onClick={() => updateScore(index, currentScore + 1)}
          className="p-3 hover:bg-slate-700 rounded-md transition text-slate-400 hover:text-white"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="w-full space-y-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 mb-3">Lineup</p>
        {team.players?.map((player) => (
          <div 
            key={player.id} 
            className={`flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 border border-transparent hover:border-slate-700 transition ${alignment === 'items-end' ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600 flex-shrink-0">
              <img src={player.avatar} alt={player.nickname} className="w-full h-full object-cover" />
            </div>
            <div className={alignment === 'items-end' ? 'text-right' : 'text-left'}>
              <div className="text-sm font-bold text-slate-200">{player.nickname}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase">{player.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentMatch;