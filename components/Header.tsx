
import React from 'react';
import { Logo } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40">
      <Logo />
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#00d2ff] opacity-50 font-mono">NODE_STATUS</span>
          <span className="text-[10px] text-white font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
            ACTIVE
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
