"use client";
import React, { useState, useEffect } from "react";
import {
  Settings,
  Play,
  Database,
  Radio,
  Activity,
  Cpu,
  Monitor,
} from "lucide-react";

// Import các component con
import CurrentMatch from "./CurrentMatch.js";
import SettingMatch from "./SettingMatch.js";
import MatchData from "./MatchData.js";

const Page = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tournamentName: "",
    matchType: "BO3",
    teamsData: [
      { name: "", tag: "", color: "#3b82f6", score: 0, players: [] },
      { name: "", tag: "", color: "#ef4444", score: 0, players: [] },
    ],
  });

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/current-game");

      const result = await res.json();

      if (result.success) {
        setCurrentMatch(result.data);
      } else {
        setCurrentMatch(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/current-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Đã tạo và kích hoạt trận đấu!");
      fetchData();
      setActiveTab("current");
    }
  };

  const updateScore = async (teamIndex, newScore) => {
    // Tạo một bản sao mới hoàn toàn của mảng teamsData
    const updatedTeams = currentMatch.teamsData.map((team, index) => {
      if (index === teamIndex) {
        return { ...team, score: newScore }; // Chỉ update score cho team được chọn
      }
      return team; // Giữ nguyên team kia
    });

    try {
      const res = await fetch("/api/current-game", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamsData: updatedTeams }), // Gửi mảng mới lên
      });

      if (res.ok) {
        fetchData(); // Load lại data từ server sau khi update thành công
      } else {
        const errorData = await res.json();
        console.error("Update failed:", errorData.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const handleSwap = async () => {
    // 1. Kiểm tra điều kiện an toàn
    if (
      !currentMatch ||
      !currentMatch.teamsData ||
      currentMatch.teamsData.length < 2
    ) {
      console.error("Không đủ dữ liệu team để swap");
      return;
    }

    // 2. Đảo ngược mảng teamsData (Immutably)
    // [TeamA, TeamB] -> [TeamB, TeamA]
    const swappedTeams = [
      { ...currentMatch.teamsData[1] },
      { ...currentMatch.teamsData[0] },
    ];

    try {
      // 3. Gửi lên API PUT
      const res = await fetch("/api/current-game", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamsData: swappedTeams, // API của bạn sẽ JSON.stringify cái này lại
        }),
      });

      if (res.ok) {
        // 4. Load lại dữ liệu mới từ Database để cập nhật UI
        await fetchData();
      } else {
        const err = await res.json();
        console.error("Swap failed:", err.error);
      }
    } catch (error) {
      console.error("Lỗi khi swap:", error);
    }
  };
  return (
    <div className="flex h-screen bg-[#0f111a] text-slate-200 font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 lg:w-64 bg-[#161925] border-r border-slate-800 flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Radio size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden lg:block">
            CORE<span className="text-blue-500">CAST</span>
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          <SideButton
            active={activeTab === "current"}
            onClick={() => setActiveTab("current")}
            icon={<Play size={20} />}
            label="Live Control"
          />
          <SideButton
            active={activeTab === "setting"}
            onClick={() => setActiveTab("setting")}
            icon={<Settings size={20} />}
            label="Match Setup"
          />
          <SideButton
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
            icon={<Database size={20} />}
            label={
              <div className="flex items-center gap-2">
                <span>Raw Engine</span>
                <span className="bg-blue-500 text-[8px] font-semibold px-1.5 py-0.5 rounded-full text-white uppercase tracking-tighter animate-pulse">
                  New
                </span>
              </div>
            }
          />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 hidden lg:block text-[10px] text-slate-500">
          <div className="flex justify-between mb-1 text-emerald-500 font-mono">
            <span>SERVER STATUS: OK</span>
            <Activity size={12} />
          </div>
          <p>© 2026 BROADCAST SYSTEM</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f111a]">
        {/* TOPBAR */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#161925]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
              {activeTab.replace("-", " ")}
              {loading && (
                <Cpu size={16} className="animate-spin text-blue-500" />
              )}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-mono">
              <div className="flex flex-col items-end">
                <span className="text-slate-500">UPTIME</span>
                <span className="text-blue-400">04:20:15</span>
              </div>
            </div>
            <div className="h-10 px-4 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
              <div className="size-2 bg-rose-500 rounded-full animate-ping" />
              <span className="text-rose-500 font-bold text-xs uppercase tracking-widest">
                On Air
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT BOX */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              {/* Hiệu ứng viền phát sáng nhẹ */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative bg-[#161925] border border-slate-800 rounded-2xl shadow-2xl p-8 min-h-[400px]">
                {activeTab === "current" && (
                  <CurrentMatch
                    currentMatch={currentMatch}
                    updateScore={updateScore}
                    fetchData={fetchData}
                    handleSwap={handleSwap}
                  />
                )}

                {activeTab === "setting" && (
                  <SettingMatch
                    formData={formData}
                    setFormData={setFormData}
                    handleCreateMatch={handleCreateMatch}
                  />
                )}

                {activeTab === "data" && (
                  <MatchData
                    currentMatch={currentMatch}
                    fetchData={fetchData}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Sub-component cho Sidebar Button
const SideButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`}
  >
    <span
      className={`${active ? "text-white" : "group-hover:text-blue-400"} transition-colors`}
    >
      {icon}
    </span>
    <span className="font-medium text-sm hidden lg:block tracking-wide">
      {label}
    </span>
  </button>
);

export default Page;
