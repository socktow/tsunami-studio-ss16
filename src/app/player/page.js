"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Edit3, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

const ROLE_ICONS = {
  TOP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png",
  JUNGLE: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png",
  MID: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png",
  ADC: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png",
  SUP: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png",
  COACH: "https://cdn-icons-png.flaticon.com/512/5231/5231189.png",
  ANALYST: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
  SUB: "https://cdn-icons-png.flaticon.com/512/5701/5701730.png"
};

const ITEMS_PER_PAGE = 8;

export default function PlayerPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ nickname: "", avatar: "", role: "MID", teamId: "" });

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([fetch("/api/player"), fetch("/api/teams")]);
      const pData = await pRes.json();
      const tData = await tRes.json();
      setPlayers(pData);
      setTeams(tData);
    } catch (e) { console.error("Data fetch failed"); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchName = p.nickname.toLowerCase().includes(searchName.toLowerCase());
      const matchTeam = teamFilter === "ALL" || p.teamId?.toString() === teamFilter;
      return matchName && matchTeam;
    });
  }, [players, searchName, teamFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE));
  const paginatedPlayers = filteredPlayers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleTeamChange = (e) => {
    setTeamFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, teamId: parseInt(form.teamId) };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/player/${editingId}` : "/api/player";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setIsDrawerOpen(false);
    fetchData();
  };

  // Helper tìm team để hiển thị logo trong Preview Drawer
  const selectedTeamData = teams.find(t => t.id.toString() === form.teamId);

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12 border border-emerald-500/20 bg-black/80 p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(16,185,129,0.05)]">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Roster<span className="text-white">.OS</span></h1>
            <p className="text-[9px] tracking-[0.5em] mt-2 opacity-50 uppercase italic">Central_Database_Link_Active</p>
          </div>

          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input 
                type="text" placeholder="FILTER_BY_ALIAS..." value={searchName} onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-emerald-950/10 border border-emerald-500/30 focus:border-emerald-500 outline-none transition-all uppercase text-xs"
              />
            </div>
            <select value={teamFilter} onChange={handleTeamChange} className="px-6 py-4 bg-black border border-emerald-500/30 font-bold text-xs appearance-none cursor-pointer hover:border-emerald-500 transition-colors uppercase">
              <option value="ALL">ALL_DIVISIONS</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button 
              onClick={() => { setEditingId(null); setForm({nickname:"", avatar:"", role:"MID", teamId:""}); setIsDrawerOpen(true); }}
              className="bg-emerald-500 text-black px-8 py-4 flex items-center gap-3 hover:bg-white transition-all font-black uppercase text-xs italic shadow-[4px_4px_0px_#065f46]"
            >
              <UserPlus className="w-4 h-4" /> Create_Record
            </button>
          </div>
        </header>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedPlayers.map((p) => (
              <motion.div
                key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-black border border-emerald-500/20 p-5 hover:border-emerald-500 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: p.team?.color || '#10b981' }}></div>
                
                {/* 🛡️ TOP BAR: ROLE & TEAM LOGO */}
                <div className="flex justify-between items-center mb-6">
                  <img src={ROLE_ICONS[p.role]} className="w-7 h-7 invert brightness-150 opacity-60 group-hover:opacity-100 transition-opacity" alt={p.role} title={p.role} />
                  
                  {/* HIỂN THỊ LOGO TEAM TẠI ĐÂY */}
                  {p.team?.logo ? (
                    <img src={p.team.logo} className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" alt={p.team.name} title={p.team.name} />
                  ) : (
                    <span className="text-[8px] opacity-30 italic uppercase tracking-tighter text-white">No_Logo</span>
                  )}
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 border border-emerald-500/20 rounded-full p-1 mb-4 group-hover:border-emerald-500/60 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <img src={p.avatar || "/default.png"} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" alt={p.nickname} />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{p.nickname}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.team?.color || '#10b981' }}></span>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{p.team?.name || "Independent"}</p>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <button onClick={() => { setEditingId(p.id); setForm({...p, teamId: p.teamId.toString()}); setIsDrawerOpen(true); }} className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-[10px] font-black transition-all border border-emerald-500/20 uppercase italic">Edit_Data</button>
                  <button onClick={async () => { if(confirm("PURGE_RECORD?")) { await fetch(`/api/player/${p.id}`, {method:"DELETE"}); fetchData(); }}} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-[10px] font-black transition-all border border-red-500/20 uppercase italic">Purge</button>
                </div>

                {/* Chữ số ID chìm phía sau */}
                <span className="absolute bottom-[-15px] right-2 text-7xl font-black text-white/[0.03] italic pointer-events-none group-hover:text-emerald-500/[0.05] transition-colors">
                   #{p.id.toString().padStart(3, '0')}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-emerald-500/20 pt-8">
          <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">Database_Entries: {filteredPlayers.length}</p>
          <div className="flex items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-emerald-500/20 disabled:opacity-20 hover:bg-emerald-500/10 transition-all active:scale-95"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-2">
               {[...Array(totalPages)].map((_, i) => (
                 <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 text-[10px] font-black italic border ${currentPage === i+1 ? 'bg-emerald-500 text-black border-emerald-500' : 'border-emerald-500/20 text-emerald-500/40 hover:text-emerald-500'}`}>{i+1}</button>
               ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-emerald-500/20 disabled:opacity-20 hover:bg-emerald-500/10 transition-all active:scale-95"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* 🔳 MODAL DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-emerald-500/30 z-[101] p-10 flex flex-col shadow-[-20px_0_100px_rgba(0,0,0,1)]"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{editingId ? "Update_Log" : "New_Register"}</h2>
                  <div className="h-0.5 w-16 bg-emerald-500 mt-1 shadow-[0_0_10px_#10b981]"></div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 border border-emerald-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              
              <form 
                onSubmit={handleSubmit} 
                className="space-y-8 flex-1 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-emerald-500/20 hover:[&::-webkit-scrollbar-thumb]:bg-emerald-500/50 scrollbar-thin scrollbar-thumb-emerald-500/20"
              >
                {/* Visual Preview */}
                <div className="p-8 bg-emerald-500/5 border border-dashed border-emerald-500/20 flex flex-col items-center relative overflow-hidden group">
                  <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
                    {/* LOGO TEAM TRONG PREVIEW */}
                    {selectedTeamData?.logo && (
                      <img src={selectedTeamData.logo} className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" alt="Team Preview" />
                    )}
                  </div>

                  <div className="w-32 h-32 relative mb-4">
                    <img src={form.avatar || "https://via.placeholder.com/150"} className="w-full h-full object-cover rounded-full border border-emerald-500/50 grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                    <div className="absolute -bottom-2 -right-2 bg-black border border-emerald-500 p-1.5 w-10 h-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <img src={ROLE_ICONS[form.role]} className="w-full h-full invert brightness-200" alt="" />
                    </div>
                  </div>
                  <span className="text-[9px] font-black tracking-[0.4em] opacity-30 uppercase italic">Aesthetic_Module_Preview</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 italic flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500"></span> 1. Operative_Name
                    </label>
                    <input value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} required className="w-full bg-transparent border-b border-emerald-500/30 py-4 text-white focus:border-emerald-500 outline-none text-xl font-bold uppercase transition-all placeholder:text-emerald-900" placeholder="ENTER_NICKNAME..." />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 italic">2. Class_Role</label>
                      <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-black border border-emerald-500/30 p-4 text-xs font-bold uppercase outline-none focus:border-emerald-500 transition-colors cursor-pointer">
                        {Object.keys(ROLE_ICONS).map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 italic">3. Division</label>
                      <select value={form.teamId} onChange={e => setForm({...form, teamId: e.target.value})} required className="w-full bg-black border border-emerald-500/30 p-4 text-xs font-bold uppercase outline-none focus:border-emerald-500 transition-colors cursor-pointer">
                        <option value="">SELECT_TEAM</option>
                        {teams.map(t => <option key={t.id} value={t.id} className="bg-black">{t.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 italic flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500"></span> 4. Asset_Source_URL
                    </label>
                    <input value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} className="w-full bg-transparent border border-emerald-500/30 p-4 text-[10px] focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-900" placeholder="HTTP://IMAGE_SERVER/ASSET_NODE.PNG" />
                  </div>
                </div>

                <div className="pt-10 space-y-4">
                  <button type="submit" className="w-full bg-emerald-500 text-black py-6 font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 active:shadow-none">
                    Confirm_Data_Push
                  </button>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-full text-[9px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-opacity">
                    Disconnect_Session
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}