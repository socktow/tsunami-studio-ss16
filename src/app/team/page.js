"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // Giả sử bạn dùng Next.js để chuyển hướng xem chi tiết

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    tagName: "",
    coach: "",
    logo: "",
    color: "#10b981" 
  });

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", tagName: "", coach: "", logo: "", color: "#10b981" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/teams/${editingId}` : "/api/teams";
    const method = editingId ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    resetForm();
    fetchTeams();
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setForm({
      name: team.name,
      tagName: team.tagName,
      coach: team.coach,
      logo: team.logo,
      color: team.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("CONFIRM_TERMINATION: GIẢI THỂ ĐỘI TUYỂN?")) {
      await fetch(`/api/teams/${id}`, { method: "DELETE" });
      fetchTeams();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono selection:bg-emerald-500 selection:text-black">
      {/* 🟦 CYBER GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-[1800px] mx-auto p-4 md:p-10">
        
        {/* 🛰️ HEADER BAR - TACTICAL STYLE */}
        <header className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-12 border border-emerald-500/40 bg-black/90 p-8 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_#10b981]">
              <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-[0.2em] uppercase leading-none text-white">Org_Commander</h1>
              <p className="text-[10px] text-emerald-500/60 mt-2 tracking-[0.4em]">ROSTER_MANAGEMENT_PROTOCOL_V2.0</p>
            </div>
          </div>

          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="w-full xl:w-auto bg-emerald-500 text-black font-black px-12 py-4 hover:bg-white transition-all shadow-[5px_5px_0px_#065f46] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase italic"
          >
            + Register_New_Division
          </button>
        </header>

        {/* 🛡️ TEAMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {teams.map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={t.id}
                className="group relative bg-[#0a0a0a] border border-emerald-500/10 p-0 overflow-hidden hover:border-emerald-500/60 transition-all shadow-xl"
              >
                {/* Team Brand Accent Line */}
                <div className="h-1.5 w-full" style={{ backgroundColor: t.color }}></div>

                <div className="p-6 relative">
                  {/* Background Tag Watermark */}
                  <div className="absolute top-2 right-4 text-7xl font-black text-white/[0.02] italic pointer-events-none group-hover:text-emerald-500/[0.03] transition-colors">
                    {t.tagName}
                  </div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="relative h-24 w-24">
                      <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: t.color }} />
                      <div className="relative h-full w-full border border-emerald-500/20 p-2 bg-black/40">
                        <img 
                          src={t.logo || "/default.png"} 
                          className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      </div>
                    </div>
                    <div className="text-right border-r-2 pr-3" style={{ borderColor: t.color }}>
                      <span className="text-[9px] font-bold text-emerald-500/40 uppercase block tracking-widest">Designation</span>
                      <p className="text-2xl font-black text-white italic leading-none">{t.tagName}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-white mb-6 tracking-tighter uppercase group-hover:text-emerald-400 transition-colors line-clamp-1 border-b border-emerald-500/10 pb-2">
                    {t.name}
                  </h2>

                  {/* Team Metadata */}
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center justify-between bg-emerald-500/5 p-3 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                      <span className="text-[9px] font-bold text-emerald-500/40 uppercase">Commanding_Officer</span>
                      <span className="text-xs font-bold text-emerald-100">{t.coach || "UNASSIGNED"}</span>
                    </div>
                    <div className="flex items-center justify-between bg-emerald-500/5 p-3 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                      <span className="text-[9px] font-bold text-emerald-500/40 uppercase">Node_Count</span>
                      <span className="text-xs font-bold text-emerald-400">{t.players?.length || 0} OPERATIVES</span>
                    </div>
                  </div>

                  {/* Action UI */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/team/${t.id}`} className="w-full">
                      <button className="w-full bg-emerald-500 text-black py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all italic">
                        Decrypt_Details
                      </button>
                    </Link>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(t)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-emerald-500 py-2 transition-all border border-emerald-500/10 uppercase"
                      >
                        Modify_Config
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-black transition-all border border-red-500/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🔳 TACTICAL MODAL FORM */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: 20 }}
                className="relative w-full max-w-2xl bg-[#080808] border border-emerald-500/40 p-10 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
              >
                <div className="mb-10 flex items-center gap-6 border-b border-emerald-500/20 pb-6">
                   <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{editingId ? "Update_Division_Parameters" : "Initiate_New_Division"}</h3>
                     <p className="text-emerald-500/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic">Reference_ID: {editingId || "AUTH_PENDING"}</p>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">1. Division_Full_Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-sans" placeholder="e.g. GAM ESPORTS" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">2. Tactical_Tag</label>
                      <input name="tagName" value={form.tagName} onChange={handleChange} required className="w-full bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 transition-all uppercase" placeholder="GAM" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">3. Commanding_Officer</label>
                      <input name="coach" value={form.coach} onChange={handleChange} className="w-full bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-sans" placeholder="COACH_NAME" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">4. Brand_Frequency_Color</label>
                      <div className="flex gap-4 items-center h-[57px]">
                        <input type="color" name="color" value={form.color} onChange={handleChange} className="h-full w-20 bg-black border border-emerald-500/20 cursor-pointer p-1" />
                        <span className="text-xs font-bold text-white/40">{form.color.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">5. Emblem_Resource_URL</label>
                    <div className="flex gap-4">
                      <input name="logo" value={form.logo} onChange={handleChange} className="flex-1 bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-sans text-sm" placeholder="https://..." />
                      {form.logo && (
                        <div className="h-14 w-14 bg-white/5 border border-emerald-500/20 p-2">
                          <img src={form.logo} className="h-full w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-10">
                    <button type="button" onClick={resetForm} className="flex-1 py-4 text-emerald-500/40 text-[10px] font-black uppercase border border-white/5 hover:text-emerald-500 transition-all">Abort_Process</button>
                    <button type="submit" className="flex-[2] bg-emerald-500 text-black py-4 font-black uppercase tracking-[0.2em] hover:bg-white transition-all italic shadow-[0_0_30px_rgba(16,185,129,0.2)]">Commit_Data_Node</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}