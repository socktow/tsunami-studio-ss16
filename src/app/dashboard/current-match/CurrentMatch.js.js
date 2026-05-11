import React from 'react';
import { RefreshCw } from 'lucide-react';

const CurrentMatch = ({ currentMatch, updateScore, fetchData }) => {
  if (!currentMatch) {
    return <div className="py-20 text-slate-500 italic text-center">Không có trận đấu nào đang kích hoạt. Hãy tạo ở tab Setting.</div>;
  }

  return (
    <div className="space-y-8 text-center">
      <div className="inline-block px-4 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider">
        {currentMatch.tournamentName} • {currentMatch.matchType}
      </div>
      
      <div className="flex justify-around items-center">
        {/* Team 1 */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold border-4" 
               style={{ borderColor: currentMatch.teamsData[0].color }}>
            {currentMatch.teamsData[0].tag}
          </div>
          <h2 className="text-xl font-bold">{currentMatch.teamsData[0].name}</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => updateScore(0, Math.max(0, currentMatch.teamsData[0].score - 1))} className="p-2 bg-slate-700 rounded hover:bg-slate-600">-</button>
            <span className="text-5xl font-mono text-blue-500">{currentMatch.teamsData[0].score}</span>
            <button onClick={() => updateScore(0, currentMatch.teamsData[0].score + 1)} className="p-2 bg-slate-700 rounded hover:bg-slate-600">+</button>
          </div>
        </div>

        <div className="text-4xl font-black italic text-slate-600">VS</div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold border-4" 
               style={{ borderColor: currentMatch.teamsData[1].color }}>
            {currentMatch.teamsData[1].tag}
          </div>
          <h2 className="text-xl font-bold">{currentMatch.teamsData[1].name}</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => updateScore(1, Math.max(0, currentMatch.teamsData[1].score - 1))} className="p-2 bg-slate-700 rounded hover:bg-slate-600">-</button>
            <span className="text-5xl font-mono text-red-500">{currentMatch.teamsData[1].score}</span>
            <button onClick={() => updateScore(1, currentMatch.teamsData[1].score + 1)} className="p-2 bg-slate-700 rounded hover:bg-slate-600">+</button>
          </div>
        </div>
      </div>
      
      <button onClick={fetchData} className="mt-4 flex items-center gap-2 mx-auto text-slate-400 hover:text-white transition">
        <RefreshCw size={14} /> Refresh Data
      </button>
    </div>
  );
};

export default CurrentMatch;