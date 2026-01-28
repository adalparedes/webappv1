import React, { useState, useEffect, memo } from 'react';

const SystemHUD: React.FC = () => {
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 18, ping: 24 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * (65 - 35) + 35),
        ram: Math.floor(Math.random() * (22 - 15) + 15),
        ping: Math.floor(Math.random() * (45 - 20) + 20)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-2 p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md fixed right-6 bottom-32 z-20 animate-in fade-in slide-in-from-right duration-1000">
      <div className="flex items-center justify-between gap-8">
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Core_Load</span>
        <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00d2ff] transition-all duration-1000" style={{ width: `${metrics.cpu}%` }}></div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-8">
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Neural_Buffer</span>
        <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00ff88] transition-all duration-1000" style={{ width: `${metrics.ram}%` }}></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Signal_Latency</span>
        <span className="text-[9px] font-mono text-[#00d2ff] font-bold">{metrics.ping}ms</span>
      </div>
    </div>
  );
};

export default memo(SystemHUD);