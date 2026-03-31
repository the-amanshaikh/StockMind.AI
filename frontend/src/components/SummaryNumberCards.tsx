"use client";

import { motion, Variants } from "framer-motion";

interface StatsProps {
  stats: {
    buys: number;
    sells: number;
    total_invested: number;
    final_value: number;
    profit: number;
    return_percentage: number;
    win_rate: number;
  };
  title?: string;
  theme?: "blue" | "purple";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 12 } }
};

export default function SummaryNumberCards({ stats, title, theme = "blue" }: StatsProps) {
  const isProfitable = stats.profit >= 0;
  const isGoodWinRate = stats.win_rate >= 50;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden lg:col-span-2"
    >
      {title && (
        <div className={`px-8 py-5 border-b border-white/5 ${theme === 'purple' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
          <h3 className={`text-xl font-black tracking-widest uppercase items-center flex ${theme === 'purple' ? 'text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'text-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}>
            <div className={`w-2 h-2 rounded-full mr-3 animate-pulse ${theme === 'purple' ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
            {title}
          </h3>
        </div>
      )}
      
      <div className="grid grid-cols-2 lg:grid-cols-3 p-3 gap-3">
        
        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Total Trades</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter drop-shadow-md">{stats.buys + stats.sells}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Win Rate</p>
          </div>
          <p className={`text-3xl font-black tracking-tighter drop-shadow-md ${isGoodWinRate ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.win_rate}%
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Total Invested</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter drop-shadow-md">₹{stats.total_invested.toLocaleString()}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Final Value</p>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter drop-shadow-md">₹{stats.final_value.toLocaleString()}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group relative overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl ${isProfitable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Net Profit</p>
          </div>
          <p className={`relative z-10 text-3xl font-black tracking-tighter drop-shadow-md ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{stats.profit.toLocaleString()}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/[0.03] hover:bg-white/[0.08] p-6 rounded-2xl border border-white/5 transition-colors group relative overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl ${isProfitable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Return (%)</p>
          </div>
          <p className={`relative z-10 text-3xl font-black tracking-tighter drop-shadow-md ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.return_percentage}%
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
