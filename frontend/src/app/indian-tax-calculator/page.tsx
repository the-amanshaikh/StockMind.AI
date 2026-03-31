"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function IndianTaxCalculatorPage() {
  const [ticker, setTicker] = useState("CIPLA");
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [shares, setShares] = useState<number>(100);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const calculateTaxes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !buyDate || !sellDate || shares <= 0) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/calculator`, {
        ticker: ticker.toUpperCase(),
        buy_date: buyDate,
        sell_date: sellDate,
        shares: Number(shares)
      });
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
    <main className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-24 relative overflow-hidden">
      {/* Pure CSS Background Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="bg-[#020617]/80 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">
            Tax <span className="text-amber-500">Calculator</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          
          {/* Input Form Column */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
              
              <h2 className="text-2xl font-bold text-white mb-2">Trade Details</h2>
              <p className="text-sm text-slate-400 mb-8 border-b border-slate-800 pb-6">Enter historical trade limits to simulate realistic Indian taxation scaling.</p>
              
              <form onSubmit={calculateTaxes} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ticker (.NS)</label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. RELIANCE.NS"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl text-white px-4 py-3 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all uppercase font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl text-white px-4 py-3 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Buy Date</label>
                    <input
                      type="date"
                      value={buyDate}
                      onChange={(e) => setBuyDate(e.target.value)}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-xl text-slate-300 px-3 py-3 text-sm focus:border-amber-500/50 outline-none transition-all"
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sell Date</label>
                    <input
                      type="date"
                      value={sellDate}
                      onChange={(e) => setSellDate(e.target.value)}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-xl text-slate-300 px-3 py-3 text-sm focus:border-amber-500/50 outline-none transition-all"
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold tracking-widest uppercase text-sm px-6 py-4 rounded-xl transition-colors mt-4"
                >
                  {loading ? "Processing..." : "Generate Report"}
                </button>
              </form>
            </div>
          </div>

          {/* Clean UI Output Area */}
          <div className="w-full lg:w-2/3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 flex items-center space-x-3">
                <span className="font-bold uppercase tracking-wider text-sm">Error:</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!results && !loading && !error && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 p-8">
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2">Awaiting Input</p>
                <p className="max-w-md text-center text-sm leading-relaxed">Submit trade details to render a fully itemized Indian delivery tax receipt and visualize the realized margins.</p>
              </div>
            )}

            {results && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 3 Main Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-3xl flex flex-col justify-center shadow-lg">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Profit</span>
                    <span className={`text-4xl font-black tracking-tighter ${results.gross_profit >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {results.gross_profit >= 0 ? '+' : ''}₹{results.gross_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-3xl flex flex-col justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1 bg-red-500/50 left-0" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Deductions</span>
                    <span className="text-4xl font-black tracking-tighter text-red-400">
                      -₹{results.taxes.total_taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex flex-col justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/5 blur-xl pointer-events-none" />
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 relative z-10">True Net Profit</span>
                    <span className={`text-4xl font-black tracking-tighter relative z-10 ${results.net_profit >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {results.net_profit >= 0 ? '+' : ''}₹{results.net_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* The "Receipt" UI Panel */}
                <div className="bg-[#0b101a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Receipt Header */}
                  <div className="bg-[#131c2e] p-8 border-b border-dashed border-slate-700 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-widest uppercase">Settlement Memo</h3>
                      <p className="text-slate-400 text-sm font-medium mt-1">Executing standard NSE Delivery logic</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Transaction Route</p>
                      <p className="text-base font-bold text-white uppercase tracking-wider">{results.shares} x {results.ticker}</p>
                    </div>
                  </div>

                  {/* Receipt Body */}
                  <div className="p-8 space-y-8">
                    {/* Dates & Values */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Buy Execution</p>
                        <p className="text-slate-300 text-sm">{results.buy_date} @ ₹{results.buy_price.toLocaleString()}</p>
                        <p className="text-white font-bold text-lg mt-1">Turnover: ₹{results.total_buy_value.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sell Execution</p>
                        <p className="text-slate-300 text-sm">{results.sell_date} @ ₹{results.sell_price.toLocaleString()}</p>
                        <p className="text-white font-bold text-lg mt-1">Turnover: ₹{results.total_sell_value.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-800" />

                    {/* Tax Line Items */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tax Breakdown</p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Securities Transaction Tax (STT)</span>
                        <span className="text-slate-300 font-mono">₹{results.taxes.stt.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Exchange Transaction Charge</span>
                        <span className="text-slate-300 font-mono">₹{results.taxes.exchange_charges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">SEBI Turnover Fees</span>
                        <span className="text-slate-300 font-mono">₹{results.taxes.sebi_charges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Stamp Duty (Buy Side)</span>
                        <span className="text-slate-300 font-mono">₹{results.taxes.stamp_duty.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">GST (18% on specific charges)</span>
                        <span className="text-slate-300 font-mono">₹{results.taxes.gst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Brokerage</span>
                        <span className="text-emerald-500 font-mono">₹{results.taxes.brokerage.toFixed(2)} (Delivery)</span>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Footer */}
                  <div className="bg-[#0f172a] p-8 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Charges Deducted</span>
                    <span className="text-xl font-black text-red-400 font-mono shadow-sm">
                      -₹{results.taxes.total_taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
