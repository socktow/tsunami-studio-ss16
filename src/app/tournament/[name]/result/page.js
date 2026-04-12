"use client";
import React, { useState, use } from "react"; // 1. Thêm use ở đây
import Link from "next/link";

export default function ResultPage({ params: paramsPromise }) { // 2. Đổi tên prop để tránh nhầm lẫn
  // 3. Sử dụng React.use() để lấy dữ liệu từ Promise
  const params = use(paramsPromise); 
  const tournamentName = params.name.toUpperCase().replace(/-/g, " ");

  // --- Giữ nguyên logic bên dưới ---
  const [matches, setMatches] = useState([
    { id: 1, teamA: "GAM Esports", teamB: "Team Secret", scoreA: 0, scoreB: 0, status: "Pending", time: "17:00" },
    { id: 2, teamA: "Team Whales", teamB: "Cerberus", scoreA: 2, scoreB: 1, status: "Finished", time: "19:00" },
    { id: 3, teamA: "Vikings Autumn", teamB: "Flash", scoreA: 0, scoreB: 0, status: "Live", time: "21:00" },
  ]);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editScore, setEditScore] = useState({ a: 0, b: 0 });

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setEditScore({ a: match.scoreA, b: match.scoreB });
  };

  const updateScore = () => {
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id 
        ? { ...m, scoreA: editScore.a, scoreB: editScore.b, status: "Finished" } 
        : m
    ));
    setSelectedMatch(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/tournament" className="text-[10px] font-black uppercase text-blue-600 hover:underline">
            ← Quay lại giải đấu
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mt-2">
            Cập nhật kết quả: <span className="text-blue-600">{tournamentName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Lịch thi đấu & Kết quả</h2>
            {matches.map((m) => (
              <div 
                key={m.id} 
                onClick={() => handleSelectMatch(m)}
                className={`bg-white p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMatch?.id === m.id ? 'border-blue-500 shadow-lg shadow-blue-50' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-right flex-1">
                    <p className="font-black text-sm uppercase">{m.teamA}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span className={`text-xl font-black ${m.scoreA > m.scoreB ? 'text-blue-600' : ''}`}>{m.scoreA}</span>
                    <span className="text-slate-300 font-bold">-</span>
                    <span className={`text-xl font-black ${m.scoreB > m.scoreA ? 'text-blue-600' : ''}`}>{m.scoreB}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-black text-sm uppercase">{m.teamB}</p>
                  </div>
                </div>
                <div className="ml-6 text-right">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                        m.status === 'Live' ? 'bg-red-100 text-red-600 animate-pulse' : 
                        m.status === 'Finished' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                        {m.status}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-10 overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-8">Update Controller</h2>
                {selectedMatch ? (
                  <div className="space-y-8 text-center">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 truncate">{selectedMatch.teamA}</p>
                        <input 
                          type="number" 
                          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 text-center text-3xl font-black outline-none focus:border-blue-500 transition-all text-white"
                          value={editScore.a}
                          onChange={(e) => setEditScore({...editScore, a: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="text-slate-600 font-black text-2xl mt-6">:</div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 truncate">{selectedMatch.teamB}</p>
                        <input 
                          type="number" 
                          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 text-center text-3xl font-black outline-none focus:border-blue-500 transition-all text-white"
                          value={editScore.b}
                          onChange={(e) => setEditScore({...editScore, b: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="pt-4 space-y-3">
                        <button 
                            onClick={updateScore}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-900/20"
                        >
                            Xác nhận tỉ số
                        </button>
                        <button 
                            onClick={() => setSelectedMatch(null)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
                    <p className="text-slate-500 font-bold text-xs uppercase px-10">Vui lòng chọn một trận đấu bên trái để cập nhật tỉ số</p>
                  </div>
                )}
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}