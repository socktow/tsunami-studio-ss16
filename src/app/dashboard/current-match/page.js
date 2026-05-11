"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Play, Database } from 'lucide-react';

// Import các component con
import CurrentMatch from './CurrentMatch.js';
import SettingMatch from './SettingMatch.js';
import MatchData from './MatchData.js';

const Page = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tournamentName: '',
    matchType: 'BO3',
    teamsData: [
      { name: '', tag: '', color: '#3b82f6', score: 0, players: [] },
      { name: '', tag: '', color: '#ef4444', score: 0, players: [] }
    ]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/current-game');
      const data = await res.json();
      if (res.ok) setCurrentMatch(data);
      else setCurrentMatch(null);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/current-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert("Đã tạo và kích hoạt trận đấu!");
      fetchData();
      setActiveTab('current');
    }
  };

  const updateScore = async (teamIndex, newScore) => {
    const updatedTeams = [...currentMatch.teamsData];
    updatedTeams[teamIndex].score = newScore;
    
    const res = await fetch('/api/current-game', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamsData: updatedTeams })
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Play className="text-blue-500" fill="currentColor" /> Broadcast Control Panel
        </h1>

        <div className="flex gap-4 mb-6 border-b border-slate-700 pb-px">
          <TabButton active={activeTab === 'current'} onClick={() => setActiveTab('current')} icon={<Play size={18}/>} label="Current Match" />
          <TabButton active={activeTab === 'setting'} onClick={() => setActiveTab('setting')} icon={<Settings size={18}/>} label="Setting Match" />
          <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={<Database size={18}/>} label="Match Data" />
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
          {loading && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
          
          {activeTab === 'current' && (
            <CurrentMatch currentMatch={currentMatch} updateScore={updateScore} fetchData={fetchData} />
          )}

          {activeTab === 'setting' && (
            <SettingMatch formData={formData} setFormData={setFormData} handleCreateMatch={handleCreateMatch} />
          )}

          {activeTab === 'data' && (
            <MatchData currentMatch={currentMatch} fetchData={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component cho nút Tab
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 flex items-center gap-2 transition-all ${active ? 'border-b-2 border-blue-500 text-blue-500 font-bold bg-blue-500/5' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {icon} {label}
  </button>
);

export default Page;