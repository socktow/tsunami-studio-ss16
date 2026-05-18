"use client";
import React, { useState, useEffect } from "react";
import {
  Save,
  Trophy,
  Users,
  Shield,
  Loader2,
  Zap,
  LayoutGrid,
  ChevronDown,
  Hash
} from "lucide-react";

const defaultTeams = [
  { name: "", tag: "", color: "#3b82f6", logo: "", players: [] },
  { name: "", tag: "", color: "#ef4444", logo: "", players: [] },
];

const SettingMatch = () => {
  const [formData, setFormData] = useState({
    tournamentName: "",
    matchType: "BO1",
    teamsData: defaultTeams,
  });

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCurrentMatch = async () => {
      try {
        const res = await fetch("/api/current-game");
        const result = await res.json();
        if (result.success && result.data) {
          setFormData({
            tournamentName: result.data.tournamentName || "",
            matchType: result.data.matchType || "BO1",
            teamsData: result.data.teamsData || defaultTeams,
          });
        }
      } catch (error) {
        console.error("LOAD ERROR:", error);
      } finally {
        setLoadingCurrent(false);
      }
    };
    loadCurrentMatch();
  }, []);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("LOAD TOURNAMENT ERROR:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/current-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) alert("Hệ thống đã đồng bộ!");
    } catch (error) {
      alert("Lỗi kết nối");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTournamentChange = async (e) => {
    const tournamentId = e.target.value;
    if (!tournamentId) {
      setSelectedTournament(null);
      return;
    }
    setLoadingTeams(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`);
      const data = await res.json();
      setSelectedTournament(data);
      setFormData((prev) => ({ ...prev, tournamentName: data.name }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSelectTeam = async (teamIndex, teamBasicData) => {
    try {
      const res = await fetch(`/api/teams/${teamBasicData.id}`);
      const fullTeamData = await res.json();
      const newTeams = [...formData.teamsData];
      newTeams[teamIndex] = {
        ...newTeams[teamIndex],
        name: fullTeamData.name,
        tag: fullTeamData.tagName,
        color: fullTeamData.color || "#ffffff",
        logo: fullTeamData.logo,
        players: fullTeamData.players || [],
      };
      setFormData({ ...formData, teamsData: newTeams });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTeamField = (idx, field, value) => {
    const newTeams = [...formData.teamsData];
    newTeams[idx][field] = value;
    setFormData({ ...formData, teamsData: newTeams });
  };

  if (loadingCurrent) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="font-mono text-xs uppercase tracking-[0.3em]">Initialising Data...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-700 overflow-hidden px-4">
      
      {/* --- HEADER (Fixed Height) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6 flex-none">
        <div>
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-white uppercase italic">
            <Zap className="text-yellow-500 fill-yellow-500" size={24} />
            Broadcast Config
          </h1>
          <p className="text-slate-500 text-[11px] font-medium mt-0.5 uppercase tracking-wider">Stream Data Management Session</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-1 rounded-xl">
          <div className="px-3 py-1">
            <div className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Status</div>
            <div className="text-xs font-mono font-bold text-emerald-400">READY_TO_SYNC</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="pr-3 pl-1">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 space-y-6">
        
        {/* --- TOP SETTINGS (Fixed Height) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-none">
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
              <Trophy size={14} />
              <h2 className="font-black uppercase tracking-widest text-[10px]">Tournament Selection</h2>
            </div>
            <div className="relative group">
              <select
                onChange={handleTournamentChange}
                className="w-full bg-zinc-950 border border-slate-700 rounded-xl p-3 pl-4 outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer text-sm font-bold"
              >
                <option value="">-- CHỌN GIẢI ĐẤU MỤC TIÊU --</option>
                {tournaments.map((t) => (
                  <option key={`tour-${t.id}`} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <LayoutGrid size={14} />
              <h2 className="font-black uppercase tracking-widest text-[10px]">Technical Specs</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <select
                 className="bg-zinc-950 border border-slate-700 rounded-xl p-2.5 outline-none focus:border-blue-500 text-xs font-bold"
                 value={formData.matchType}
                 onChange={(e) => setFormData({ ...formData, matchType: e.target.value })}
               >
                 {["BO1", "BO3", "BO5"].map(type => <option key={type}>{type}</option>)}
               </select>
               <div className="bg-zinc-950 border border-slate-700 rounded-xl p-2.5 text-[10px] font-mono text-blue-400 text-center flex items-center justify-center font-bold">
                 LIVE_CH_01
               </div>
            </div>
          </div>
        </section>

        {/* --- TEAMS CONFIGURATION (Flexible Height, No Scroll) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {[0, 1].map((idx) => (
            <div key={`team-container-${idx}`} className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-[2rem] p-6 min-h-0">
              
              {/* Team Header */}
              <div className="flex items-center justify-between mb-6 flex-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 rounded-lg border border-slate-800">
                    <Shield size={18} className={idx === 0 ? "text-blue-500" : "text-red-500"} />
                  </div>
                  <h2 className="font-black text-lg italic uppercase tracking-tighter">Team {idx + 1}</h2>
                </div>
                <input
                  type="color"
                  value={formData.teamsData[idx].color}
                  onChange={(e) => updateTeamField(idx, "color", e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-2 border-slate-800 overflow-hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-3 gap-3 mb-6 flex-none">
                <div className="col-span-3">
                   <select
                      disabled={!selectedTournament || loadingTeams}
                      onChange={(e) => {
                        const teamEntry = selectedTournament.teams.find(t => t.team.id === parseInt(e.target.value));
                        if (teamEntry) handleSelectTeam(idx, teamEntry.team);
                      }}
                      className="w-full bg-zinc-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-blue-500 disabled:opacity-30"
                    >
                      <option value="">-- SYNC FROM DATABASE --</option>
                      {selectedTournament?.teams.map((t) => (
                        <option key={`team-opt-${idx}-${t.team.id}`} value={t.team.id}>{t.team.name}</option>
                      ))}
                    </select>
                </div>
                <input
                  placeholder="Team Name"
                  className="col-span-2 bg-zinc-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-blue-500"
                  value={formData.teamsData[idx].name}
                  onChange={(e) => updateTeamField(idx, "name", e.target.value)}
                />
                <input
                  placeholder="TAG"
                  className="bg-zinc-950 border border-slate-700 rounded-xl p-2.5 text-xs font-black text-center uppercase outline-none focus:border-blue-500"
                  value={formData.teamsData[idx].tag}
                  onChange={(e) => updateTeamField(idx, "tag", e.target.value)}
                />
              </div>

              {/* Players List (The only scrollable part if needed) */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[9px] uppercase text-slate-500 font-black tracking-widest">Active Roster</h3>
                  <div className="h-px flex-1 mx-4 bg-slate-800" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {formData.teamsData[idx].players?.length > 0 ? (
                    formData.teamsData[idx].players.map((player, pIdx) => (
                      <div key={`player-${idx}-${player.id || pIdx}`} className="bg-zinc-950/40 border border-slate-800/50 rounded-xl p-2 flex items-center gap-3 hover:border-blue-500/30 transition-all">
                        <div className="w-9 h-9 bg-slate-800 rounded border border-slate-700 flex-none overflow-hidden">
                          {player.avatar ? (
                            <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600"><Users size={14} /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[13px] text-slate-200 truncate uppercase tracking-tight">{player.nickname}</div>
                          <div className="text-[8px] uppercase font-black text-blue-500 tracking-tighter">{player.role || 'Member'}</div>
                        </div>
                        <Hash size={12} className="text-slate-700 mr-2" />
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800/40 rounded-2xl">
                      <Users size={24} className="text-slate-800 mb-2" />
                      <p className="text-[9px] uppercase font-bold text-slate-600 tracking-widest">No Roster Selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- ACTION BUTTON (Fixed Height) --- */}
        <div className="flex-none pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full bg-white text-black disabled:bg-slate-800 disabled:text-slate-500 rounded-xl p-4 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-[0.99]"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span className="relative z-10">{isSubmitting ? "Processing..." : "Sync Broadcast Engine"}</span>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
          </button>
        </div>
      </form>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes shine { from { left: -100%; } to { left: 100%; } }
        .group-hover\:animate-shine:hover { animation: shine 0.8s ease-in-out; }
      `}</style>
    </div>
  );
};

export default SettingMatch;