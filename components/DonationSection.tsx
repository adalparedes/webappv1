import React, { useState } from 'react';

const DonationSection: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
      <div className="relative group overflow-hidden bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl mx-4 md:mx-0">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff]/20 to-transparent opacity-30 group-hover:opacity-50 transition duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left Side: Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40">
            <img 
              src="https://res.cloudinary.com/dv1yofc8f/image/upload/v1767856891/fox_bum_djceqz.png" 
              alt="Fox Bum" 
              className="w-24 h-auto max-h-24 md:w-36 md:max-h-36 object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Middle: Main CTA - Updated Button to Green #00ff88 */}
          <div className="flex-grow text-center">
            <h3 className="font-orbitron text-base md:text-2xl font-bold text-white mb-4 tracking-wider uppercase px-2">
              "POR FAVOR DONA Y APOYA A UN TAZO DORADO"
            </h3>
            <button 
              onClick={() => window.open('https://donorbox.org/apoyo-a-creacion-de-proyectos-web', '_blank')}
              className="px-6 md:px-8 py-3 bg-[#00ff88] text-black font-orbitron font-bold text-xs md:text-sm tracking-[0.2em] rounded-sm hover:bg-white transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] active:scale-95 uppercase"
            >
              APOYO VIA DONORBOX
            </button>
          </div>

          {/* Right Side: Crypto Addresses */}
          <div className="flex flex-col gap-3 w-full md:min-w-[300px] md:w-auto">
            {/* Bitcoin */}
            <div 
              onClick={() => copyToClipboard('33yi7TtyuGBe9PYFEhJnppuuDd8yYEVWKN', 'BTC')}
              className="cursor-pointer bg-black/40 border border-white/5 p-3 rounded-lg hover:border-[#00d2ff]/50 transition-colors group/item active:bg-white/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#f7931a] text-lg">₿</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">Donar Bitcoin</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-[10px] md:text-xs text-white/70 font-mono truncate max-w-[180px] md:max-w-[200px]">33yi7TtyuGBe...YEVWKN</code>
                <span className="text-[9px] text-[#00d2ff] ml-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                  {copied === 'BTC' ? 'COPIADO!' : 'COPY'}
                </span>
              </div>
            </div>

            {/* Ethereum */}
            <div 
              onClick={() => copyToClipboard('0x196A45E803Ad6376C24c26dF8D64F08986298a31', 'ETH')}
              className="cursor-pointer bg-black/40 border border-white/5 p-3 rounded-lg hover:border-[#00d2ff]/50 transition-colors group/item active:bg-white/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#627eea] text-lg">Ξ</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">Donar Ethereum</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-[10px] md:text-xs text-white/70 font-mono truncate max-w-[180px] md:max-w-[200px]">0x196A45E8...298a31</code>
                <span className="text-[9px] text-[#00d2ff] ml-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                  {copied === 'ETH' ? 'COPIED!' : 'COPY'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-white/5 text-center">
          <p className="text-white text-[10px] md:text-[11px] font-mono tracking-tight opacity-80 px-2 leading-relaxed">
            AMLO fue el peor presidente que ha tenido méxico / ¡Viva la Libertad! ✊
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationSection;