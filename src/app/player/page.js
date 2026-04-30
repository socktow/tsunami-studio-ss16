"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Định nghĩa link icon hoặc SVG cho từng vị trí
const ROLE_ICONS = {
  TOP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png",
  JUNGLE: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png",
  MID: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png",
  ADC: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png",
  SUP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png",
  COACH: "https://cdn-icons-png.flaticon.com/512/5231/5231189.png", // Icon giả lập cho Coach/Analyst
  ANALYST: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
  SUB: "https://cdn-icons-png.flaticon.com/512/5701/5701730.png"
};

export default function PlayerPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [form, setForm] = useState({ nickname: "", avatar: "", role: "MID", teamId: "" });

  const roles = Object.keys(ROLE_ICONS);

  const fetchData = async () => {
    const [pRes, tRes] = await Promise.all([fetch("/api/player"), fetch("/api/teams")]);
    const pData = await pRes.json();
    const tData = await tRes.json();
    setPlayers(pData);
    setTeams(tData);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredPlayers = players.filter((p) => {
    const matchName = p.nickname.toLowerCase().includes(searchName.toLowerCase());
    const matchTeam = teamFilter === "ALL" || p.teamId?.toString() === teamFilter;
    return matchName && matchTeam;
  });

  const openAddDrawer = () => {
    setEditingId(null);
    setForm({ nickname: "", avatar: "", role: "MID", teamId: "" });
    setIsDrawerOpen(true);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ nickname: p.nickname, avatar: p.avatar, role: p.role, teamId: p.teamId.toString() });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, teamId: parseInt(form.teamId) };
    const url = editingId ? `/api/player/${editingId}` : "/api/player";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setIsDrawerOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if(confirm("PURGE THIS DATA NODE?")) {
      await fetch(`/api/player/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono selection:bg-emerald-500 selection:text-black">
      {/* 🟦 CYBER GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 p-4 md:p-10 max-w-[1800px] mx-auto">
        
        {/* 🛰️ HEADER SYSTEM */}
        <header className="flex flex-col xl:flex-row gap-6 mb-12 border border-emerald-500/40 bg-black/90 p-8 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <div className="flex-1">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_#10b981]">
                 <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
               </div>
               <div>
                  <h1 className="text-3xl font-black tracking-[0.2em] uppercase leading-none">Roster_OS</h1>
                  <p className="text-[10px] text-emerald-500/60 mt-2 tracking-[0.4em]">CENTRALIZED_PLAYER_DATABASE_V4.0</p>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative group">
              <input 
                type="text"
                placeholder="SEARCH_NODE..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="bg-emerald-950/20 border border-emerald-500/40 px-5 py-3 focus:outline-none focus:border-emerald-500 text-sm w-full md:w-80 transition-all placeholder:text-emerald-900"
              />
              <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 w-0 group-focus-within:w-full transition-all duration-300"></div>
            </div>
            <select 
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-black border border-emerald-500/40 px-5 py-3 focus:outline-none focus:border-emerald-500 text-sm appearance-none cursor-pointer hover:bg-emerald-500/5"
            >
              <option value="ALL">ALL_DIVISIONS</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>)}
            </select>
            <button 
              onClick={openAddDrawer}
              className="bg-emerald-500 text-black px-8 py-3 font-black hover:bg-white transition-all shadow-[5px_5px_0px_#065f46] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase italic"
            >
              + Create_Record
            </button>
          </div>
        </header>

        {/* 🧬 PLAYER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={p.id}
                className="group relative bg-[#0a0a0a] border border-emerald-500/10 p-0 overflow-hidden hover:border-emerald-500/60 transition-all shadow-xl"
              >
                {/* Team Color Accent Bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: p.team?.color || '#10b981' }}></div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-6">
                    {/* Role Icon Highlight */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full"></div>
                      <img 
                        src={ROLE_ICONS[p.role]} 
                        className="relative w-10 h-10 object-contain brightness-125 group-hover:scale-110 transition-transform" 
                        alt={p.role} 
                        title={p.role}
                      />
                    </div>
                    {/* Team Logo Small */}
                    <div className="flex flex-col items-end">
                      <img src={p.team?.logo} className="w-12 h-12 object-contain opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                    </div>
                  </div>

                  {/* Main Identity */}
                  <div className="relative mb-6 flex flex-col items-center">
                    <div className="w-28 h-28 border-2 border-emerald-500/20 rounded-full p-1 group-hover:border-emerald-500/50 transition-colors mb-4">
                      <img src={p.avatar || "/default.png"} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">{p.nickname}</h3>
                    <div className="text-[10px] bg-emerald-500/10 px-2 py-0.5 mt-1 border border-emerald-500/20 text-emerald-300">
                      STATUS: ACTIVE_NODE
                    </div>
                  </div>

                  {/* Meta Info Table */}
                  <div className="grid grid-cols-2 gap-2 border-t border-emerald-500/10 pt-4 mb-4">
                    <div>
                      <span className="block text-[9px] text-emerald-500/40 uppercase">Division</span>
                      <span className="text-xs font-bold truncate block" style={{ color: p.team?.color }}>{p.team?.name || "N/A"}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-emerald-500/40 uppercase">Class_Role</span>
                      <span className="text-xs font-bold text-emerald-100 block">{p.role}</span>
                    </div>
                  </div>

                  {/* Action UI */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)} className="flex-1 bg-white/5 hover:bg-emerald-500 hover:text-black py-2 text-[10px] font-black uppercase transition-all border border-white/5">Edit_Data</button>
                    <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500/10 hover:bg-red-500 text-white py-2 text-[10px] font-black uppercase transition-all border border-red-500/20">Purge</button>
                  </div>
                </div>
                
                {/* Background ID Number */}
                <span className="absolute bottom-[-10px] right-2 text-6xl font-black text-white/[0.02] italic pointer-events-none group-hover:text-emerald-500/[0.03]">
                  #{p.id.toString().padStart(3, '0')}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🔳 MODAL DRAWER (SIDE PANEL) */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              />
              
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-emerald-500/50 z-[101] shadow-[-20px_0_60px_rgba(0,0,0,0.8)] p-10 flex flex-col"
              >
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase italic">{editingId ? "Edit_Player" : "New_Registration"}</h2>
                    <div className="h-1 w-20 bg-emerald-500 mt-1"></div>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 flex-1 overflow-y-auto pr-2">
                  {/* PREVIEW PANEL */}
                  <div className="relative group flex justify-center py-6 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                     <div className="relative w-40 h-40">
                        {form.avatar ? (
                          <img src={form.avatar} className="w-full h-full object-cover rounded-full border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                        ) : (
                          <div className="w-full h-full rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-500/40 text-center px-4 uppercase tracking-widest">No_Avatar_Source</div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-black border border-emerald-500 p-2">
                           <img src={ROLE_ICONS[form.role]} className="w-8 h-8 brightness-125" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">1. Nickname_Alias</label>
                      <input name="nickname" value={form.nickname} onChange={(e) => setForm({...form, nickname: e.target.value})} required className="w-full bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-sans text-lg" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">2. Role_Class</label>
                        <select name="role" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full bg-emerald-950/30 border border-emerald-500/20 p-4 text-white focus:outline-none focus:border-emerald-500">
                          {roles.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">3. Team_Affiliation</label>
                        <select name="teamId" value={form.teamId} onChange={(e) => setForm({...form, teamId: e.target.value})} required className="w-full bg-emerald-950/30 border border-emerald-500/20 p-4 text-white focus:outline-none focus:border-emerald-500">
                          <option value="" className="bg-black italic">-- SELECT TEAM --</option>
                          {teams.map(t => <option key={t.id} value={t.id} className="bg-black">{t.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">4. Visual_Source_URL</label>
                      <input name="avatar" placeholder="https://..." value={form.avatar} onChange={(e) => setForm({...form, avatar: e.target.value})} className="w-full bg-black border-b border-emerald-500/30 p-4 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm" />
                    </div>
                  </div>

                  <div className="pt-10 space-y-4">
                    <button type="submit" className="w-full bg-emerald-500 text-black py-5 font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                      {editingId ? "Commit_Update" : "Finalize_Registration"}
                    </button>
                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-full py-4 text-emerald-500/40 text-[10px] uppercase font-bold hover:text-emerald-500 transition-colors tracking-widest">
                      Terminate_Session
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}