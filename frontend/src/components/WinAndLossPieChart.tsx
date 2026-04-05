"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface WinLossProps {
  buys: number;
  win_rate: number;
  theme?: "blue" | "purple";
}

export default function WinAndLossPieChart({ buys, win_rate, theme = "blue" }: WinLossProps) {
  // Assuming buys = round trip trades
  const totalTrades = buys;
  const wins = Math.round((win_rate / 100) * totalTrades);
  const losses = totalTrades - wins;
  
  const data = [
    { name: "Wins", value: wins, color: theme === "blue" ? "#3b82f6" : "#a855f7" },
    { name: "Losses", value: losses, color: "rgba(255,255,255,0.05)" }, 
  ];

  if (totalTrades === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/5 backdrop-blur-[40px] border border-white/10 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden group hover:bg-white/[0.07] transition-all duration-500"
    >
      <div className={`absolute -inset-24 opacity-0 group-hover:opacity-40 blur-3xl transition-opacity duration-1000 pointer-events-none ${theme === 'purple' ? 'bg-purple-600/20' : 'bg-blue-600/20'}`}></div>
      
      <h3 className="text-xl font-black tracking-tight text-white mb-1 text-center relative z-10 drop-shadow-md">Win Ratio</h3>
      <p className={`text-sm font-semibold text-center mb-6 relative z-10 tracking-widest uppercase ${theme === 'purple' ? 'text-purple-300' : 'text-blue-300'}`}>
        {win_rate}% Success
      </p>
      
      <div className="h-[200px] w-full relative z-10 transition-transform duration-700 ease-out group-hover:scale-105">
        <ResponsiveContainer width="100%" height={200} minWidth={100}>
          <PieChart>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              cursor={{ fill: 'transparent' }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
              animationBegin={200}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color})` }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
          <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] tracking-tighter">{wins}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wins</span>
        </div>
      </div>
    </motion.div>
  );
}
