"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Calendar, Plus, Edit3, Trash2, X, 
  Search, LayoutGrid, Activity, CheckCircle2, Clock 
} from "lucide-react";

const STATUS_CONFIG = {
  UPCOMING: { color: "#fbbf24", icon: <Clock className="w-3 h-3" />, label: "Sắp diễn ra" },
  ONGOING: { color: "#10b981", icon: <Activity className="w-3 h-3" />, label: "Đang đấu" },
  FINISHED: { color: "#ef4444", icon: <CheckCircle2 className="w-3 h-3" />, label: "Kết thúc" },
};

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    logo: "",
    startDate: "",
    status: "UPCOMING",
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openDrawer = (tournament = null) => {
    if (tournament) {
      setEditingId(tournament.id);
      // Format date cho input datetime-local
      const formattedDate = tournament.startDate 
        ? new Date(tournament.startDate).toISOString().slice(0, 16) 
        : "";
      setForm({
        name: tournament.name,
        logo: tournament.logo,
        startDate: formattedDate,
        status: tournament.status,
      });
    } else {
      setEditingId(null);
      setForm({ name: "", logo: "", startDate: "", status: "UPCOMING" });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/tournaments/${editingId}`, form);
      } else {
        await axios.post("/api/tournaments", form);
      }
      setIsDrawerOpen(false);
      fetchTournaments();
    } catch (err) {
      alert("Error saving tournament");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa giải đấu này? Dữ liệu không thể khôi phục.")) return;
    try {
      await axios.delete(`/api/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-6 md:p-10">
      {/* Background Grid Deco */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-emerald-500/20 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-white" />
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Tournaments<span className="text-emerald-500">.DB</span></h1>
            </div>
            <p className="text-[10px] tracking-[0.5em] opacity-50 uppercase">Global_Event_Coordinator_v2.0</p>
          </div>

          <button 
            onClick={() => openDrawer()}
            className="group relative px-8 py-4 bg-emerald-500 text-black font-black uppercase italic text-sm flex items-center gap-2 overflow-hidden transition-all hover:bg-white"
          >
            <Plus className="w-4 h-4" /> Initialize_New_Tournament
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total_Events", val: tournaments.length },
            { label: "Active_Now", val: tournaments.filter(t => t.status === "ONGOING").length },
            { label: "Upcoming", val: tournaments.filter(t => t.status === "UPCOMING").length },
            { label: "Archived", val: tournaments.filter(t => t.status === "FINISHED").length },
          ].map((s, i) => (
            <div key={i} className="border border-emerald-500/10 bg-emerald-500/5 p-4">
              <p className="text-[9px] uppercase opacity-40 mb-1">{s.label}</p>
              <p className="text-2xl font-black text-white italic">{s.val.toString().padStart(2, '0')}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center italic opacity-50">Syncing_With_Mainframe...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {tournaments.map((t) => (
                <motion.div
                  key={t.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-black border border-emerald-500/20 hover:border-emerald-500 transition-all p-6 shadow-xl"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black border border-emerald-500/20 rounded-full">
                    <span style={{ color: STATUS_CONFIG[t.status].color }}>
                      {STATUS_CONFIG[t.status].icon}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-white/70">
                      {STATUS_CONFIG[t.status].label}
                    </span>
                  </div>

                  {/* Logo & Info */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 border border-emerald-500/20 p-1 bg-emerald-500/5">
                      <img src={t.logo || "/placeholder.png"} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt="" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white italic uppercase leading-none mb-1 group-hover:text-emerald-500">{t.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] opacity-50 italic">
                        <Calendar className="w-3 h-3" />
                        {new Date(t.startDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex justify-between items-end border-t border-emerald-500/10 pt-4">
                    <div>
                      <p className="text-[9px] uppercase opacity-40">Registered_Teams</p>
                      <p className="text-xl font-black text-white">{(t.teams?.length || 0).toString().padStart(2, '0')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openDrawer(t)} className="p-2 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🔳 DRAWER FORM */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080808] border-l border-emerald-500/30 z-[101] p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black text-white italic uppercase">{editingId ? "Update_Registry" : "New_Initialization"}</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Logo Preview Section */}
                <div className="p-6 bg-emerald-500/5 border border-dashed border-emerald-500/30 flex flex-col items-center">
                   {form.logo ? (
                     <img src={form.logo} className="w-24 h-24 object-contain mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                   ) : (
                     <div className="w-24 h-24 border border-emerald-500/10 flex items-center justify-center mb-4"><Trophy className="opacity-10 w-12 h-12" /></div>
                   )}
                   <p className="text-[10px] uppercase opacity-30 italic">Asset_Visual_Module</p>
                </div>

                <div className="space-y-6 text-xs font-bold uppercase tracking-widest">
                  <div className="space-y-2">
                    <label className="opacity-40 italic">01. Tournament_Identity</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-transparent border-b border-emerald-500/30 py-3 text-white focus:border-emerald-500 outline-none text-base font-bold transition-all" placeholder="ID_NAME..." />
                  </div>

                  <div className="space-y-2">
                    <label className="opacity-40 italic">02. Visual_Asset_URL</label>
                    <input name="logo" value={form.logo} onChange={handleChange} className="w-full bg-transparent border-b border-emerald-500/30 py-3 text-white focus:border-emerald-500 outline-none transition-all" placeholder="HTTPS://LOGO_SOURCE..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="opacity-40 italic">03. Start_Cycle</label>
                      <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full bg-black border border-emerald-500/20 p-3 text-white focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="opacity-40 italic">04. Current_Status</label>
                      <select name="status" value={form.status} onChange={handleChange} className="w-full bg-black border border-emerald-500/20 p-3 text-white focus:border-emerald-500 outline-none transition-all cursor-pointer">
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="FINISHED">FINISHED</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 text-black py-5 font-black uppercase italic tracking-tighter hover:bg-white transition-all shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
                  {editingId ? "Push_Update_Chain" : "Commit_New_Data"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98144; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
}