"use client";

import { motion } from "framer-motion";

interface Transaction {
  date: string;
  action: string;
  price: number;
  shares: number;
  value: number;
}

interface TradeHistoryProps {
  transactions: Transaction[];
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function PastTradesTable({ transactions }: TradeHistoryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden mt-8"
    >
      <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <h3 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">Trade Audit Log</h3>
        <span className="text-xs font-bold bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          {transactions.length} EXECUTIONS
        </span>
      </div>
      
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-sm text-slate-300 relative">
          <thead className="bg-[#0f172a]/80 backdrop-blur-xl text-[10px] tracking-widest uppercase font-black text-slate-400 sticky top-0 z-10 shadow-md border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Date / Time</th>
              <th className="px-8 py-5">Position</th>
              <th className="px-8 py-5">Execution Price</th>
              <th className="px-8 py-5">Size (Units)</th>
              <th className="px-8 py-5 text-right">Notional Value</th>
            </tr>
          </thead>
          <motion.tbody 
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {transactions.map((tx, idx) => (
              <motion.tr variants={rowVariants} key={idx} className="hover:bg-white/[0.04] transition-colors group">
                <td className="px-8 py-5 font-mono text-sm tracking-tight text-slate-300 group-hover:text-white transition-colors">{tx.date}</td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-md ${
                      tx.action === 'BUY'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                    }`}
                  >
                    {tx.action}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-300 font-semibold group-hover:text-white transition-colors">₹{tx.price.toFixed(2)}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-400 group-hover:text-blue-300 transition-colors">{tx.shares.toFixed(4)}</td>
                <td className="px-8 py-5 text-right font-black tracking-tight text-white group-hover:text-blue-200 drop-shadow-sm transition-colors">₹{tx.value.toFixed(2)}</td>
              </motion.tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold tracking-tight text-slate-400">No executions found.</p>
                    <p className="text-sm mt-2 font-medium tracking-wide">The strategy criteria was not met within this period.</p>
                  </div>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
