import React from 'react';
import { RefreshCw } from 'lucide-react';

const MatchData = ({ currentMatch, fetchData }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 italic font-mono uppercase text-sm tracking-widest">Active Match JSON Data</h3>
        <button onClick={fetchData} className="p-2 hover:bg-slate-700 rounded transition">
          <RefreshCw size={16}/>
        </button>
      </div>
      <pre className="bg-slate-950 p-6 rounded-lg text-green-400 text-sm overflow-x-auto font-mono border border-slate-900 shadow-inner custom-scrollbar">
        {currentMatch ? JSON.stringify(currentMatch, null, 2) : "// No data available"}
      </pre>
    </div>
  );
};

export default MatchData;