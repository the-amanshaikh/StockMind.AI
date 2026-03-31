"use client";

import { useState } from "react";
import axios from "axios";
import SummaryNumberCards from "@/components/SummaryNumberCards";
import LineGraphForProfits from "@/components/LineGraphForProfits";
import PastTradesTable from "@/components/PastTradesTable";
import WinAndLossPieChart from "@/components/WinAndLossPieChart";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BacktestPage() {
  const [strategy, setStrategy] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const runBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategy.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat`, { text: strategy });
      setResults(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "An error occurred while connecting to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070e17] text-slate-200 selection:bg-blue-500/30 font-sans pb-24 overflow-x-hidden relative">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      
      {/* Header */}
      <header className="bg-[#070e17]/40 sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-6">
            <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10 text-white font-bold">
              &larr; Back
            </Link>
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
                  Strategy <span className="text-blue-500">Backtest</span>
                </h1>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 flex flex-col items-center">
        {/* Chat Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mb-16"
        >
          <form onSubmit={runBacktest} className="relative group">
            <div className="relative transform transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 focus-within:via-indigo-500 to-blue-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0d1624]/80 backdrop-blur-[40px] border border-white/10 rounded-[1.5rem] p-2.5 shadow-2xl h-full">
                <textarea
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="e.g. Bought on Jan 10 2024 and sold on Jan 10 2025..."
                  className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:outline-none focus:ring-0 text-lg px-4 py-3 resize-none h-[72px] font-medium"
                  disabled={loading}
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={loading || !strategy.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-500 text-white px-6 py-4 rounded-xl transition-all mr-1 shadow-[0_0_20px_rgba(59,130,246,0.4)] font-bold tracking-wider"
                >
                  {loading ? "..." : "RUN"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Output Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 p-6 rounded-3xl flex items-start space-x-4 shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-8 max-w-4xl mx-auto">
                <div>
                  <h4 className="font-black tracking-wider uppercase text-red-300">System Error</h4>
                  <p className="mt-2 text-base font-medium text-red-400/80">{error}</p>
                </div>
              </motion.div>
            )}

            {results && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ staggerChildren: 0.1 }} className="space-y-10">
                <div className="max-w-4xl mx-auto group relative overflow-hidden bg-blue-900/10 backdrop-blur-2xl border border-blue-500/20 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(59,130,246,0.1)] flex items-start space-x-5">
                   <div className="relative z-10">
                     <h4 className="font-black text-blue-300 text-sm tracking-widest uppercase drop-shadow-md">AI Analysis</h4>
                     <p className="mt-3 text-blue-100/90 leading-relaxed font-medium text-[1.05rem]">{results.text_response}</p>
                   </div>
                </div>

                {results.transactions && results.transactions.length > 0 && (
                  <>
                    <div className="grid gap-6 items-stretch grid-cols-1 lg:grid-cols-3 max-w-5xl mx-auto">
                      <SummaryNumberCards stats={results} theme="blue" />
                      <WinAndLossPieChart buys={results.buys} win_rate={results.win_rate} theme="blue" />
                    </div>
                    <LineGraphForProfits dates={results.equity_curve_dates} values={results.equity_curve_values} />
                    <PastTradesTable transactions={results.transactions} />
                  </>
                )}
              </motion.div>
            )}

            {!results && !loading && !error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[450px] flex flex-col items-center justify-center space-y-8 bg-white/5 backdrop-blur-[40px] rounded-[3rem] border border-white/10 text-slate-500 max-w-4xl mx-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition duration-500 relative overflow-hidden group">
                <div className="text-center max-w-sm relative z-10">
                  <p className="text-2xl font-black text-slate-400/80 mb-3 tracking-widest uppercase drop-shadow-md">System Ready</p>
                  <p className="text-base font-medium leading-relaxed">Type your strategy naturally in the prompt bar to begin parsing dates, executing criteria, and mapping the chart.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
