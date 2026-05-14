import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit3, Save, X, Database, Terminal, AlertTriangle } from 'lucide-react';

const DEMO_DATA = {
  tournamentName: "LCK 2026",
  matchType: "BO5",
  teamsData: [
    {
      name: "GEN.G",
      tag: "GEN",
      color: "#9e7c1f",
      logo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e3/Gen.Glogo_square.png",
      players: [
        { nickname: "Chovy", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/b3/GEN_Chovy_2026_Split_1.png", role: "MID" },
        { nickname: "Kiin", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/65/GEN_Kiin_2026_Split_1.png", role: "TOP" },
        { nickname: "Canyon", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/55/GEN_Canyon_2026_Split_1.png", role: "JUNGLE" },
        { nickname: "Ruler", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e3/GEN_Ruler_2026_Split_1.png", role: "ADC" },
        { nickname: "Duro", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/75/GEN_Duro_2026_Split_1.png", role: "SUP" }
      ],
      score: 1
    },
    {
      name: "T1",
      tag: "T1",
      color: "#ff0000",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1280px-T1_esports_logo.svg.png",
      players: [
        { nickname: "Faker", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5a/T1_Faker_2026_LCK_Cup.png", role: "MID" },
        { nickname: "Keria", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/da/T1_Keria_2026_LCK_Cup.png", role: "SUP" },
        { nickname: "Oner", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d2/T1_Oner_2026_LCK_Cup.png", role: "JUNGLE" },
        { nickname: "Doran", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/de/T1_Doran_2026_LCK_Cup.png", role: "TOP" },
        { nickname: "ChuChu", avatar: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e9/T1_Peyz_2026_LCK_Cup.png", role: "ADC" }
      ],
      score: 2
    }
  ],
  isActive: true
};

const MatchData = ({ currentMatch, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentMatch && !isEditing) {
      setEditContent(JSON.stringify(currentMatch, null, 2));
    }
  }, [currentMatch, isEditing]);

  const handleUseDemo = () => {
    setEditContent(JSON.stringify(DEMO_DATA, null, 2));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const parsedData = JSON.parse(editContent);

      const res = await fetch("/api/current-game", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentName: parsedData.tournamentName,
          matchType: parsedData.matchType,
          teamsData: parsedData.teamsData,
          isActive: parsedData.isActive
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchData();
      } else {
        const err = await res.json();
        alert("Lỗi: " + (err.error || "Không thể lưu"));
      }
    } catch (e) {
      alert("JSON không hợp lệ!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-blue-400" />
          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-tighter">
            Data Engine v2.0
          </span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${isEditing ? 'bg-yellow-500' : 'bg-green-500'}`} />
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={handleUseDemo}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded text-xs font-medium transition-all"
              >
                <Database size={14} /> Sử dụng Data Demo
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-all"
              >
                <Edit3 size={14} /> Edit Mode
              </button>
              <button onClick={fetchData} className="p-1.5 text-slate-500 hover:text-white transition">
                <RefreshCw size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition disabled:opacity-50 shadow-lg shadow-emerald-900/20"
              >
                <Save size={14} /> {isSaving ? "COMMITING..." : "COMMIT CHANGES"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded text-xs font-medium transition-all"
              >
                <X size={14} /> ABORT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor/Viewer Area */}
      <div className="relative flex-1 group overflow-hidden">
        {isEditing && (
          <div className="absolute top-0 right-0 z-10 p-2 pointer-events-none">
            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded font-mono uppercase">
              Unsaved Changes
            </span>
          </div>
        )}
        
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-full bg-transparent p-6 text-indigo-300 text-sm font-mono focus:outline-none resize-none custom-scrollbar leading-relaxed"
            spellCheck="false"
          />
        ) : (
          <div className="w-full h-full p-6 overflow-auto custom-scrollbar">
            <pre className="text-emerald-500/90 text-sm font-mono leading-relaxed">
              {currentMatch ? JSON.stringify(currentMatch, null, 2) : "// No telemetry data received."}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900/80 border-t border-slate-800 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <div className="flex gap-4">
          <span>STATUS: {isSaving ? 'UPLOADING' : 'READY'}</span>
          <span>ENCODING: UTF-8</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle size={10} className="text-yellow-600" />
          <span className="italic uppercase">Direct database access enabled</span>
        </div>
      </div>
    </div>
  );
};

export default MatchData;