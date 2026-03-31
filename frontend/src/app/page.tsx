"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const features = [
    {
      title: "Strategy Backtesting",
      description: "Test your trading strategies naturally with our advanced AI engine. Get instant insights, win rates, and visual equity curves.",
      href: "/test-single-strategy",
      border: "hover:border-blue-500/50"
    },
    {
      title: "Strategy Comparison",
      description: "Pit two strategies against each other. Compare performance metrics, trade histories, and equity side by side in real time.",
      href: "/compare-two-strategies",
      border: "hover:border-purple-500/50"
    },
    {
      title: "News Search",
      description: "Find specific news articles for any stock on any given date. Leverage AI to pinpoint market catalysts accurately.",
      href: "/search-stock-news",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Indian Tax Calculator",
      description: "Instantly calculate exact gross vs true net profits by automatically deducting STT, GST, and broker charges from historical trades.",
      href: "/indian-tax-calculator",
      border: "hover:border-amber-500/50"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050b14] text-slate-200 overflow-hidden relative flex flex-col items-center justify-center font-sans pb-10">
      {/* Dynamic Animated Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_alternate]" />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-20 mt-12 relative"
        >
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">The Edge You Deserve</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-br from-white via-blue-100 to-slate-500 bg-clip-text text-transparent tracking-tighter drop-shadow-2xl">
            StockMindfull
          </h1>
          <p className="text-xl md:text-3xl text-slate-400/90 max-w-4xl mx-auto font-medium leading-relaxed tracking-wide">
            Next generation intelligence for market dominance. Analyze, compare, and uncover hidden patterns with zero effort.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full w-full">
              <Link
                href={feature.href}
                className={`group relative flex flex-col h-full bg-[#0a111e]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] transition-all duration-500 z-10 overflow-hidden transform hover:-translate-y-4 ${feature.border}`}
              >
                {/* Background light hover effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />

                <h3 className="text-3xl font-black text-white mb-5 tracking-tight relative z-10">{feature.title}</h3>
                <p className="text-slate-400 font-medium text-lg leading-relaxed flex-grow relative z-10">{feature.description}</p>

                <div className="mt-10 flex items-center text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors relative z-10">
                  <span className="mr-3">Launch Module &gt;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
