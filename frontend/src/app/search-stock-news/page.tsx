"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NewsPage() {
  const [query, setQuery] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const searchNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat`, { text: `Find news for ${query}` });
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
    <main className="min-h-screen bg-[#070e17] text-slate-200 selection:bg-emerald-500/30 font-sans pb-24 overflow-x-hidden relative">
      <div className="fixed top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/10 blur-[150px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_alternate]" />
      
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
                  Specific Stock <span className="text-emerald-500">News</span>
                </h1>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 flex flex-col items-center">
        {/* Search Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mb-16"
        >
          <form onSubmit={searchNews} className="relative group">
            <div className="relative transform transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 focus-within:via-teal-500 to-emerald-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0d1624]/80 backdrop-blur-[40px] border border-white/10 rounded-[1.5rem] p-2.5 shadow-2xl h-full">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Tata Motors on Jan 10 2024..."
                  className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:outline-none focus:ring-0 text-lg px-4 py-3 resize-none h-[72px] font-medium"
                  disabled={loading}
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/50 disabled:text-slate-500 text-white px-6 py-4 rounded-xl transition-all mr-1 shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold tracking-wider"
                >
                  {loading ? "..." : "SEARCH"}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ staggerChildren: 0.1 }} className="space-y-10 max-w-6xl mx-auto">
                
                {/* AI Assistant Context */}
                <div className="group relative overflow-hidden bg-emerald-900/10 backdrop-blur-2xl border border-emerald-500/20 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(16,185,129,0.1)] flex items-start space-x-5">
                   <div className="relative z-10">
                     <h4 className="font-black text-emerald-300 text-sm tracking-widest uppercase drop-shadow-md">AI Context</h4>
                     <p className="mt-3 text-emerald-100/90 leading-relaxed font-medium text-[1.05rem]">{results.text_response}</p>
                   </div>
                </div>

                {/* News Feed Display */}
                {results.news_articles && results.news_articles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {results.news_articles.map((article: any, i: number) => (
                      <motion.a 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        key={i} href={article.link} target="_blank" rel="noopener noreferrer" 
                        className="bg-white/5 backdrop-blur-2xl hover:bg-white/10 border border-white/10 p-8 rounded-[2rem] transition-all duration-500 shadow-xl block group relative overflow-hidden"
                      >
                        <h5 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors leading-snug drop-shadow-md z-10 relative">{article.title}</h5>
                        <div className="flex justify-between items-center mt-8 text-xs font-black uppercase tracking-widest z-10 relative">
                          <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">{article.publisher}</span>
                          <span className="text-slate-500">{new Date(article.published_date).toLocaleDateString()}</span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10">
                    <p className="text-xl text-slate-400 font-medium">No recent news articles found for this query.</p>
                  </div>
                )}
              </motion.div>
            )}

            {!results && !loading && !error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[450px] flex flex-col items-center justify-center space-y-8 bg-white/5 backdrop-blur-[40px] rounded-[3rem] border border-white/10 text-slate-500 max-w-4xl mx-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition duration-500 relative overflow-hidden group">
                <div className="text-center max-w-sm relative z-10">
                  <p className="text-2xl font-black text-slate-400/80 mb-3 tracking-widest uppercase drop-shadow-md">Search Ready</p>
                  <p className="text-base font-medium leading-relaxed">Enter a stock name and optionally a date to fetch highly relevant news and market sentiment.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
