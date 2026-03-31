"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EquityChartProps {
  dates: string[];
  values: number[];
  valuesB?: number[]; // Values for Strategy B
}

export default function LineGraphForProfits({ dates, values, valuesB }: EquityChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      x: {
        type: 'number' as const,
        easing: 'linear' as const,
        duration: 2400,
        from: NaN, 
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * (2400 / ctx.chart.data.labels.length);
        }
      },
    },
    plugins: {
      legend: {
        display: !!valuesB,
        position: 'top' as const,
        labels: { color: '#cbd5e1', font: { family: 'inherit', size: 12, weight: 'bold' as const }, padding: 20 }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13, weight: 'bold' as const },
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', maxTicksLimit: 7, font: { family: 'inherit', weight: 600 } },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)', borderDash: [4, 4] },
        ticks: { color: '#64748b', callback: (value: any) => `₹${value}`, font: { family: 'inherit', weight: 600 } },
        border: { display: false }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const datasets: any[] = [
    {
      fill: true,
      label: valuesB ? 'Strategy A' : 'Portfolio Value',
      data: values,
      borderColor: '#3b82f6',
      borderWidth: 3,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        return gradient;
      },
      tension: 0.5, // Smoother bezier curves
      pointRadius: 0,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#60a5fa',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
    },
  ];

  if (valuesB) {
    datasets.push({
      fill: true,
      label: 'Strategy B',
      data: valuesB,
      borderColor: '#a855f7',
      borderWidth: 3,
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        return gradient;
      },
      tension: 0.5,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#c084fc',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
    });
  }

  const data = { labels: dates, datasets };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="w-full bg-white/5 backdrop-blur-[40px] p-8 rounded-[2rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-fuchsia-500/20 transition-all duration-1000"></div>
      
      <h3 className="text-xl font-black text-white mb-8 tracking-widest uppercase drop-shadow-md">
        Equity Curve {valuesB && 'Comparison'}
      </h3>
      <div className="h-[400px] relative z-10 w-full hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-700">
        <Line options={options} data={data} />
      </div>
    </motion.div>
  );
}
