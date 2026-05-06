"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, Eye, ArrowLeftRight, 
  Save, Shield, ChevronRight, AlertCircle, User
} from "lucide-react";

const MOCK_TOURNAMENTS = [
  { id: 1, name: "VCS 2024 SUMMER", teamIds: [1, 2] },
  { id: 2, name: "WORLD CHAMPIONSHIP 2024", teamIds: [1, 3] },
];

const MOCK_TEAMS = [
  { id: 1, name: "GAM ESPORTS", tag: "GAM", logo: "https://upload.wikimedia.org/wikipedia/en/3/37/GAM_Esports_logo.png", players: ["Kiaya", "Levi", "Emo", "EasyLove", "Elio", "Pyshiro"] },
  { id: 2, name: "VIKING ESPORTS", tag: "VKE", logo: "https://upload.wikimedia.org/wikipedia/en/c/c6/Viking_Esports_logo.png", players: ["Nanaue", "Gury", "Kati", "Shogun", "Bie", "Tomrio"] },
  { id: 3, name: "T1", tag: "T1", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/T1_logo.svg/1200px-T1_logo.svg.png", players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria", "Rekkles"] },
];

const POSITIONS = ["TOP", "JNG", "MID", "ADC", "SUP"];

const CurrentMatchSetting = () => {
  const [activeTab, setActiveTab] = useState("setting");
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [matchConfig, setMatchConfig] = useState({
    mode: "Bo3",
    teamA: { id: null, score: 0, players: Array(5).fill("") },
    teamB: { id: null, score: 0, players: Array(5).fill("") },
  });

  const filteredTeams = useMemo(() => {
    if (!selectedTournamentId) return [];
    const tournament = MOCK_TOURNAMENTS.find(t => t.id === parseInt(selectedTournamentId));
    return MOCK_TEAMS.filter(team => tournament?.teamIds.includes(team.id));
  }, [selectedTournamentId]);

  const handleSwap = () => {
    setMatchConfig(prev => ({
      ...prev,
      teamA: prev.teamB,
      teamB: prev.teamA,
    }));
  };

  const updateTeam = (side, teamId) => {
    const team = MOCK_TEAMS.find(t => t.id === parseInt(teamId));
    setMatchConfig(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        id: team ? team.id : null,
        players: team ? team.players.slice(0, 5) : Array(5).fill("")
      }
    }));
  };

  const updatePlayer = (side, posIndex, playerName) => {
    setMatchConfig(prev => {
      const newPlayers = [...prev[side].players];
      newPlayers[posIndex] = playerName;
      return {
        ...prev,
        [side]: { ...prev[side], players: newPlayers }
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 border-b border-emerald-500/20 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Match_<span className="text-emerald-500">Controller</span>
            </h1>
            <p className="text-[10px] opacity-50 tracking-[0.4em] uppercase mt-1">Live_Broadcasting_System_v1.0</p>
          </div>
          
          <div className="flex bg-emerald-500/5 p-1 border border-emerald-500/20">
            {["setting", "preview"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase italic transition-all ${activeTab === tab ? 'bg-emerald-500 text-black' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
              >
                {tab === 'setting' ? <Settings2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {tab === 'setting' ? 'Configuration' : 'Live_Preview'}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "setting" ? (
            <motion.div key="setting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              
              {/* Step 1: Tournament */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-500/5 p-6 border border-emerald-500/10">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-black opacity-40 italic flex items-center gap-2">
                    <Shield className="w-3 h-3" /> 01. Select_Tournament
                  </label>
                  <select 
                    value={selectedTournamentId}
                    onChange={(e) => {
                        setSelectedTournamentId(e.target.value);
                        updateTeam('teamA', null);
                        updateTeam('teamB', null);
                    }}
                    className="w-full bg-black border border-emerald-500/20 p-4 text-white focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="">-- CHOOSE TOURNAMENT --</option>
                    {MOCK_TOURNAMENTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black opacity-40 italic">02. Match_Format</label>
                  <div className="flex gap-1 h-[58px]">
                    {["Bo1", "Bo3", "Bo5"].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMatchConfig({...matchConfig, mode: m})}
                        className={`flex-1 text-xs font-black border transition-all ${matchConfig.mode === m ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-emerald-500/20 text-white/40 hover:border-emerald-500/50'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Team Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40 italic text-blue-400">03. Blue_Side_Entity</label>
                    <select 
                      value={matchConfig.teamA.id || ""}
                      disabled={!selectedTournamentId}
                      onChange={(e) => updateTeam('teamA', e.target.value)}
                      className="w-full bg-black border border-blue-500/30 p-4 text-white outline-none disabled:opacity-20 transition-all focus:border-blue-500"
                    >
                      <option value="">-- SELECT TEAM --</option>
                      {filteredTeams.map(t => <option key={t.id} value={t.id} disabled={matchConfig.teamB.id === t.id}>{t.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2 text-right">
                    <label className="text-[10px] uppercase font-black opacity-40 italic text-red-400">04. Red_Side_Entity</label>
                    <select 
                      value={matchConfig.teamB.id || ""}
                      disabled={!selectedTournamentId}
                      onChange={(e) => updateTeam('teamB', e.target.value)}
                      className="w-full bg-black border border-red-500/30 p-4 text-white outline-none disabled:opacity-20 transition-all focus:border-red-500"
                    >
                      <option value="">-- SELECT TEAM --</option>
                      {filteredTeams.map(t => <option key={t.id} value={t.id} disabled={matchConfig.teamA.id === t.id}>{t.name}</option>)}
                    </select>
                 </div>
              </div>

              {/* Step 3: Match Detail Control */}
              {!matchConfig.teamA.id || !matchConfig.teamB.id ? (
                <div className="h-60 border border-dashed border-emerald-500/10 flex flex-col items-center justify-center opacity-20">
                    <AlertCircle className="w-10 h-10 mb-2" />
                    <p className="uppercase text-[10px] tracking-widest font-black">Awaiting_Entity_Selection_Protocol</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
                  <button 
                    onClick={handleSwap}
                    className="absolute left-1/2 top-[40px] -translate-x-1/2 z-20 w-12 h-12 bg-emerald-500 text-black rounded-full flex items-center justify-center hover:rotate-180 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-4 border-[#050505]"
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                  </button>

                  <TeamConfigCard 
                    side="BLUE_SIDE" 
                    team={MOCK_TEAMS.find(t => t.id === matchConfig.teamA.id)} 
                    config={matchConfig.teamA}
                    onScoreChange={(val) => setMatchConfig({...matchConfig, teamA: {...matchConfig.teamA, score: val}})}
                    onPlayerChange={(idx, name) => updatePlayer('teamA', idx, name)}
                  />

                  <TeamConfigCard 
                    side="RED_SIDE" 
                    team={MOCK_TEAMS.find(t => t.id === matchConfig.teamB.id)} 
                    config={matchConfig.teamB}
                    isRed
                    onScoreChange={(val) => setMatchConfig({...matchConfig, teamB: {...matchConfig.teamB, score: val}})}
                    onPlayerChange={(idx, name) => updatePlayer('teamB', idx, name)}
                  />
                </motion.div>
              )}

              <div className="pt-10 flex justify-end">
                 <button className="px-10 py-5 bg-emerald-500 text-black font-black uppercase italic hover:bg-white transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                   <Save className="w-5 h-5" /> Commit_Match_Changes
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black border border-emerald-500/20 p-10 min-h-[400px]">
               <div className="flex flex-col items-center text-center">
                  <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/30 text-[9px] uppercase tracking-[4px] mb-10 italic font-black">Registry_Preview_Mode</div>
                  <div className="flex items-center gap-10 md:gap-20">
                     <PreviewTeam teamId={matchConfig.teamA.id} score={matchConfig.teamA.score} players={matchConfig.teamA.players} />
                     <div className="text-4xl md:text-6xl font-black text-white italic opacity-20">VS</div>
                     <PreviewTeam teamId={matchConfig.teamB.id} score={matchConfig.teamB.score} players={matchConfig.teamB.players} isRight />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// CẢI TIẾN UI PLAYER SELECTOR TẠI ĐÂY
const TeamConfigCard = ({ side, team, isRed, config, onScoreChange, onPlayerChange }) => {
  const sideColor = isRed ? 'red' : 'blue';

  return (
    <div className={`p-6 border ${isRed ? 'border-red-500/30 bg-red-500/5' : 'border-blue-500/30 bg-blue-500/5'} relative overflow-hidden`}>
      {/* Background Decor */}
      <div className={`absolute top-0 ${isRed ? 'right-0' : 'left-0'} opacity-10 font-black text-7xl italic pointer-events-none -translate-y-4`}>
        {team?.tag}
      </div>

      <div className={`flex gap-4 items-center mb-8 pt-4 relative z-10 ${isRed ? 'flex-row-reverse text-right' : ''}`}>
        <div className="w-16 h-16 bg-black border border-white/10 p-2 shadow-2xl shrink-0">
          <img src={team?.logo} className="w-full h-full object-contain" alt="" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">{team?.name}</h3>
          <div className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase mt-1 ${isRed ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
            {side}
          </div>
        </div>
        <div className="bg-black p-2 border border-white/10 shrink-0">
          <p className="text-[9px] uppercase opacity-40 mb-1 font-black text-center">Score</p>
          <input 
            type="number" 
            value={config.score}
            onChange={(e) => onScoreChange(parseInt(e.target.value) || 0)}
            className="w-10 bg-transparent text-center text-xl font-black text-white outline-none"
          />
        </div>
      </div>

      {/* PLAYER SELECTOR GRID */}
      <div className="space-y-4 relative z-10">
        {POSITIONS.map((pos, idx) => (
          <div key={pos} className={`space-y-2`}>
            <div className={`flex items-center gap-2 ${isRed ? 'flex-row-reverse' : ''}`}>
              <span className={`text-[10px] font-black italic ${isRed ? 'text-red-400' : 'text-blue-400'}`}>{pos}</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            <div className={`flex flex-wrap gap-1.5 ${isRed ? 'justify-end' : ''}`}>
              {team?.players.map((playerName) => {
                const isSelected = config.players[idx] === playerName;
                return (
                  <button
                    key={playerName}
                    onClick={() => onPlayerChange(idx, playerName)}
                    className={`
                      px-3 py-1.5 text-[10px] font-bold uppercase border transition-all duration-200
                      ${isSelected 
                        ? (isRed ? 'bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]') 
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                      }
                    `}
                  >
                    {playerName}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PreviewTeam = ({ teamId, score, players, isRight }) => {
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (!team) return null;
    return (
        <div className={`flex flex-col gap-6 ${isRight ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-6 ${isRight ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-20 h-20 bg-black border-2 border-emerald-500/20 p-4">
                    <img src={team.logo} className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="text-6xl font-black text-white italic leading-none">{score}</div>
                    <div className="text-xl font-black text-emerald-500 tracking-widest">{team.tag}</div>
                </div>
            </div>
            <div className={`space-y-1 ${isRight ? 'text-right' : 'text-left'}`}>
                {players.map((p, i) => (
                    <div key={i} className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                        <span className="text-emerald-500/50 mr-2">{POSITIONS[i]}</span> {p || '---'}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CurrentMatchSetting;