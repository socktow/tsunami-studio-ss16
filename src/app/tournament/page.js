"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

export default function TournamentPage() {
  // DỮ LIỆU MẪU (MOCK DATA)
  const [tournaments, setTournaments] = useState([
    { id: 1, name: "vcs-dusk-2026", displayName: "VCS Dusk 2026", logo: "🏆", teamCount: 8, status: "Live" },
    { id: 2, name: "tsunami-cup", displayName: "Tsunami Cup", logo: "🌊", teamCount: 16, status: "Upcoming" },
    { id: 3, name: "lck-summer", displayName: "LCK Summer 2026", logo: "🔥", teamCount: 10, status: "Ended" },
    { id: 4, name: "worlds-championship", displayName: "Worlds 2026", logo: "🌎", teamCount: 22, status: "Upcoming" },
  ]);

  // State cho Form
  const [form, setForm] = useState({ id: null, name: "", logo: "" });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Xử lý Upload Logo (Base64)
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm((prev) => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // Tạo mới hoặc Cập nhật giải đấu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    
    const slug = form.name.toLowerCase().trim().replace(/ /g, "-");

    if (isEditing) {
      setTournaments(prev => prev.map(t => 
        t.id === form.id ? { ...t, displayName: form.name, name: slug, logo: form.logo || t.logo } : t
      ));
      setIsEditing(false);
    } else {
      const newTournament = {
        id: Date.now(),
        name: slug,
        displayName: form.name,
        logo: form.logo || "🎮",
        teamCount: 0,
        status: "Upcoming"
      };
      setTournaments([newTournament, ...tournaments]);
    }
    setForm({ id: null, name: "", logo: "" });
  };

  // Kích hoạt chế độ sửa
  const startEdit = (t) => {
    setForm({ id: t.id, name: t.displayName, logo: t.logo });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION & FORM */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Tournaments</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Hệ thống quản trị Esports itgwc</p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl flex-1 max-w-2xl w-full">
            <h2 className="text-[10px] font-black uppercase text-blue-600 mb-4 tracking-widest">
              {isEditing ? "Chỉnh sửa thông tin" : "Tạo giải đấu mới"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-4 items-end">
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold focus:bg-white focus:border-blue-500 transition-all"
                  placeholder="Ví dụ: VCS Mùa Xuân 2026"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()} 
                  className="w-[52px] h-[52px] rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl overflow-hidden hover:bg-slate-200 transition-all shadow-inner"
                >
                  {form.logo && form.logo.length > 5 ? (
                    <img src={form.logo} className="w-full h-full object-cover" alt="logo" />
                  ) : (form.logo || "🖼️")}
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleLogoUpload} />
                
                <button className={`h-[52px] px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${isEditing ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-blue-600'}`}>
                  {isEditing ? "Cập nhật" : "Tạo giải"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* TOURNAMENT LIST TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tournament Name</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Teams</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tournaments.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          {t.logo.length > 5 ? <img src={t.logo} className="w-full h-full object-cover" alt="logo" /> : t.logo}
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-slate-800 tracking-tight leading-tight">{t.displayName}</h3>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-1 italic italic">/tournament/{t.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <div className="bg-slate-100/50 inline-block px-4 py-2 rounded-2xl border border-slate-100">
                        <span className="text-xl font-black text-slate-900 leading-none">{t.teamCount}</span>
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-tighter">Slots</span>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        t.status === 'Live' ? 'bg-green-100 text-green-600 animate-pulse' : 
                        t.status === 'Ended' ? 'bg-slate-100 text-slate-400' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-end items-center gap-3">
                        {/* NÚT CẬP NHẬT TỈ SỐ */}
                        <Link 
                          href={`/tournament/${t.name}/result`} 
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                          title="Cập nhật kết quả trận đấu"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </Link>

                        {/* NÚT QUẢN LÝ TEAM */}
                        <Link 
                          href={`/tournament/${t.name}/team`} 
                          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
                        >
                          Danh sách Team
                        </Link>

                        {/* NÚT SỬA NHANH */}
                        <button 
                          onClick={() => startEdit(t)} 
                          className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Sửa thông tin"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {tournaments.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Chưa có giải đấu nào trong hệ thống</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}