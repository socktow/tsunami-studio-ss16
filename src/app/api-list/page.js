"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FileCode, ChevronRight, Search, 
  Globe, Send, Terminal, Plus, Database, 
  Edit3, Trash2, Copy, Check, RefreshCw, Loader2
} from 'lucide-react';

const ApiList = () => {
  // 1. Quản lý trạng thái dữ liệu từ server
  const [structuredApi, setStructuredApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApi, setSelectedApi] = useState(null);
  const [openFolders, setOpenFolders] = useState([]);
  const [jsonInput, setJsonInput] = useState('{\n  "status": "requesting"\n}');

  // 2. Hàm Fetch dữ liệu từ file system (thông qua API route scan-routes)
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan-routes');
      const data = await res.json();
      setStructuredApi(data);
      
      // Tự động mở tất cả folder và chọn endpoint đầu tiên nếu có
      if (data.length > 0) {
        setOpenFolders(data.map(f => f.folder));
        if (data[0].endpoints.length > 0) {
          setSelectedApi(data[0].endpoints[0]);
        }
      }
    } catch (error) {
      console.error("Failed to scan API routes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const toggleFolder = (name) => {
    setOpenFolders(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
      POST: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
      PUT: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
      DELETE: 'text-red-400 border-red-400/20 bg-red-400/5',
    };
    return colors[method] || 'text-zinc-400';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono flex">
      
      {/* 📂 SIDEBAR: FOLDER STRUCTURE */}
      <aside className="w-80 border-r border-emerald-500/10 bg-[#070707] flex flex-col relative">
        <div className="p-6 border-b border-emerald-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-white">API_EXPLORER</span>
            </div>
            <button 
              onClick={fetchRoutes}
              className="p-1 hover:text-white transition-colors"
              title="Rescan /api folder"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text" 
              placeholder="Filter routes..." 
              className="w-full bg-black border border-zinc-800 rounded py-2 pl-9 pr-4 text-[10px] outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 opacity-40">
              <Loader2 className="animate-spin mb-2" size={20} />
              <span className="text-[10px] uppercase tracking-tighter">Scanning /api folder...</span>
            </div>
          ) : (
            structuredApi.map((group) => (
              <div key={group.folder} className="mb-2">
                <button 
                  onClick={() => toggleFolder(group.folder)}
                  className="flex items-center gap-2 w-full p-2 hover:bg-emerald-500/5 rounded transition-all text-zinc-400 hover:text-emerald-400"
                >
                  <motion.div animate={{ rotate: openFolders.includes(group.folder) ? 90 : 0 }}>
                    <ChevronRight size={14} />
                  </motion.div>
                  <Folder size={14} className={openFolders.includes(group.folder) ? "text-emerald-500" : ""} />
                  <span className="text-[11px] font-bold uppercase tracking-tighter">{group.folder}</span>
                </button>

                <AnimatePresence>
                  {openFolders.includes(group.folder) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 border-l border-zinc-800 mt-1 overflow-hidden"
                    >
                      {group.endpoints.map((api) => (
                        <div
                          key={api.id}
                          onClick={() => setSelectedApi(api)}
                          className={`flex items-center gap-3 p-2 pl-4 cursor-pointer transition-all border-l-2 ${
                            selectedApi?.id === api.id 
                            ? "border-emerald-500 bg-emerald-500/10 text-white" 
                            : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                          }`}
                        >
                          <span className={`text-[8px] font-black w-8 ${getMethodColor(api.method).split(' ')[0]}`}>
                            {api.method}
                          </span>
                          <span className="text-[10px] truncate">{api.path.replace('/api/', '')}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* 🕹️ CONSOLE AREA */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {selectedApi ? (
          <>
            <div className="flex items-center gap-3 bg-black border border-zinc-800 p-3 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/[0.02] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Globe size={14} className="text-zinc-600" />
              <span className={`text-[10px] font-black ${getMethodColor(selectedApi.method)}`}>{selectedApi.method}</span>
              <div className="flex-1 text-[11px] text-zinc-400 font-bold truncate">
                https://api.tsunami-st.com<span className="text-white">{selectedApi.path}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
              <div className="flex flex-col h-full gap-4">
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-zinc-600 mb-2 uppercase tracking-widest italic flex items-center gap-2">
                    <Plus size={12} /> Payload_Configuration
                  </span>
                  <textarea 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="flex-1 bg-[#080808] border border-zinc-800 p-4 text-xs text-zinc-300 font-mono outline-none focus:border-emerald-500/30 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="flex flex-col h-full gap-4">
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-2">
                      <Terminal size={12} /> Live_System_Output
                    </span>
                    <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">STATUS_OK_200</span>
                  </div>
                  <div className="flex-1 bg-black border border-zinc-900 p-4 font-mono text-xs text-emerald-500/60 overflow-auto custom-scrollbar relative">
                    <pre className="relative z-10">{`{
  "status": "ready",
  "endpoint": "${selectedApi.path}",
  "desc": "${selectedApi.desc}",
  "timestamp": "${new Date().toISOString()}"
}`}</pre>
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.02)_50%,transparent_100%)] bg-[size:100%_4px] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button className="group relative overflow-hidden bg-emerald-500 text-black font-black px-8 py-3 text-xs uppercase tracking-tighter hover:bg-emerald-400 transition-all">
                <span className="relative z-10 flex items-center gap-2">
                  <Send size={14} /> Execute_Protocol
                </span>
              </button>
              <div className="flex gap-6 text-zinc-600">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] uppercase opacity-50">Last_Access</span>
                   <span className="text-[10px] font-bold text-zinc-400">Never</span>
                </div>
                <div className="flex gap-4 items-center border-l border-zinc-800 pl-6">
                  <Edit3 size={16} className="hover:text-emerald-500 cursor-pointer transition-colors" />
                  <Trash2 size={16} className="hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <Terminal size={48} className="mb-4" />
            <span className="text-xs uppercase tracking-[0.5em]">Select_Endpoint_To_Initialize</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApiList;