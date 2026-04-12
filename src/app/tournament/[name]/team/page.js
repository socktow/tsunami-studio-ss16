"use client";
import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";

export default function TournamentTeamPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const tournamentName = params.name;

  const [teams, setTeams] = useState([
    { 
      id: 1, name: "GAM Esports", tag: "GAM", logo: "https://vcs.gg/gam-logo.png", color: "#eab308",
      activeLineup: { TOP: {id: 101, name: "Kiaya"}, JUNGLE: {id: 102, name: "Levi"} }, 
      members: [{ id: 101, name: "Kiaya" }, { id: 102, name: "Levi" }, { id: 103, name: "Emo" }] 
    },
  ]);

  const [form, setForm] = useState({ name: "", tag: "", logo: "", color: "#2563eb" });
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!form.name || !form.tag) return;
    setTeams(prev => [...prev, { id: Date.now(), ...form, members: [], activeLineup: {} }]);
    setForm({ name: "", tag: "", logo: "", color: "#2563eb" });
  };

  const updateTeamData = (teamId, newData) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...newData } : t));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link href="/tournament" className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">← Tournaments List</Link>
          <h1 className="text-5xl font-black tracking-tighter uppercase mt-4">{tournamentName?.replace(/-/g, " ")}</h1>
        </div>

        {/* ADD TEAM FORM */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">Đăng ký Team mới</h2>
          <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Team Name</label>
              <input className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Logo (URL hoặc Upload)</label>
              <div className="flex gap-2">
                <input className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-xs" placeholder="Dán Link..." value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200">📁</button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
              </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tag & Color</label>
                <div className="flex gap-2">
                    <input className="w-20 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-black text-blue-600 uppercase" maxLength={4} value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} />
                    <input type="color" className="flex-1 h-[48px] rounded-2xl bg-slate-50 border border-slate-100 outline-none p-1 cursor-pointer" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                </div>
            </div>
            <button className="bg-slate-900 text-white px-8 h-[48px] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">Create Team</button>
          </form>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} onUpdate={(data) => updateTeamData(team.id, data)} onDelete={() => setTeams(prev => prev.filter(t => t.id !== team.id))} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // Mặc định Tab 1: Tactical Lineup
  const [mName, setMName] = useState("");
  const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUP"];
  
  const [editInfo, setEditInfo] = useState(team);
  const [lineupSelection, setLineupSelection] = useState(team.activeLineup);

  useEffect(() => {
    if (isModalOpen) {
      setEditInfo(team);
      setLineupSelection(team.activeLineup || {});
      setActiveTab(1); // Reset về tab 1 khi mở modal
    }
  }, [isModalOpen, team]);

  const handleSave = () => {
    onUpdate({ ...editInfo, activeLineup: lineupSelection });
    setIsModalOpen(false);
  };

  const handleUploadEdit = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditInfo(prev => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-2 overflow-hidden flex flex-col h-[400px] shadow-sm transition-all" style={{ borderColor: team.color + '20' }}>
      <div className="p-6 flex justify-between items-center text-white shrink-0" style={{ backgroundColor: team.color }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1 shadow-inner">
             <img src={team.logo || 'https://via.placeholder.com/150'} className="w-full h-full object-contain" alt="logo" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight truncate max-w-[150px]">{team.name}</h2>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsModalOpen(true)} className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Manage</button>
            <button onClick={() => { if(confirm("Xóa team?")) onDelete() }} className="bg-rose-500/80 hover:bg-rose-600 px-3 py-2 rounded-xl text-white">✕</button>
        </div>
      </div>

      <div className="p-8 flex-1 grid grid-cols-5 gap-3 bg-slate-50/50">
        {roles.map(role => (
          <div key={role} className="flex flex-col items-center">
            <span className="text-[8px] font-black text-slate-400 mb-2">{role}</span>
            <div className={`w-full aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center transition-all bg-white ${team.activeLineup?.[role] ? 'border-blue-500 shadow-md scale-105' : 'border-slate-200 border-dashed opacity-60'}`}>
              <p className="text-[10px] font-black text-slate-900 text-center px-1 truncate w-full uppercase">
                {team.activeLineup?.[role]?.name || "---"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header & Tabs */}
            <div className="bg-white border-b shrink-0" style={{ borderTop: `8px solid ${editInfo.color}` }}>
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Manage Team</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{team.name} • Control Center</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 p-3 rounded-full text-slate-400 hover:text-slate-900 transition-all font-black">✕</button>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex px-8 gap-8">
                {[
                  { id: 1, label: "1. Tactical Lineup" },
                  { id: 2, label: "2. Add Member" },
                  { id: 3, label: "3. General Info" }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-10 overflow-y-auto flex-1 bg-slate-50/30 custom-scrollbar">
              
              {/* TAB 1: TACTICAL LINEUP */}
              {activeTab === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {roles.map(role => {
                        const otherSelectedIds = Object.entries(lineupSelection)
                          .filter(([r, m]) => r !== role && m !== null)
                          .map(([r, m]) => m.id);
                        const availableMembers = editInfo.members.filter(m => !otherSelectedIds.includes(m.id));

                        return (
                          <div key={role} className="space-y-3">
                            <label className="text-[9px] font-black text-blue-600 uppercase block text-center tracking-tighter">{role}</label>
                            <div className="relative group">
                              <select 
                                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-xs appearance-none cursor-pointer text-center"
                                value={lineupSelection[role]?.id || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const member = editInfo.members.find(m => m.id === parseInt(val));
                                  setLineupSelection(prev => ({...prev, [role]: member || null}));
                                }}
                              >
                                <option value="">---</option>
                                {availableMembers.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                       <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter italic">
                         * Nhân sự đã gán vào vị trí sẽ tự động loại trừ khỏi các vị trí khác
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ADD MEMBER */}
              {activeTab === 2 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-3">Thêm thành viên mới</label>
                    <div className="flex gap-2">
                      <input className="flex-1 bg-slate-50 px-5 py-4 rounded-2xl outline-none font-bold border border-transparent focus:border-blue-200" placeholder="Nhập Nickname..." value={mName} onChange={e => setMName(e.target.value)} />
                      <button onClick={() => { if(mName) { setEditInfo({...editInfo, members: [...editInfo.members, {id: Date.now(), name: mName}]}); setMName(""); } }} className="bg-slate-900 text-white px-8 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 transition-all">Add Member</button>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-4">Danh sách thành viên ({editInfo.members.length})</label>
                    <div className="flex flex-wrap gap-2">
                      {editInfo.members.length > 0 ? editInfo.members.map(m => (
                        <div key={m.id} className="bg-slate-100 pl-4 pr-2 py-2 rounded-xl text-[11px] font-black text-slate-700 flex items-center gap-3 border border-slate-200">
                          {m.name}
                          <button onClick={() => setEditInfo({...editInfo, members: editInfo.members.filter(x => x.id !== m.id)})} className="w-6 h-6 rounded-lg hover:bg-rose-500 hover:text-white transition-all">✕</button>
                        </div>
                      )) : <p className="text-slate-300 text-xs italic">Chưa có thành viên nào...</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GENERAL INFO */}
              {activeTab === 3 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Team Name</label>
                        <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm border border-transparent focus:border-blue-200" value={editInfo.name} onChange={e => setEditInfo({...editInfo, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Team Tag</label>
                        <input className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-black text-blue-600 uppercase border border-transparent focus:border-blue-200" value={editInfo.tag} onChange={e => setEditInfo({...editInfo, tag: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Brand Color & Logo</label>
                        <div className="flex gap-2">
                          <input className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none text-xs border border-transparent focus:border-blue-200" value={editInfo.logo} onChange={e => setEditInfo({...editInfo, logo: e.target.value})} />
                          <input type="file" id={`edit-logo-${team.id}`} hidden onChange={handleUploadEdit} />
                          <button onClick={() => document.getElementById(`edit-logo-${team.id}`).click()} className="bg-slate-100 px-5 rounded-2xl text-lg hover:bg-slate-200 transition-colors">📁</button>
                          <input type="color" className="w-14 h-14 p-1 rounded-2xl bg-slate-50 cursor-pointer border border-slate-200" value={editInfo.color} onChange={e => setEditInfo({...editInfo, color: e.target.value})} />
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-white border-t flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900 transition-all">Huỷ bỏ</button>
              <button onClick={handleSave} className="px-12 py-4 rounded-2xl font-black text-[10px] uppercase text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95" style={{ backgroundColor: editInfo.color }}>Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}