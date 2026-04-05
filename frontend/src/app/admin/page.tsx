"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Prompt {
  id: number;
  prompt: string;
  timestamp: string;
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/prompts`);
        setPrompts(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load prompts");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-[#020617]/80 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">
            Admin <span className="text-indigo-500">Logs</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-500" />
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">User Query Archive</h2>
              <p className="text-sm text-slate-400">View real-time natural language strategies submitted by your users.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-400">{prompts.length}</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Logs</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 text-slate-500 font-medium">Loading Database...</div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-xl border border-red-500/20">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e293b] text-slate-300 text-xs uppercase tracking-widest font-bold">
                    <th className="px-6 py-5 border-b border-slate-700">ID</th>
                    <th className="px-6 py-5 border-b border-slate-700">Timestamp</th>
                    <th className="px-6 py-5 border-b border-slate-700">Raw Prompt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {prompts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500">No prompts have been logged yet.</td>
                    </tr>
                  ) : (
                    prompts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5 text-slate-500 font-mono text-sm group-hover:text-indigo-400 transition-colors">#{p.id}</td>
                        <td className="px-6 py-5 text-slate-400 text-sm whitespace-nowrap">{p.timestamp}</td>
                        <td className="px-6 py-5 text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-2xl">{p.prompt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
