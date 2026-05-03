"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Calendar, ArrowLeft, Users, 
  Settings, Trash2, Activity, Shield, Plus, X, Search
} from "lucide-react";

export default function TournamentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState(null);
  const [allTeams, setAllTeams] = useState([]); // Tất cả đội trong hệ thống
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTournament = async () => {
    try {
      const res = await axios.get(`/api/tournaments/${id}`);
      setTournament(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu giải đấu:", err);
    }
  };

  const fetchAllTeams = async () => {
    try {
      const res = await axios.get("/api/teams");
      setAllTeams(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách đội:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTournament(), fetchAllTeams()]);
      setLoading(false);
    };
    init();
  }, [id]);

  // Lọc danh sách đội chưa tham gia giải này
  const availableTeams = allTeams.filter(team => {
    const isAlreadyIn = tournament?.teams?.some(t => t.teamId === team.id);
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlreadyIn && matchesSearch;
  });

  const handleAddTeam = async (teamId) => {
    try {
      await axios.post("/api/tournament-teams", {
        tournamentId: parseInt(id),
        teamId: teamId
      });
      // Refresh dữ liệu
      await fetchTournament();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm đội");
    }
  };

  const handleRemoveTeam = async (relationId) => {
    if (!confirm("Hệ thống: Hủy đăng ký đội này khỏi giải đấu?")) return;
    try {
      await axios.delete(`/api/tournament-teams/${relationId}`);
      await fetchTournament();
    } catch (err) {
      alert("Lỗi khi xóa đội");
    }
  };

  const handleDeleteTournament = async () => {
    if (!confirm("Hệ thống: Xác nhận xóa vĩnh viễn giải đấu này?")) return;
    try {
      await axios.delete(`/api/tournaments/${id}`);
      router.push("/tournaments");
    } catch (err) {
      alert("Lỗi khi xóa giải đấu");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-mono italic animate-pulse">
      SYNCING_TOURNAMENT_RESOURCES_v2.0...
    </div>
  );

  if (!tournament) return <div className="p-10 text-white">404: Protocol Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-6 md:p-10">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/tournaments")}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] opacity-50 hover:opacity-100 mb-8 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back_To_Fleet
        </button>

        {/* Hero Header */}
        <section className="relative border border-emerald-500/20 bg-emerald-500/5 p-8 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-emerald-500/20 text-[9px] italic border-l border-b border-emerald-500/20 uppercase text-white">
            Status: {tournament.status}
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-40 h-40 border border-emerald-500/40 p-2 bg-black">
              <img src={tournament.logo || "/placeholder.png"} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" alt="Logo" />
            </div>
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[11px] font-bold uppercase opacity-70">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(tournament.startDate).toLocaleString('vi-VN')}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {tournament.teams?.length || 0} Entities_Linked</div>
                <div className="flex items-center gap-2 text-emerald-400"><Activity className="w-4 h-4" /> ID_SEC_0{tournament.id}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Roster Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
                <Shield className="w-5 h-5" /> Roster_Registry
              </h2>
            </div>

            {tournament.teams?.length === 0 ? (
              <div className="p-20 border border-dashed border-emerald-500/10 text-center italic opacity-30 text-sm uppercase tracking-widest">
                No_Units_Deployed_Yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tournament.teams.map((relation) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={relation.id}
                    className="group flex items-center justify-between gap-4 bg-emerald-500/5 border border-emerald-500/10 p-4 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black border border-emerald-500/20 p-1">
                          <img src={relation.team.logo} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div>
                          <p className="text-white font-bold uppercase italic text-sm">{relation.team.name}</p>
                          <p className="text-[9px] opacity-40 uppercase tracking-tighter">Verified_Organization</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveTeam(relation.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <div className="border border-emerald-500/20 p-6 bg-black">
              <h3 className="text-sm font-black text-white italic uppercase mb-6 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
                <Settings className="w-4 h-4" /> Command_Actions
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-emerald-500 text-black font-black uppercase italic text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Initialize_New_Team
                </button>

                <button 
                  onClick={handleDeleteTournament}
                  className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-500 font-black uppercase italic text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Terminate_Protocol
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- ADD TEAM MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#080808] border border-emerald-500/30 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5">
                <h2 className="text-lg font-black text-white italic uppercase">Select_Deployment_Unit</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-red-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-emerald-500/10 bg-black flex items-center gap-3">
                <Search className="w-4 h-4 opacity-30" />
                <input 
                  type="text" 
                  placeholder="SEARCH_ENTITY_NAME..."
                  className="bg-transparent border-none outline-none text-white text-xs font-mono w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Team List */}
              <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar space-y-2">
                {availableTeams.length === 0 ? (
                  <div className="py-10 text-center text-[10px] opacity-30 italic">NO_UNITS_AVAILABLE_FOR_LINKING</div>
                ) : (
                  availableTeams.map(team => (
                    <div 
                      key={team.id}
                      className="flex items-center justify-between p-3 border border-emerald-500/5 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <img src={team.logo} className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100" />
                        <span className="text-sm font-bold text-white/80 uppercase">{team.name}</span>
                      </div>
                      <button 
                        onClick={() => handleAddTeam(team.id)}
                        className="px-4 py-2 border border-emerald-500/50 text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-black transition-all"
                      >
                        Deploy
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/10 text-[9px] opacity-30 italic text-center">
                GLOBAL_ENTITY_DATABASE_SYNC_ACTIVE
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98144; }
      `}</style>
    </div>
  );
}