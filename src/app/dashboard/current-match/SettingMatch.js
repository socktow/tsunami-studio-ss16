import React, { useState, useEffect } from 'react';
import { Save, Trophy, Users, Shield, Loader2 } from 'lucide-react';

const SettingMatch = ({ formData, setFormData }) => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Lấy danh sách giải đấu khi load trang
  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error("Lỗi lấy giải đấu:", err));
  }, []);

  // 2. Logic gửi dữ liệu lên API POST /api/current-game
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/current-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Broadcast đã được cập nhật!");
        console.log("Match created:", result);
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Không thể kết nối đến server");
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
      setFormData(prev => ({ ...prev, tournamentName: data.name }));
    } catch (err) {
      console.error("Lỗi lấy chi tiết giải đấu:", err);
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
        color: fullTeamData.color || '#ffffff',
        logo: fullTeamData.logo,
        players: fullTeamData.players || [] 
      };
      setFormData({ ...formData, teamsData: newTeams });
    } catch (err) {
      console.error("Lỗi lấy chi tiết team:", err);
    }
  };

  const updateTeamField = (idx, field, value) => {
    const newTeams = [...formData.teamsData];
    newTeams[idx][field] = value;
    setFormData({ ...formData, teamsData: newTeams });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CHỌN GIẢI ĐẤU */}
      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-4">
        <h3 className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase">
          <Trophy size={16} /> Quick Setup from Database
        </h3>
        <select 
          onChange={handleTournamentChange}
          className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm outline-none focus:border-blue-500 text-white"
        >
          <option value="">-- Select a Tournament --</option>
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* THÔNG TIN CHUNG */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Tournament Name</label>
          <input 
            className="w-full bg-slate-900 border border-slate-700 rounded p-3 focus:border-blue-500 outline-none text-white"
            value={formData.tournamentName}
            onChange={(e) => setFormData({...formData, tournamentName: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Match Type</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white"
            value={formData.matchType}
            onChange={(e) => setFormData({...formData, matchType: e.target.value})}
          >
            <option>BO1</option><option>BO3</option><option>BO5</option>
          </select>
        </div>
      </div>

      {/* CHI TIẾT 2 TEAM */}
      <div className="grid grid-cols-2 gap-8">
        {[0, 1].map((idx) => (
          <div key={idx} className="p-4 bg-slate-900 rounded-lg border border-slate-700 space-y-4">
            <h3 className="font-bold text-blue-400 uppercase tracking-widest text-xs flex items-center gap-2">
              <Shield size={14}/> TEAM {idx + 1}
            </h3>

            <select 
              disabled={!selectedTournament || loadingTeams}
              onChange={(e) => {
                const teamEntry = selectedTournament.teams.find(t => t.team.id === parseInt(e.target.value));
                if(teamEntry) handleSelectTeam(idx, teamEntry.team);
              }}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs disabled:opacity-50 text-white"
            >
              <option value="">-- Quick Select Team --</option>
              {selectedTournament?.teams.map(t => (
                <option key={t.team.id} value={t.team.id}>{t.team.name}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input 
                placeholder="Name" 
                className="bg-slate-800 p-2 rounded text-sm outline-none focus:ring-1 ring-blue-500 text-white"
                value={formData.teamsData[idx].name}
                onChange={(e) => updateTeamField(idx, 'name', e.target.value)}
              />
              <input 
                placeholder="Tag" 
                className="bg-slate-800 p-2 rounded text-sm uppercase text-white"
                value={formData.teamsData[idx].tag}
                onChange={(e) => updateTeamField(idx, 'tag', e.target.value)}
              />
            </div>

            {/* DANH SÁCH PLAYER */}
            <div className="mt-4">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Starting Roster</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {formData.teamsData[idx].players?.length > 0 ? (
                  formData.teamsData[idx].players.map((player) => (
                    <div key={player.id} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                      <div className="relative w-10 h-10 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.nickname} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-full h-full p-2 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-white">{player.nickname}</div>
                        <div className="text-[10px] text-blue-400 font-mono uppercase">{player.role}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-slate-600 italic py-4 text-center border border-dashed border-slate-800 rounded">
                    No players loaded.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
                <input 
                  type="color"
                  className="bg-transparent h-6 w-10 cursor-pointer"
                  value={formData.teamsData[idx].color}
                  onChange={(e) => updateTeamField(idx, 'color', e.target.value)}
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{formData.teamsData[idx].color}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20 text-white"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Save size={20} />
        )}
        {isSubmitting ? "UPDATING..." : "SAVE & UPDATE BROADCAST"}
      </button>
    </form>
  );
};

export default SettingMatch;